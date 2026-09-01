// 爱播爱播 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// API: https://www.455577.xyz
// 内置 HTTP 函数: req(url, options) -> { content, headers, ... }

var HOST = 'https://www.455577.xyz';
var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

// ========== 主分类（source 就是分类） ==========
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

// 从 HTML 中提取内嵌的 SvelteKit JSON 数据
function extractData(html) {
  if (!html) return null;
  // 匹配 data: { type:"data", data:{ ... vods:[...] ... } }
  var match = html.match(/data:\s*\{type:"data",data:\{([^]*?)\},uses:/);
  if (!match) return null;
  try {
    var obj = JSON.parse('{' + match[1] + '}');
    return obj;
  } catch (e) {
    return null;
  }
}

// ========== 数据获取函数 ==========

async function fetchList(sourceKey, pg) {
  try {
    var url = HOST + '/category?source=' + sourceKey + '&page=' + pg;
    var html = await request(url);
    if (!html) return [];
    
    var data = extractData(html);
    if (!data || !data.vods) return [];
    
    var list = [];
    for (var i = 0; i < data.vods.length; i++) {
      var item = data.vods[i];
      // vod_id 格式: sourceKey-id（用于 detail 请求）
      list.push({
        vod_id: sourceKey + '-' + item.id,
        vod_name: item.name || '',
        vod_pic: item.pic || '',
        vod_remarks: item.remarks || item.type || ''
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

// 获取某个 source 的子分类
async function fetchClasses(sourceKey) {
  try {
    var url = HOST + '/category?source=' + sourceKey;
    var html = await request(url);
    if (!html) return [];
    
    var data = extractData(html);
    if (!data || !data.classes) return [];
    
    var list = [];
    for (var i = 0; i < data.classes.length; i++) {
      var cls = data.classes[i];
      list.push({
        type_id: String(cls.id),
        type_name: cls.name
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

async function fetchDetail(id) {
  try {
    var url = HOST + '/' + id;
    var html = await request(url);
    if (!html) return null;
    
    var data = extractData(html);
    if (!data || !data.vods || data.vods.length === 0) return null;
    
    var item = data.vods[0];
    return {
      id: id,
      name: item.name || '',
      pic: item.pic || '',
      m3u8: item.m3u8 || '',
      playUrl: item.playUrl || '',
      remarks: item.remarks || ''
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
      // 首页：显示所有 source 作为分类，加载 source=17（全部）的视频
      var list = await fetchList('17', 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var list = await fetchList('17', 1);
      return JSON.stringify({ list: list });
    },

    category: async function(tid, pg, filter, extend) {
      // tid = sourceKey（11-41），直接用 source 参数请求
      var page = pg || 1;
      var sourceKey = tid || '17';
      var list = await fetchList(sourceKey, page);
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
          vod_remarks: data.remarks || '',
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
