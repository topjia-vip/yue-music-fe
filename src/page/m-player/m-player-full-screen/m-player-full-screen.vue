<template>
    <!--全屏播放器-->
    <div class="m-play-full-screen" ref="fullScreenPlayer">
        <div class="m-play-full-screen-content">
            <div class="bg-img" v-lazy:background-image="currentPlaySong.image" :key="currentPlaySong.image"></div>
            <div class="mask-layer"></div>
            <div class="play-content">
                <div class="close-btn">
                    <i class="btn fa fa-angle-down" aria-hidden="true" title="收起" @click="closeFullScreen"></i>
                </div>
                <div class="full-screen-box" @click="setFullScreen">
                    <Icon class="btn" type="ios-expand" title="全屏" size="18" v-if="!isFullScreen"/>
                    <Icon class="btn" type="ios-contract" title="还原" size="18" v-else/>
                </div>
                <div class="song-info-box">
                    <div class="song-image">
                        <img ref="fullPlayerImage" class="image" ondragstart="return false"
                             v-lazy="handleLazyImage(currentPlaySong.image)"
                             :alt="currentPlaySong.title" :key="currentPlaySong.image">
                    </div>
                    <div class="song-info">
                        <div class="song-info-box">
                            <div class="info">
                                <h1 class="song-name">{{currentPlaySong.title}}</h1>
                                <div class="singer-box">
                                    歌手：
                                    <span class="singer" v-for="(singer,index) in currentPlaySong.singers"
                                          v-html="currentPlaySong.singers.length !== 1 && index !== currentPlaySong.singers.length - 1 ? `${singer.singerName}/`:singer.singerName"
                                          :key="singer.singerMid"
                                          @click="toSingerDetail(singer)">
                                    </span>
                                </div>
                                <div class="album">专辑：{{currentPlaySong.album}}</div>
                            </div>
                            <div class="song-lyric-box">
                                <m-lyric-player ref="lyricPlayer" :lyric="currentLyric"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="m-player-full-screen-tools">
                    <div class="playing-progress-bar-box" @mousedown="progressClick($event,'song')">
                        <div class="playing-progress-bar" ref="progressBar">
                            <div ref="progress" class="play-progressed-bar"></div>
                            <div ref="progressBtn" class="btn"
                                 @mousedown.prevent.stop="progressTouchStart($event,'song')">
                            </div>
                        </div>
                    </div>
                    <div class="tools-box">
                        <div class="left-tools">
                            <div class="love-btn-box">
                                <!--收藏按钮-->
                                <i class="love-btn fa fa-heart-o" aria-hidden="true" title="收藏"
                                   @click.stop="saveFavoriteSong"
                                   v-if="isFavoriteSong"></i>
                                <i class="unlove-btn fa fa-heart" aria-hidden="true" title="取消收藏"
                                   @click.stop="deleteFavoriteSong"
                                   v-else></i>
                            </div>
                            <!--播放时间-->
                            <div class="playTime">
                                <div class="time start-time">{{formatTime(currentTime)}}</div>
                                /
                                <div class="time end-time">{{formatTime(audio.duration)}}</div>
                            </div>
                        </div>
                        <div class="right-tools">

                        </div>
                        <div class="play-tools">
                            <i class="btn prev fa fa-step-backward" aria-hidden="true" @click="perv"></i>
                            <span class="btn play icon iconfont icon-play-btn" v-if="!playStatus"
                                  @click="changePlayStatus"></span>
                            <span class="btn pause icon iconfont icon-pause" v-else @click="changePlayStatus"></span>
                            <i class="btn next fa fa-step-forward" aria-hidden="true" @click="next"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import MLyricPlayer from '../../../components/m-lyric-player/m-lyric-player'
  import { mapGetters } from 'vuex'
  import { Icon } from 'view-design'
  import './font-icon/iconfont.css'
  import SongDefLazyImg from '../../../resources/images/playlist_300.png'

  export default {
    name: 'm-player-full-screen',
    components: { MLyricPlayer, Icon },
    props: {
      currentPlaySong: {
        type: Object
      },
      playStatus: {
        type: Boolean
      },
      currentTime: {
        type: Number
      },
      currentSongLoad: {
        type: Number
      },
      currentLyric: {
        type: String
      },
      sequenceList: {
        type: Array
      },
      playReady: {
        type: Boolean
      },
      audio: {
        type: Object
      },
      openVolume: {
        type: Boolean
      },
      showPlayList: {
        type: Boolean
      },
      loginUser: {
        type: Object
      },
      favoriteSongList: {
        type: Array
      }
    },
    data () {
      return {
        screenHeight: window.innerHeight,
        isFullScreen: false
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.screenHeight = window.innerHeight
      })
      if (window.ipcRenderer) {
        window.ipcRenderer.on('noFullScreen', (event, arg) => {
          this.isFullScreen = false
        })
      }
    },
    computed: {
      ...mapGetters([
        'fullScreen'
      ]),
      isFavoriteSong () {
        // 未登录
        if (this.loginUser === null || this.favoriteSongList === null) {
          return true
        }
        return this.favoriteSongList.findIndex((item) => item.id + '' === this.currentPlaySong.id + '') === -1
      },
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: SongDefLazyImg,
            loading: SongDefLazyImg
          }
        }
      }
    },
    methods: {
      setFullScreen () {
        if (window.ipcRenderer) {
          this.isFullScreen = !this.isFullScreen
          if (this.isFullScreen) {
            window.ipcRenderer.send('fullScreen')
          } else {
            window.ipcRenderer.send('noFullScreen')
          }
        }
      },
      open () {
        this.$refs.fullScreenPlayer.style.transform = `translateY(0)`
      },
      close () {
        this.$refs.fullScreenPlayer.style.transform = `translateY(100%)`
      },
      // 上一首
      perv () {
        this.$emit('perv')
      },
      // 下一首
      next () {
        this.$emit('next')
      },
      // 改变播放状态
      changePlayStatus () {
        this.$emit('changePlayStatus')
      },
      // 滑动条点击
      progressClick (e, type) {
        this.$emit('progressClick', e, type)
      },
      // 滑动条滑动
      progressTouchStart (e, type) {
        this.$emit('progressTouchStart', e, type)
      },
      // 打开或关闭音量
      closeOrOpenVolume () {
        this.$emit('closeOrOpenVolume')
      },
      // 改变播放模式
      changePlayMode () {
        this.$emit('changePlayMode')
      },
      // 打开播放列表
      openPlayList () {
        this.$emit('openPlayList')
      },
      // 关闭全屏播放器
      closeFullScreen () {
        if (this.isFullScreen) {
          window.ipcRenderer.send('noFullScreen')
          this.isFullScreen = !this.isFullScreen
        }
        this.$emit('closeFullScreen')
      },
      // 歌手详情页
      toSingerDetail (singer) {
        this.closeFullScreen()
        this.$emit('toSingerDetail', singer)
      },
      // 收藏正在播放的歌曲
      saveFavoriteSong () {
        this.$emit('saveFavoriteSong', this.currentPlaySong)
      },
      // 取消收藏正在播放的歌曲
      deleteFavoriteSong () {
        this.$emit('deleteFavoriteSong', this.currentPlaySong)
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
      }
    },
    watch: {
      screenHeight (newValue) {
        if (this.fullScreen) {
          this.$refs.fullScreenPlayer.style.transform = `translateY(0)`
        } else {
          this.$refs.fullScreenPlayer.style.transform = `translateY(100%)`
        }
      },
      fullScreen (newValue) {
        if (newValue) {
          this.open()
        } else {
          this.close()
        }
      }
    }
  }
</script>

<style lang="less">
    @import "../../../common/css/theme/theme";

    .m-play-full-screen {
        user-select: none;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        min-width: 1020px;
        min-height: 665px;
        z-index: 1000;
        opacity: 1;
        transform: translateY(100%);
        transition: transform 300ms;
        background: #3d3d3d;
        -webkit-app-region: drag;

        .m-play-full-screen-content {
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 20px 25px;
            overflow: hidden;
            z-index: 1003;

            .bg-img {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;
                transform: scale(1.1);
                filter: blur(20px);
                z-index: -2;
            }

            .mask-layer {
                position: absolute;
                width: 100%;
                height: 100%;
                background: #0000008c;
                top: 0;
                left: 0;
                z-index: -1;
            }

            .play-content {
                position: relative;
                width: 100%;
                height: 100%;
                padding: 80px 0;

                .close-btn {
                    position: absolute;
                    top: 25px;
                    -webkit-app-region: no-drag;

                    .btn {
                        color: #918f90;
                        font-size: 24px;
                    }

                    .btn:hover {
                        cursor: pointer;
                        color: #ffffff;
                    }
                }

                .full-screen-box {
                    position: absolute;
                    top: 25px;
                    right: 0;
                    -webkit-app-region: no-drag;

                    .btn {
                        color: #918f90;
                        font-size: 24px;
                    }

                    .btn:hover {
                        cursor: pointer;
                        color: #ffffff;
                    }
                }

                .song-info-box {
                    width: 100%;
                    height: 100%;
                    max-width: 1200px;
                    margin: auto;

                    .song-image {
                        position: relative;
                        float: left;
                        width: 50%;
                        height: 100%;

                        .image {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            right: 0;
                            left: 0;
                            margin: auto;
                            width: 100%;
                            height: 100%;
                            max-width: 350px;
                            max-height: 350px;
                            display: block;
                            border-radius: 50%;
                            animation: spin 30s infinite linear;
                        }

                        @keyframes spin {
                            0% {
                                transform: rotate(0deg);
                            }
                            100% {
                                transform: rotate(360deg);
                            }
                        }

                    }

                    .song-info {
                        float: left;
                        width: 50%;
                        height: 100%;
                        padding: 60px;
                        text-align: center;

                        .song-info-box {
                            position: relative;
                            width: 100%;
                            height: 100%;
                            padding-top: 100px;
                            -webkit-app-region: no-drag;

                            .info {
                                position: absolute;
                                top: 0;
                                width: 100%;

                                .song-name {
                                    user-select: text;
                                    color: #ffffff;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }

                                ::selection {
                                    background: #d3d3d3;
                                    color: #ffffff;
                                }

                                .singer-box {
                                    color: #a49f9c;
                                    font-size: 12px;
                                    margin-top: 10px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;

                                    .singer {
                                        cursor: pointer;
                                    }
                                }

                                .album {
                                    color: #a49f9c;
                                    font-size: 12px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }

                            .song-lyric-box {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }

                .m-player-full-screen-tools {
                    position: absolute;
                    bottom: 0;
                    height: 80px;
                    width: 100%;
                    -webkit-app-region: no-drag;

                    .playing-progress-bar-box {
                        width: 100%;
                        height: 20px;
                        padding: 8.5px 0;

                        .playing-progress-bar {
                            position: relative;
                            height: 3px;
                            background: #ffffff1f;

                            .load-bar {
                                position: absolute;
                                height: 4px;
                                background: #454546;
                                border-radius: 2px;
                            }

                            .play-progressed-bar {
                                position: relative;
                                width: 0;
                                height: 3px;
                                background: @player-bar-color;
                            }

                            .btn {
                                position: absolute;
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                background: @player-bar-color;
                                top: -4px;
                                left: -6px;
                                opacity: 0;
                            }
                        }
                    }

                    .playing-progress-bar-box:hover {
                        .btn {
                            opacity: 1;
                        }
                    }

                    .tools-box {
                        position: relative;
                        width: 100%;
                        height: 60px;
                        padding: 10px 250px;

                        .left-tools {
                            position: absolute;
                            width: 250px;
                            height: 40px;
                            line-height: 40px;
                            left: 0;

                            .love-btn-box {
                                display: inline-block;

                                .love-btn {
                                    color: #ADAFB2;
                                    margin-right: 5px;
                                }

                                .love-btn:hover {
                                    color: #d65958;
                                    cursor: pointer;
                                    margin-right: 5px;
                                }

                                .unlove-btn {
                                    color: #d65958;
                                    cursor: pointer;
                                    margin-right: 5px;
                                }
                            }

                            .playTime {
                                font-size: 12px;
                                color: #a9a9a9;
                                display: inline-block;

                                .time {
                                    width: 30px;
                                    display: inline-block;
                                    text-align: center;
                                }
                            }
                        }

                        .play-tools {
                            text-align: center;
                            line-height: 40px;
                            height: 40px;
                            position: relative;

                            .btn {
                                cursor: pointer;
                                color: #ffffff;
                            }

                            .btn:hover {
                                color: @player-bar-color;
                            }

                            .prev {
                                position: relative;
                                font-size: 24px;
                                top: -6px;
                            }

                            .play, .pause {
                                color: @player-bar-color;
                                font-size: 40px;
                                margin: 0 20px;
                            }

                            .next {
                                position: relative;
                                font-size: 24px;
                                top: -6px;
                            }
                        }

                        .right-tools {
                            position: absolute;
                            width: 250px;
                            height: 40px;
                            line-height: 40px;
                            right: 0;
                        }
                    }
                }
            }
        }
    }
</style>
