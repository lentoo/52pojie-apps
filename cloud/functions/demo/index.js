// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'env-52pojie-2tc3i'
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: 'o_Kaw4sUVXAr5YzJZeDVZAlQRxg8',
      templateId: 'GUMP-Xoi6B1J38VU1ldRWa4NNcb5T-DiOHrm7Fl7iaE',
      page: '/pages/index/index',
      data: {
        thing1: { value: '自选基金估值已更新' },
        thing2: { value: '诺安成长混合估值已更新+0.56%' },
        date3: { value: new Date().toLocaleString() },
        thing4: { value: '点击进入小程序查看更多基金更新估值数据' }
      },
      miniprogramState: 'developer'
    })    
    return result
  } catch (error) {
    console.log(error)
  }
}

