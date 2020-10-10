const axios = require('axios').default
const cheerio = require('cheerio')
const iconv = require('iconv-lite')

const HOST_NAME = 'https://www.52pojie.cn/'
axios.defaults.timeout = 30000

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

async function getPlateList(plateId, page = 1) {

  const url = `${HOST_NAME}forum-${plateId}-${page}.html?t=${Date.now()}`

  const htmlStr = await getHtml(url)
  console.log('get', url);
  const $ = cheerio.load(htmlStr)

  const plate_list = []

  const $tbodys = $('#threadlist .bm_c tbody')

  $tbodys.each((index, tbody) => {
    const $tbody = $(tbody)
    // 过滤分割线
    if (!$tbody.attr('id')) return

    if ($tbody.attr('id') === 'separatorline') return
    // 过滤置顶贴
    if (!$tbody.attr('id').startsWith('normalthread')) return

    const id = $tbody.attr('id').split('_')[1]
    const type = $tbody.find('.new em a').text().trim()

    const title = $tbody.find('.new a.s.xst').text()
    // #normalthread_1233028 > tr > td:nth-child(3) > cite > a
    const link =  HOST_NAME + $tbody.find('.new a.s.xst').attr('href')
    const hasRecommend = $tbody.find('.new').has('[alt=recommend]').length > 0
    const hasHot = $tbody.find('.new').has('[alt=heatlevel]').length > 0
    const hasNew = $tbody.find('.new').has('.xi1').length > 0
    const author = $tbody.find('td.by').first().find('cite a').text()
    const post_date = $tbody.find('td.by em span').text()
    const commentNum = $tbody.find('td.num a').text()
    const viewNum = $tbody.find('td.num em').text()
    plate_list.push({
      id,
      type,
      title,
      link,
      hasRecommend,
      hasHot,
      author,
      post_date,
      commentNum,
      viewNum,
      hasNew
    })
  })
  if (plateId === '66' && page === 1) {
    plate_list.shift()
  }
  console.log(plate_list);
  return plate_list
}

async function getPlateListByGuide(openUrl, page = 1) {

  let url = decodeURIComponent(openUrl)
  url += '&page=' + page
  const htmlStr = await getHtml(url)
  console.log('get', url);
  const $ = cheerio.load(htmlStr)

  const plate_list = []

  const $tbodys = $('#threadlist .bm_c tbody')

  $tbodys.each((index, tbody) => {
    const $tbody = $(tbody)
    // 过滤分割线
    if (!$tbody.attr('id')) return

    if ($tbody.attr('id') === 'separatorline') return
    // 过滤置顶贴
    if (!$tbody.attr('id').startsWith('normalthread')) return

    const id = $tbody.attr('id').split('_')[1]
    
    const title = $tbody.find('.common a').text()
    // #normalthread_1233028 > tr > td:nth-child(3) > cite > a
    const type = $tbody.find('td.by').first().find('a').text().trim()
    const link =  HOST_NAME + $tbody.find('.common a').attr('href')
    const author = $($tbody.find('td.by').get(1)).find('cite a').text()
    const post_date =$($tbody.find('td.by').get(1)).find('em span').text()
    const commentNum = $tbody.find('td.num a').text()
    const viewNum = $tbody.find('td.num em').text()

    const hasRecommend = $tbody.find('.new').has('[alt=recommend]').length > 0
    const hasHot = $tbody.find('.new').has('[alt=heatlevel]').length > 0
    const hasNew = $tbody.find('.new').has('.xi1').length > 0
    
    const money = $tbody.find('.common .xw1').html() || -1
    const hasResolve = $tbody.find('.common').text().indexOf('[已解决]') > -1
    plate_list.push({
      id,
      type,
      title,
      link,
      hasRecommend,
      hasHot,
      author,
      post_date,
      commentNum,
      viewNum,
      hasNew,
      money,
      hasResolve
    })
  })
  console.log(plate_list);
  return plate_list
}

exports.main = async (event, context) => {
  const { page, url, data, action } = event || {}

  switch (action) {
    case 'get_plate_list_data':
      return getPlateList(data.plateId, data.page)
      break;
      case 'get_plate_list_data_by_guide':
        return getPlateListByGuide(data.openUrl, data.page)
        break;
    default:
      break;
  }
}