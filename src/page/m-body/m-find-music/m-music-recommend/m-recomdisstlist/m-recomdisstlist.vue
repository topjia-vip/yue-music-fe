<template>
    <div class="m-recomdisstlist-box">
        <Title :title="'推荐歌单'" @moreClick="_toDisstPage"/>
        <!--歌单展示-->
        <div class="m-playlist-box">
            <ul>
                <li class="item" v-for="(item,index) in recomPlayList" :key="index">
                    <div class="img-box">
                        <div class="visitnum-box">
                            <div class="visitnum">
                                <Icon type="ios-headset"/>
                                <span>{{handleVisitNum(item.visitnum)}}</span>
                            </div>
                        </div>
                        <img ondragstart="return false" class="item-img" v-lazy="handleLazyImage(item.disstLogo)"
                             :alt="item.disstName"
                             :key="item.disstLogo"
                             @click="songListDetail(item)">
                        <div class="play-icon" @click="playDisst(index)">
                            <Icon class="icon" type="ios-play" size="18"/>
                        </div>
                    </div>
                    <div class="item-name" @click="songListDetail(item)">{{item.disstName}}</div>
                </li>
            </ul>
        </div>
        <m-disst-play-loading ref="disstLoading"/>
    </div>
</template>

<script>

  import Title from '../../../../../components/m-title/m-title'
  import { Icon } from 'view-design'
  import { _normalizeSongs, scrollToTop } from '../../../../../common/js/util'
  import { mapActions, mapMutations } from 'vuex'
  import { disstDetailSongList } from '../../../../../api/disst'
  import { ERR_OK } from '../../../../../api/config'
  import { createDisstDetailData } from '../../../../../common/js/createReqData'
  import MDisstPlayLoading from '../../../../../components/m-disst-play-loading/m-disst-play-loading'
  import DisstDefLazyImg from '../../../../../resources/images/album_300.png'

  export default {
    name: 'm-recomdisstlist',
    components: { MDisstPlayLoading, Title, Icon },
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
      _toDisstPage () {
        let router = '/findMusic/dissts'
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
          scrollToTop('m-find-music-box')
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
      ]),
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    }
  }
</script>

<style lang="less">
    .m-recomdisstlist-box {
        position: relative;
        width: 100%;
        min-height: 500px;

        .m-playlist-box {
            margin-top: 10px;
            margin-right: -15px;

            .item {
                list-style: none;
                padding: 0 15px 40px 0;
                width: 20%;
                display: inline-block;

                .img-box {
                    position: relative;

                    .visitnum-box {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 100%;
                        height: 20px;
                        line-height: 20px;
                        color: #FFFFFF;
                        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                        background-image: linear-gradient(to right, #ffffff00, #000000a6);

                        .visitnum {
                            float: right;

                            span {
                                margin-right: 5px;
                                font-size: 12px;
                            }
                        }
                    }

                    .item-img {
                        cursor: pointer;
                        display: block;
                        width: 100%;
                        height: 100%;
                    }

                    .play-icon {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        width: 30px;
                        height: 30px;
                        color: #c2bebee3;
                        background: #00000059;
                        text-align: center;
                        border-radius: 50%;
                        border: 1px solid #FFFFFF;
                        margin: 0 10px 10px 0;
                        opacity: 0;
                        z-index: -1;
                        transition: 0.5s;

                        .icon {
                            position: relative;
                            top: 5px;
                            left: 1px;
                        }
                    }

                    .play-icon:hover {
                        background: #000000;
                        color: #FFFFFF;
                    }
                }

                .img-box:hover {
                    .play-icon {
                        cursor: pointer;
                        opacity: 1;
                        z-index: 10;
                    }
                }

                .item-name {
                    height: 40px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    color: var(--font-base-color);
                    font-size: 12px;
                    padding-top: 5px;
                }

                .item-name:hover {
                    cursor: pointer;
                    color: var(--font-active-color);
                }
            }
        }
    }
</style>
