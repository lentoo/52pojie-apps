const axios = require('axios').default;
const cheerio = require('cheerio');
// const Iconv = require('iconv').Iconv
const iconv = require('iconv-lite');
const cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'env-52pojie-2tc3i',
});
/**
 *
 */
const HOST_NAME = 'https://www.52pojie.cn/';
axios.defaults.timeout = 30000;
const db = cloud.database();
async function getHtml(url) {
  console.log(`proxy: http://test.gymgest.com.cn/node/proxy?url=${url}`);
  const res = await axios.get(
    `http://test.gymgest.com.cn/node/proxy?url=${url}`
  );
  return res.data;
}
// async function getHtml(url) {
//   const res = await axios.get(url, {
//     // 以下为解决中文乱码的主要代码
//     responseType: 'stream',
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
//       'Pragma': 'no-cache',
//       'Content-type': 'application/x-www-form-urlencoded; chatset=gbk',
//       'Sec-Fetch-Dest': 'document',
//       'Sec-Fetch-Mode': 'navigate',
//       'Sec-Fetch-Site': 'none',
//       'Sec-Fetch-User': '?1',
//       'Upgrade-Insecure-Requests': '1',
//       'Accept': '*/*',
//       'Accept-Encoding': 'gzip, deflate, br',
//       // 'Cookie': 'htVD_2132_connect_is_bind=1; htVD_2132_connect_uin=8FADB23A2BBA09962DE77F951C069A81; htVD_2132_smile=1D1; htVD_2132_nofavfid=1; __gads=ID=6b293984e3dad776:T=1588901663:S=ALNI_Ma8bJ85FyV8AsJ2XJzS03lSZsmj8w; Hm_lvt_46d556462595ed05e05f009cdafff31a=1598232753; htVD_2132_atarget=1; htVD_2132_saltkey=Ybowo3zF; htVD_2132_lastvisit=1598226700; htVD_2132_con_request_uri=https%3A%2F%2Fwww.52pojie.cn%2Fconnect.php%3Fmod%3Dlogin%26op%3Dcallback%26referer%3Dhttps%253A%252F%252Fwww.52pojie.cn%252Fforum-66-1.html; htVD_2132_seccodecSAKAjxr5=915331.760036139683be1753; htVD_2132_client_token=8FADB23A2BBA09962DE77F951C069A81; htVD_2132_lastviewtime=575886%7C1598578079; htVD_2132_sid=0; htVD_2132_seccodecSAIwoY94=2454269.2d0790aab06d6d91b6; htVD_2132_seccodecSAIwo=2454270.d402fcc03e7e8eddf4; htVD_2132_client_created=1599542456; htVD_2132_auth=b451wgkMY8FE6VxNE7jezjq0FdE2T7H6ByWkb414sbnBb%2F3VR72lDm%2FjIGe67ObYOFGYMYj15SmP9WRnLinbTDlhFec; htVD_2132_connect_login=1; htVD_2132_home_readfeed=1599630148; htVD_2132_ulastactivity=1599722039%7C0; htVD_2132_st_t=575886%7C1599722259%7C1d2f049263f1cb8a820a84c8ccb6b2d3; htVD_2132_forum_lastvisit=D_16_1599565400D_8_1599722228D_66_1599722259; htVD_2132_visitedfid=66D8D75D16D10; htVD_2132_viewid=tid_1264239; htVD_2132_ignore_rate=1; htVD_2132_checkpm=1; htVD_2132_lastcheckfeed=575886%7C1599722367; Hm_lpvt_46d556462595ed05e05f009cdafff31a=1599722370; htVD_2132_clearUserdata=forum; htVD_2132_lastact=1599722387%09forum.php%09viewthread; htVD_2132_st_p=575886%7C1599722387%7Ca980d0ee29bdc765905f3565a02efdce'
//     }
//   })
//   // 返回一个promise实例对象
//   return new Promise(resolve => {

//     const chunks = []

//     res.data.on('data', chunk => {

//       chunks.push(chunk)

//     })

//     res.data.on('end', (data) => {
//       const buffer = Buffer.concat(chunks)

//       const str = iconv.decode(buffer, 'gbk')

//       resolve(str)

//     })
//   })
// }

async function getHomePageData() {
  const result = await getHtml(
    'https://www.52pojie.cn/forum.php?_t=' + Date.now()
  );
  const $ = cheerio.load(result, { decodeEntities: false });

  let homeTabs = $('.toptitle_7ree a');
  const tabs = [];

  homeTabs.each((index, tab) => {
    if (index === homeTabs.length - 1) return;
    let title = $(tab).text();
    if (title && title.indexOf('（') > -1) {
      title = title.split('（')[0];
    }
    const link = $(tab).attr('href');
    tabs.push({
      id: index,
      name: title,
      list: [],
      more_link: HOST_NAME + link,
    });
  });

  const tds = $('#category_ .fl_row td');
  tds.each((index, td) => {
    if (index === tds.length - 1) return;
    const list_box = $(td).find('.threadline_7ree');
    const list_item = list_box.map((i, item) => {
      const a = $(item).find('a');
      const text = trim(a.text());
      const link = trim(a.attr('href'));
      const tips = trim(a.attr('tips'));
      return {
        text,
        link: HOST_NAME + link,
        tips,
      };
    });
    tabs[index].list = list_item.toArray();
  });
  console.log(tabs);

  return tabs;
}

async function getAreasData() {
  const result = await getHtml('https://www.52pojie.cn/forum.php');

  const $ = cheerio.load(result);
  let areas = $('#hd .nav_ico02 li a');
  const list_data = [];
  areas.each((index, item) => {
    const $item = $(item);
    const name = trim($item.text());
    const title = trim($item.attr('title'));
    const link = $item.attr('href');
    list_data.push({
      index,
      name,
      title,
      link: HOST_NAME + link,
    });
  });
  areas = $('#hd .nav_ico03 li a');
  areas.each((index, item) => {
    const $item = $(item);
    const name = trim($item.text());
    const title = trim($item.attr('title'));
    const link = $item.attr('href');
    list_data.push({
      index,
      name,
      title,
      link: HOST_NAME + link,
    });
  });
  console.log(list_data);
  return list_data;
}
function removeDuplicates(arr) {
  if (arr instanceof Array) {
    return [...new Set(arr)];
  }
  return arr;
}
function replaceContent(content) {
  if (!content) return {};

  const diff = [];

  content = content.replace(/ignore_js_op/g, 'div');
  console.log('content', content);
  content = content.replace(/<img(.*?)>/g, function (word) {
    console.log('word', word);
    let newContent = '';
    if (word.indexOf('none.gif') > -1) {
      newContent = word
        .replace('src=', 'style="max-width:92%;" data-none=')
        .replace('zoomfile', 'src');
      diff.push({
        old: word,
        new: newContent,
      });
      return newContent;
    } else {
      newContent = word.replace('src=', 'style="max-width:92%;" src=');
      return newContent;
    }

    return word;
  });
  console.log('diff', diff);
  content = content.replace(/<pre(.*?)>/g, function (word) {
    word = word.replace(/(class=[\w\W]*")/, 'class="pre-code"');
    return word;
  });

  const reg_baidu_pan =
    /((?:https?:\/\/)?(?:yun|pan|eyun)\.baidu\.com\/(?:s\/\w*(((-)?\w*)*)?|share\/\S*\d\w*))/g;
  const baidu_pan_links = removeDuplicates(content.match(reg_baidu_pan) || []);
  const reg_189_pan = /https?:\/\/cloud\.189\.cn\/t\/(\w*)/g;
  const cloud_189_links = removeDuplicates(content.match(reg_189_pan) || []);
  const reg_lanzou_pan = /(https?:\/\/(www|pan)\.lanzoux?\.com\/(\w*))/g;
  const lanzou_links = removeDuplicates(content.match(reg_lanzou_pan) || []);
  return {
    diff,
    content,
    pan_links: [...baidu_pan_links, ...cloud_189_links, ...lanzou_links],
  };
}
async function getArticleDetailData(url, page = 1) {
  const id = url.split('-')[1];

  const html = await getHtml(url);

  const $ = cheerio.load(html);

  const $main = $('.res-postfirst');

  const $plate = $(
    '#postlist > table:nth-child(1) > tbody > tr > td.plc.ptm.pbn.vwthd > h1 > a'
  );

  const $title = $('#thread_subject');

  const $username = $main.find('.favatar .xw1');

  const $avatar = $main.find('.favatar .avatar img');

  const $post_date = $main.find('.authi em');

  const $money = $main.find('.rusld cite').html() || -1;
  const $hasResolve = $main.find('.rsld').length > 0;
  let $content = $('.pcb .t_fsz');

  // 若无权限
  let $alert_message = $('#messagetext p');
  let alert_message = '';
  if ($alert_message) {
    alert_message = $alert_message.text();
  }
  if ($content.length === 0) {
    $content = $('.pcb .rwdn');
  }
  const $pgs = $('.pgs .pg');
  let pages = 0;
  let nextUrl = '';
  if ($pgs.length > 0) {
    const $span = $pgs.find('label span');
    const reg = /(\w+)/;
    const matches = reg.exec($span.attr('title'));

    if (matches) {
      pages = matches[0];
      if (Number(page) < Number(pages)) {
        const arr = url.split('-');
        nextUrl = `${arr[0]}-${arr[1]}-${Number(page) + 1}-${arr[3]}`;
      }
    }
  }
  const link = url;

  let $comments = $('#postlist > div');
  $comments = $comments.slice(1, $comments.length - 1);

  const comments = [];
  $comments.each((index, comment) => {
    const $comment = $(comment);
    const $c_username = $comment.find('.favatar .authi .xw1');
    const $c_avatar = $comment.find('.avatar img');
    let $c_content = $comment.find('.pcb .t_fsz');
    const $c_post_date = $comment.find('.authi em');

    if ($c_content.length === 0) {
      $c_content = $comment.find('.pcb .pcbs');
    }

    comments.push({
      username: $c_username.text(),
      avatar: $c_avatar.attr('src'),
      content: $c_content.html(),
      post_date: $c_post_date.text(),
    });
  });
  const { content, diff, pan_links } = replaceContent($content.html());
  return {
    id,
    plate: $plate.text(),
    title: $title.text(),
    username: $username.text(),
    avatar: $avatar.attr('src'),
    post_date: $post_date.text(),
    content,
    diff,
    link,
    pages,
    comments,
    pan_links,
    hasNext: Boolean(nextUrl),
    money: $money,
    hasResolve: $hasResolve,
    alert_message,
  };
}

async function getArticleDetailComments(id, page) {
  const url = `https://www.52pojie.cn/thread-${id}-${page}-1.html`;

  const html = await getHtml(url);

  const $ = cheerio.load(html);

  const $pgs = $('.pgs .pg');
  let pages = 0;
  let nextUrl = '';
  if ($pgs.length > 0) {
    const $span = $pgs.find('label span');
    const reg = /(\w+)/;
    const matches = reg.exec($span.attr('title'));

    if (matches) {
      pages = matches[0];
      if (Number(page) < Number(pages)) {
        const arr = url.split('-');
        nextUrl = `${arr[0]}-${arr[1]}-${Number(page) + 1}-${arr[3]}`;
      }
    }
  }

  let $comments = $('#postlist > div');
  if (page == '1') {
    $comments = $comments.slice(1, $comments.length - 1);
  } else {
    $comments = $comments.slice(0, $comments.length - 1);
  }
  console.log($comments.length);
  const comments = [];
  $comments.each((index, comment) => {
    const $comment = $(comment);
    const $c_username = $comment.find('.favatar .authi .xw1');
    const $c_avatar = $comment.find('.avatar img');
    const $c_content = $comment.find('.pcb .t_fsz');
    const $c_post_date = $comment.find('.authi em');
    comments.push({
      username: $c_username.text(),
      avatar: $c_avatar.attr('src'),
      content: $c_content.html(),
      post_date: $c_post_date.text(),
    });
  });

  return {
    comments,
    id,
    page,
    pages,

    hasNext: Boolean(nextUrl),
  };
}
function trim(text) {
  if (text && text.trim) {
    return text.trim();
  }
  return text;
}

exports.main = async (event, context) => {
  console.log(event);
  console.log(context);
  const { page, url, id, action } = event || {};
  // const data_cache = await db
  //   .collection('data_cache')
  //   .where({
  //     action: action,
  //   })
  //   .get();
  // const action_cache_data = data_cache.data;
  // let useCache = false;
  // if (action_cache_data.length > 0) {
  //   const last_date = action_cache_data[0].last_date;
  //   const result = action_cache_data[0].result;
  //   const now = Date.now();
  //   useCache = now < last_date;
  //   if (useCache) {
  //     return result;
  //   }
  // }
  let result = null;
  console.log('action = ', action);
  switch (action) {
    case 'get_home_page_data':
      result = await getHomePageData();
      break;
    case 'get_areas_data':
      result = await getAreasData();
      break;
    case 'get_article_detail_data':
      result = await getArticleDetailData(url, page);
      return result;
    case 'get_article_detail_comments_data':
      result = await getArticleDetailComments(id, page);
      return result;
    default:
      break;
  }
  // if (useCache === false) {
  //   createCache(action, result, 1000 * 60 * 10); // 缓存10分钟
  // }
  return result;
};

async function createCache(key, value, cache_time) {
  await db
    .collection('data_cache')
    .where({
      action: key,
    })
    .remove();
  return db.collection('data_cache').add({
    data: {
      action: key,
      result: value,
      last_date: Date.now() + cache_time,
    },
  });
}
