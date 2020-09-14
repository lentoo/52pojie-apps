const axios = require('axios').default
const cheerio = require('cheerio')
exports.main = async (event, context) => {
  const action = event.action

  if (action === 'get_ant_manor_answer') {
    return getAntManorAnswer()
  }
}

async function getAntManorAnswer() {

  const result = await axios.get('https://www.app178.com/dujia/248082.html')
  const $ = cheerio.load(result.data)
  const trs = $('.jjzq_ny_left1_main table tr').slice(1, 4)
  const antManorAnswer = []
  trs.each((index, tr) => {
    const tds = $(tr).find('td')
    if (tds.length === 3) {
      antManorAnswer.push({
        id: index,
        date: $(tds[0]).text(),
        title: $(tds[1]).text(),
        answer: $(tds[2]).text(),
      })
    }
  })
  console.log(antManorAnswer);
  return antManorAnswer
}