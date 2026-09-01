// 每日大赛 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// API: https://d3fzqoxno61m61.rnxuiofe.com/
// 内置 HTTP 函数: req(url, options) -> { content, headers, ... }

var HOST = 'https://d3fzqoxno61m61.rnxuiofe.com';
var UA = 'Mozilla/5.0 (Linux; U; Android 13; zh-Hans-CN; PFJM10 Build/TP1A.220905.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/135.0.4896.58 Quark/6.13.6.581 Mobile Safari/537.36';

// ========== 分类列表 ==========
var CATEGORIES = [
  { type_id: 'mrds', type_name: '每日大赛' },
  { type_id: 'ztds', type_name: '主题大赛' },
  { type_id: 'rstt', type_name: '热搜吃瓜' },
  { type_id: 'xazd', type_name: '校园学生' },
  { type_id: 'blyp', type_name: '必撸大赛' },
  { type_id: 'fctg', type_name: '反差泄密' },
  { type_id: 'mhds', type_name: '网红黑料' },
  { type_id: 'lqdp', type_name: '猎奇重口' },
  { type_id: 'jdsj', type_name: 'AV看片' },
  { type_id: 'mxwh', type_name: '明星大赛' },
  { type_id: 'smdh', type_name: '动漫之家' },
  { type_id: 'dypd', type_name: '影视国漫' },
  { type_id: 'mtds', type_name: 'cos写真' },
  { type_id: 'ysds', type_name: '声控ASMR' },
  { type_id: 'czds', type_name: '寸止挑战' },
  { type_id: 'hjds', type_name: '混剪PMV' },
  { type_id: 'tgds', type_name: '原创投稿' },
  { type_id: 'omjp', type_name: '欧美精品' },
  { type_id: 'qwcs', type_name: '全网参赛' }
];

// ========== HTTP 请求封装 ==========

async function request(url) {
  try {
    var res = await req(url, { 
      headers: { 
        'User-Agent': UA,
        'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
      } 
    });
    return res.content || '';
  } catch (e) {
    return '';
  }
}

function safeParse(str) {
  try { return JSON.parse(str); } catch (e) { return null; }
}

// ========== 数据获取函数 ==========

async function fetchList(tid, pg) {
  try {
    var url = HOST + '/category/' + tid + '/' + pg + '/';
    var html = await request(url);
    if (!html) return [];
    
    var list = [];
    // 提取文章链接
    var articleRegex = /<article[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>[\s\S]*?<\/article>/g;
    var match;
    while ((match = articleRegex.exec(html)) !== null) {
      var articleHtml = match[0];
      var link = match[1];
      
      // 提取标题
      var titleMatch = articleHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
      var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      
      // 提取图片
      var imgMatch = articleHtml.match(/<img[^>]*src="([^"]*)"[^>]*>/);
      var img = imgMatch ? imgMatch[1] : '';
      
      if (title && link) {
        list.push({
          vod_id: link,
          vod_name: title,
          vod_pic: img,
          vod_remarks: ''
        });
      }
    }
    
    return list;
  } catch (e) {
    return [];
  }
}

async function fetchDetail(id) {
  try {
    var url = id.startsWith('http') ? id : HOST + id;
    var html = await request(url);
    if (!html) return null;
    
    // 提取标题
    var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    
    // 提取m3u8链接
    var m3u8Regex = /(https?:\/\/[^'"\s]*?\.m3u8[^'"\s]*)/g;
    var m3u8Urls = [];
    var m3u8Match;
    while ((m3u8Match = m3u8Regex.exec(html)) !== null) {
      m3u8Urls.push(m3u8Match[1]);
    }
    
    if (m3u8Urls.length === 0) return null;
    
    return {
      id: id,
      title: title,
      videopath: m3u8Urls[0],
      allUrls: m3u8Urls
    };
  } catch (e) {
    return null;
  }
}

// ========== Spider 方法 ==========

export function __jsEvalReturn() {
  return {
    init: async function(ext) {},

    home: async function(filter) {
      var list = await fetchList('mrds', 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var list = await fetchList('mrds', 1);
      return JSON.stringify({ list: list.slice(0, 10) });
    },

    category: async function(tid, pg, filter, extend) {
      var page = pg || 1;
      var list = await fetchList(tid, page);
      return JSON.stringify({ list: list, page: String(page) });
    },

    detail: async function(ids) {
      var id = (typeof ids === 'string') ? ids : (Array.isArray(ids) ? ids[0] : '');
      if (!id) return JSON.stringify({ list: [] });
      var data = await fetchDetail(id);
      if (!data) return JSON.stringify({ list: [] });
      return JSON.stringify({
        list: [{
          vod_id: id,
          vod_name: data.title || '每日大赛',
          vod_pic: '',
          vod_content: '',
          vod_remarks: '',
          vod_year: '',
          vod_area: '',
          vod_class: '',
          type_name: '',
          vod_play_from: '每日大赛',
          vod_play_url: '正片$' + data.videopath
        }]
      });
    },

    search: async function(key, quick, pg) {
      return JSON.stringify({ list: [], page: '1' });
    },

    play: async function(flag, id, vipFlags) {
      var url = id;
      if (url && url.indexOf('$') > -1) url = url.split('$')[1];
      return JSON.stringify({ url: url, parse: 0, header: { 'User-Agent': UA } });
    },

    live: function(url) { return ''; },
    sniffer: function() { return false; },
    isVideo: function(url) { return false; },
    action: function(actionArg) { return ''; },
    destroy: function() {}
  };
}
