import * as types from './mutation-types'

const mutations = {
  [types.SET_PLAY_LIST] (state, songList) {
    state.playList = songList
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_CURRENT_PLAY_SONG] (state, data) {
    state.playList[state.currentPlaySongIndex].playUrl = data
  },
  [types.SET_CURRENT_PLAY_SONG_INDEX] (state, index) {
    state.currentPlaySongIndex = index
  },
  [types.SET_PLAYING_STATUS] (state, flag) {
    state.playStatus = flag
  },
  [types.SET_CATEGORY_GROUP_ID] (state, id) {
    state.categoryGroupId = id
  },
  [types.SET_CURRENT_SONG] (state, song) {
    state.currentSong = song
  },
  [types.SET_SEARCH_KEY] (state, searchKey) {
    state.searchKey = searchKey
  },
  [types.SET_SHOW_TOP_BOX] (state, showTopBox) {
    state.showTopBox = showTopBox
  },
  [types.SET_LOGIN_USER] (state, loginUser) {
    state.loginUser = loginUser
  },
  [types.SET_USER_TOKEN] (state, token) {
    state.token = token
  },
  [types.SET_LOGIN_USER_FAVORITE_DISSTS] (state, dissts) {
    state.userFavoriteDissts = dissts
  },
  [types.SET_LOGIN_USER_FAVORITE_SONG_LIST] (state, favoriteSongList) {
    state.favoriteSongList = favoriteSongList
  },
  [types.SET_CURRENT_TOP] (state, currentTop) {
    state.currentTop = currentTop
  },
  [types.SET_ROUTER_STACK_POINTER] (state, pointer) {
    state.routerStackPointer = pointer
  },
  [types.SET_NEED_LOGIN] (state, needLogin) {
    state.needLogin = needLogin
  }
}
export default mutations
