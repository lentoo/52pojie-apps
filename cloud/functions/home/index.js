const axios = require('axios').default
const cheerio = require('cheerio')
// const Iconv = require('iconv').Iconv
const iconv = require('iconv-lite')
/**
 * 
 */
const HOST_NAME = 'https://www.52pojie.cn/'

async function getHtml(url) {
  const res = await axios.get(url, {
    // 以下为解决中文乱码的主要代码
    responseType: 'stream',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
      'Pragma': 'no-cache',
      'Content-type': 'application/x-www-form-urlencoded; chatset=gbk',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cookie': 'htVD_2132_connect_is_bind=1; htVD_2132_connect_uin=8FADB23A2BBA09962DE77F951C069A81; htVD_2132_smile=1D1; htVD_2132_nofavfid=1; __gads=ID=6b293984e3dad776:T=1588901663:S=ALNI_Ma8bJ85FyV8AsJ2XJzS03lSZsmj8w; Hm_lvt_46d556462595ed05e05f009cdafff31a=1598232753; htVD_2132_atarget=1; htVD_2132_saltkey=Ybowo3zF; htVD_2132_lastvisit=1598226700; htVD_2132_con_request_uri=https%3A%2F%2Fwww.52pojie.cn%2Fconnect.php%3Fmod%3Dlogin%26op%3Dcallback%26referer%3Dhttps%253A%252F%252Fwww.52pojie.cn%252Fforum-66-1.html; htVD_2132_seccodecSAKAjxr5=915331.760036139683be1753; htVD_2132_client_token=8FADB23A2BBA09962DE77F951C069A81; htVD_2132_lastviewtime=575886%7C1598578079; htVD_2132_sid=0; htVD_2132_seccodecSAIwoY94=2454269.2d0790aab06d6d91b6; htVD_2132_seccodecSAIwo=2454270.d402fcc03e7e8eddf4; htVD_2132_client_created=1599542456; htVD_2132_auth=b451wgkMY8FE6VxNE7jezjq0FdE2T7H6ByWkb414sbnBb%2F3VR72lDm%2FjIGe67ObYOFGYMYj15SmP9WRnLinbTDlhFec; htVD_2132_connect_login=1; htVD_2132_home_readfeed=1599630148; htVD_2132_ulastactivity=1599722039%7C0; htVD_2132_st_t=575886%7C1599722259%7C1d2f049263f1cb8a820a84c8ccb6b2d3; htVD_2132_forum_lastvisit=D_16_1599565400D_8_1599722228D_66_1599722259; htVD_2132_visitedfid=66D8D75D16D10; htVD_2132_viewid=tid_1264239; htVD_2132_ignore_rate=1; htVD_2132_checkpm=1; htVD_2132_lastcheckfeed=575886%7C1599722367; Hm_lpvt_46d556462595ed05e05f009cdafff31a=1599722370; htVD_2132_clearUserdata=forum; htVD_2132_lastact=1599722387%09forum.php%09viewthread; htVD_2132_st_p=575886%7C1599722387%7Ca980d0ee29bdc765905f3565a02efdce'
    }
  })
  // 返回一个promise实例对象
  return new Promise(resolve => {

    const chunks = []

    res.data.on('data', chunk => {

      chunks.push(chunk)

    })

    res.data.on('end', (data) => {
      const buffer = Buffer.concat(chunks)

      const str = iconv.decode(buffer, 'gbk')

      resolve(str)

    })
  })
}

async function getHomePageData () {
  const result = await getHtml('https://www.52pojie.cn/forum.php?_t=' + Date.now())

  const $ = cheerio.load(result, { decodeEntities: false })

  const homeTabs = $('.toptitle_7ree a')
  const tabs = []

  homeTabs.each((index, tab) => {
    let title = $(tab).text()
    if (title && title.indexOf('（') > -1) {
      title = title.split('（')[0]
    }
    const link = $(tab).attr('href')
    tabs.push({
      id: index,
      name: title,
      list: [],
      more_link: HOST_NAME + link,
    })
  })
  
  const tds = $('#category_ .fl_row td')
  tds.each((index, td) => {
    const list_box = $(td).find('.threadline_7ree')
    const list_item = list_box.map((i, item) => {
      const a = $(item).find('a')
      const text = trim(a.text())
      const link = trim(a.attr('href'))
      const tips = trim(a.attr('tips'))
      return {
        text,
        link: HOST_NAME + link,
        tips
      }
    })
    tabs[index].list = list_item.toArray()
  })
  console.log(tabs);

  return tabs
}

async function getAreasData() {
  const result = await getHtml('https://www.52pojie.cn/forum.php')
  
  const $ = cheerio.load(result)
  let areas = $('#hd .nav_ico02 li a')
  const list_data = []
  areas.each((index, item) => {
    const $item = $(item)
    const name = trim($item.text())
    const title = trim($item.attr('title'))
    const link = $item.attr('href')
    list_data.push({
      index,
      name,
      title,
      link: HOST_NAME + link
    })
  })
  areas = $('#hd .nav_ico03 li a')
  areas.each((index, item) => {
    const $item = $(item)
    const name = trim($item.text())
    const title = trim($item.attr('title'))
    const link = $item.attr('href')
    list_data.push({
      index,
      name,
      title,
      link: HOST_NAME + link
    })
  })
  console.log(list_data);
  return list_data
}

function trim(text) {
  if (text && text.trim) {
    return text.trim()
  }
  return text
}



exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  switch (event.action) {
    case 'get_home_page_data':
      return await getHomePageData()
      break;
    case 'get_areas_data': 
      return await getAreasData()
      break
    default:
      break;
  }
  
}