<template>
    <div class="m-recommend-box">
        <div class="info-page" v-if="isShow && !isError">
            <m-focus ref="focus" :focus="focus" v-if="focus !== null"/>
            <m-recommend-focus-skeleton v-else/>
            <div class="content-box" v-if="playlist !== null && newSongList !== null">
                <m-recomdisstlist :recom-play-list="playlist"/>
                <m-newsonglist :new-song-list="newSongList"/>
            </div>
            <m-recommend-disst-skeleton v-else/>
        </div>
        <m-recommend-skeleton v-if="!isShow && !isError"/>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </div>
</template>

<script>

  import MFocus from './m-focus/m-focus'
  import MRecomdisstlist from './m-recomdisstlist/m-recomdisstlist'
  import { getFocus, getRecommendPlayListAndNewMusic } from '../../../../api/recommend'
  import { ERR_OK } from '../../../../api/config'
  import Loading from '../../../../components/loading/loading'
  import MNewsonglist from './m-newsongs/m-newsonglist'
  import { _normalizeSongs, sleep } from '../../../../common/js/util'
  import { getFocusData, getPlayListAndNewMusicData } from '../../../../common/js/requestData'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import MTips from '../../../../components/m-tips/m-tips'
  import MErrorPage from '../../../../components/m-error-page/m-error-page'
  import MRecommendSkeleton from '../../../../components/m-skeleton/m-recommend-skeleton'
  import MRecommendDisstSkeleton from '../../../../components/m-skeleton/m-recommend-disst-skeleton'
  import MRecommendFocusSkeleton from '../../../../components/m-skeleton/m-recommend-focus-skeleton'

  export default {
    name: 'm-recommend',
    components: {
      MRecommendFocusSkeleton,
      MRecommendDisstSkeleton,
      MRecommendSkeleton,
      MErrorPage,
      MTips,
      MNewsonglist,
      Loading,
      MRecomdisstlist,
      MFocus
    },
    data () {
      return {
        playlist: null,
        newSongList: null,
        focus: null,
        isShow: false,
        isError: false
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.isShow) {
          vm.$refs.focus.$refs.slider.reload()
          vm.$refs.focus.$refs.slider.autoPlay()
        }
      })
    },
    beforeRouteLeave (to, from, next) {
      this.$refs.focus.$refs.slider.stopPlay()
      next()
    },
    created () {
      this._getRecommendPlayListAndNewMusicAndFocus()
    },
    methods: {
      async _getRecommendPlayListAndNewMusicAndFocus () {
        // focus
        let focusData = getFocusData()
        let focusSign = getSign(focusData)
        let reqDataFocus = createReqData(focusSign, focusData)
        let resFocus = await getFocus(reqDataFocus)
        for (let i = 0; i < 5; i++) {
          if (resFocus.code !== ERR_OK) {
            sleep(500)
            resFocus = await getFocus(reqDataFocus)
          } else {
            break
          }
        }
        if (resFocus.code !== ERR_OK) {
          this.isError = true
          return
        }
        this.focus = resFocus.data.focus
        this.isShow = true
        // 新歌单和歌曲
        let data = getPlayListAndNewMusicData()
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getRecommendPlayListAndNewMusic(reqData)
        for (let i = 0; i < 5; i++) {
          // 5次重试机会
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await getRecommendPlayListAndNewMusic(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        this.playlist = res.data.playlist.slice(0, 10)
        this.newSongList = _normalizeSongs(res.data.newSongList.slice(0, 10))
      },
      refresh () {
        this.isError = false
        this._getRecommendPlayListAndNewMusicAndFocus()
      }
    }
  }
</script>

<style lang="less">
    .m-recommend-box {
        position: relative;
        padding-top: 20px;
        max-width: 1040px;
        margin: 0 auto;
        width: 100%;
        height: 100%;

        .content-box {
            position: relative;
        }

        .loading {
            position: relative;
            top: 100px;
        }
    }
</style>
