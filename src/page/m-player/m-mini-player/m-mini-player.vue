<template>
    <!--迷你播放器-->
    <div class="player">
        <!--播放按钮-->
        <div class="player-tools">
            <div class="tool prev-song">
                <i class="tool-icon fa fa-step-backward" aria-hidden="true" @click="perv"></i>
            </div>
            <div class="tool play" v-if="!playStatus" @click="changePlayStatus">
                <span class="play-icon icon iconfont icon-play-btn"></span>
            </div>
            <div class="tool pause" v-else @click="changePlayStatus">
                <span class="pause-icon icon iconfont icon-pause"></span>
            </div>
            <div class="tool next-song">
                <i class="tool-icon fa fa-step-forward" aria-hidden="true" @click="next"></i>
            </div>
        </div>
        <!--开始时间-->
        <div class="time start-time">{{formatTime(currentTime)}}</div>
        <!--播放进度条-->
        <div class="play-progress-bar-box">
            <div class="ex-bar" @mousedown="progressClick($event,'song')">
                <div class="play-progress-bar" ref="progressBar">
                    <div class="load-bar" :style="`width:${currentSongLoad}%`"></div>
                    <div ref="progress" class="play-progressed-bar"></div>
                    <div ref="progressBtn" class="btn" @mousedown.prevent="progressTouchStart($event,'song')">
                        <clip-loader style="position: absolute;top: -13px; left: 0;" size="12px"
                                     color="rgb(135, 133, 133)"
                                     :loading="sequenceList.length !== 0 && !playReady"></clip-loader>
                    </div>
                </div>
            </div>
        </div>
        <!--结束时间-->
        <div class="time end-time">{{formatTime(audio.duration)}}</div>
        <!--工具栏-->
        <div class="volume-box">
            <div class="icon-box" @click="closeOrOpenVolume">
                <Icon type="md-volume-up" v-if="openVolume"/>
                <Icon type="md-volume-mute" v-if="!openVolume"/>
            </div>
            <div class="volume-bar-box">
                <div class="ex-bar" @mousedown="progressClick($event,'volume')">
                    <div class="volume-bar" ref="volumeProgressBar">
                        <div ref="volumeProgress" class="volume-progressed-bar"></div>
                        <div ref="volumeProgressBtn" class="btn"
                             @mousedown.prevent="progressTouchStart($event,'volume')">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="model">
            <m-player-font-icon @changePlayMode="changePlayMode" @changeShowPlayListStatus="changeShowPlayListStatus"
                                :showPlayList="showPlayList"/>
        </div>
        <!--当前播放歌曲显示-->
        <div ref="currentPlaySong" class="current-play-song">
            <div class="current-song-img-box">
                <div class="up" @click="openFullScreenPlayer">
                    <i class="up-icon fa fa-angle-double-up" aria-hidden="true"></i>
                </div>
                <img ondragstart="return false" class="img" v-lazy="handleLazyImage(currentPlaySong.image)"
                     :alt="currentPlaySong.name" :key="currentPlaySong.image">
            </div>
            <div class="current-song-info">
                <div class="song-name">
                    <span v-html="currentPlaySong.name"></span>
                </div>
                <div class="singers">
                    <span class="singer-name" v-for="(singer) in currentPlaySong.singers" :key="singer.singerMid"
                          v-html="singer.singerName" @click="toSingerDetail(singer)" @dblclick.stop=""></span>
                </div>
            </div>
            <!--收藏按钮-->
            <i class="love-btn fa fa-heart-o" aria-hidden="true" title="收藏"
               @click.stop="saveFavoriteSong"
               v-if="isFavoriteSong"></i>
            <i class="unlove-btn fa fa-heart" aria-hidden="true" title="取消收藏"
               @click.stop="deleteFavoriteSong"
               v-else></i>
        </div>
    </div>
</template>

<script>
  import MPlayerFontIcon from '../icon/m-player-font-icon'
  import ClipLoader from 'vue-spinner/src/ClipLoader'
  import { Icon } from 'view-design'
  import SongDefLazyImg from '../../../resources/images/playlist_300.png'

  export default {
    name: 'm-mimi-player',
    components: {
      MPlayerFontIcon,
      ClipLoader,
      Icon
    },
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
    computed: {
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
      changeShowPlayListStatus () {
        this.$emit('changeShowPlayListStatus')
      },
      // 打开全屏播放器
      openFullScreenPlayer () {
        this.$emit('openFullScreenPlayer')
      },
      // 歌手详情页
      toSingerDetail (singer) {
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
    }
  }
</script>

<style lang="less">
    @import '../../../common/css/theme/theme';

    .player {
        user-select: none;
        height: 51px;
        width: 100%;
        min-width: 1020px;
        position: absolute;
        bottom: 0;
        z-index: 999;
        padding: 5px 310px 5px 240px;
        border-top: 0.1px solid #363636;
        box-shadow: -3px 4px 5px #7d7d7d;
        background: @mini-player-background-color;

        .player-tools {
            position: absolute;
            width: 200px;
            height: 40px;
            color: @tools-color;
            left: 0;
            padding: 0 10px;
            text-align: center;

            .tool {
                display: flex;
                justify-content: center;
                align-items: center;
                float: left;
                height: 40px;
                width: 40px;
                line-height: 40px;
                margin: 0 10px;

                i {
                    display: inline;
                }

                .tool-icon:hover {
                    cursor: pointer;
                    color: @player-bar-color;
                }
            }

            .prev-song {
                padding: 5px;

                .tool-icon {
                    font-size: 24px;
                    position: relative;
                }
            }

            .play {
                cursor: pointer;
                padding: 2.5px;

                .play-icon {
                    color: @player-bar-color;
                    font-size: 38px;
                    position: relative;
                }
            }

            .pause {
                cursor: pointer;
                padding: 2.5px;

                .pause-icon {
                    color: @player-bar-color;
                    font-size: 38px;
                    position: relative;
                }
            }

            .next-song {
                padding: 5px;

                .tool-icon {
                    font-size: 24px;
                    position: relative;
                }
            }
        }

        .time {
            position: absolute;
            width: 40px;
            height: 40px;
            line-height: 40px;
            padding: 0 3px;
            font-size: 12px;
            text-align: center;
            color: @time-color;
            display: inline-block;
        }

        .start-time {
            left: 200px;
        }

        .play-progress-bar-box {
            width: 100%;
            height: 40px;
            line-height: 40px;
            display: inline-block;
            padding: 14px 8px;

            .ex-bar {
                cursor: pointer;
                padding: 4px 0;

                .play-progress-bar {
                    position: relative;
                    height: 4px;
                    background: @play-progress-bar-color;
                    border-radius: 2px;

                    .load-bar {
                        position: absolute;
                        height: 4px;
                        background: @load-bar-color;
                        border-radius: 2px;
                    }

                    .play-progressed-bar {
                        position: relative;
                        width: 0;
                        height: 4px;
                        background: @player-bar-color;
                        border-radius: 2px;
                    }

                    .btn {
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: @player-bar-color;
                        top: -4px;
                        left: -6px;

                        .song-loading {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            width: 12px;
                            height: 12px;
                        }
                    }

                    .btn:hover {
                        cursor: pointer;
                    }
                }
            }
        }

        .end-time {
            right: 270px;
        }

        .volume-box {
            height: 40px;
            width: 140px;
            display: inline-block;
            position: absolute;
            right: 130px;
            padding: 0 5px;

            .icon-box {
                height: 40px;
                width: 24px;
                line-height: 40px;
                font-size: 24px;
                float: left;
                color: @icon-color;
                margin-right: 6px;
            }

            .icon-box:hover {
                cursor: pointer;
                color: @tools-color;
            }

            .volume-bar-box {
                height: 40px;
                padding: 12px 2px;
                width: 100px;
                float: left;

                .ex-bar {
                    height: 16px;
                    padding: 6px 0;

                    .volume-bar {
                        position: relative;
                        width: 100%;
                        height: 4px;
                        background: @play-progress-bar-color;
                        border-radius: 2px;
                    }

                    .volume-progressed-bar {
                        position: relative;
                        width: 0;
                        height: 4px;
                        background: @player-bar-color;
                        border-radius: 2px;
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
                        z-index: -1;
                    }
                }

                .ex-bar:hover {
                    cursor: pointer;

                    .btn {
                        opacity: 1;
                        z-index: 10;
                    }
                }
            }
        }

        .model {
            position: absolute;
            height: 40px;
            width: 130px;
            right: 0;
            padding: 0 5px;
            display: inline-block;
        }

        .current-play-song {
            width: 200px;
            height: 60px;
            position: absolute;
            background: @current-play-song-background-color;
            top: -61px;
            left: 0;
            border-top: 0.1px solid @current-play-song-border-color;
            border-right: 0.1px solid @current-play-song-border-color;
            padding: 8px 30px 8px 5px;
            transform: translate3d(-100%, 0, 0);
            transition: transform 300ms;

            .love-btn {
                position: absolute;
                right: 8px;
                top: 12px;
                color: @no-favorite-color;
                margin-right: 5px;
            }

            .love-btn:hover {
                color: @favorite-color;
                cursor: pointer;
                margin-right: 5px;
            }

            .unlove-btn {
                position: absolute;
                right: 8px;
                top: 12px;
                color: @favorite-color;
                cursor: pointer;
                margin-right: 5px;
            }

            .current-song-img-box {
                float: left;
                cursor: pointer;
                position: relative;

                .up {
                    position: absolute;
                    display: inline-block;
                    width: 44px;
                    height: 44px;
                    color: #000;
                    text-align: center;
                    background: #00000052;
                    overflow: hidden;
                    opacity: 0;

                    .up-icon {
                        position: relative;
                        font-size: 30px;
                        top: 40px;
                        transition-property: top;
                        transition-duration: 0.2s;
                    }
                }

                .img {
                    width: 44px;
                    height: 44px;
                    display: block;
                }

                .up:hover {
                    opacity: 1;

                    .up-icon {
                        top: 8px;
                    }
                }
            }

            .current-song-info {
                float: left;
                font-size: 12px;
                padding: 0 8px;
                width: 120px;

                .song-name {
                    width: 100%;
                    height: 22px;
                    line-height: 22px;
                    color: @current-play-song-name-color;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    span:hover {
                        cursor: pointer;
                    }
                }

                .singers {
                    width: 100%;
                    height: 22px;
                    line-height: 22px;
                    color: @current-play-song-singer-color;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    span {
                        margin-right: 5px;
                    }

                    span:hover {
                        color: @current-play-song-name-color;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>
