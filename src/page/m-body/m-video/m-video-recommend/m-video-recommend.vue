<template>
    <div class="m-video-recommend-box">
        <!-- 最新推荐 -->
        <div class="m-video-recommend">
            <div class="title">最新推荐</div>
            <m-video-list ref="videoList" :videos="allVideo" @toSingerDetail="toSingerDetail" @playVideo='playVideo'
                          v-if="allVideo.length !== 0"/>
            <m-video-list-skeleton v-else/>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { createRecommendVideo } from '../../../../common/js/createReqData'
  import { getRecommendVideo } from '../../../../api/video'
  import { ERR_OK } from '../../../../api/config'
  import MPlayBtn from '../../../../components/m-play-btn/m-play-btn'
  import MVideoListSkeleton from '../../../../components/m-skeleton/m-video-list-skeleton'
  import MVDefLazyImg from '../../../../resources/images/mv_300.png'
  import MVideoList from '../../../../components/m-video-list/m-video-list'

  export default {
    name: 'm-video-recommend',
    components: { MVideoList, MVideoListSkeleton, MPlayBtn, Icon },
    data () {
      return {
        allVideo: []
      }
    },
    created () {
      this._initVideos()
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.$refs.videoList) {
          vm.$refs.videoList.calculationHeight()
        }
      })
    },
    computed: {
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: MVDefLazyImg,
            loading: MVDefLazyImg
          }
        }
      }
    },
    methods: {
      async _initVideos () {
        let reqData = createRecommendVideo('all')
        let res = await getRecommendVideo(reqData)
        if (res.code === ERR_OK) {
          this.allVideo = res.videos
        }
      },
      playVideo (video) {
        this.$emit('playVideo', video)
      },
      toSingerDetail (singer) {
        this.$emit('toSingerDetail', singer)
      }
    }
  }
</script>

<style lang="less">
    @import "../../../../common/css/theme/theme";

    .m-video-recommend-box {
        padding-bottom: 40px;

        .m-video-recommend {
            margin-top: 20px;

            .title {
                font-size: 17px;
                color: #FFFFFF;
            }
        }
    }
</style>
