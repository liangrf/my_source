// 爱播爱播 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// API: https://www.455577.xyz
// 内置 HTTP 函数: req(url, options) -> { content, headers, ... }

var HOST = 'https://www.455577.xyz';
var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

// ========== 分类列表 ==========
var CATEGORIES = [
  { type_id: '11', type_name: '国产自拍' },
  { type_id: '12', type_name: '日韩AV' },
  { type_id: '13', type_name: '欧美精品' },
  { type_id: '14', type_name: '异族风情' },
  { type_id: '15', type_name: '动漫专栏' },
  { type_id: '16', type_name: '蓝光超清' },
  { type_id: '17', type_name: '全部' }
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

async function fetchList(sourceKey, pg) {
  try {
    var url = HOST + '/category?source=' + sourceKey + '&page=' + pg;
    var html = await request(url);
    if (!html) return [];
    
    // 从 HTML 中提取内嵌的 JSON 数据
    var dataMatch = html.match(/data:\s*\{[^}]*vods:\s*(\[[\s\S]*?\])/);
    if (!dataMatch) return [];
    
    var vods = safeParse(dataMatch[1]);
    if (!vods || !Array.isArray(vods)) return [];
    
    var list = [];
    for (var i = 0; i < vods.length; i++) {
      var item = vods[i];
      list.push({
        vod_id: String(item.id),
        vod_name: item.name || '',
        vod_pic: item.pic || '',
        vod_remarks: item.type || ''
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

async function fetchDetail(id) {
  try {
    // 从 id 中提取 sourceKey 和实际 ID
    var parts = id.split('-');
    if (parts.length < 2) return null;
    
    var url = HOST + '/' + id;
    var html = await request(url);
    if (!html) return null;
    
    // 从 HTML 中提取内嵌的 JSON 数据
    var dataMatch = html.match(/data:\s*\{[^}]*vods:\s*(\[[\s\S]*?\])/);
    if (!dataMatch) return null;
    
    var vods = safeParse(dataMatch[1]);
    if (!vods || !Array.isArray(vods) || vods.length === 0) return null;
    
    var item = vods[0];
    return {
      id: id,
      name: item.name || '',
      pic: item.pic || '',
      m3u8: item.m3u8 || '',
      playUrl: item.playUrl || ''
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
      var list = await fetchList('17', 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var list = await fetchList('17', 1);
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
          vod_name: data.name || '爱播爱播',
          vod_pic: data.pic || '',
          vod_content: '',
          vod_remarks: '',
          vod_year: '',
          vod_area: '',
          vod_class: '',
          type_name: '',
          vod_play_from: '爱播爱播',
          vod_play_url: data.playUrl || ('正片$' + data.m3u8)
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
