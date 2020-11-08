<template>
    <div class="m-video-rank-box">
        <div class="m-video-rank">
            <!--头部-->
            <div class="mv-rank-header" v-if="mvRankInfo !== null">
                <!--图片-->
                <div class="rank-image-box">
                    <img ondragstart="return false" class="image" :src="mvRankInfo.frontPicUrl"/>
                    <div class="rank-intro">
                        <Tooltip max-width="600" placement="bottom-start">
                            <Icon class="info icon" type="ios-alert-outline" size="25"/>
                            <div slot="content">
                                <p v-html="mvRankInfo.intro"></p>
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div class="rank-info">
                    <div class="rank-title">
                        <span>{{mvRankInfo.topTitle}}</span>
                    </div>
                </div>
            </div>
            <!--骨架屏-->
            <m-video-rank-header-skeleton v-else/>
            <!-- tag -->
            <div class="rank-tags-box">
                <div class="rank-tags">
                    <div class="tag-item">
                        <span class="text" :class="areaType === 0?'active':''" @click="selectAreaType(0)">总榜</span>
                    </div>
                    <div class="tag-item">
                        <span class="text" :class="areaType === 1?'active':''" @click="selectAreaType(1)">内地</span>
                    </div>
                    <div class="tag-item">
                        <span class="text" :class="areaType === 2?'active':''" @click="selectAreaType(2)">港台</span>
                    </div>
                    <div class="tag-item">
                        <span class="text" :class="areaType === 3?'active':''" @click="selectAreaType(3)">欧美</span>
                    </div>
                    <div class="tag-item">
                        <span class="text" :class="areaType === 4?'active':''" @click="selectAreaType(4)">韩国</span>
                    </div>
                    <div class="tag-item">
                        <span class="text" :class="areaType === 5?'active':''" @click="selectAreaType(5)">日本</span>
                    </div>
                    <div class="active-line-box" ref="activeLine">
                        <div class="active-line"></div>
                    </div>
                </div>
            </div>
            <m-video-list :videos="mvRankData" @toSingerDetail="toSingerDetail" @playVideo="playVideo"
                          v-if="mvRankData !== null"
                          ref="videos"/>
            <m-video-list-skeleton v-else/>
        </div>
    </div>
</template>

<script>
  import { Tooltip, Icon } from 'view-design'
  import { getMVRankListData, getRankInfoData } from '../../../../common/js/requestData'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import { getMvRankData, getMvRankInfo } from '../../../../api/video'
  import MPlayBtn from '../../../../components/m-play-btn/m-play-btn'
  import MVideoRankHeaderSkeleton from '../../../../components/m-skeleton/m-video-rank-header-skeleton'
  import MVideoRankListSkeleton from '../../../../components/m-skeleton/m-video-rank-list-skeleton'
  import MVideoList from '../../../../components/m-video-list/m-video-list'
  import MVideoListSkeleton from '../../../../components/m-skeleton/m-video-list-skeleton'

  export default {
    name: 'm-video-rank',
    components: {
      MVideoListSkeleton,
      MVideoList,
      MVideoRankListSkeleton,
      MVideoRankHeaderSkeleton,
      MPlayBtn,
      Tooltip,
      Icon
    },
    data () {
      return {
        mvRankInfo: null,
        mvRankData: null,
        areaType: 0
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.$refs.videos) {
          vm.$refs.videos.calculationHeight()
        }
      })
    },
    created () {
      this._initVideoRank()
    },
    computed: {
      handleTime () {
        return (time) => {
          let date = new Date(parseInt(time + '000'))
          let year = date.getFullYear()
          let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
          let day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
          return `创建时间：${year}-${month}-${day}`
        }
      }
    },
    methods: {
      async _initVideoRank () {
        // 获取排行榜信息
        let data = getRankInfoData()
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getMvRankInfo(reqData)
        this.$nextTick(() => {
          this.mvRankInfo = res.mvRankInfo
        })
        this._getMvRankList()
      },
      async _getMvRankList () {
        this.mvRankData = null
        // 获取排行榜数据
        let data = getMVRankListData(this.areaType)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getMvRankData(reqData)
        this.$nextTick(() => {
          this.mvRankData = res.mvRankData
        })
      },
      playVideo (video) {
        this.$emit('playVideo', video)
      },
      selectAreaType (type) {
        this.areaType = type
        this.changeActiveLineStyle(type)
        this._getMvRankList()
      },
      changeActiveLineStyle (type) {
        this.$refs.activeLine.style.transform = `translate3d(${type * 100}%, 0, 0)`
      },
      toSingerDetail (singer) {
        this.$emit('toSingerDetail', singer)
      }
    }
  }
</script>

<style lang="less">
    @import "../../../../common/css/theme/theme";

    .m-video-rank-box {
        margin: 20px auto 0 auto;
        padding-bottom: 40px;

        .m-video-rank {
            width: 100%;

            .mv-rank-header {
                height: 200px;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;

                .rank-image-box {
                    position: relative;
                    width: 200px;
                    height: 200px;

                    .image {
                        width: 100%;
                        height: 100%;
                        display: block;
                        border-radius: 10px;
                    }

                    .rank-intro {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        margin: 0 0 6px 6px;
                        width: 200%;

                        .info {
                            cursor: pointer;
                            color: #FFFFFF;
                        }
                    }
                }

                .rank-info {
                    height: 100%;
                    margin-left: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;

                    .rank-title {
                        font-weight: bold;
                        font-size: 30px;
                        color: #FFFFFF;
                    }
                }
            }

            .rank-tags-box {
                height: 60px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .rank-tags {
                    position: relative;
                    height: 100%;
                    padding: 10px 0;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    .tag-item {
                        width: 80px;

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

                    .active-line-box {
                        position: absolute;
                        left: 0;
                        bottom: 10px;
                        height: 4px;
                        width: 80px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        transform: translate3d(0, 0, 0);
                        transition: transform 200ms;

                        .active-line {
                            width: 28px;
                            height: 100%;
                            border-radius: 5px;
                            background-color: @player-bar-color;
                        }
                    }
                }
            }
        }
    }
</style>
