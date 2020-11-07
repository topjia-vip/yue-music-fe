<template>
    <div class="m-video-player-box"
         @mouseenter="playerMouseenter"
         @mouseleave="playerMouseleave"
         @mousemove="playerMousemove"
    >
        <video class="video"
               ref="video"
               preload="auto"
               @loadstart="loadstart"
               @canplay="canplay"
               @waiting="waiting"
               @playing="playing"
               @timeupdate="updateTime"
               @click="changePlayStatus"
               :poster="currentVideo?currentVideo.mvPicUrl:''"
               :src="playUrl?playUrl.url:''">
        </video>
        <loading v-if="videoWaiting" :color="'#FFFFFF'" class="loading"/>
        <!-- 暂停图标 -->
        <div v-if="!videoWaiting && !playStatus" class="pause-btn-box">
            <div class="pause-btn">
                <Icon class="btn" type="md-play" size="60" @click="changePlayStatus"/>
            </div>
        </div>
        <!-- 视频控制栏 -->
        <div class="video-controls-box" ref="controls"
             @mouseenter="mouseenterControls"
             @mouseleave="mouseleaveControls"
        >
            <!--播放进度条-->
            <div class="play-progress-bar-box" @mousedown="progressClick($event,'video')">
                <div class="playing-progress-bar" ref="progressBar">
                    <div ref="progress" class="play-progressed-bar"></div>
                    <div ref="progressBtn" class="btn"
                         @mousedown.prevent.stop="progressTouchStart($event,'video')">
                    </div>
                </div>
            </div>
            <div class="play-tools-box">
                <!--左边操作按钮-->
                <div class="tools left-tools">
                    <div class="btn-box play-btn-box">
                        <Icon class="btn" v-if="!playStatus" type="md-play" size="20" @click="changePlayStatus"
                              title="播放"/>
                        <Icon class="btn" v-else type="md-pause" size="20" @click="changePlayStatus" title="暂停"/>
                    </div>
                    <div v-if="videoWaiting" class="video-waiting-tip">
                        <span class="text">视频缓冲中,请稍等..</span>
                    </div>
                    <div v-else class="video-play-time">
                        <div class="time start-time">{{formatTime(currentTime)}}</div>
                        /
                        <div class="time end-time">{{formatTime(video.duration)}}</div>
                    </div>
                </div>
                <!--右边操作按钮-->
                <div class="tools right-tools">
                    <!--音量-->
                    <div class="volume-box" @wheel.stop="mousewheelChangeVolume">
                        <div class="btn-box volume-btn-box" @click="closeOrOpenVolume">
                            <Icon class="btn" type="md-volume-up" size="20" v-if="openVolume"/>
                            <Icon class="btn" type="md-volume-mute" size="20" v-if="!openVolume"/>
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
                    <div class="play-url-btn-box"
                         v-if="playUrl"
                         @mouseenter="openOtherUrl = true"
                         @mouseleave="openOtherUrl=false">
                        <div class="play-url-btn" :title="`视频品质 ${playUrl.type}`">
                            <span>{{playUrl.type}}</span>
                        </div>
                        <div class="other-url-box" v-if="openOtherUrl">
                            <div class="url" v-for="(url,index) in videoUrls" :key="index">
                                <span class="text" :class="url.id === playUrl.id?'active':''" @click="changeUrl(url)">{{url.type}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import Loading from '../loading/loading'
  import { prefixStyle } from '../../common/js/dom'

  const progressType = {
    video: 'video',
    volume: 'volume'
  }
  const transform = prefixStyle('transform')
  export default {
    name: 'm-video-player',
    components: {
      Loading,
      Icon
    },
    props: {
      playUrl: {
        type: Object
      },
      videoUrls: {
        type: Array
      },
      currentVideo: {
        type: Object
      }
    },
    data () {
      return {
        video: null,
        openOtherUrl: false,
        videoWaiting: true,
        canPlay: false,
        playStatus: false, // 播放状态 true --> 播放 false---> 暂停
        currentTime: 0,
        percent: 0,
        volumePercent: 0.4, // 默认音量40%
        moveInControls: false, // 是否移动到控制栏
        openVolume: true
      }
    },
    created () {
      this.touch = {}
      this.volumeTouch = {}
    },
    mounted () {
      this.$nextTick(() => {
        this.video = this.$refs.video
        this.openControls()
        this._offset(this.$refs.volumeProgressBar.clientWidth * this.volumePercent, 'volume')
        this.video.volume = this.volumePercent
      })
    },
    methods: {
      changeUrl (url) {
        this.openOtherUrl = false
        if (url.id === this.playUrl.id) {
          return
        }
        this.initVideoStatus()
        this.$emit('changeUrl', url)
      },
      changePlayStatus () {
        if (this.canPlay) {
          this.playStatus = !this.playStatus
        }
      },
      initVideoStatus () {
        this.openOtherUrl = false
        this.videoWaiting = true
      },
      loadstart () {
        console.log('loadstart')
        this.videoWaiting = true
        this.playStatus = false
      },
      canplay () {
        console.log('canplay')
        this.play()
        this.playStatus = true
      },
      waiting () {
        console.log('waiting')
        this.videoWaiting = true
        this.playStatus = false
        this.canPlay = false
      },
      playing () {
        console.log('playing')
        this.videoWaiting = false
        this.playStatus = true
        this.canPlay = true
      },
      // 播放视频
      play () {
        this.video.play()
      },
      // 暂停视频
      pause () {
        this.video.pause()
      },
      // 更新播放时间
      updateTime (e) {
        if (!this.canPlay) {
          return
        }
        if (!this.isMove) {
          this.currentTime = e.target.currentTime
          this.percent = this.currentTime / this.video.duration
        }
      },
      mouseenterControls () {
        clearTimeout(this.closeTimer)
        clearTimeout(this.mousemoveTimer)
        this.moveInControls = true
      },
      mouseleaveControls () {
        this.moveInControls = false
      },
      playerMouseenter () {
        // 打开控制栏
        // 1. 清空closeTimer
        clearTimeout(this.closeTimer)
        clearTimeout(this.mousemoveTimer)
        // 2. 打开控制台
        this.openControls()
      },
      playerMouseleave () {
        this.closeControls()
      },
      playerMousemove () {
        if (!this.moveInControls) {
          this.playerMouseenter()
        }
      },
      // 打开控制栏
      openControls () {
        this.$refs.controls.style.transform = 'translate3d(0, 0, 0)'
        // 鼠标未操作 2 秒后关闭
        this.mousemoveTimer = setTimeout(() => {
          this.closeControls()
        }, 2000)
      },
      // 关闭控制栏
      closeControls () {
        this.closeTimer = setTimeout(() => {
          if (this.$refs.controls) {
            this.$refs.controls.style.transform = 'translate3d(0, 100%, 0)'
          }
        }, 1500)
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
      mousewheelChangeVolume (e) {
        let num = 0.1
        if (e.wheelDelta > 0) {
          // 添加音量 每次加10
          this.volumePercent += num
          if (this.volumePercent + num > 1) {
            this.volumePercent = 1
          } else {
            this.volumePercent += num
          }
        } else {
          // 减少音量 每次减10
          if (this.volumePercent - num < 0) {
            this.volumePercent = 0
          } else {
            this.volumePercent -= num
          }
        }
        this._offset(this.$refs.volumeProgressBar.clientWidth * this.volumePercent, 'volume')
        this.video.volume = this.volumePercent
      },
      closeOrOpenVolume () {
        this.openVolume = !this.openVolume
        if (!this.openVolume) {
          this._offset(0, 'volume')
          this.video.volume = 0
        } else {
          this._offset(this.$refs.volumeProgressBar.clientWidth * this.volumePercent, 'volume')
          this.video.volume = this.volumePercent
        }
      },
      // 滑动条点击
      progressClick (e, type) {
        switch (type) {
          case progressType.video: {
            const rect = this.$refs.progressBar.getBoundingClientRect()
            if (e.pageX < rect.left || e.pageX > rect.right) {
              return
            }
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth, 'video')
            this._triggerPercent('video')
            break
          }
          case progressType.volume: {
            const rect = this.$refs.volumeProgressBar.getBoundingClientRect()
            if (e.pageX < rect.left || e.pageX > rect.right) {
              return
            }
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth, 'volume')
            this._triggerPercent('volume')
            break
          }
        }
      },
      // 滑动条滑动
      progressTouchStart (e, type) {
        switch (type) {
          case progressType.video: {
            this.touch.initiated = true
            this.touch.startX = e.pageX
            this.touch.left = this.$refs.progress.clientWidth
            document.onmousemove = (e) => {
              if (!this.touch.initiated) {
                return
              }
              const deltaX = e.pageX - this.touch.startX
              const offsetWidth = Math.min(this.$refs.progressBar.clientWidth,
                Math.max(0, this.touch.left + deltaX))
              this._offset(offsetWidth, type)
              this.onProgressBarMove()
            }
            document.onmouseup = (e) => {
              this.touch.initiated = false
              this._triggerPercent(type)
              document.onmouseup = null
            }
            break
          }
          case progressType.volume: {
            this.volumeTouch.initiated = true
            this.volumeTouch.startX = e.pageX
            this.volumeTouch.left = this.$refs.volumeProgress.clientWidth
            document.onmousemove = (e) => {
              if (!this.volumeTouch.initiated) {
                return
              }
              const deltaX = e.pageX - this.volumeTouch.startX
              const offsetWidth = Math.min(this.$refs.volumeProgressBar.clientWidth,
                Math.max(0, this.volumeTouch.left + deltaX))
              this._offset(offsetWidth, 'volume')
              this._triggerPercent('volume')
            }
            document.onmouseup = (e) => {
              this.volumeTouch.initiated = false
              document.onmouseup = null
            }
            break
          }
        }
      },
      _offset (offsetWidth, type) {
        switch (type) {
          case progressType.video: {
            this.$refs.progress.style.width = `${offsetWidth}px`
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            break
          }
          case progressType.volume: {
            this.$refs.volumeProgress.style.width = `${offsetWidth}px`
            this.$refs.volumeProgressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            break
          }
        }
      },
      // 歌曲进度条操作
      _triggerPercent (type) {
        switch (type) {
          case progressType.video: {
            const barWidth = this.$refs.progressBar.clientWidth
            this.percent = this.$refs.progress.clientWidth / barWidth
            this.isMove = false
            this.$refs.video.currentTime = this.currentVideo.duration * this.percent
            if (!this.playStatus) {
              this.changePlayStatus()
            }
            break
          }
          case progressType.volume: {
            const barWidth = this.$refs.volumeProgressBar.clientWidth
            this.volumePercent = this.$refs.volumeProgress.clientWidth / barWidth
            if (this.volumePercent > 0) {
              this.openVolume = true
            } else {
              this.openVolume = false
            }
            if (this.video !== undefined) {
              this.video.volume = this.volumePercent
            }
            break
          }
        }
      },
      // 进度条滑动时歌词跟随滑动
      onProgressBarMove () {
        this.isMove = true
        const barWidth = this.$refs.progressBar.clientWidth
        this.percent = this.$refs.progress.clientWidth / barWidth
        this.currentTime = this.currentVideo.duration * this.percent
      }
    },
    watch: {
      playStatus (newValue) {
        if (newValue) {
          // 播放视频
          this.play()
        } else {
          // 暂停视频
          this.pause()
        }
      },
      percent (newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth, 'video')
        }
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .m-video-player-box {
        position: relative;
        width: 100%;
        max-height: 600px;
        background: #000000;
        overflow: hidden;

        .video {
            position: relative;
            width: 100%;
            max-height: 600px;
            outline: none;
            display: block;
        }

        .loading {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }

        .pause-btn-box {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            width: 60px;
            height: 60px;

            .pause-btn {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .btn {
                    color: #FFFFFF;
                }

                .btn:hover {
                    cursor: pointer;
                    color: @player-bar-color;
                }
            }
        }

        .video-controls-box {
            position: absolute;
            width: 100%;
            bottom: 0;
            height: 48px;
            padding: 0 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            background-color: #00000057;
            transform: translate3d(0, 0, 0);
            transition: transform 200ms;

            .play-progress-bar-box {
                width: 100%;
                height: 10px;
                display: flex;
                justify-content: center;
                align-items: center;

                .playing-progress-bar {
                    position: relative;
                    width: 100%;
                    height: 3px;
                    background: #63696e;

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

            .play-progress-bar-box:hover {
                .btn {
                    opacity: 1;
                }
            }

            .play-tools-box {
                width: 100%;
                height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .tools {
                    height: 100%;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    flex-flow: wrap;

                    .btn-box {
                        width: 30px;
                        height: 100%;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;

                        .btn {
                            color: #FFFFFF;
                        }

                        .btn:hover {
                            cursor: pointer;
                            color: @player-bar-color;
                        }
                    }

                    .play-url-btn-box {
                        position: relative;

                        .play-url-btn {
                            position: relative;
                            z-index: 10;
                            height: 20px;
                            width: 40px;
                            font-size: 12px;
                            color: #FFFFFF;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border: 1px solid #FFFFFF;
                            border-radius: 4px;
                        }

                        .play-url-btn:hover {
                            cursor: pointer;
                            color: @player-bar-color;
                            border: 1px solid @player-bar-color;
                        }

                        .other-url-box {
                            height: 130px;
                            width: 100%;
                            position: absolute;
                            bottom: 15px;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            flex-flow: column-reverse;
                            background: #00000040;

                            .url {
                                height: 25px;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                .text {
                                    color: #FFFFFF;
                                }

                                .text:hover {
                                    cursor: pointer;
                                    color: @player-bar-color;
                                }

                                .active {
                                    color: @player-bar-color !important;
                                }
                            }
                        }
                    }
                }

                .left-tools {
                    .video-waiting-tip {
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .text {
                            color: #FFFFFF;
                            font-size: 12px;
                        }
                    }

                    .video-play-time {
                        font-size: 12px;
                        color: #FFFFFF;
                        display: inline-block;

                        .time {
                            width: 30px;
                            display: inline-block;
                            text-align: center;
                        }
                    }
                }

                .right-tools {

                    .volume-box {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 130px;

                        .volume-bar-box {
                            height: 30px;
                            width: 80px;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            .ex-bar {
                                width: 100%;
                                height: 16px;
                                padding: 6px 0;

                                .volume-bar {
                                    position: relative;
                                    width: 100%;
                                    height: 4px;
                                    background: #63696e;
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
                                    opacity: 1;
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
                }
            }
        }
    }
</style>
