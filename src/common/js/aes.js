const CryptoJS = require('crypto-js')

let key = CryptoJS.enc.Utf8.parse('pEXiCeq1i4^L@Ihe')
let iv = CryptoJS.enc.Utf8.parse('FoLTbtM2UqJAEzo4')

/**
 * @param data 待加密数据
 * @returns {*}
 */
export function aesMinEncrypt (data) {
  let _word = CryptoJS.enc.Utf8.parse(data)
  let encrypted = CryptoJS.AES.encrypt(_word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
