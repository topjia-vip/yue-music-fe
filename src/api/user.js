import { BASE_URL, MUSIC_USER } from './config'
import { aesMinEncrypt } from '../common/js/aes'
import axios from 'axios'
import state from '../store/state'

/**
 * 用户登录api
 * @param reqData 请求加密参数
 * @returns {Promise<T>}
 */
export function login (reqData) {
  const url = `${BASE_URL}/${MUSIC_USER}/user/login`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

/**
 * 用户头像上传
 * @param file 上传的文件流
 */
export function upload (file) {
  const url = `${BASE_URL}/${MUSIC_USER}/user/upload?token=${state.token.token}`
  let config = {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
  return axios.post(url, file, config).then(res => {
    return Promise.resolve(res.data)
  })
}

/**
 * 用户修改信息
 * @param reqData 请求加密参数
 * @returns {Promise<T>}
 */
export function updateUser (reqData) {
  const url = `${BASE_URL}/${MUSIC_USER}/user/update?token=${state.token.token}`
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(reqData))
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

/**
 * 检查输入用户名是否存在
 * @param reqData 请求加密参数
 * @returns {Promise<T>}
 */
export function checkNickName (reqData) {
  const url = `${BASE_URL}/${MUSIC_USER}/user/check_name?token=${state.token.token}`
  const data = {
    reqData: aesMinEncrypt(reqData)
  }
  return axios.post(url, data).then(res => {
    return Promise.resolve(res.data)
  })
}

/**
 * 检测登录用户是否过期
 */
export function checkLoginUserToken () {
  if (state.token === null) {
    return
  }
  const url = `${BASE_URL}/${MUSIC_USER}/user/checkUser?token=${state.token.token}`
  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}
