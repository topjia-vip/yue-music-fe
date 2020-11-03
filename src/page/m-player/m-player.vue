<template>
    <div>
        <m-mimi-player
                ref="smallPlayer"
                :audio="audio"
                :current-play-song="currentPlaySong"
                :current-song-load="currentSongLoad"
                :current-time="currentTime"
                :open-volume="openVolume"
                :play-ready="playReady"
                :play-status="playStatus"
                :sequence-list="sequenceList"
                :show-play-list="showPlayList"
                :login-user="loginUser"
                :favoriteSongList="favoriteSongList"
                @perv="perv"
                @next="next"
                @changePlayStatus="changePlayStatus"
                @progressClick="progressClick"
                @progressTouchStart="progressTouchStart"
                @closeOrOpenVolume="closeOrOpenVolume"
                @changePlayMode="changePlayMode"
                @changeShowPlayListStatus="changeShowPlayListStatus"
                @openFullScreenPlayer="openFullScreenPlayer"
                @toSingerDetail="toSingerDetail"
                @saveFavoriteSong="saveFavoriteSong"
                @deleteFavoriteSong="deleteFavoriteSong"
        />
        <!--全屏播放器-->
        <m-player-full-screen ref="fullPlayer"
                              :audio="audio"
                              :current-play-song="currentPlaySong"
                              :current-song-load="currentSongLoad"
                              :current-time="currentTime"
                              :current-lyric="currentLyric"
                              :open-volume="openVolume"
                              :play-ready="playReady"
                              :play-status="playStatus"
                              :sequence-list="sequenceList"
                              :show-play-list="showPlayList"
                              :login-user="loginUser"
                              :favoriteSongList="favoriteSongList"
                              @closeFullScreen="closeFullScreen"
                              @progressClick="progressFullClick"
                              @progressTouchStart="progressFullTouchStart"
                              @toSingerDetail="toSingerDetail"
                              @changePlayStatus="changePlayStatus"
                              @perv="perv"
                              @next="next"
                              @saveFavoriteSong="saveFavoriteSong"
                              @deleteFavoriteSong="deleteFavoriteSong"
        />
        <m-tips ref="tips" :width="160"/>
        <!--audio-->
        <audio class="audio" id="audio" ref="audio" @timeupdate="updateTime" @canplay="canPlaySong" @ended="end"/>
    </div>
</template>

<script>
  import { Icon, Message } from 'view-design'
  import { prefixStyle } from '../../common/js/dom'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import MPlayerFontIcon from './icon/m-player-font-icon'
  import { deleteSong, getSongUrl, getSongUrlByQQYY, saveSong, songLyric } from '../../api/song'
  import { ERR_OK } from '../../api/config'
  import { playMode } from '../../common/js/config'
  import { _normalizeSongs, shuffle } from '../../common/js/util'
  import MPlayList from './m-play-list/m-play-list'
  import { getSongPlayUrlData } from '../../common/js/requestData'
  import { getSign } from '../../common/js/sign'
  import { createReqData, createSongLyricData } from '../../common/js/createReqData'
  import ClipLoader from 'vue-spinner/src/ClipLoader'
  import { Base64 } from 'js-base64'
  import MMimiPlayer from './m-mini-player/m-mini-player'
  import MPlayerFullScreen from './m-player-full-screen/m-player-full-screen'
  import MTips from '../../components/m-tips/m-tips'

  const TYPE_SONG = 'song'
  const TYPE_VOLUME = 'volume'
  const transform = prefixStyle('transform')
  export default {
    name: 'm-player',
    components: {
      MMimiPlayer,
      MTips,
      MPlayerFullScreen,
      MPlayList,
      MPlayerFontIcon,
      Icon,
      Message,
      ClipLoader
    },
    props: {
      showPlayList: {
        type: Boolean
      }
    },
    data () {
      return {
        percent: 0, // 歌曲播放进度
        volumePercent: 1, // 音量大小 默认50%
        currentTime: 0, // 当前播放时间
        showBtn: false,
        currentLyric: '', // 当前歌曲歌词
        currentLyricTrans: null,
        currentSongLoad: 0,
        playReady: false,
        canPlay: false,
        isMove: false, // 当前是否正在拖拽进度条
        volume: 100,
        openVolume: true,
        playStatusFinish: true, // 判断播放状态是否改变完成的标志位，防止快速切换播放状态
        audio: { duration: 0 }
      }
    },
    computed: {
      ...mapGetters([
        'playList',
        'sequenceList',
        'fullScreen',
        'currentPlaySong',
        'currentPlaySongIndex',
        'playStatus',
        'mode',
        'loginUser',
        'favoriteSongList'
      ])
    },
    created () {
      this.touch = {}
      this.volumeTouch = {}
    },
    mounted () {
      this._offsetVolume(this.$refs.smallPlayer.$refs.volumeProgressBar.clientWidth * this.volumePercent)
    },
    methods: {
      openFullScreenPlayer () {
        this.setFullScreen(true)
      },
      closeFullScreen () {
        this.setFullScreen(false)
      },
      openTips (tips) {
        this.$refs.tips.showTips(tips)
      },
      closeTips () {
        this.$refs.tips.closeTips()
      },
      saveFavoriteSong (song) {
        if (this.loginUser === null) {
          // 收藏动作，需要登录，未登录弹出登录框，返回
          this.setNeedLogin(true)
          return
        }
        // 进行收藏逻辑
        saveSong(song).then(res => {
          if (res.code === ERR_OK) {
            let data = res.data
            if (data.status === 0) {
              // 重新设置用户的收藏歌曲列表
              this.setLoginUserFavoriteSongList(_normalizeSongs(data.data))
            }
          }
        }).catch(() => {
          // token校验失败，用户登录失效，清除当前用户信息，重定向到首页
          // this.updateTips = '用户登录过期'
          // setTimeout(() => {
          //   this.$refs.updateTips.style.opacity = 0
          //   this.$refs.updateTips.style.zIndex = -1
          //   this.canSubmit = false
          //   this.logout()
          // }, 1000)
        })
      },
      deleteFavoriteSong (song) {
        // 取消收藏
        deleteSong(song.id).then(res => {
          if (res.code === ERR_OK) {
            let data = res.data
            if (data.status === 0) {
              // 重新设置用户的收藏歌曲列表
              this.setLoginUserFavoriteSongList(_normalizeSongs(data.data))
            }
          }
        })
      },
      closeOrOpenVolume () {
        this.openVolume = !this.openVolume
        if (!this.openVolume) {
          this._offsetVolume(0)
          this.$refs.audio.volume = 0
        } else {
          this._offsetVolume(this.$refs.smallPlayer.$refs.volumeProgressBar.clientWidth * this.volumePercent)
          this.$refs.audio.volume = this.volumePercent
        }
      },
      changeTitle () {
        if (this.playStatus) {
          let title = '悦音乐丨▶ '
          if (this.currentPlaySong.title) {
            title += this.currentPlaySong.title
          } else {
            title += this.currentPlaySong.name
          }
          if (this.currentPlaySong.subTitle) {
            title += this.currentPlaySong.subTitle
          }
          document.title = title
        } else {
          document.title = '悦音乐'
        }
      },
      changeShowPlayListStatus () {
        this.$emit('changeShowPlayListStatus')
      },
      toSingerDetail (singer) {
        let router = `/singer/${singer.singerName}/${singer.singerMid}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      // 初始化audio
      cleanAudio () {
        const audio = this.$refs.audio
        this.setPlayStatus(false)
        audio.pause()
      },
      // 初始化状态
      clearStatus () {
        this.currentTime = 0
        this.percent = 0
        this.canPlay = false
        this.currentSongLoad = 0
        this.audio.duration = 0
        this.playReady = false
      },
      // 播放音乐
      playSong () {
        this.canPlay = true
        this.setPlayStatus(true)
      },
      canPlaySong () {
        if (!this.playReady) {
          this.playSong()
          this.$refs.fullPlayer.$refs.lyricPlayer.play()
          this.playReady = true
          this.audio.duration = this.$refs.audio.duration
        }
      },
      // 改变播放模式
      changePlayMode () {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentPlaySong.id
        })
        this.setCurrentPlaySongIndex(index)
      },
      // 改变播放状态
      changePlayStatus () {
        if (this.sequenceList.length === 0 || !this.canPlay || !this.playStatusFinish) {
          return
        }
        this.setPlayStatus(!this.playStatus)
        if (this.playStatus) {
          this.$refs.fullPlayer.$refs.fullPlayerImage.style.animationPlayState = 'running'
        } else {
          setTimeout(() => {
            this.$refs.fullPlayer.$refs.fullPlayerImage.style.animationPlayState = 'paused'
          }, 500)
        }
        if (this.currentLyric) {
          if (this.playStatus) {
            this.$refs.fullPlayer.$refs.lyricPlayer.togglePlay()
          } else {
            setTimeout(() => {
              this.$refs.fullPlayer.$refs.lyricPlayer.togglePlay()
            }, 1000)
          }
        }
      },
      // 歌曲播放结束切换下一首
      end () {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next(false)
        }
        this.changeTitle()
      },
      // 单曲循环
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        this.$refs.fullPlayer.$refs.lyricPlayer.seek(0)
        this.setPlayStatus(true)
        this.changeTitle()
      },
      // 切换到上一首歌曲
      perv () {
        if (this.sequenceList.length === 0 || !this.canPlay) {
          return
        }
        if (this.playList.length === 1 || this.mode === playMode.loop) {
          this.loop()
        } else {
          let index = this.currentPlaySongIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentPlaySongIndex(index)
          if (!this.playList) {
            this.changePlayStatus()
          }
        }
        this.changeTitle()
      },
      // 切换到下一首歌曲
      next (type) {
        if (!type && (this.sequenceList.length === 0 || !this.canPlay)) {
          return
        }
        if (this.playList.length === 1 || this.mode === playMode.loop) {
          this.loop()
        } else {
          let index = this.currentPlaySongIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentPlaySongIndex(index)
          if (!this.playList) {
            this.changePlayStatus()
          }
        }
        this.changeTitle()
      },
      // 格式化时间
      formatTime (interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      clearAll () {
        if (this.sequenceList.length === 0) {
          return
        }
        this.deleteSongList()
        this.$refs.fullPlayer.$refs.lyricPlayer.clearLyric()
        this.currentLyric = ''
        this.currentLyricTrans = null
        this.currentTime = 0
        this.currentSongLoad = 0
      },
      // 更新播放时间
      updateTime (e) {
        if (!this.canPlay) {
          return
        }
        if (!this.isMove) {
          this.currentTime = e.target.currentTime
          this.percent = this.currentTime / this.audio.duration
          if (this.currentSongLoad !== 100) {
            const audio = this.$refs.audio
            const timeRanges = audio.buffered
            if (audio.buffered.length !== 0) {
              this.currentSongLoad = parseInt(timeRanges.end(timeRanges.length - 1) * 100 / audio.duration * 100) / 100
            }
          }
        }
      },
      // 拖拽滑条事件
      progressFullTouchStart (e, type) {
        if (type === TYPE_SONG) {
          if (this.sequenceList.length === 0) {
            return
          }
          this.touch.initiated = true
          this.touch.startX = e.pageX
          this.touch.left = this.$refs.fullPlayer.$refs.progress.clientWidth
          document.onmousemove = (e) => {
            if (!this.touch.initiated) {
              return
            }
            const deltaX = e.pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.fullPlayer.$refs.progressBar.clientWidth,
              Math.max(0, this.touch.left + deltaX))
            this._offset(offsetWidth, 'full')
            this.onProgressBarMove('full')
          }
          document.onmouseup = (e) => {
            this.touch.initiated = false
            this._triggerPercent('full')
            document.onmouseup = null
          }
        } else if (type === TYPE_VOLUME) {
          this.volumeTouch.initiated = true
          this.volumeTouch.startX = e.pageX
          this.volumeTouch.left = this.$refs.fullPlayer.$refs.volumeProgress.clientWidth
          document.onmousemove = (e) => {
            if (!this.volumeTouch.initiated) {
              return
            }
            const deltaX = e.pageX - this.volumeTouch.startX
            const offsetWidth = Math.min(this.$refs.fullPlayer.$refs.volumeProgressBar.clientWidth,
              Math.max(0, this.volumeTouch.left + deltaX))
            this._offsetVolume(offsetWidth, 'full')
            this._triggerVolumePercent('full')
          }
          document.onmouseup = (e) => {
            this.volumeTouch.initiated = false
            document.onmouseup = null
          }
        }
      },
      progressFullClick (e, type) {
        if (type === TYPE_SONG) {
          if (this.sequenceList.length === 0) {
            return
          }
          const rect = this.$refs.fullPlayer.$refs.progressBar.getBoundingClientRect()
          if (e.pageX < rect.left || e.pageX > rect.right) {
            return
          }
          const offsetWidth = e.pageX - rect.left
          this._offset(offsetWidth, 'full')
          this._triggerPercent('full')
        } else if (type === TYPE_VOLUME) {
          const rect = this.$refs.fullPlayer.$refs.volumeProgressBar.getBoundingClientRect()
          if (e.pageX < rect.left || e.pageX > rect.right) {
            return
          }
          const offsetWidth = e.pageX - rect.left
          this._offsetVolume(offsetWidth, 'full')
          this._triggerVolumePercent('full')
        }
      },
      // 拖拽滑条事件
      progressTouchStart (e, type) {
        if (type === TYPE_SONG) {
          if (this.sequenceList.length === 0) {
            return
          }
          this.touch.initiated = true
          this.touch.startX = e.pageX
          this.touch.left = this.$refs.smallPlayer.$refs.progress.clientWidth
          document.onmousemove = (e) => {
            if (!this.touch.initiated) {
              return
            }
            const deltaX = e.pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.smallPlayer.$refs.progressBar.clientWidth,
              Math.max(0, this.touch.left + deltaX))
            this._offset(offsetWidth)
            this.onProgressBarMove()
          }
          document.onmouseup = (e) => {
            this.touch.initiated = false
            this._triggerPercent()
            document.onmouseup = null
          }
        } else if (type === TYPE_VOLUME) {
          this.volumeTouch.initiated = true
          this.volumeTouch.startX = e.pageX
          this.volumeTouch.left = this.$refs.smallPlayer.$refs.volumeProgress.clientWidth
          document.onmousemove = (e) => {
            if (!this.volumeTouch.initiated) {
              return
            }
            const deltaX = e.pageX - this.volumeTouch.startX
            const offsetWidth = Math.min(this.$refs.smallPlayer.$refs.volumeProgressBar.clientWidth,
              Math.max(0, this.volumeTouch.left + deltaX))
            this._offsetVolume(offsetWidth)
            this._triggerVolumePercent()
          }
          document.onmouseup = (e) => {
            this.volumeTouch.initiated = false
            document.onmouseup = null
          }
        }
      },
      // 点击滑条事件
      progressClick (e, type) {
        if (type === TYPE_SONG) {
          if (this.sequenceList.length === 0) {
            return
          }
          const rect = this.$refs.smallPlayer.$refs.progressBar.getBoundingClientRect()
          if (e.pageX < rect.left || e.pageX > rect.right) {
            return
          }
          const offsetWidth = e.pageX - rect.left
          this._offset(offsetWidth)
          this._triggerPercent()
        } else if (type === TYPE_VOLUME) {
          const rect = this.$refs.smallPlayer.$refs.volumeProgressBar.getBoundingClientRect()
          if (e.pageX < rect.left || e.pageX > rect.right) {
            return
          }
          const offsetWidth = e.pageX - rect.left
          this._offsetVolume(offsetWidth)
          this._triggerVolumePercent()
        }
      },
      _offset (offsetWidth, type = 'small') {
        if (type === 'full') {
          this.$refs.fullPlayer.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.fullPlayer.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        } else {
          this.$refs.smallPlayer.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.smallPlayer.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        }
      },
      _offsetVolume (offsetWidth, type = 'small') {
        if (type === 'full') {
          this.$refs.fullPlayer.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.fullPlayer.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        } else {
          this.$refs.smallPlayer.$refs.volumeProgress.style.width = `${offsetWidth}px`
          this.$refs.smallPlayer.$refs.volumeProgressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        }
      },
      // 歌曲进度条操作
      _triggerPercent (type = 'small') {
        if (type === 'full') {
          const barWidth = this.$refs.fullPlayer.$refs.progressBar.clientWidth
          this.percent = this.$refs.fullPlayer.$refs.progress.clientWidth / barWidth
        } else {
          const barWidth = this.$refs.smallPlayer.$refs.progressBar.clientWidth
          this.percent = this.$refs.smallPlayer.$refs.progress.clientWidth / barWidth
        }
        this.isMove = false
        this.$refs.audio.currentTime = this.currentPlaySong.duration * this.percent
        if (this.currentLyric) {
          this.$refs.fullPlayer.$refs.lyricPlayer.seek(this.currentPlaySong.duration * this.percent)
        }
        if (!this.playStatus) {
          this.changePlayStatus()
        }
      },
      // 进度条滑动时歌词跟随滑动
      onProgressBarMove (type = 'small') {
        this.isMove = true
        if (type === 'full') {
          const barWidth = this.$refs.fullPlayer.$refs.progressBar.clientWidth
          this.percent = this.$refs.fullPlayer.$refs.progress.clientWidth / barWidth
          this.currentTime = this.currentPlaySong.duration * this.percent
        } else {
          const barWidth = this.$refs.smallPlayer.$refs.progressBar.clientWidth
          this.percent = this.$refs.smallPlayer.$refs.progress.clientWidth / barWidth
          this.currentTime = this.currentPlaySong.duration * this.percent
        }
      },
      // 音量大小操作
      _triggerVolumePercent () {
        const barWidth = this.$refs.smallPlayer.$refs.volumeProgressBar.clientWidth
        this.volumePercent = this.$refs.smallPlayer.$refs.volumeProgress.clientWidth / barWidth
        if (this.volumePercent > 0) {
          this.openVolume = true
        } else {
          this.openVolume = false
        }
        if (this.$refs.audio !== undefined) {
          this.$refs.audio.volume = this.volumePercent
        }
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ]),
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayStatus: 'SET_PLAYING_STATUS',
        setCurrentPlaySong: 'SET_CURRENT_PLAY_SONG',
        setCurrentPlaySongIndex: 'SET_CURRENT_PLAY_SONG_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAY_LIST',
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER',
        setNeedLogin: 'SET_NEED_LOGIN',
        setLoginUserFavoriteSongList: 'SET_LOGIN_USER_FAVORITE_SONG_LIST'
      })
    },
    watch: {
      currentPlaySong (newSong, oldSong) {
        if (!newSong.id) {
          this.currentTime = 0
          this.$refs.audio.src = ''
          this.percent = 0
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.$refs.fullPlayer.$refs.lyricPlayer.clearLyric()
          this.currentLyric = ''
          this.currentLyricTrans = null
        }
        this.cleanAudio()
        this.clearStatus()
        clearTimeout(this.Timeout)
        this.Timeout = setTimeout(async () => {
          // 获取歌曲歌词
          if (newSong.lyric === undefined) {
            let reaData = createSongLyricData(newSong.mid)
            let res = await songLyric(reaData)
            for (let i = 0; i < 3; i++) {
              if (res.code !== ERR_OK) {
                res = await songLyric(reaData)
              } else {
                break
              }
            }
            // 三次重试无效
            if (res.code !== ERR_OK) {
              this.openTips('≥﹏≤歌词获取失败啦')
              // 下一首
              setTimeout(() => {
                this.closeTips()
                this.next(true)
              }, 500)
              return
            }
            let lyric = Base64.decode(res.songLyric)
            this.currentLyric = lyric
          } else {
            this.currentLyric = newSong.lyric
          }
          if (!newSong.playUrl) {
            //  获取新的播放链接（防止老链接死亡无法播放）
            getSongUrl(newSong.mid).then(async res => {
              if (res.code === ERR_OK) {
                // 重新设置该歌曲的播放链接
                this.setCurrentPlaySong(res.songPlayUrl)
                this.$refs.audio.src = this.currentPlaySong.playUrl
                this.$refs.audio.volume = this.volumePercent
                this.changeTitle()
              } else {
                // 其他途径获取失败尝试从官方获取播放链接
                let data = getSongPlayUrlData(newSong.mid)
                let sign = getSign(data)
                let reqData = createReqData(sign, data)
                let res = await getSongUrlByQQYY(reqData)
                for (let i = 0; i < 3; i++) {
                  // 重试三次
                  if (res.code !== ERR_OK) {
                    res = await getSongUrlByQQYY(reqData)
                  } else {
                    break
                  }
                }
                if (res.code === ERR_OK && res.songPlayUrl !== null) {
                  //  重新设置该歌曲的播放链接
                  this.setCurrentPlaySong(res.songPlayUrl)
                  this.$refs.audio.src = this.currentPlaySong.playUrl
                  this.$refs.audio.volume = this.volumePercent
                  this.changeTitle()
                } else {
                  // 提示用户无法播放并跳过播放下一首
                  this.openTips(`≥﹏≤${newSong.name}无法播放`)
                  // 下一首
                  setTimeout(() => {
                    this.closeTips()
                    this.next(true)
                  }, 500)
                }
              }
            })
          } else {
            if (newSong.songPlayUrl !== null) {
              // 获取歌曲歌词
              if (newSong.lyric === undefined) {
                let reaData = createSongLyricData(newSong.mid)
                let res = await songLyric(reaData)
                for (let i = 0; i < 3; i++) {
                  if (res.code !== ERR_OK) {
                    res = await songLyric(reaData)
                  } else {
                    break
                  }
                }
                // 三次重试无效
                if (res.code !== ERR_OK) {
                  this.openTips('≥﹏≤歌词获取失败啦')
                  // 下一首
                  setTimeout(() => {
                    this.closeTips()
                    this.next(true)
                  }, 500)
                  return
                }
                let lyric = Base64.decode(res.songLyric)
                this.currentLyric = lyric
              } else {
                this.currentLyric = newSong.lyric
              }
              this.$refs.audio.src = this.currentPlaySong.playUrl
              this.$refs.audio.volume = this.volumePercent
              this.changeTitle()
            } else {
              // 提示用户无法播放并跳过播放下一首
              this.openTips(`≥﹏≤${newSong.name}无法播放`)
              // 下一首
              setTimeout(() => {
                this.closeTips()
                this.next(true)
              }, 500)
            }
          }
        }, 500)
      },
      currentPlaySongIndex (newValue) {
        if (newValue !== -1) {
          this.$refs.smallPlayer.$refs.currentPlaySong.style.transform = 'translate3d(0, 0, 0)'
        } else {
          this.$refs.smallPlayer.$refs.currentPlaySong.style.transform = 'translate3d(-100%, 0, 0)'
        }
      },
      // 根据播放状态修改音乐的播放状态(音量淡入浅出)
      playStatus (newPlayStatus) {
        if (this.canPlay) {
          const audio = this.$refs.audio
          const v = this.volumePercent / 20
          this.playStatusFinish = false
          this.$nextTick(() => {
            if (newPlayStatus) {
              audio.volume = 0
              let volume = 0
              audio.play()
              let t = setInterval(() => {
                volume += v
                if (volume < this.volumePercent) {
                  audio.volume = volume
                } else {
                  audio.volume = this.volumePercent
                  this.playStatusFinish = true
                  clearInterval(t)
                }
              }, 50)
            } else {
              let volume = this.volumePercent
              let t = setInterval(() => {
                volume -= v
                if (volume > 0) {
                  audio.volume = volume
                } else {
                  audio.volume = 0
                  setTimeout(() => {
                    audio.pause()
                    this.playStatusFinish = true
                    clearInterval(t)
                  }, 20)
                }
              }, 50)
            }
            this.changeTitle()
          })
        }
      },
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.smallPlayer.$refs.progressBar.clientWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
          const fullBarWidth = this.$refs.fullPlayer.$refs.progressBar.clientWidth
          const fullOffsetWidth = newPercent * fullBarWidth
          this._offset(fullOffsetWidth, 'full')
        }
      }
    }
  }
</script>

<style lang="less">

</style>
