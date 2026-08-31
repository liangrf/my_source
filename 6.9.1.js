// 6.9影视 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// Function names match FongMi Spider.java call() invocations

var API_URL = '';

function init(ext) {
  API_URL = ext || '';
}

function home(filter) {
  var classList = [
    { type_id: '9', type_name: '性感佳人' },
    { type_id: '10', type_name: '国产精品' },
    { type_id: '14', type_name: 'H动漫' },
    { type_id: '16', type_name: '欧美激情' },
    { type_id: '25', type_name: '三级电影' }
  ];
  var list = [
    { vod_id: '1', vod_name: '测试视频1', vod_pic: 'https://via.placeholder.com/200x300', vod_remarks: '测试' },
    { vod_id: '2', vod_name: '测试视频2', vod_pic: 'https://via.placeholder.com/200x300', vod_remarks: '测试' }
  ];
  return JSON.stringify({ class: classList, list: list });
}

function homeVod() {
  var list = [
    { vod_id: '1', vod_name: '首页推荐1', vod_pic: 'https://via.placeholder.com/200x300', vod_remarks: '推荐' }
  ];
  return JSON.stringify({ list: list });
}

function category(tid, pg, filter, extend) {
  var list = [
    { vod_id: '1', vod_name: '分类视频1', vod_pic: 'https://via.placeholder.com/200x300', vod_remarks: '测试' }
  ];
  return JSON.stringify({ list: list, page: String(pg) });
}

function detail(id) {
  return JSON.stringify({ list: [{
    vod_id: '1',
    vod_name: '测试视频',
    vod_pic: 'https://via.placeholder.com/200x300',
    vod_play_from: '线路1',
    vod_play_url: 'https://example.com/test.m3u8'
  }] });
}

function search(key, quick, pg) {
  return JSON.stringify({ list: [], page: '1' });
}

function play(flag, id, vipFlags) {
  return JSON.stringify({ url: id, parse: 0 });
}

function live(url) {
  return '';
}

function sniffer() {
  return false;
}

function isVideo(url) {
  return false;
}

function action(actionArg) {
  return '';
}

function destroy() {
}

var __JS_SPIDER__ = {
  init: init,
  home: home,
  homeVod: homeVod,
  category: category,
  detail: detail,
  search: search,
  play: play,
  live: live,
  sniffer: sniffer,
  isVideo: isVideo,
  action: action,
  destroy: destroy
};
