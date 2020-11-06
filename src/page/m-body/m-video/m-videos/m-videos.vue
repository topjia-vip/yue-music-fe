<template>
    <div class="m-videos-box">
        <!--标签栏-->
        <div class="m-videos-tags-box" v-if="tags !== null">
            <div class="tags area-tags">
                <div class="tag" :class="areaId+'' === tag.id?'select':''" v-for="(tag,index) in tags.area"
                     :key="index"
                     @click="selectTag(tag.id,'area')"
                >
                    <div class="tag-text">{{tag.name}}</div>
                </div>
            </div>
            <div class="tags version-tags">
                <div class="tag" :class="versionId+'' === tag.id?'select':''" v-for="(tag,index) in tags.version"
                     :key="index"
                     @click="selectTag(tag.id,'version')"
                >
                    <div class="tag-text">{{tag.name}}</div>
                </div>
            </div>
        </div>
        <m-videos-header-skeleton v-else/>
        <!--title-->
        <div class="m-videos-title-box">
            <div class="title">
                <div class="title-text">全部MV</div>
            </div>
            <div class="order-box">
                <div class="order new" :class="order === 1?'select':''" @click="selectOrder(1)">最新</div>
                <div class="order hot" :class="order === 0?'select':''" @click="selectOrder(0)">最热</div>
            </div>
        </div>
        <!--视频列表-->
        <m-video-list :videos="videos" @toSingerDetail="toSingerDetail" v-if="videos !== null"/>
        <m-video-list-skeleton v-else/>
        <div class="max-videos" v-if="!hasMoreVideos">
            <span class="tip">没有更多视频啦~~</span>
        </div>
    </div>
</template>

<script>
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import { getVideos, getVideoTags } from '../../../../api/video'
  import { getVideosData, getVideosTags } from '../../../../common/js/requestData'
  import { ERR_OK } from '../../../../api/config'
  import MVideoList from '../../../../components/m-video-list/m-video-list'
  import MVideoListSkeleton from '../../../../components/m-skeleton/m-video-list-skeleton'
  import MVideosHeaderSkeleton from '../../../../components/m-skeleton/m-videos-header-skeleton'

  const PAGE_SIZE = 50
  export default {
    name: 'm-videos',
    components: { MVideosHeaderSkeleton, MVideoListSkeleton, MVideoList },
    props: {
      scrollTop: {
        type: Number
      },
      scrollHeight: {
        type: Number
      },
      clientHeight: {
        type: Number
      }
    },
    data () {
      return {
        currentPage: 1,
        areaId: 15,
        versionId: 7,
        order: 1,
        start: 0,
        tags: null,
        videos: null,
        hasMoreVideos: true
      }
    },
    created () {
      this._initVideos()
    },
    methods: {
      async _initVideos () {
        let data = getVideosTags()
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getVideoTags(reqData)
        if (res.code === ERR_OK) {
          this.tags = res.videoTags
        }
        this._getVideos()
      },
      async _getVideos () {
        if (!this.hasMoreVideos) {
          return
        }
        let data = getVideosData(this.start, PAGE_SIZE, parseInt(this.areaId), parseInt(this.versionId), this.order)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getVideos(reqData)
        if (res.code === ERR_OK) {
          if (res.videos.length === 0) {
            // 没有更多视频
            this.hasMoreVideos = false
            return
          }
          if (this.start === 0) {
            // 第一次获取
            this.videos = res.videos
            this.start = this.videos.length
          } else {
            // 下拉获取
            this.videos = this.videos.concat(res.videos)
            this.start += this.videos.length
          }
        }
      },
      selectTag (id, type) {
        switch (type) {
          case 'area': {
            this.areaId = id
            break
          }
          case 'version': {
            this.versionId = id
            break
          }
        }
        this.initStatus()
        this._getVideos()
      },
      selectOrder (order) {
        if (this.order === order) {
          return
        }
        this.order = order
        this.initStatus()
        this._getVideos()
      },
      initStatus () {
        this.start = 0
        this.videos = null
        this.hasMoreVideos = true
      },
      toSingerDetail (singer) {
        this.$emit('toSingerDetail', singer)
      }
    },
    watch: {
      scrollTop (scrollTop) {
        if (scrollTop + this.clientHeight >= this.scrollHeight - 10) {
          // 加载更多视频
          this._getVideos()
        }
      }
    }
  }
</script>

<style lang="less">
    @import "../../../../common/css/theme/theme";

    .m-videos-box {
        position: relative;
        padding-bottom: 40px;

        .m-videos-tags-box {
            margin-top: 20px;
            height: 100px;
            width: 100%;
            display: flex;
            flex-flow: column;
            justify-content: space-around;
            align-items: flex-start;

            .tags {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .tag {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 80px;
                    height: 30px;
                    margin-right: 10px;
                    border: 1px solid #313132;
                    border-radius: 15px;

                    .tag-text {
                        color: #FFFFFF;
                    }
                }

                .select {
                    background-color: @player-bar-color !important;
                    border: 1px solid @player-bar-color !important;
                }

                .tag:hover {
                    cursor: pointer;
                    background-color: #2b2b2c;
                }
            }
        }

        .m-videos-title-box {
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .title {
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: flex-end;

                .title-text {
                    font-weight: bold;
                    font-size: 24px;
                    color: #FFFFFF;
                }
            }

            .order-box {
                height: 100%;
                width: 60px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;

                .order {
                    color: #FFFFFF;
                    font-size: 12px;
                }

                .order:hover {
                    cursor: pointer;
                    color: @player-bar-color;
                }

                .select {
                    color: @player-bar-color !important;
                }
            }
        }

        .max-videos {
            position: absolute;
            bottom: 0;
            height: 40px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .tip {
                color: #cccccc;
                font-size: 12px;
            }
        }
    }
</style>
