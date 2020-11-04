import { BASE_URL, MUSIC_REQUEST } from './config'
import axios from 'axios'
import { aesMinEncrypt } from '../common/js/aes'

export function getFocus (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/recommend/getfocus`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getRecommendPlayListAndNewMusic (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/recommend/getplaylistandmusic`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getNewSong (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/recommend/getnewsong`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then((res) => {
    return Promise.resolve(res.data)
  })
}
