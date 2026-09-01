// 6.9影视 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// 使用 __jsEvalReturn ES模块格式
// API: http://lu3fcm.aksdsrle.com
// 内置 HTTP 函数: req(url, options) -> { content, headers, ... }

var HOST = 'http://lu3fcm.aksdsrle.com';
var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

// ========== 分类列表 ==========
var CATEGORIES = [
  { type_id: '9',  type_name: '性感佳人' },
  { type_id: '10', type_name: '国产精品' },
  { type_id: '14', type_name: 'H动漫' },
  { type_id: '16', type_name: '欧美激情' },
  { type_id: '25', type_name: '三级电影' },
  { type_id: '26', type_name: '高清无码' },
  { type_id: '27', type_name: '美乳巨乳' },
  { type_id: '28', type_name: '少女萝莉' },
  { type_id: '29', type_name: '家庭乱伦' },
  { type_id: '30', type_name: '绝顶潮吹' },
  { type_id: '31', type_name: '痴女淫乱' },
  { type_id: '34', type_name: '强奸凌辱' },
  { type_id: '35', type_name: '制服丝袜' },
  { type_id: '36', type_name: 'AV剧情' },
  { type_id: '37', type_name: '人妻熟女' },
  { type_id: '38', type_name: '偷拍盗摄' },
  { type_id: '39', type_name: '风俗沙龙' },
  { type_id: '40', type_name: '国产传媒' },
  { type_id: '41', type_name: '女同性恋' },
  { type_id: '42', type_name: '直播网红' },
  { type_id: '44', type_name: '国产AV' },
  { type_id: '45', type_name: 'SM调教' },
  { type_id: '46', type_name: 'AV解说' }
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
    var url = HOST + '/api/videosort/' + tid + '?orderby=&page=' + pg + '&uuid=1&device=0';
    var html = await request(url);
    if (!html) return [];
    var j = safeParse(html);
    if (!j || j.code !== 200 || !j.rescont || !j.rescont.data) return [];
    var data = j.rescont.data;
    var list = [];
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      list.push({
        vod_id: String(item.id),
        vod_name: item.title || '',
        vod_pic: item.coverpath || '',
        vod_remarks: item.authername || ''
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

async function fetchDetail(id) {
  try {
    var url = HOST + '/api/videoplay/' + id + '?&uuid=1';
    var html = await request(url);
    if (!html) return null;
    var j = safeParse(html);
    if (!j || j.code !== 200 || !j.rescont) return null;
    return j.rescont;
  } catch (e) {
    return null;
  }
}

// ========== Spider 方法 ==========

export function __jsEvalReturn() {
  return {
    init: async function(ext) {},

    home: async function(filter) {
      var list = await fetchList(CATEGORIES[0].type_id, 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var list = await fetchList(CATEGORIES[0].type_id, 1);
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
      var videoUrl = data.videopath || '';
      return JSON.stringify({
        list: [{
          vod_id: String(data.id),
          vod_name: data.title || '',
          vod_pic: data.coverpath || '',
          vod_content: data.introduction || '',
          vod_remarks: data.playtimes || data.authername || '',
          vod_year: '',
          vod_area: '',
          vod_class: '',
          type_name: '',
          vod_play_from: '6.9影视',
          vod_play_url: (data.title || '播放') + '$' + videoUrl
        }]
      });
    },

    search: async function(key, quick, pg) {
      return JSON.stringify({ list: [], page: '1' });
    },

    play: async function(flag, id, vipFlags) {
      var url = id;
      if (url && url.indexOf('$') > -1) url = url.split('$')[1];
      return JSON.stringify({ url: url, parse: 1 });
    },

    live: function(url) { return ''; },
    sniffer: function() { return false; },
    isVideo: function(url) { return false; },
    action: function(actionArg) { return ''; },
    destroy: function() {}
  };
}
