import axios from 'axios'
import { aesMinEncrypt } from '../common/js/aes'
import { BASE_URL, MUSIC_REQUEST } from './config'

export function getRecommendVideo (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/video/getrecommendmv`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMvRankInfo (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/video/getmvrankinfo`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMvRankData (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/video/getmvrankdata`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getVideoTags (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/video/getvideostags`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getVideos (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/video/getvideos`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getVideoPlayUrl (reqData, vid) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/video/video_play_url?vid=${vid}`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getVideoInfoAndOtherVideo (reqData, vid) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/video/video_info_other?vid=${vid}`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}
