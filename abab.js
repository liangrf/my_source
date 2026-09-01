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

// ========== HTTP 请求 ==========

async function request(url) {
  try {
    var res = await req(url, { headers: { 'User-Agent': UA } });
    return res.content || '';
  } catch (e) {
    return '';
  }
}

// ========== HTML 解析 ==========

// 从列表页提取视频
function parseListHtml(html) {
  if (!html) return [];
  var list = [];
  // 提取 SvelteKit 内嵌数据中的 vods
  var dataMatch = html.match(/vods:\s*\[([\s\S]*?)\]\s*,\s*(?:totalPages|prerendered)/);
  if (dataMatch) {
    // 逐个提取 vod 对象
    var vodRegex = /\{id:(\d+),name:"([^"]*)",pic:"([^"]*)"[^}]*?(?:remarks:"([^"]*)",)?[^}]*?m3u8:"([^"]*)"[^}]*?playUrl:"([^"]*)"[^}]*?sourceKey:"(\d+)"/g;
    var m;
    while ((m = vodRegex.exec(dataMatch[0])) !== null) {
      list.push({
        vod_id: m[7] + '-' + m[1],
        vod_name: m[2],
        vod_pic: m[3],
        vod_remarks: m[4] || ''
      });
    }
  }
  return list;
}

// 从详情页提取 m3u8
function parseDetailHtml(html, id) {
  if (!html) return null;
  // 标题
  var titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  var name = titleMatch ? titleMatch[1].trim() : '';
  // 封面
  var picMatch = html.match(/og:image"\s+content="([^"]*)"/);
  var pic = '';
  if (picMatch) {
    pic = picMatch[1];
    if (pic.indexOf('/api/img?url=') > -1) {
      pic = decodeURIComponent(pic.split('/api/img?url=')[1].split('&')[0]);
    }
  }
  // m3u8 - 从 "直接播放" 链接
  var m3u8Match = html.match(/href="(https?:\/\/[^"]*\.m3u8[^"]*)"[^>]*>[^<]*直接播放/);
  var m3u8 = m3u8Match ? m3u8Match[1] : '';
  // 备注（时长）
  var remarksMatch = html.match(/<span[^>]*>([\d:]+)<\/span>/);
  var remarks = remarksMatch ? remarksMatch[1] : '';

  return { id: id, name: name, pic: pic, m3u8: m3u8, remarks: remarks };
}

// ========== Spider ==========

export function __jsEvalReturn() {
  return {
    init: async function(ext) {},

    home: async function(filter) {
      var html = await request(HOST + '/category?source=17');
      var list = parseListHtml(html);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var html = await request(HOST + '/category?source=17');
      var list = parseListHtml(html);
      return JSON.stringify({ list: list });
    },

    category: async function(tid, pg, filter, extend) {
      var page = pg || 1;
      var html = await request(HOST + '/category?source=' + (tid || '17') + '&page=' + page);
      var list = parseListHtml(html);
      return JSON.stringify({ list: list, page: String(page) });
    },

    detail: async function(ids) {
      var id = (typeof ids === 'string') ? ids : (Array.isArray(ids) ? ids[0] : '');
      if (!id) return JSON.stringify({ list: [] });
      var html = await request(HOST + '/' + id);
      var data = parseDetailHtml(html, id);
      if (!data || !data.m3u8) return JSON.stringify({ list: [] });
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
          vod_play_url: '正片$' + data.m3u8
        }]
      });
    },

    search: async function(key, quick, pg) {
      return JSON.stringify({ list: [], page: '1' });
    },

    play: async function(flag, id, vipFlags) {
      var url = id;
      if (url && url.indexOf('$') > -1) url = url.split('$')[1];
      return JSON.stringify({
        url: url,
        parse: 0,
        header: { 'User-Agent': UA, 'Referer': HOST + '/' }
      });
    },

    live: function(url) { return ''; },
    sniffer: function() { return false; },
    isVideo: function(url) { return false; },
    action: function(actionArg) { return ''; },
    destroy: function() {}
  };
}
