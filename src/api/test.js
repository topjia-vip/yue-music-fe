let Qs = require('qs')
let axios = require('axios')

const CryptoJS = require('crypto-js')

let key = CryptoJS.enc.Utf8.parse('pEXiCeq1i4^L@Ihe')
let iv = CryptoJS.enc.Utf8.parse('FoLTbtM2UqJAEzo4')

/**
 * @param data 待加密数据
 * @returns {*}
 */
function aesMinEncrypt (data) {
  let _word = CryptoJS.enc.Utf8.parse(data)
  let encrypted = CryptoJS.AES.encrypt(_word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

let user = {
  'id': 1,
  'userNick': 'demoData',
  'userHeaderUrl': 'demoData',
  'userAccount': 'demoData',
  'userPassword': 'aaasada1',
  'userTelephoneNum': '15202355862'
}

function userRegister (user) {
  const url = 'http://localhost:17890/music-user/user/register'
  const data = {
    reqData: aesMinEncrypt(JSON.stringify(user))
  }
  return axios.post(url, Qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

function oss (user) {
  const url = 'http://localhost:17890/music-user//aliyun/oss/policy'
  return axios.get(url).then(res => {
    return Promise.resolve(res.data)
  })
}

// userRegister(user).then(res => {
//   console.log(res)
// })

oss().then(res => {
  console.log(res)
})
