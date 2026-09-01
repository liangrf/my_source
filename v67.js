// 6.7 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// API: https://wap.jiejiesp19.xyz
// 内置 HTTP 函数: req(url, options) -> { content, headers, ... }

var HOST = 'https://wap.jiejiesp19.xyz';
var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

// ========== 分类列表 ==========
var CATEGORIES = [
  { type_id: '87', type_name: '黄瓜资源' },
  { type_id: '248', type_name: '155资源' },
  { type_id: '117', type_name: '森林资源' },
  { type_id: '86', type_name: '奥斯卡资源' },
  { type_id: '237', type_name: '百万资源' },
  { type_id: '251', type_name: '制服诱惑' },
  { type_id: '254', type_name: '中文字幕' },
  { type_id: '262', type_name: '美乳巨乳' },
  { type_id: '259', type_name: '熟女人妻' },
  { type_id: '260', type_name: '萝莉少女' },
  { type_id: '263', type_name: '强奸乱伦' },
  { type_id: '249', type_name: '无码专区' }
];

// ========== HTTP 请求封装 ==========

async function request(url) {
  try {
    var res = await req(url, { headers: { 'User-Agent': UA } });
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
    var url = HOST + '/jiejie/index.php/vod/type/id/' + tid + '.html';
    if (pg > 1) {
      url = HOST + '/jiejie/index.php/vod/type/id/' + tid + '/page/' + pg + '.html';
    }
    var html = await request(url);
    if (!html) return [];
    
    var list = [];
    // 提取视频列表
    var itemRegex = /<li[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>[\s\S]*?<\/li>/g;
    var match;
    while ((match = itemRegex.exec(html)) !== null) {
      var itemHtml = match[0];
      var link = match[1];
      
      // 提取标题
      var titleMatch = itemHtml.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
      var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
      
      // 提取图片
      var imgMatch = itemHtml.match(/<img[^>]*data-original="([^"]*)"[^>]*>/);
      var img = imgMatch ? imgMatch[1] : '';
      
      if (title && link) {
        list.push({
          vod_id: link.startsWith('http') ? link : HOST + link,
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
    var titleMatch = html.match(/<h4[^>]*>([\s\S]*?)<\/h4>/);
    var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    
    // 提取视频链接
    var videoRegex = /src="([^"]*(?:m3u8|mp4)[^"]*)"/g;
    var videoUrls = [];
    var videoMatch;
    while ((videoMatch = videoRegex.exec(html)) !== null) {
      videoUrls.push(videoMatch[1]);
    }
    
    if (videoUrls.length === 0) return null;
    
    return {
      id: id,
      title: title,
      videopath: videoUrls[0]
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
      var list = await fetchList('87', 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var list = await fetchList('87', 1);
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
          vod_name: data.title || '6.7',
          vod_pic: '',
          vod_content: '',
          vod_remarks: '',
          vod_year: '',
          vod_area: '',
          vod_class: '',
          type_name: '',
          vod_play_from: '6.7',
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
