import axios from 'axios'
import { aesMinEncrypt } from '../common/js/aes'
import { BASE_URL, MUSIC_REQUEST } from './config'

export function getSingerList (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/singer/getSingerList`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerSongList (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/singer/songlist`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerAlbums (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/singer/albums`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerConcern (reqData, singerMid) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/singer/concern`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData)),
    singerMid
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getSingerInfo (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/singer/info`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}
