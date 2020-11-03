/* eslint-disable */

/****************************通用******************************/
// 推荐通用的reqData
export function createReqData (sign, data) {
  return {
    url: 'http://u.y.qq.com/cgi-bin/musics.fcg',
    params: [
      {
        key: 'g_tk',
        value: '243291677'
      },
      {
        key: 'loginUin',
        value: '0'
      },
      {
        key: 'hostUin',
        value: '0'
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: '0'
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: '0'
      },
      {
        key: 'sign',
        value: sign
      },
      {
        key: 'data',
        value: JSON.stringify(data)
      }
    ]
  }
}

/****************************歌单******************************/
export function createDisstCategoryGroupData () {
  return {
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg',
    params: [
      {
        key: 'g_tk',
        value: '243291677'
      },
      {
        key: 'loginUin',
        value: '0'
      },
      {
        key: 'hostUin',
        value: '0'
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: '0'
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: '0'
      }
    ]
  }
}

export function createDisstListData (categoryId, sortId, sin, ein) {
  return {
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
    params: [
      {
        key: 'g_tk',
        value: '243291677'
      },
      {
        key: 'hostUin',
        value: '0'
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: '0'
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: 0
      },
      {
        key: 'rnd',
        value: Math.random()
      },
      {
        key: 'sin',
        value: sin
      },
      {
        key: 'ein',
        value: ein
      },
      {
        key: 'sortId',
        value: sortId
      },
      {
        key: 'categoryId',
        value: categoryId
      }
    ]
  }
}

export function createDisstDetailData (disstid) {
  return {
    url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    params: [
      {
        key: 'g_tk',
        value: '243291677'
      },
      {
        key: 'hostUin',
        value: '0'
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: '0'
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: 0
      },
      {
        key: 'loginUin',
        value: '0'
      },
      {
        key: 'type',
        value: '1'
      },
      {
        key: 'json',
        value: '1'
      },
      {
        key: 'utf8',
        value: '1'
      },
      {
        key: 'onlysong',
        value: '0'
      },
      {
        key: 'new_format',
        value: '1'
      },
      {
        key: 'disstid',
        value: disstid
      }
    ]
  }
}

/****************************歌手信息******************************/
export function createSingerInfoData (singermid) {
  return {
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_singer_desc.fcg',
    params: [
      {
        key: 'singermid',
        value: singermid
      },
      {
        key: 'r',
        value: new Date()
      },
      {
        key: 'utf8',
        value: 1
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'format',
        value: 'xml'
      }
    ]
  }
}

/****************************用户信息******************************/
export function createUserInfoData (userName) {
  return {
    url: 'http://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg',
    params: [
      {
        key: 'g_tk_new_20200303',
        value: '235955490'
      },
      {
        key: 'g_tk',
        value: '235955490'
      },
      {
        key: 'loginUin',
        value: '0'
      },
      {
        key: 'hostUin',
        value: '0'
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: '0'
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: '0'
      },
      {
        key: 'cid',
        value: '205360838'
      },
      {
        key: 'ct',
        value: '20'
      },
      {
        key: 'userid',
        value: userName
      },
      {
        key: 'reqfrom',
        value: '1'
      },
      {
        key: 'reqtype',
        value: '0'
      }
    ]
  }
}

export function createUserFavoriteDissts (userName) {
  return {
    url: 'http://c.y.qq.com/fav/fcgi-bin/fcg_get_profile_order_asset.fcg',
    params: [
      {
        key: 'g_tk_new_20200303',
        value: '139748594'
      },
      {
        key: 'g_tk',
        value: '454411234'
      },
      {
        key: 'loginUin',
        value: '0'
      },
      {
        key: 'hostUin',
        value: 0
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: 0
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: 0
      },
      {
        key: 'cid',
        value: 205360956
      },
      {
        key: 'ct',
        value: 20
      },
      {
        key: 'userid',
        value: userName
      },
      {
        key: 'reqtype',
        value: 3
      },
      {
        key: 'sin',
        value: 0
      },
      {
        key: 'ein',
        value: 10
      }
    ]
  }
}

export function createUserFavoriteSongList (userName, disstId) {
  return {
    url: 'http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
    params: [
      {
        key: 'type',
        value: 1
      },
      {
        key: 'json',
        value: 1
      },
      {
        key: 'utf8',
        value: 1
      },
      {
        key: 'onlysong',
        value: 1
      },
      {
        key: 'nosign',
        value: 1
      },
      {
        key: 'new_format',
        value: 1
      },
      {
        key: 'song_begin',
        value: 0
      },
      {
        key: 'song_num',
        value: 100
      },
      {
        key: 'ctx',
        value: 1
      },
      {
        key: 'disstid',
        value: disstId
      },
      {
        key: '_',
        value: 1590566500870
      },
      {
        key: 'g_tk_new_20200303',
        value: 139748594
      },
      {
        key: 'userid',
        value: userName
      },
      {
        key: 'g_tk',
        value: 454411234
      },
      {
        key: 'loginUin',
        value: userName
      },
      {
        key: 'hostUin',
        value: 0
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: 0
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: 0
      }
    ]
  }

}

/****************************搜索******************************/
export function createHotKeyData () {
  return {
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    params: [
      {
        key: 'g_tk_new_20200303',
        value: '5381'
      },
      {
        key: 'g_tk',
        value: '5381'
      },
      {
        key: 'loginUin',
        value: '0'
      },
      {
        key: 'hostUin',
        value: '0'
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: '0'
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: '0'
      }
    ]
  }
}

export function createSmartSearchData (key) {
  return {
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
    params: [
      {
        key: 'is_xml',
        value: 0
      },
      {
        key: 'key',
        value: key
      },
      {
        key: 'g_tk_new_20200303',
        value: '2109667352'
      },
      {
        key: 'g_tk',
        value: '2109667352'
      },
      {
        key: 'loginUin',
        value: '0'
      },
      {
        key: 'hostUin',
        value: '0'
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: '0'
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: '0'
      }
    ]
  }
}

export function createSearchSongData (key, num, page) {
  return {
    url: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
    params: [
      {
        key: 'ct',
        value: 24
      },
      {
        key: 'qqmusic_ver',
        value: 1298
      },
      {
        key: 'new_json',
        value: 1
      },
      {
        key: 'remoteplace',
        value: 'txt.yqq.center'
      },
      {
        key: 'searchid',
        value: 37929466145937599
      },
      {
        key: 't',
        value: 0
      },
      {
        key: 'aggr',
        value: 1
      },
      {
        key: 'catZhida',
        value: 1
      },
      {
        key: 'lossless',
        value: 0
      },
      {
        key: 'flag_qc',
        value: 0
      },
      {
        key: 'p',
        value: page
      },
      {
        key: 'n',
        value: num
      },
      {
        key: 'w',
        value: key
      },
      {
        key: 'g_tk_new_20200303',
        value: 2109667352
      },
      {
        key: 'g_tk',
        value: 2109667352
      },
      {
        key: 'loginUin',
        value: 0
      },
      {
        key: 'hostUin',
        value: 0
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: 0
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: 0
      }
    ]
  }
}

/****************************歌词******************************/
export function createSongLyricData (songMid) {
  return {
    url: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
    params: [
      {
        key: '-',
        value: 'MusicJsonCallback_lrc'
      },
      {
        key: 'pcachetime',
        value: 1592643518908
      },
      {
        key: 'songmid',
        value: songMid
      },
      {
        key: 'g_tk_new_20200303',
        value: 678806227
      },
      {
        key: 'g_tk',
        value: 678806227
      },
      {
        key: 'loginUin',
        value: 0
      },
      {
        key: 'hostUin',
        value: 0
      },
      {
        key: 'format',
        value: 'json'
      },
      {
        key: 'inCharset',
        value: 'utf8'
      },
      {
        key: 'outCharset',
        value: 'utf-8'
      },
      {
        key: 'notice',
        value: 0
      },
      {
        key: 'platform',
        value: 'yqq.json'
      },
      {
        key: 'needNewCode',
        value: 0
      }
    ]
  }
}
