/* eslint-disable */

/****************************歌手******************************/
// 获取歌手粉丝量
export function getSingerConcernData (singerMid) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'concernStatus': {
      'module': 'Concern.ConcernSystemServer',
      'method': 'cgi_qry_concern_status',
      'param': {
        'vec_userinfo': [{ 'usertype': 1, 'userid': singerMid }],
        'opertype': 5,
        'encrypt_singerid': 1
      }
    },
    'concernNum': {
      'module': 'Concern.ConcernSystemServer',
      'method': 'cgi_qry_concern_num',
      'param': {
        'vec_userinfo': [{ 'usertype': 1, 'userid': singerMid }],
        'opertype': 6
      }
    }
  }
}

// 获取歌手歌曲列表
export function getSingerSongListData (singerMid, begin, sortId, num) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'singerSongList': {
      'method': 'GetSingerSongList',
      'param': {
        'order': sortId,
        'singerMid': singerMid,
        'begin': begin,
        'num': num
      },
      'module': 'musichall.song_list_server'
    }
  }
}

// 获取歌手专辑列表
export function getSingerAlbumsData (singerMid, begin, sortId, num) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'getAlbumList': {
      'method': 'GetAlbumList',
      'param': {
        'singerMid': singerMid,
        'order': sortId,
        'begin': begin,
        'num': num,
        'songNumTag': 0,
        'singerID': 0
      },
      'module': 'music.musichallAlbum.AlbumListServer'
    }
  }
}

// 获取歌手列表
export function getSingerListData (area, genre, index, sex, sin, cur_page) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'singerList': {
      'module': 'Music.SingerListServer',
      'method': 'get_singer_list',
      'param': {
        'area': area,
        'sex': sex,
        'genre': genre,
        'index': index,
        'sin': sin,
        'cur_page': cur_page
      }
    }
  }
}

/****************************推荐******************************/
// 获取焦点图
export function getFocusData () {
  return {
    'comm': { 'ct': 24 },
    'focus': {
      'module': 'music.musicHall.MusicHallPlatform',
      'method': 'GetFocus',
      'param': {}
    }
  }
}

// 获取最新歌曲和推荐歌单
export function getPlayListAndNewMusicData () {
  return {
    'comm': { 'ct': 24 },
    'recomPlaylist': {
      'method': 'get_hot_recommend',
      'param': { 'async': 1, 'cmd': 2 },
      'module': 'playlist.HotRecommendServer'
    },
    'new_song': {
      'module': 'newsong.NewSongServer',
      'method': 'get_new_song_info',
      'param': { 'type': 5 }
    }
  }
}

// 获取最新歌曲
export function getNewSongData (type) {
  return {
    'comm': { 'ct': 24 },
    'new_song': {
      'module': 'newsong.NewSongServer',
      'method': 'get_new_song_info',
      'param': { 'type': type }
    }
  }
}

/****************************排行榜******************************/
export function getRankInfoData () {
  return {
    'comm': { 'ct': 24 },
    'toplist': {
      'module': 'musicToplist.ToplistInfoServer',
      'method': 'GetAll',
      'param': {}
    }
  }
}

/****************************歌曲******************************/
export function getSongPlayUrlData (songmid) {
  return {
    'req': {
      'module': 'CDN.SrfCdnDispatchServer',
      'method': 'GetCdnDispatch',
      'param': { 'guid': '9220829888', 'calltype': 0, 'userip': '' }
    },
    'req_0': {
      'module': 'vkey.GetVkeyServer',
      'method': 'CgiGetVkey',
      'param': {
        'guid': '9220829888',
        'songmid': [songmid],
        'songtype': [0],
        'uin': '1256957450',
        'loginflag': 1,
        'platform': '20',
        'ctx': 1
      }
    },
    'comm': { 'uin': 1256957450, 'format': 'json', 'ct': 24, 'cv': 0 }
  }
}

export function getSongDetailData (songmid, songid) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'songinfo': {
      'method': 'get_song_detail_yqq',
      'param': { 'song_type': 0, 'song_mid': songmid, 'song_id': songid },
      'module': 'music.pf_song_detail_svr'
    }
  }
}

/****************************用户信息******************************/
export function getUserData (userName) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'base': {
      'module': 'userInfo.BaseUserInfoServer',
      'method': 'get_user_baseinfo_v2',
      'param': { 'vec_uin': [userName] }
    }
  }
}

export function getUserFavoriteDissts (userName) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'base': {
      'module': 'userInfo.BaseUserInfoServer',
      'method': 'get_user_baseinfo_v2',
      'param': { 'vec_uin': [userName] }
    }
  }
}

/****************************排行榜******************************/
export function getTopListData (topId, period) {
  return {
    'detail': {
      'module': 'musicToplist.ToplistInfoServer',
      'method': 'GetDetail',
      'param': { 'topId': topId, 'offset': 0, 'num': 500, 'period': period }
    }, 'comm': { 'ct': 24, 'cv': 0 }
  }
}

/****************************MV******************************/
export function getMVRankListData (areaType) {
  return {
    'comm': { 'ct': 24, 'cv': 0 },
    'request': {
      'method': 'get_video_rank_list',
      'param': {
        'rank_type': 0,
        'area_type': areaType,
        'required': ['vid', 'name', 'singers', 'cover_pic', 'pubdate']
      },
      'module': 'video.VideoRankServer'
    }
  }
}

export function getVideosTags () {
  return {
    'comm': { 'ct': 24 },
    'mv_tag': { 'module': 'MvService.MvInfoProServer', 'method': 'GetAllocTag', 'param': {} }
  }
}

export function getVideosData (start, size, areaId, versionId, order) {
  return {
    'comm': { 'ct': 24 },
    'mv_list': {
      'module': 'MvService.MvInfoProServer',
      'method': 'GetAllocMvInfo',
      'param': { 'start': start, 'size': size, 'version_id': versionId, 'area_id': areaId, 'order': order }
    }
  }
}

export function getVideoPlayUrlData (vid) {
  return {
    'getMvUrl': {
      'module': 'gosrf.Stream.MvUrlProxy',
      'method': 'GetMvUrls',
      'param': {
        'vids': [
          vid
        ],
        'request_typet': 10001,
        'addrtype': 3
      }
    },
    'comm': {
      'ct': 24,
      'cv': 4747474,
      'g_tk': 34936803,
      'uin': 1256957450,
      'format': 'json',
      'platform': 'yqq'
    }
  }
}

export function getVideoInfoAndOtherVideoData (vid) {
  return {
    'comm': {
      'ct': 24,
      'cv': 4747474
    },
    'mvinfo': {
      'module': 'video.VideoDataServer',
      'method': 'get_video_info_batch',
      'param': {
        'vidlist': [
          vid
        ],
        'required': [
          'vid',
          'type',
          'sid',
          'cover_pic',
          'duration',
          'singers',
          'video_switch',
          'msg',
          'name',
          'desc',
          'playcnt',
          'pubdate',
          'isfav',
          'gmid'
        ]
      }
    },
    'other': {
      'module': 'video.VideoLogicServer',
      'method': 'rec_video_byvid',
      'param': {
        'vid': vid,
        'required': [
          'vid',
          'type',
          'sid',
          'cover_pic',
          'duration',
          'singers',
          'video_switch',
          'msg',
          'name',
          'desc',
          'playcnt',
          'pubdate',
          'isfav',
          'gmid',
          'uploader_headurl',
          'uploader_nick',
          'uploader_encuin',
          'uploader_uin',
          'uploader_hasfollow',
          'uploader_follower_num'
        ],
        'support': 1
      }
    }
  }
}
