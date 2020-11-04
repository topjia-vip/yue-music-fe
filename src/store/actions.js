import * as types from './mutation-types'
import { PLAY_HISTORY, playMode, SEARCH_HISTORY, SEARCH_HISTORY_MAX_LENGTH } from '../common/js/config'
import { shuffle } from '../common/js/util'
import yueMusicLocalStorage from '../common/js/localStorage'

function findIndex (list, song) {
  return list.findIndex((item) => item.id === song.id)
}

export const selectPlay = function ({ commit, state }, { list, index }) {
  // 先清空列表
  commit(types.SET_CURRENT_PLAY_SONG_INDEX, -1)
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  setTimeout(() => {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
      let randomList = shuffle(list)
      commit(types.SET_PLAY_LIST, randomList)
      index = findIndex(randomList, list[index])
      commit(types.SET_CURRENT_PLAY_SONG_INDEX, index)
    } else {
      commit(types.SET_PLAY_LIST, list)
    }
    commit(types.SET_CURRENT_PLAY_SONG_INDEX, index)
  }, 10)
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_PLAY_SONG_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATUS, true)
}

export const insertSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentPlaySongIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playList, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playList.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_PLAY_SONG_INDEX, currentIndex)
}
export const addToNext = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentPlaySongIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playList, song)
  // 因为是插入到播放歌曲的下一首，所以索引+1
  let index = currentIndex + 1
  // 插入这首歌到当前索引位置
  playList.splice(index, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_PLAY_SONG_INDEX, currentIndex)
}

export const deleteSong = function ({ commit, state }, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentPlaySongIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_PLAY_SONG_INDEX, currentIndex)

  if (!playList.length) {
    commit(types.SET_PLAYING_STATUS, false)
  }
}

export const deleteSongList = function ({ commit }) {
  commit(types.SET_CURRENT_PLAY_SONG_INDEX, -1)
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATUS, false)
}

// 播放历史记录
export const addPlayHistorySong = function ({ commit }, song) {
  let playHistoryArr = getPlayHistorySong()
  let index = playHistoryArr.findIndex((item) => item.id + '' === song.id + '')

  if (playHistoryArr.length !== 0 && index !== -1) {
    // 原来数组已经存在该歌曲
    // 1. 删除该歌曲原来的位置
    playHistoryArr.splice(index, 1)
  }
  // 2. 将该歌曲添加到第一个位置
  playHistoryArr.unshift(song)
  // 重新保存LocalStorage
  yueMusicLocalStorage.save(PLAY_HISTORY, playHistoryArr)
  commit(types.SET_PLAY_HISTORY, getPlayHistorySong())
}

export const cleanAllPlayHistorySong = function ({ commit }) {
  yueMusicLocalStorage.remove(PLAY_HISTORY)
  commit(types.SET_PLAY_HISTORY, getPlayHistorySong())
}

export const getPlayHistorySong = function () {
  return yueMusicLocalStorage.get(PLAY_HISTORY)
}

export const readPlayHistory = function ({ commit }) {
  commit(types.SET_PLAY_HISTORY, getPlayHistorySong())
}

// 搜索历史记录
export const addSearchHistory = function ({ commit }, searchKey) {
  let searchHistoryArray = getSearchHistory()
  let index = searchHistoryArray.findIndex((item) => item === searchKey)

  if (searchHistoryArray.length !== 0 && index !== -1) {
    searchHistoryArray.splice(index, 1)
  }
  searchHistoryArray.unshift(searchKey)

  if (searchHistoryArray.length >= SEARCH_HISTORY_MAX_LENGTH) {
    // 最多保存10个搜索记录，大于10个删除最老的搜索记录
    searchHistoryArray.splice(SEARCH_HISTORY_MAX_LENGTH, searchHistoryArray.length - SEARCH_HISTORY_MAX_LENGTH)
  }
  // 重新保存LocalStorage
  yueMusicLocalStorage.save(SEARCH_HISTORY, searchHistoryArray)
  commit(types.SET_SEARCH_HISTORY, getSearchHistory())
}

export const deleteSearchHistoryByKey = function ({ commit }, key) {
  let searchHistoryArray = getSearchHistory()
  let index = searchHistoryArray.findIndex((item) => item === key)
  if (index !== -1) {
    searchHistoryArray.splice(index, 1)
  }
  // 重新保存LocalStorage
  yueMusicLocalStorage.save(SEARCH_HISTORY, searchHistoryArray)
  commit(types.SET_SEARCH_HISTORY, getSearchHistory())
}

export const deleteSearchHistory = function ({ commit }) {
  yueMusicLocalStorage.remove(SEARCH_HISTORY)
  commit(types.SET_SEARCH_HISTORY, getSearchHistory())
}

export const getSearchHistory = function () {
  return yueMusicLocalStorage.get(SEARCH_HISTORY)
}

export const readSearchHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, getSearchHistory())
}
