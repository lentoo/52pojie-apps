const axios = require('axios').default
axios.defaults.timeout = 30000
exports.main = async (event, context) => {
  const { action, data } = event

  switch (action) {
    case 'action_search_fund':
      return searchFund(data.key)
      break;
  
    default:
      break;
  }
}

async function searchFund(key) {
  let url = `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?&m=9&key=${key}&_t=${Date.now()}`
  const result = await axios.get(url)
  const datas = result.data.Datas
  if (datas.length > 0) {
    return datas[0]
  } else {
    return datas
  }
}

