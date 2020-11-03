import { playMode } from '../common/js/config'
import routerStack from '../RouterStack'

const state = {
  // 是否显示回到顶部
  showTopBox: false,
  // 当前选择的歌曲详情的歌曲
  currentSong: null,
  // 搜索关键字
  searchKey: '',
  // 歌单分类id
  categoryGroupId: 10000000,
  // 播放的歌曲列表
  playList: [],
  // 顺序播放列表
  sequenceList: [],
  // 当前播放的歌曲在列表的索引
  currentPlaySongIndex: -1,
  // 播放器是否是全屏的播放器，false显示mini版播放器
  fullScreen: false,
  // 当前的播放状态
  playStatus: false,
  // 当前的播放模式
  mode: playMode.sequence,
  // 登录的用户
  loginUser: null,
  // userToken
  token: null,
  // 用户收藏的歌单
  userFavoriteDissts: null,
  // 用户收藏的歌曲
  favoriteSongList: null,
  // 当前选择的排行榜
  currentTop: null,
  // 记录路由栈的指针
  routerStackPointer: routerStack.routerStack.pointer,
  // 是否需要登录
  needLogin: false
}

export default state
