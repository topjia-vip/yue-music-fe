import axios from 'axios'
import Qs from 'qs'
import { aesMinEncrypt } from '../common/js/aes'
import { BASE_URL, MUSIC_REQUEST, MUSIC_MUSIC } from './config'
import state from '../store/state'

export function disstCategoryGroup (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/disst/disstcategorygroup`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function dissList (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/disst/disstlist`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function disstDetailSongList (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/disst/disstsonglist`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function disstDetail (reqData) {
  const url = `${BASE_URL}/${MUSIC_REQUEST}/disst/disstDetail`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function saveDisst (reqData) {
  const url = `${BASE_URL}/${MUSIC_MUSIC}/music/disst/save?token=${state.token.token}`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function deleteDisst (disstId) {
  const url = `${BASE_URL}/${MUSIC_MUSIC}/music/disst/delete?token=${state.token.token}`
  const data = {
    reqData: aesMinEncrypt(disstId)
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}
