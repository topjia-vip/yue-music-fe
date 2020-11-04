import { BASE_URL, MUSIC_REQUEST } from './config'
import axios from 'axios'
import { aesMinEncrypt } from '../common/js/aes'

/**
 * 获取热搜榜
 */
export function getHotKey (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/search/getHotKey`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

/**
 * 迷你搜索
 * @param reqData 请求参数
 */
export function smartSearch (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/search/smartsearch`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchSong (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/search/song`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

// export function search (key, num, page, type) {
//   let url = ''
//   if (type === 'song') {
//     url = `${BASE_URL}/search/searchsong`
//   } else if (type === 'album') {
//     url = `${BASE_URL}/search/searchalbum`
//   } else if (type === 'playlist') {
//     url = `${BASE_URL}/search/searchsonglist`
//   } else {
//     url = `${BASE_URL}/search/searchlyric`
//   }
//   const data = {
//     key,
//     num,
//     page
//   }
//   return axios.post(url, Qs.stringify(data)).then(res => {
//     return Promise.resolve(res.data)
//   })
// }
