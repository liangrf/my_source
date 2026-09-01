// 丝瓜 S - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// API: https://api.sgapiaba.xyz
// 内置 HTTP 函数: req(url, options) -> { content, headers, ... }

var HOST = 'https://api.sgapiaba.xyz';
var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

// ========== 分类列表 ==========
var CATEGORIES = [
  { type_id: '0',  type_name: '随机' },
  { type_id: '10', type_name: '国产自拍' },
  { type_id: '14', type_name: 'H动漫' },
  { type_id: '58', type_name: '扶她姐妹' },
  { type_id: '60', type_name: '国产AV' },
  { type_id: '17', type_name: '网红主播' },
  { type_id: '37', type_name: '嫩模专区' },
  { type_id: '53', type_name: '偷拍盗摄' },
  { type_id: '54', type_name: '萌妹酱篇' },
  { type_id: '55', type_name: '精彩短片' },
  { type_id: '32', type_name: '外流视频' },
  { type_id: '40', type_name: '明星淫梦' },
  { type_id: '56', type_name: '鹿少女集' },
  { type_id: '1',  type_name: '高清无码' },
  { type_id: '5',  type_name: '制服诱惑' },
  { type_id: '11', type_name: '长腿丝袜' },
  { type_id: '29', type_name: 'AV剧情' },
  { type_id: '24', type_name: 'AV素人' },
  { type_id: '51', type_name: '淫荡痴女' },
  { type_id: '20', type_name: '巨乳咪咪' },
  { type_id: '6',  type_name: '人妻熟女' },
  { type_id: '49', type_name: '近亲乱伦' },
  { type_id: '46', type_name: '淫乱师生' },
  { type_id: '4',  type_name: '角色扮演' },
  { type_id: '22', type_name: '青春萝莉' },
  { type_id: '39', type_name: '魔镜系列' },
  { type_id: '57', type_name: '中文无码' },
  { type_id: '9',  type_name: '当红女优' },
  { type_id: '19', type_name: '中文字幕' },
  { type_id: '36', type_name: '259LUXU' },
  { type_id: '23', type_name: '重咸口味' },
  { type_id: '30', type_name: '丝瓜推荐' },
  { type_id: '25', type_name: '三级电影' },
  { type_id: '52', type_name: '电车之狼' },
  { type_id: '59', type_name: '中外合拍' },
  { type_id: '44', type_name: '苍老师' },
  { type_id: '38', type_name: '女同性爱' },
  { type_id: '16', type_name: '欧美AV' },
  { type_id: '35', type_name: '恐怖情色' }
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
    var url = HOST + '/api/videosort/' + tid + '?page=' + pg;
    var html = await request(url);
    if (!html) return [];
    var j = safeParse(html);
    if (!j || !j.rescont || !j.rescont.data) return [];
    var data = j.rescont.data;
    var list = [];
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      list.push({
        vod_id: String(item.id),
        vod_name: item.title || '',
        vod_pic: item.coverbase64 ? item.coverbase64.url : (item.coverpath || ''),
        vod_remarks: item.playtimes || ''
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

async function fetchDetail(id) {
  try {
    var url = HOST + '/api/videoplay/' + id + '?uuid=1';
    var html = await request(url);
    if (!html) return null;
    var j = safeParse(html);
    if (!j || !j.rescont) return null;
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
      var list = await fetchList('0', 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var list = await fetchList('0', 1);
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
          vod_pic: data.coverbase64 ? data.coverbase64.url : (data.coverpath || ''),
          vod_content: data.introduction || '',
          vod_remarks: data.playtimes || '',
          vod_year: '',
          vod_area: '',
          vod_class: '',
          type_name: '',
          vod_play_from: '丝瓜',
          vod_play_url: '正片$' + videoUrl
        }]
      });
    },

    search: async function(key, quick, pg) {
      return JSON.stringify({ list: [], page: '1' });
    },

    play: async function(flag, id, vipFlags) {
      var url = id;
      if (url && url.indexOf('$') > -1) url = url.split('$')[1];
      return JSON.stringify({ url: url, parse: 0, header: { 'User-Agent': UA, 'Referer': HOST } });
    },

    live: function(url) { return ''; },
    sniffer: function() { return false; },
    isVideo: function(url) { return false; },
    action: function(actionArg) { return ''; },
    destroy: function() {}
  };
}
