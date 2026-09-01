// 6.9影视 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// 使用 __jsEvalReturn ES模块格式
// 硬编码测试数据 - 验证格式正确性

export function __jsEvalReturn() {
  return {
    init: function(ext) {},

    home: function(filter) {
      var classList = [
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
      var list = [
        { vod_id: '236030', vod_name: '【测试】FNS-151 新人可爱到让人窒息', vod_pic: 'http://image.wfcuemliy.com/storage/liulian/videocover/2026/05/02/177769456167562.jpeg', vod_remarks: '素人' },
        { vod_id: '236029', vod_name: '【测试】MIFD-699 新人极品脸蛋', vod_pic: 'http://image.wfcuemliy.com/storage/liulian/videocover/2026/05/02/177769456021236.jpeg', vod_remarks: '素人' },
        { vod_id: '236026', vod_name: '【测试】MIDA-439 传奇AV女优', vod_pic: 'http://image.wfcuemliy.com/storage/liulian/videocover/2026/05/02/177769455851374.jpeg', vod_remarks: '素人' }
      ];
      return JSON.stringify({ class: classList, list: list });
    },

    homeVod: function() {
      var list = [
        { vod_id: '236030', vod_name: '【推荐】FNS-151', vod_pic: 'http://image.wfcuemliy.com/storage/liulian/videocover/2026/05/02/177769456167562.jpeg', vod_remarks: '推荐' }
      ];
      return JSON.stringify({ list: list });
    },

    category: function(tid, pg, filter, extend) {
      var list = [
        { vod_id: '236030', vod_name: '【分类测试】FNS-151', vod_pic: 'http://image.wfcuemliy.com/storage/liulian/videocover/2026/05/02/177769456167562.jpeg', vod_remarks: '测试' },
        { vod_id: '236029', vod_name: '【分类测试】MIFD-699', vod_pic: 'http://image.wfcuemliy.com/storage/liulian/videocover/2026/05/02/177769456021236.jpeg', vod_remarks: '测试' }
      ];
      return JSON.stringify({ list: list, page: String(pg || 1) });
    },

    detail: function(ids) {
      return JSON.stringify({ list: [{
        vod_id: '236030',
        vod_name: '【测试】FNS-151 新人',
        vod_pic: 'http://image.wfcuemliy.com/storage/liulian/videocover/2026/05/02/177769456167562.jpeg',
        vod_content: '测试详情',
        vod_remarks: '02:47:52',
        vod_play_from: '6.9影视',
        vod_play_url: '播放$https://hsm3.hwzcfz.com/a3/20260430/s3hA9neM/index.m3u8'
      }] });
    },

    search: function(key, quick, pg) {
      return JSON.stringify({ list: [], page: '1' });
    },

    play: function(flag, id, vipFlags) {
      var url = id;
      if (url && url.indexOf('$') > -1) url = url.split('$')[1];
      return JSON.stringify({ url: url, parse: 0 });
    },

    live: function(url) { return ''; },
    sniffer: function() { return false; },
    isVideo: function(url) { return false; },
    action: function(actionArg) { return ''; },
    destroy: function() {}
  };
}
