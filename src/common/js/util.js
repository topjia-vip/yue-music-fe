import { createSong } from './song'

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function getDateByYearAndWeek (year, week) {
  let nowYear = new Date(year, 0, 1)
  let day = nowYear.getDay()
  let i = 1
  let o = null
  let l = null
  if (year >= 2013) {
    i = 0
    o = new Date(nowYear.valueOf() + 864e5 * (7 * (week - i) + (3 - day)))
    l = new Date(o.valueOf() - 5184e5)
    if (((year > 2013) || (year === 2013)) && week > 15) {
      o = new Date(nowYear.valueOf() + 864e5 * (7 * (week - i) + (3 - day)))
      l = new Date(o.valueOf() - 5184e5)
    }
  }
  return {
    left: {
      date: l,
      month: l.getMonth() + 1,
      day: l.getDate()
    },
    right: {
      date: o,
      month: o.getMonth() + 1,
      day: o.getDate()
    }
  }
}

export function handleTime (duration) {
  let minute = Math.floor((duration / 60))
  let second = duration % 60
  let res = ''
  if (minute < 10) {
    res += `0${minute}:`
  } else {
    res += `${minute}:`
  }
  if (second < 10) {
    res += `0${second}`
  } else {
    res += `${second}`
  }
  return res
}

export function _normalizeSongs (list) {
  let ret = []
  list.forEach((song) => {
    ret.push(createSong(song))
  })
  return ret
}

export function handleSingerNames (singers) {
  let res = ''
  for (let i = 0; i < singers.length; i++) {
    if (i !== singers.length - 1) {
      res += `<span class="singer_name" title="${singers[i].singerName}" singerMid='${singers[i].singerMid}'>${singers[i].singerName}</span> / `
    } else {
      res += `<span class="singer_name" title="${singers[i].singerName}" singerMid='${singers[i].singerMid}'>${singers[i].singerName}</span>`
    }
  }
  return res
}

export function scrollToTop (className) {
  document.getElementsByClassName(className)[0].scrollTop = 0
}

export function scrollToIndex (className, index) {
  document.getElementsByClassName(className)[0].scrollTop = index
}

export function listHasSong (list, song) {
  if (list === null) {
    return false
  }
  let index = list.findIndex(item => item.id + '' === song.id + '')
  return index > -1
}

// 休眠线程
export function sleep (delay) {
  for (let t = Date.now(); Date.now() - t <= delay;) {}
}
