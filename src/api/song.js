import { BASE_URL, MUSIC_MUSIC, MUSIC_REQUEST } from './config'
import axios from 'axios'
import { aesMinEncrypt } from '../common/js/aes'
import state from '../store/state'

export function getSongUrlByQQYY (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/song/getsongurlqqyy`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSongUrl (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/song/getsongurl`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function songLyric (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/song/songlyric`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function downloadSong (downloadUrl) {
  return axios({
    method: 'get',
    url: downloadUrl,
    responseType: 'blob'
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function saveSong (song) {
  const url = `${BASE_URL}/${MUSIC_MUSIC}/music/song/save?token=${state.token.token}`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(song))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function deleteSong (songId) {
  const url = `${BASE_URL}/${MUSIC_MUSIC}/music/song/delete?token=${state.token.token}`
  const data = {
    reqData: aesMinEncrypt(songId)
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}
