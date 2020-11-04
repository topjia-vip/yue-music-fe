// 返回state的playList
export const playList = state => state.playList

// 返回state的sequenceList
export const sequenceList = state => state.sequenceList

// 返回state的fullScreen
export const fullScreen = state => state.fullScreen

// 返回播放模式
export const mode = state => state.mode

// 返回state的currentPlaySongIndex
export const currentPlaySongIndex = state => state.currentPlaySongIndex

// 通过当前的播放列表和播放歌曲的索引获取当前播放的歌曲信息
export const currentPlaySong = state => {
  return state.playList[state.currentPlaySongIndex] || {}
}

// 返回state的playStatus
export const playStatus = state => state.playStatus

// 返回state的categoryGroupId
export const categoryGroupId = state => state.categoryGroupId

// 返回state的currentSinger
export const currentSong = state => state.currentSong

// 返回state的searchKey
export const searchKey = state => state.searchKey

// 返回state的showTopBox
export const showTopBox = state => state.showTopBox

// 返回state的loginUser
export const loginUser = state => state.loginUser

export const token = state => state.token

export const userFavoriteDissts = state => state.userFavoriteDissts

export const favoriteSongList = state => state.favoriteSongList

export const currentTop = state => state.currentTop

export const routerStackPointer = state => state.routerStackPointer

export const needLogin = state => state.needLogin

export const playHistory = state => state.playHistory

export const searchHistory = state => state.searchHistory
