// 6.9影视 - TVBox 蜂蜜版 (FongMi 5.6.3) type:3 JS Spider
// 独立实现 - 不使用 legado2tvbox 转换工具
// API: http://lu3fcm.aksdsrle.com
// 来源: Legado 订阅源 rssSource_6.9.json

export function __jsEvalReturn() {
  var HOST = 'http://lu3fcm.aksdsrle.com';
  var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

  // ========== 分类列表 (来自 Legado sortUrl) ==========
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

  // ========== 工具函数 ==========

  /**
   * HTTP GET 请求
   * @param {string} url - 请求地址
   * @returns {string} 响应体
   */
  function req(url) {
    try {
      return request(url, { headers: { 'User-Agent': UA } });
    } catch (e) {
      try {
        return request(url);
      } catch (e2) {
        return '';
      }
    }
  }

  /**
   * 安全 JSON 解析
   * @param {string} str - JSON 字符串
   * @returns {object|null} 解析后的对象
   */
  function safeParse(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  }

  /**
   * 获取视频列表
   * @param {string} tid - 分类 ID
   * @param {number} pg - 页码
   * @returns {Array} 视频列表
   */
  function fetchList(tid, pg) {
    try {
      var url = HOST + '/api/videosort/' + tid + '?orderby=&page=' + pg + '&uuid=1&device=0';
      var html = req(url);
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

  // ========== FongMi Spider 接口 ==========

  /**
   * 初始化 - 接收 ext 参数
   * @param {string} ext - 站点配置的 ext 字段 (可选, 用于覆盖 HOST)
   */
  function init(ext) {
    if (ext && typeof ext === 'string' && ext.indexOf('http') === 0) {
      HOST = ext.replace(/\/+$/, '');
    }
  }

  /**
   * 首页 - 返回分类列表和首页视频
   * @param {string} filter - 当前筛选条件 (本源未使用)
   * @returns {string} JSON: { class: [...], list: [...] }
   */
  function home(filter) {
    try {
      var list = fetchList(CATEGORIES[0].type_id, 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    } catch (e) {
      return JSON.stringify({ class: CATEGORIES, list: [] });
    }
  }

  /**
   * 首页推荐 - 返回推荐视频
   * @returns {string} JSON: { list: [...] }
   */
  function homeVod() {
    try {
      var list = fetchList(CATEGORIES[0].type_id, 1);
      return JSON.stringify({ list: list.slice(0, 10) });
    } catch (e) {
      return JSON.stringify({ list: [] });
    }
  }

  /**
   * 分类视频列表
   * @param {string} tid - 分类 ID
   * @param {number} pg - 页码
   * @param {string} filter - 筛选条件
   * @param {object} extend - 扩展参数
   * @returns {string} JSON: { list: [...], page: "N" }
   */
  function category(tid, pg, filter, extend) {
    try {
      var page = pg || 1;
      var list = fetchList(tid, page);
      return JSON.stringify({ list: list, page: String(page) });
    } catch (e) {
      return JSON.stringify({ list: [], page: String(pg || 1) });
    }
  }

  /**
   * 视频详情 - 获取播放地址
   * @param {string|Array} ids - 视频 ID (字符串或数组)
   * @returns {string} JSON: { list: [{ vod_play_from, vod_play_url, ... }] }
   */
  function detail(ids) {
    try {
      var id = (typeof ids === 'string') ? ids : (Array.isArray(ids) ? ids[0] : '');
      if (!id) return JSON.stringify({ list: [] });

      var url = HOST + '/api/videoplay/' + id + '?&uuid=1';
      var html = req(url);
      if (!html) return JSON.stringify({ list: [] });

      var j = safeParse(html);
      if (!j || j.code !== 200 || !j.rescont) return JSON.stringify({ list: [] });

      var data = j.rescont;
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
    } catch (e) {
      return JSON.stringify({ list: [] });
    }
  }

  /**
   * 搜索 - API 不支持搜索功能
   * @param {string} key - 搜索关键词
   * @param {boolean} quick - 快速搜索
   * @param {number} pg - 页码
   * @returns {string} JSON: { list: [], page: "1" }
   */
  function search(key, quick, pg) {
    return JSON.stringify({ list: [], page: '1' });
  }

  /**
   * 播放 - 返回播放地址
   * @param {string} flag - 线路标识
   * @param {string} id - 播放 URL (可能包含 $ 分隔符)
   * @param {Array} vipFlags - VIP 标识
   * @returns {string} JSON: { url: "...", parse: 0 }
   */
  function play(flag, id, vipFlags) {
    try {
      var url = id;
      if (url && url.indexOf('$') > -1) {
        url = url.split('$')[1];
      }
      return JSON.stringify({ url: url, parse: 0 });
    } catch (e) {
      return JSON.stringify({ url: id, parse: 0 });
    }
  }

  /**
   * 直播 - 本源不支持
   */
  function live(url) {
    return '';
  }

  /**
   * 嗅探 - 本源不使用
   */
  function sniffer() {
    return false;
  }

  /**
   * 判断是否为视频 - 本源不使用
   */
  function isVideo(url) {
    return false;
  }

  /**
   * 自定义动作 - 本源不使用
   */
  function action(actionArg) {
    return '';
  }

  /**
   * 销毁 - 清理资源
   */
  function destroy() {
  }

  // ========== 返回 Spider 对象 ==========
  return {
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
}
