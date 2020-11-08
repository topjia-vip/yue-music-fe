<template>
    <Content class="m-video-play-page-box" ref="videoPageBox">
        <m-slider ref="wrapper">
            <div class="m-video-play-page-content" ref="scroll" @scroll="scroll">
                <!-- 视频播放器 -->
                <m-video-player
                        ref="video"
                        :currentVideo='currentVideo'
                        :playUrl="playUrl"
                        :videoUrls="videoUrls"
                        @changeUrl="changeUrl"
                        @hidden="hidden"
                        @scrollY="scrollY"
                />
                <div class="info-box">
                    <!-- MV基本信息 -->
                    <div class="current-video-info-box" v-if="currentVideo">
                        <div class="video-name">
                            <span class="text">{{currentVideo.mvTitle}}</span>
                        </div>
                        <div class="video-other-info-box">
                            <div class="other-info singer-box">
                                演唱：
                                <div class="singer-name-box" v-for="(singer,singerIndex) in currentVideo.singers"
                                     :key="singerIndex">
                                    <span class="singer-name" v-html="singer.singerName"
                                          @click="toSingerDetail(singer)"/>
                                    <span class="division"
                                          v-if="singerIndex !== currentVideo.singers.length - 1">/</span>
                                </div>
                            </div>
                            <div class="other-info visitNum">
                                <span>{{handleVisitNum(currentVideo.listenNum)}}</span>
                            </div>
                            <div class="other-info mv-create-time">{{handleTime(currentVideo.createTime)}}</div>
                        </div>
                    </div>
                    <!-- 操作按钮 -->
                    <div class="video-tools-box">

                    </div>
                    <!-- 相关MV -->
                    <div class="other-video-box" v-if="otherVideos && otherVideos.length !== 0">
                        <m-video-list :videos="otherVideos" @toSingerDetail="toSingerDetail" @playVideo="playVideo"/>
                    </div>
                    <!-- 评论 -->
                </div>
            </div>
        </m-slider>
        <scroll-top v-if="showToTop" @toTop="toTop"/>
    </Content>
</template>

<script>
  import { Content } from 'view-design'
  import MVideoPlayer from '../../../../components/m-video-player/m-video-player'
  import { getVideoInfoAndOtherVideoData, getVideoPlayUrlData } from '../../../../common/js/requestData'
  import { getVideoInfoAndOtherVideo, getVideoPlayUrl } from '../../../../api/video'
  import { ERR_OK } from '../../../../api/config'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import MVideoList from '../../../../components/m-video-list/m-video-list'
  import MSlider from '../../../../components/m-slider/m-slider'
  import { mapMutations } from 'vuex'
  import ScrollTop from '../../../../components/scrollTop/scroll-top'
  import { timeOut } from '../../../../common/js/config'

  export default {
    name: 'm-video-play-page',
    components: { ScrollTop, MSlider, MVideoList, MVideoPlayer, Content },
    data () {
      return {
        vid: '',
        playUrl: null,
        videoUrls: null,
        otherVideos: null,
        currentVideo: null,
        showToTop: false,
        screenHeight: document.body.clientHeight
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$refs.video.initVideoStatus()
      next()
    },
    created () {
      this.vid = this.$route.params.videoId
      this.$nextTick(() => {
        this._getVideoInfoAndOtherVideo()
      })
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.screenHeight = window.innerHeight
      })
      this.$refs.videoPageBox.$el.style.height = `${window.innerHeight - 102.1}px`
    },
    computed: {
      handleTime () {
        return (time) => {
          if (isNaN(time)) {
            return `创建时间：${time}`
          }
          let timeInt = parseInt(time + '000')
          let date = new Date(timeInt)
          let year = date.getFullYear()
          let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
          let day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
          return `创建时间：${year}-${month}-${day}`
        }
      }
    },
    methods: {
      async _getVideoInfoAndOtherVideo () {
        this.initStatus()
        let data = getVideoInfoAndOtherVideoData(this.vid)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getVideoInfoAndOtherVideo(reqData, this.vid)
        if (res.code === ERR_OK) {
          this.otherVideos = res.data.otherVideos
          this.currentVideo = res.data.videoInfo
        }
        this._getVideoPlayUrl()
      },
      async _getVideoPlayUrl () {
        let data = getVideoPlayUrlData(this.vid)
        let res = await getVideoPlayUrl(data, this.vid)
        if (res.code === ERR_OK) {
          this.videoUrls = res.videoUrl.urls
          this.playUrl = res.videoUrl.defaultUrl
        }
      },
      initStatus () {
        this.playUrl = null
        this.videoUrls = null
        this.otherVideos = null
        this.currentVideo = null
      },
      hidden () {
        this.$refs.scroll.style.overflowY = 'hidden'
        this.$refs.scroll.style.paddingRight = '8px'
      },
      scrollY () {
        this.$refs.scroll.style.overflowY = 'scroll'
        this.$refs.scroll.style.paddingRight = '0'
      },
      toTop () {
        this.$refs.wrapper.scrollToTop(this.$refs.scroll, timeOut)
      },
      scroll () {
        let scrollTop = this.$refs.scroll.scrollTop
        if (scrollTop > 100) {
          this.showToTop = true
        } else {
          this.showToTop = false
        }
        // 判断是否可进入/退出画中画模式
        if (!this.$refs.video.smallMode) {
          if (scrollTop >= this.$refs.video.$el.clientHeight) {
            // 进入画中画模式
            this.$nextTick(() => {
              this.$refs.video.small()
            })
          }
        } else {
          if (scrollTop <= 50) {
            // 进入画中画模式
            this.$nextTick(() => {
              this.$refs.video.full()
            })
          }
        }
      },
      changeUrl (url) {
        this.playUrl = null
        this.$nextTick(() => {
          this.playUrl = url
        })
      },
      handleVisitNum (number) {
        if (number >= 10000) {
          const num = number / 10000
          return `${Math.round(num * 10) / 10}万次观看`
        } else {
          return number
        }
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
      playVideo (video) {
        let router = `/video/${video.vid}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    },
    watch: {
      screenHeight () {
        this.$refs.videoPageBox.$el.style.height = `${window.innerHeight - 102.1}px`
      },
      '$route' () {
        this.vid = this.$route.params.videoId
        this._getVideoInfoAndOtherVideo()
        this.toTop()
      }
    }
  }
</script>

<style lang="less">
    @import "../../../../common/css/theme/theme";

    .m-video-play-page-box {
        position: relative;
        z-index: 0;
        user-select: none;
        background: #16181C;
        min-width: 820px;
        width: 100%;
        overflow: hidden;

        ::selection {
            background: #d3d3d3;
            color: #ffffff;
        }

        .m-video-play-page-content {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;

            .info-box {
                padding: 20px;

                .current-video-info-box {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-flow: column;

                    .video-name {
                        padding: 5px 0;
                        color: #FFFFFF;
                    }

                    .video-other-info-box {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        padding: 5px 0;

                        .other-info {
                            margin-right: 10px;
                            font-size: 12px;
                            color: #616162;
                        }

                        .singer-box {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;

                            .singer-name {
                                color: #8e8e8f;
                            }

                            .singer-name:hover {
                                cursor: pointer;
                                color: @player-bar-color;
                            }
                        }
                    }
                }

                .video-tools-box {

                }

                .other-video-box {
                    height: 100%;
                }
            }
        }

        .m-video-play-page-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        // 火狐
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;

        .m-video-play-page-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-video-play-page-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-video-play-page-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-video-play-page-content::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .m-video-play-page-content::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }
    }
</style>
