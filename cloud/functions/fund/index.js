const axios = require('axios').default
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'env-52pojie-2tc3i'
})
const db = cloud.database()
axios.defaults.timeout = 30000
function padZero(num) {
  if (Number(num) < 10) {
    return '0' + num
  }
  return num
}
exports.main = async (event, context) => {
  const { action, data } = event

  switch (action) {
    case 'action_search_fund':
      return searchFund(data.key)
    case 'action_get_holiday':
      return getJieJiaRi(data.date)
    default:
      return fundValuationUpdateNotify()
  }
}

async function searchFund(key) {
  let url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?&m=9&key=${key}&_t=${Date.now()}`
  const result = await axios.get(url)
  const datas = result.data.Datas
  if (datas.length > 0) {
    return {
      code: 0,
      data: datas[0],
      msg: '成功'
    }
  } else {
    return {
      code: -1,
      data: null,
      msg: '基金未找到，请检查是否输入有误'
    }
  }
}

// 基金估值更新通知
async function fundValuationUpdateNotify() {
  const user_fund_subscribe_db = db.collection('user_fund_subscribe')
  const user_fund_db = db.collection('user_funds')
  const result = await user_fund_subscribe_db.get()
  const data = result.data
  console.log(data)
  data.forEach(row => {
    console.log(row.openid);
    user_fund_db.where({
      openid: row.openid
    }).get()
      .then(funds => {
        if (funds.data.length === 0) return
        const funds_data = funds.data[0]
        const codes = funds_data.codes
        if (codes.length === 0) return

        const url = `https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=50&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=ssdfsdfsd&Fcodes=${codes.join(',')}`
        axios.get(url)
          .then(response => {
            if (response.status !== 200 || response.data.ErrCode !== 0) return
            const fund_datas = response.data.Datas
            return fund_datas
          })
          .then(funds_data => {
            const date = new Date()
            const date_str = `${date.getFullYear()}-${(padZero(date.getMonth() + 1))}-${padZero(date.getDate())} 15:00`
            console.log(date_str);
            
            const updated = funds_data.every(fund => {
              return fund.GZTIME === date_str
            })
            if (updated) {
              notify(row.openid, funds_data[0])
                .catch(error => {
                  console.log('catch error', error);
                  console.log('通知失败', row.openid);
                })
            }
          })
      })
  })
}

async function notify(touser, fund) {
  const result = await cloud.openapi.subscribeMessage.send({
    touser: touser,
    templateId: 'GUMP-Xoi6B1J38VU1ldRWa4NNcb5T-DiOHrm7Fl7iaE',
    page: '/sub-package/fund/index?r=notify',
    data: {
      thing1: { value: '自选基金估值已更新' },
      thing2: { value: `${fund.SHORTNAME}已更新` },
      date3: { value: new Date().toLocaleString() },
      thing4: { value: '点击进入小程序查看其它已更新的基金估值数据' }
    }
  })
  return result
}

async function getJieJiaRi(date) {
  const results = await db.collection('global_config').where({
    type: 'tian_xing'
  }).get()
  if (results.data.length === 0) {
    return {
      code: -1,
      data: null,
      msg: '未配置'
    }
  }
  const data = results.data[0]
  const response = await axios.get(`http://api.tianapi.com/txapi/jiejiari/index?key=${data.config.api_key}&date=${date}`)
  if (response.data.code === 200) {
    return {
      code: 0,
      data: response.data.newslist[0]
    }
  } else {
    return {
      code: -1,
      data: null,
      msg: response.data.msg
    }
  }
}
