/* eslint-disable */

class YueMusicLocalStorage {
  /**
   * 保存元素
   * @param key
   * @param value
   */
  save (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  /**
   * 根据key查询保存的元素数组 为空返回空数组
   * @param key
   * @returns {[]}
   */
  get (key) {
    let arr = []
    let value = localStorage.getItem(key)
    if (value) {
      arr = JSON.parse(value)
    }
    return arr
  }

  /**
   * 删除指定key的元素
   * @param key
   */
  remove (key) {
    localStorage.removeItem(key)
  }
}

let yueMusicLocalStorage = new YueMusicLocalStorage()
export default yueMusicLocalStorage
