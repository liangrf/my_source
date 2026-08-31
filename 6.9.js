// 6.9影视 - TVBox 蜂蜜版 JS Spider (type:3)
// 兼容性优化版
var HOST = 'http://lu3fcm.aksdsrle.com';
var UUID = '1';
var DEVICE = '0';

var CLASS_MAP = [
  ['9','性感佳人'],['10','国产精品'],['14','H动漫'],['16','欧美激情'],['25','三级电影'],
  ['26','高清无码'],['27','美乳巨乳'],['28','少女萝莉'],['29','家庭乱伦'],['30','绝顶潮吹'],
  ['31','痴女淫乱'],['34','强奸凌辱'],['35','制服丝袜'],['36','AV剧情'],['37','人妻熟女'],
  ['38','偷拍盗摄'],['39','风俗沙龙'],['40','国产传媒'],['41','女同性恋'],['42','直播网红'],
  ['44','国产AV'],['45','SM调教'],['49','AV解说'],['50','热门爆料']
];

var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

// JSON 序列化
function jp(o) {
  if (typeof jsonParse === 'function') return jsonParse(o);
  return JSON.stringify(o);
}

// HTTP 请求 - 兼容多种 TVBox 版本
function req(url) {
  // 尝试 request(url, options)
  if (typeof request === 'function') {
    try {
      var res = request(url, { headers: { 'User-Agent': UA } });
      if (res) return res;
    } catch (e) {}
    try {
      return request(url);
    } catch (e) {}
  }
  // 尝试 httpGet
  if (typeof httpGet === 'function') {
    try {
      return httpGet(url);
    } catch (e) {}
  }
  // 尝试 fetch
  if (typeof fetch === 'function') {
    try {
      return fetch(url);
    } catch (e) {}
  }
  return '';
}

// 获取列表
function fetchList(tid, pg) {
  try {
    var url = HOST + '/api/videosort/' + tid + '?orderby=&page=' + pg + '&uuid=' + UUID + '&device=' + DEVICE;
    var html = req(url);
    if (!html) return [];
    var j = JSON.parse(html);
    var data = (j && j.rescont && j.rescont.data) ? j.rescont.data : [];
    var list = [];
    for (var i = 0; i < data.length; i++) {
      var it = data[i];
      list.push({
        vod_id: String(it.id),
        vod_name: it.title || '',
        vod_pic: it.coverpath || '',
        vod_remarks: it.authername || ''
      });
    }
    return list;
  } catch (e) {
    return [];
  }
}

// 构建分类
function buildClass() {
  var c = [];
  for (var i = 0; i < CLASS_MAP.length; i++) {
    c.push({ type_id: CLASS_MAP[i][0], type_name: CLASS_MAP[i][1] });
  }
  return c;
}

// 初始化
function init(extend) {}

// 首页内容
function homeContent(filter) {
  return jp({ class: buildClass(), list: fetchList('9', '1') });
}

// 分类内容
function categoryContent(tid, pg, filter, extend) {
  return jp({ list: fetchList(tid, pg), page: String(pg) });
}

// 详情内容
function detailContent(ids) {
  try {
    var id = (typeof ids === 'string') ? ids : ids[0];
    var url = HOST + '/api/videoplay/' + id + '?&uuid=' + UUID;
    var html = req(url);
    if (!html) return jp({ list: [] });
    var j = JSON.parse(html);
    var path = (j && j.rescont && j.rescont.videopath) ? j.rescont.videopath : '';
    return jp({ list: [{
      vod_id: String(id),
      vod_name: '',
      vod_pic: '',
      vod_play_from: '线路1',
      vod_play_url: path
    }] });
  } catch (e) {
    return jp({ list: [] });
  }
}

// 搜索内容
function searchContent(key, quick, pg) {
  return jp({ list: [], page: '1' });
}

// 播放内容
function playerContent(flag, id, vipFlags) {
  return jp({ url: id, parse: 0 });
}
