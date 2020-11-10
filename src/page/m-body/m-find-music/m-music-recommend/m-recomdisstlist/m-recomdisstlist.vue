<template>
    <div class="m-recomdisstlist-box">
        <!--歌单展示-->
        <m-disst-list @songListDetail="songListDetail" @playDisst="playDisst" :dissts="recomPlayList"/>
        <m-disst-play-loading ref="disstLoading"/>
    </div>
</template>

<script>

  import { _normalizeSongs } from '../../../../../common/js/util'
  import { mapActions } from 'vuex'
  import { disstDetailSongList } from '../../../../../api/disst'
  import { ERR_OK } from '../../../../../api/config'
  import { createDisstDetailData } from '../../../../../common/js/createReqData'
  import MDisstPlayLoading from '../../../../../components/m-disst-play-loading/m-disst-play-loading'
  import DisstDefLazyImg from '../../../../../resources/images/album_300.png'
  import MDisstList from '../../m-dissts/m-disst-list/m-disst-list'

  export default {
    name: 'm-recomdisstlist',
    components: { MDisstList, MDisstPlayLoading },
    props: {
      recomPlayList: {
        type: Array
      }
    },
    computed: {
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: DisstDefLazyImg,
            loading: DisstDefLazyImg
          }
        }
      }
    },
    methods: {
      handleVisitNum (number) {
        if (number >= 10000) {
          const num = number / 10000
          return `${Math.round(num * 10) / 10}万`
        } else {
          return number
        }
      },
      songListDetail (songList) {
        let router = `/disst/${songList.disstId}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      playDisst (index) {
        let disst = this.recomPlayList[index]
        if (this.disstId !== disst.disstId) {
          if (disst.songlist === null) {
            this.$refs.disstLoading.openLoading()
            let reqData = createDisstDetailData(disst.disstId)
            disstDetailSongList(reqData).then(res => {
              if (res.code === ERR_OK) {
                this.recomPlayList[index].songlist = _normalizeSongs(res.songs)
              }
              this.playDisstSong(this.recomPlayList[index])
              this.$refs.disstLoading.closeLoading()
            })
          } else {
            this.playDisstSong(disst)
          }
        }
      },
      // 播放整个列表
      playDisstSong (disst) {
        this.selectPlay(
          {
            list: disst.songlist,
            index: 0
          }
        )
      },
      ...mapActions([
        'selectPlay'
      ])
    }
  }
</script>

<style lang="less">
    .m-recomdisstlist-box {
        position: relative;
        width: 100%;
        min-height: 500px;
    }
</style>
