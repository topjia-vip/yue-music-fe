<template>
    <div class="m-rank-box">
        <div class="info-page" v-if="isShow && !isError">
            <div class="rank-1" v-if="isShow">
                <h2 class="title">{{topList[0].groupName}}</h2>
                <div class="rank-1-content">
                    <ul>
                        <li ref="rankItem" class="rank-1-item" v-for="(top) in topList[0].topList" :key="top.topId"
                            @click="toTopListPage(top)">
                            <div class="rank-bottom"></div>
                            <div class="rank-1-box">
                                <div class="base-box img-box">
                                    <img ondragstart="return false" class="top-img" v-lazy="top.frontPicUrl"
                                         :alt="top.topTitle" :key="top.frontPicUrl">
                                    <div class="listenNum-box">
                                        <Icon type="ios-headset"/>
                                        <div>{{handleVisitNum(top.listenNum)}}</div>
                                    </div>
                                    <div class="img-mask"></div>
                                    <m-play-btn class="play-icon-box" :font-size="50" @play="playRankList(top)"/>
                                </div>
                                <div ref="rankSong" class="rank-song">
                                    <h1 class="top-title">{{top.topTitle}}</h1>
                                    <ul>
                                        <li class="rank-song-item" v-for="(rankSong) in top.rankSong"
                                            :key="rankSong.songId">
                                            <div class="rank-num">{{rankSong.rank}}、</div>
                                            <div class="rank-song-info" v-html="rankSong.title+'-'+rankSong.singerName">
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="other-rank" v-if="isShow">
                <div class="rank" v-for="(rank,index) in topList" v-if="index !== 0" :key="index">
                    <h2 class="title">{{rank.groupName}}</h2>
                    <div class="ohter-rank-content">
                        <ul>
                            <li class="rank-item" v-for="(top) in rank.topList" :key="top.topId"
                                @click="toTopListPage(top)">
                                <div class="rank-bottom"></div>
                                <div class="base-box other-top-img-box">
                                    <img ondragstart="return false" class="ohter-top-img" v-lazy="top.frontPicUrl"
                                         :alt="top.topTitle" :key="top.frontPicUrl">
                                    <div class="listenNum-box">
                                        <Icon type="ios-headset"/>
                                        <div>{{handleVisitNum(top.listenNum)}}</div>
                                    </div>
                                    <div class="img-mask"></div>
                                    <m-play-btn class="play-icon-box" :font-size="60" @play="playRankList(rank)"/>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <m-disst-play-loading ref="rankLoading"/>
        </div>
        <m-rank-skeleton v-if="!isShow && !isError"/>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { initTopDetail, topListInfo } from '../../../../api/rank'
  import { ERR_OK } from '../../../../api/config'
  import elementResizeDetectorMaker from 'element-resize-detector'
  import Loading from '../../../../components/loading/loading'
  import { getRankInfoData, getTopListData } from '../../../../common/js/requestData'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import { mapActions, mapMutations } from 'vuex'
  import { _normalizeSongs, sleep } from '../../../../common/js/util'
  import MDisstPlayLoading from '../../../../components/m-disst-play-loading/m-disst-play-loading'
  import MPlayBtn from '../../../../components/m-play-btn/m-play-btn'
  import MErrorPage from '../../../../components/m-error-page/m-error-page'
  import { dissList } from '../../../../api/disst'
  import MRankSkeleton from '../../../../components/m-skeleton/m-rank-skeleton'

  export default {
    name: 'm-rank',
    components: {
      MRankSkeleton,
      MErrorPage,
      MPlayBtn,
      MDisstPlayLoading,
      Loading,
      Icon
    },
    data () {
      return {
        topList: {},
        topSongList: [],
        isShow: false,
        isError: false
      }
    },
    created () {
      this.$nextTick(() => {
        this._initRankData()
      })
    },
    updated () {
      this.$nextTick(() => {
        let erd = elementResizeDetectorMaker()
        erd.listenTo(document.getElementsByClassName('rank-1-item')[0], function (element) {
          let width = element.offsetWidth
          let imgBoxs = document.getElementsByClassName('rank-song')
          for (let i = 0; i < imgBoxs.length; i++) {
            imgBoxs[i].style.width = `${width - 180}px`
          }
        })
      })
    },
    methods: {
      async _initRankData () {
        let data = getRankInfoData()
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await topListInfo(reqData)
        for (let i = 0; i < 5; i++) {
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await dissList(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        sleep(200)
        this.topList = res.toplist
        this.isShow = true
      },
      refresh () {
        this.isError = false
        this._initRankData()
      },
      handleVisitNum (number) {
        if (number >= 10000) {
          const num = number / 10000
          return `${Math.round(num * 10) / 10}万`
        } else {
          return number
        }
      },
      toTopListPage (top) {
        let router = `/rank/${top.topId}`
        if (this.$route.path !== router) {
          this.setCurrentTop(top)
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      // 播放整个列表
      playRankList (rank) {
        this.$refs.rankLoading.openLoading()
        let data = getTopListData(rank.topId, rank.period)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        initTopDetail(reqData).then(res => {
          if (res.code === ERR_OK) {
            this.topSongList = _normalizeSongs(res.topDetail.top_song_list)
            this.selectPlay(
              {
                list: this.topSongList,
                index: 0
              }
            )
          }
          this.$refs.rankLoading.closeLoading()
        })
      },
      ...mapActions([
        'selectPlay',
        'insertSong',
        'addToNext'
      ]),
      ...mapMutations({
        setCurrentTop: 'SET_CURRENT_TOP',
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    }
  }
</script>

<style lang="less">
    .m-rank-box {
        position: relative;
        padding-top: 20px;
        max-width: 1040px;
        margin: 0 auto;
        width: 100%;
        height: 100%;

        .title {
            color: var(--font-base-color);
        }

        .top-img {
            display: block;
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }

        .listenNum-box {
            position: absolute;
            bottom: 0;
            left: 0;
            font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
            padding: 2px 8px;
            background: #000000;
            border-radius: 13px;
            margin: 0 0 4px 4px;
            color: #FFFFFF;
            line-height: 22px;
            opacity: 1;
            transition: opacity 300ms;

            div {
                font-size: 12px;
                display: inline-block;
            }
        }

        .img-mask {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            background: #2828287a;
            border-radius: 9px;
            opacity: 0;
            z-index: 10;
            transition: opacity 300ms;
        }

        .play-icon-box {
            z-index: 11;
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(.7);
            transition: transform 300ms, opacity 300ms;
        }

        .base-box:hover {
            .listenNum-box {
                opacity: 0;
            }

            .img-mask {
                opacity: 1;
            }

            .play-icon-box {
                opacity: 1;
                transform: translate3d(0, 0, 0) scale(1);
            }
        }

        .rank-1 {
            .rank-1-content {
                margin-right: -2%;

                .rank-1-item {
                    position: relative;
                    width: 48%;
                    list-style: none;
                    height: 150px;
                    cursor: pointer;
                    display: inline-block;
                    margin-top: 20px;
                    margin-right: 2%;

                    .rank-1-box {
                        top: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 6;
                        background: var(--rank-background-color);
                        border-radius: 10px;
                        position: relative;
                        transform: translateY(0px);
                        transition: transform 200ms;

                        .img-box {
                            position: relative;
                            float: left;
                        }

                        .rank-song {
                            float: left;
                            height: 150px;
                            padding: 20px 15px;

                            .top-title {
                                font-size: 17px;
                                color: var(--font-base-color);
                                font-weight: normal;
                            }

                            .rank-song-item {
                                margin-top: 10px;
                                list-style: none;
                                color: var(--font-tow-color);
                                font-size: 12px;

                                .rank-num {
                                    float: left;
                                    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                                }

                                .rank-song-info {
                                    overflow: hidden;
                                    white-space: nowrap;
                                    text-overflow: ellipsis;
                                }
                            }
                        }
                    }

                    .rank-1-box:hover {
                        transform: translateY(-10px);
                    }

                    .rank-bottom {
                        cursor: pointer;
                        position: absolute;
                        height: 10px;
                        width: 100%;
                        bottom: 0;
                        z-index: 5;
                    }

                    .rank-bottom:hover + .rank-1-box {
                        transform: translateY(-10px);
                    }
                }

                @media (min-width: 1250px) {
                    .rank-1-item {
                        width: 31%;
                    }
                }
            }
        }

        .other-rank {
            .rank {
                margin-top: 20px;
                margin-right: -25px;
                margin-bottom: 20px;

                .rank-item {
                    position: relative;
                    width: 25%;
                    margin-top: 20px;
                    list-style: none;
                    display: inline-block;
                    padding: 0 25px 0 0;

                    .other-top-img-box {
                        cursor: pointer;
                        position: relative;
                        top: 0;
                        z-index: 6;
                        transform: translateY(0px);
                        transition: transform 200ms;

                        .ohter-top-img {
                            display: block;
                            width: auto;
                            height: auto;
                            max-width: 100%;
                            max-height: 100%;
                            border-radius: 10px;
                        }
                    }

                    .other-top-img-box:hover {
                        transform: translateY(-10px);
                    }

                    .rank-bottom {
                        cursor: pointer;
                        position: absolute;
                        height: 10px;
                        width: 100%;
                        bottom: 0;
                        z-index: 5;
                    }

                    .rank-bottom:hover + .other-top-img-box {
                        transform: translateY(-10px);
                    }
                }

                @media (min-width: 1250px) {
                    .rank-item {
                        width: 20%;
                    }
                }
            }
        }
    }
</style>
