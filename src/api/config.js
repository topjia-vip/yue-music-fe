export const ERR_OK = 0

export const connections = [
  // 'http://121.36.29.8:8088',
  'http://localhost:17890',
  'https://yuemusic.utools.club'
]

// 本地测试url
// export const BASE_URL = 'http://121.36.29.8:8088'
// export const BASE_URL = 'http://localhost:17890'
export let BASE_URL = 'http://localhost:17890'

export function setBaseUrl (url) {
  BASE_URL = url
}

// 微服务名
export const MUSIC_REQUEST = 'music-request'

export const MUSIC_USER = 'music-user'

export const MUSIC_MUSIC = 'music-music'
