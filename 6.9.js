// 6.9影视 - TVBox 蜂蜜版 调试版 (先用静态数据验证JS执行)
function jp(o) {
  if (typeof jsonParse === 'function') return jsonParse(o);
  return JSON.stringify(o);
}

function init(extend) {}

function homeContent(filter) {
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
  return jp({ class: classList, list: list });
}

function categoryContent(tid, pg, filter, extend) {
  var list = [
    { vod_id: '1', vod_name: '分类视频1', vod_pic: 'https://via.placeholder.com/200x300', vod_remarks: '测试' }
  ];
  return jp({ list: list, page: String(pg) });
}

function detailContent(ids) {
  return jp({ list: [{
    vod_id: '1',
    vod_name: '测试视频',
    vod_pic: 'https://via.placeholder.com/200x300',
    vod_play_from: '线路1',
    vod_play_url: 'https://example.com/test.m3u8'
  }] });
}

function searchContent(key, quick, pg) {
  return jp({ list: [], page: '1' });
}

function playerContent(flag, id, vipFlags) {
  return jp({ url: id, parse: 0 });
}
