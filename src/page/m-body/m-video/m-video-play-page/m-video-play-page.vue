<template>
    <div class="m-video-play-page-box">
        <div class="m-video-play-page-content">
            <!-- 视频播放器 -->
            <m-video-player :playUrl="playUrl" :videoUrls="videoUrls" @changeUrl="changeUrl"/>
        </div>
    </div>
</template>

<script>
  import MVideoPlayer from '../../../../components/m-video-player/m-video-player'
  import { getVideoInfoAndOtherVideoData, getVideoPlayUrlData } from '../../../../common/js/requestData'
  import { getVideoInfoAndOtherVideo, getVideoPlayUrl } from '../../../../api/video'
  import { ERR_OK } from '../../../../api/config'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'

  export default {
    name: 'm-video-play-page',
    components: { MVideoPlayer },
    data () {
      return {
        vid: '',
        playUrl: null,
        videoUrls: null,
        otherVideos: null,
        currentVideo: null
      }
    },
    created () {
      this.vid = this.$route.params.videoId
      this.$nextTick(() => {
        this._getVideoInfoAndOtherVideo()
      })
    },
    methods: {
      async _getVideoInfoAndOtherVideo () {
        let data = getVideoInfoAndOtherVideoData(this.vid)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getVideoInfoAndOtherVideo(reqData, this.vid)
        console.log(res)
        if (res.code === ERR_OK) {
          this.otherVideos = res.data.otherVideos
          this.currentVideo = res.data.videoInfo
        }
        this._getVideoPlayUrl()
      },
      async _getVideoPlayUrl () {
        let data = getVideoPlayUrlData(this.vid)
        let res = await getVideoPlayUrl(data, this.vid)
        console.log(res)
        if (res.code === ERR_OK) {
          this.videoUrls = res.videoUrl.urls
          this.playUrl = res.videoUrl.defaultUrl
        }
      },
      changeUrl (url) {
        this.playUrl = null
        this.$nextTick(() => {
          this.playUrl = url
        })
      }
    }
  }
</script>

<style lang="less">
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
        }

        .m-video-play-page-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

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
