// 6.9影视 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// Uses CatVod __jsEvalReturn ES module format for FongMi compatibility
// spider.js imports this module and sets globalThis.__JS_SPIDER__

export function __jsEvalReturn() {
  var API_URL = '';

  return {
    init: function(ext) {
      API_URL = ext || '';
    },

    home: function(filter) {
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
    },

    homeVod: function() {
      var list = [
        { vod_id: '1', vod_name: '首页推荐1', vod_pic: 'https://via.placeholder.com/200x300', vod_remarks: '推荐' }
      ];
      return JSON.stringify({ list: list });
    },

    category: function(tid, pg, filter, extend) {
      var list = [
        { vod_id: '1', vod_name: '分类视频1', vod_pic: 'https://via.placeholder.com/200x300', vod_remarks: '测试' }
      ];
      return JSON.stringify({ list: list, page: String(pg) });
    },

    detail: function(id) {
      return JSON.stringify({ list: [{
        vod_id: '1',
        vod_name: '测试视频',
        vod_pic: 'https://via.placeholder.com/200x300',
        vod_play_from: '线路1',
        vod_play_url: 'https://example.com/test.m3u8'
      }] });
    },

    search: function(key, quick, pg) {
      return JSON.stringify({ list: [], page: '1' });
    },

    play: function(flag, id, vipFlags) {
      return JSON.stringify({ url: id, parse: 0 });
    },

    live: function(url) {
      return '';
    },

    sniffer: function() {
      return false;
    },

    isVideo: function(url) {
      return false;
    },

    action: function(actionArg) {
      return '';
    },

    destroy: function() {
    }
  };
}
