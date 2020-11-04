import { BASE_URL, MUSIC_REQUEST } from './config'
import axios from 'axios'
import { aesMinEncrypt } from '../common/js/aes'

export function topListInfo (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/rank/toplistinfo`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function initTopDetail (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/rank/topdetail`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}
