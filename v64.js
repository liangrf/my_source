// 6.4 - TVBox 蜂蜜版 (FongMi) type:3 JS Spider
// API: https://www.85xo.com
// 内置 HTTP 函数: req(url, options) -> { content, headers, ... }

var HOST = 'https://www.85xo.com';
var UA = 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0 Mobile Safari/537.36';

// ========== 分类列表 ==========
var CATEGORIES = [
  { type_id: 'ya-zhou-ren', type_name: '亚洲人' },
  { type_id: 'ma-lai', type_name: '马来' },
  { type_id: 'ri-ben', type_name: '日本' },
  { type_id: 'hou-ru', type_name: '后入' },
  { type_id: 'da-nai', type_name: '大奶' },
  { type_id: 'gao-chao', type_name: '高潮' },
  { type_id: 'zuo-ai', type_name: '做爱' },
  { type_id: 'ma-lai-zi-ya', type_name: '马来西亚' },
  { type_id: 'mei-mei', type_name: '妹妹' },
  { type_id: 'tu-ya', type_name: '兔牙' },
  { type_id: 'mei', type_name: '妹' },
  { type_id: 'ju-ru', type_name: '巨乳' },
  { type_id: 'zi-wei', type_name: '自慰' },
  { type_id: 'qing-lv', type_name: '情侣' },
  { type_id: 'sao', type_name: '骚' },
  { type_id: 'nan-you', type_name: '男友' },
  { type_id: 'yin-jiao', type_name: '淫叫' },
  { type_id: 'zhua-nai', type_name: '抓奶' },
  { type_id: 'xin-jia-po', type_name: '新加坡' },
  { type_id: 'nei-yi', type_name: '内衣' },
  { type_id: 'rou-bang', type_name: '肉棒' },
  { type_id: 'chuang-shang', type_name: '床上' },
  { type_id: 'nei-bi', type_name: '嫩逼' },
  { type_id: 'ri-ben-ren', type_name: '日本人' },
  { type_id: 'bao-yu', type_name: '鲍鱼' },
  { type_id: 'kou', type_name: '口' },
  { type_id: 'shao-nv', type_name: '少女' },
  { type_id: 'mei-nv', type_name: '美女' },
  { type_id: 'tai-wan', type_name: '台灣' },
  { type_id: 'ke-ai', type_name: '可爱' },
  { type_id: 'tou-pai', type_name: '偷拍' },
  { type_id: 'bai-bi', type_name: '掰逼' },
  { type_id: 'pen-shui', type_name: '喷水' },
  { type_id: 'tuo-yi', type_name: '脱衣' },
  { type_id: 'pi-yan', type_name: '屁眼' },
  { type_id: 'kou-jiao', type_name: '口交' },
  { type_id: 'gao-zhong', type_name: '高中' },
  { type_id: 'mei-zi', type_name: '妹子' },
  { type_id: 'zhong-guo', type_name: '中國' },
  { type_id: 'mu-gao', type_name: '母狗' },
  { type_id: 'quan-luo', type_name: '全裸' },
  { type_id: 'mei-tun', type_name: '美臀' },
  { type_id: 'pin-ru', type_name: '贫乳' },
  { type_id: 'bi', type_name: '逼' },
  { type_id: 'nei-ku', type_name: '内裤' },
  { type_id: 'ai', type_name: '爱' },
  { type_id: 'zi-pai', type_name: '自拍' },
  { type_id: 'xue-sheng', type_name: '学生' },
  { type_id: 'shen-yin', type_name: '呻吟' },
  { type_id: 'han-guo', type_name: '韓國' },
  { type_id: 'tai-guo', type_name: '泰國' },
  { type_id: 'yue-nan', type_name: '越南' },
  { type_id: 'jin-pai', type_name: '近拍' },
  { type_id: 'xiang-gang', type_name: '香港' },
  { type_id: 'xin-ma', type_name: '新馬' },
  { type_id: 'jie-pai', type_name: '街拍' }
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
    var url = HOST + '/tags/' + tid + '/';
    if (pg > 1) {
      url = HOST + '/tags/' + tid + '/page/' + pg + '/';
    }
    var html = await request(url);
    if (!html) return [];
    
    var list = [];
    // 提取视频列表
    var itemRegex = /<div[^>]*class="item"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>[\s\S]*?<\/div>/g;
    var match;
    while ((match = itemRegex.exec(html)) !== null) {
      var itemHtml = match[0];
      var link = match[1];
      
      // 提取标题
      var titleMatch = itemHtml.match(/<img[^>]*alt="([^"]*)"[^>]*>/);
      var title = titleMatch ? titleMatch[1].trim() : '';
      
      // 提取图片
      var imgMatch = itemHtml.match(/<img[^>]*src="([^"]*)"[^>]*>/);
      var img = imgMatch ? imgMatch[1] : '';
      
      if (title && link) {
        list.push({
          vod_id: link.startsWith('http') ? link : HOST + link,
          vod_name: title,
          vod_pic: img,
          vod_remarks: ''
        });
      }
    }
    
    return list;
  } catch (e) {
    return [];
  }
}

async function fetchDetail(id) {
  try {
    var url = id.startsWith('http') ? id : HOST + id;
    var html = await request(url);
    if (!html) return null;
    
    // 提取标题
    var titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    var title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    
    // 提取视频链接
    var videoRegex = /src="([^"]*(?:m3u8|mp4)[^"]*)"/g;
    var videoUrls = [];
    var videoMatch;
    while ((videoMatch = videoRegex.exec(html)) !== null) {
      videoUrls.push(videoMatch[1]);
    }
    
    if (videoUrls.length === 0) return null;
    
    return {
      id: id,
      title: title,
      videopath: videoUrls[0]
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
      var list = await fetchList('ya-zhou-ren', 1);
      return JSON.stringify({ class: CATEGORIES, list: list });
    },

    homeVod: async function() {
      var list = await fetchList('ya-zhou-ren', 1);
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
          vod_name: data.title || '6.4',
          vod_pic: '',
          vod_content: '',
          vod_remarks: '',
          vod_year: '',
          vod_area: '',
          vod_class: '',
          type_name: '',
          vod_play_from: '6.4',
          vod_play_url: '正片$' + data.videopath
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
