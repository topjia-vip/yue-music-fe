<template>
    <Content ref="singerBox" class="m-singer-detail-box">
        <m-slider ref="wrapper" v-if="isShow">
            <div class="m-singer-detail-box-content" ref="scroll" @scroll="scroll">
                <div class="singer-detail">
                    <div class="singer-detail-header">
                        <div class="img-box">
                            <img class="singer-detail-img" ondragstart="return false"
                                 v-lazy="handleLazyImage(`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singerMid}.jpg?max_age=2592000`)"
                                 :alt="singerMid"
                                 :key="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singerMid}.jpg?max_age=2592000`"
                            >
                        </div>
                        <div class="singer-detail-info-box">
                            <div class="singer-name">
                                <h2 v-html="singerName"></h2>
                            </div>

                            <div class="singer-desc">
                            <span class="desc" v-for="(desc,index) in singerDetail.singerInfo.basic"
                                  v-if="(desc.key === '国籍' || desc.key === '出生日期' || desc.key === '职业' )"
                                  :key="index"><span>{{desc.value}}</span></span>
                            </div>
                            <div class="singer-concern">
                                <span>粉丝数：{{handleVisitNum(this.singerDetail.concernNum)}}</span>
                            </div>
                            <div class="song-sum">
                                <span>单曲数：{{this.singerDetail.songListTotal}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="nav-tag">
                        <li class="item">
                            <div class="box" :class="showTagPage === 1?'active':''" @click="changeTagPage(1)">
                                <div>
                                    <span>精选</span>
                                </div>
                            </div>
                        </li>
                        <li class="item">
                            <div class="box" :class="showTagPage === 2?'active':''" @click="changeTagPage(2)">
                                <div>
                                    <span>歌曲<span>{{this.singerDetail.songListTotal}}</span></span>
                                </div>
                            </div>
                        </li>
                        <li class="item" v-if="hotSingerAlbums.total !== 0">
                            <div class="box" :class="showTagPage === 3?'active':''" @click="changeTagPage(3)">
                                <div>
                                    <span>专辑 <span>{{hotSingerAlbums.total}}</span></span>
                                </div>
                            </div>
                        </li>
                        <li class="item">
                            <div class="box" :class="showTagPage === 4?'active':''" @click="changeTagPage(4)">
                                <div>
                                    <span>详情</span>
                                </div>
                            </div>
                        </li>
                    </div>
                    <handpick :playStatus="playStatus"
                              :currentPlaySong="currentPlaySong"
                              :hotSongList="hotSongList"
                              :playList="playList"
                              :showPage="showPage"
                              :selectSong="selectSong"
                              :singerAlbums="hotSingerAlbums.albums"
                              @selectItem="selectItem"
                              @playSong="playSong"
                              @openMenu="openMenu"
                              @playSongList="playSongList"
                              @toAllSongPage="changeTagPage(2)"
                              @toAlbums="changeTagPage(3)"
                              @location="location"
                              v-show="showPage && showTagPage === 1"
                    />
                    <song-list
                            :playStatus="playStatus"
                            :currentPlaySong="currentPlaySong"
                            :playList="playList"
                            :showPage="showPage"
                            :selectSong="selectSong"
                            :scrollTop="scrollTop"
                            :clientHeight="clientHeight"
                            :scrollHeight="scrollHeight"
                            :songListTotal="singerDetail.songListTotal"
                            @selectItem="selectItem"
                            @openMenu="openMenu"
                            @playSong="playSong"
                            @playSongList="playSongList"
                            @location="location"
                            v-show="showTagPage === 2"
                    />
                    <albums v-show="showPage && showTagPage === 3"
                            :singerMid="singerMid"
                    />
                    <singer-info :singerInfo="singerDetail.singerInfo"
                                 v-show="showPage && showTagPage === 4"
                    />
                    <loading class="loading" v-if="!showPage"/>
                    <m-right-click-menu :left="left" :top="top" v-if="isShowMenu" @operation="operation"/>
                    <scroll-top v-if="showToTop" @toTop="toTop"/>
                </div>
            </div>
        </m-slider>
        <m-singer-detail-skeleton v-if="!isShow"></m-singer-detail-skeleton>
    </Content>
</template>

<script>
  import { Content } from 'view-design'
  import { mapActions, mapGetters } from 'vuex'
  import { getSingerAlbums, getSingerConcern, getSingerInfo, getSingerSongList } from '../../../../../api/singer'
  import { ERR_OK } from '../../../../../api/config'
  import { _normalizeSongs } from '../../../../../common/js/util'
  import { operationType, timeOut } from '../../../../../common/js/config'
  import MRightClickMenu from '../../../../../components/m-right-click-menu/m-right-click-menu'
  import ScrollTop from '../../../../../components/scrollTop/scroll-top'
  import MLocationPlaySong from '../../../../../components/m-location-play-song/m-location-play-song'
  import Loading from '../../../../../components/loading/loading'
  import Handpick from './handpick/handpick'
  import SongList from './song-list/song-list'
  import SingerInfo from './singer-info/singer-info'
  import {
    getSingerAlbumsData,
    getSingerConcernData,
    getSingerSongListData
  } from '../../../../../common/js/requestData'
  import { getSign } from '../../../../../common/js/sign'
  import Albums from './albums/albums'
  import { createReqData, createSingerInfoData } from '../../../../../common/js/createReqData'
  import MSlider from '../../../../../components/m-slider/m-slider'
  import MSingerDetailSkeleton from '../../../../../components/m-skeleton/m-singer-detail-skeleton'
  import SingerDefLazyImg from '../../../../../resources/images/singer_300.png'

  export default {
    name: 'm-singer-detail',
    components: {
      MSingerDetailSkeleton,
      MSlider,
      Albums,
      SingerInfo,
      SongList,
      Handpick,
      Loading,
      MLocationPlaySong,
      ScrollTop,
      MRightClickMenu,
      Content
    },
    data () {
      return {
        singerMid: '',
        singerName: '',
        singerDetail: {},
        isShow: false,
        selectSong: {},
        hotSongList: [],
        showToTop: false,
        top: 0,
        left: 0,
        isShowMenu: false,
        begin: 0,
        showPage: false,
        showTagPage: 1,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        hotSingerAlbums: {},
        screenHeight: document.body.clientHeight
      }
    },
    // 初始化组件
    beforeRouteLeave (to, from, next) {
      this.showTagPage = 1
      next()
    },
    computed: {
      ...mapGetters([
        'currentPlaySong',
        'playList',
        'playStatus'
      ]),
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: SingerDefLazyImg,
            loading: SingerDefLazyImg
          }
        }
      }
    },
    created () {
      this.showPage = 1
      if (this.$route.params.singerMid === '') {
        this.$router.replace('/findMusic/recommend')
      } else {
        this.singerName = this.$route.params.singerName
        this.singerMid = this.$route.params.singerMid
        this._initSingerInfo()
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.addEventListener('click', e => {
          const v = document.getElementsByClassName('m-menu-box')[0]
          if (v) {
            if (!v.contains(event.target)) {
              this.isShowMenu = false
            }
          }
        })
        window.addEventListener('resize', () => {
          this.screenHeight = window.innerHeight
        })
        this.$refs.singerBox.$el.style.height = `${window.innerHeight - 102.1}px`
      })
    },
    methods: {
      _initSingerInfo: async function () {
        this.isShow = false
        let hotSongListData = getSingerSongListData(this.singerMid, 0, 1, 10)
        let hotSongListSign = getSign(hotSongListData)
        let hotSongListReqData = createReqData(hotSongListSign, hotSongListData)
        let res = await getSingerSongList(hotSongListReqData)
        if (res.code === ERR_OK) {
          this.hotSongList = _normalizeSongs(res.data.songs)
          this.singerDetail.songListTotal = res.data.total
        }

        let hotSingerAlbumsData = getSingerAlbumsData(this.singerMid, 0, 1, 5)
        let hotSingerAlbumsSign = getSign(hotSingerAlbumsData)
        let hotSingerAlbumsReqData = createReqData(hotSingerAlbumsSign, hotSingerAlbumsData)
        res = await getSingerAlbums(hotSingerAlbumsReqData)
        if (res.code === ERR_OK) {
          this.hotSingerAlbums = res.data
        }

        let singerConcernData = getSingerConcernData(this.singerMid)
        let singerConcernSign = getSign(singerConcernData)
        let singerConcernReqData = createReqData(singerConcernSign, singerConcernData)
        res = await getSingerConcern(singerConcernReqData, this.singerMid)
        if (res.code === ERR_OK) {
          this.singerDetail.concernNum = res.data.concernNum
        }

        let singerInfoReqData = createSingerInfoData(this.singerMid)
        res = await getSingerInfo(singerInfoReqData)
        if (res.code === ERR_OK) {
          this.singerDetail.singerInfo = res.data
        }

        this.isShow = true
      },
      location (top) {
        this.$refs.wrapper.scrollTo(this.$refs.scroll, top, timeOut)
      },
      _handleNum (number) {
        if (number >= 10000) {
          const num = number / 10000
          return `${Math.round(num * 10) / 10}万`
        } else {
          return number
        }
      },
      selectItem (selectSong) {
        this.selectSong = selectSong
      },
      openMenu (e, selectSong) {
        this.selectItem(selectSong)
        let dom = document.getElementsByClassName('m-singer-detail-box-content')[0]
        let disst = document.getElementsByClassName('singer-detail')[0]
        let scrollY = this.$refs.scroll.scrollTop
        // 左边过界判断
        if (window.innerWidth - e.pageX < 200) {
          this.left = e.pageX - ((dom.clientWidth - disst.clientWidth) / 2 + 170) - 200
        } else {
          this.left = e.pageX - ((dom.clientWidth - disst.clientWidth) / 2 + 170)
        }
        this.left -= 30
        // 屏幕下面过界判断
        let toBottomHeight = e.pageY - 51
        if (window.innerHeight - e.pageY - 50 < 300) {
          this.top = (toBottomHeight + scrollY) - 300
        } else {
          this.top = (toBottomHeight + scrollY)
        }
        this.isShowMenu = true
      },
      changeTagPage (type) {
        this.showTagPage = type
      },
      // 菜单操作选项
      operation (type) {
        this.isShowMenu = false
        if (type === operationType.play) {
          this.playSong(this.selectSong)
        } else if (type === operationType.addToNext) {
          this.addNext(this.selectSong)
        }
      },
      toTop () {
        this.$refs.wrapper.scrollToTop(this.$refs.scroll, timeOut)
      },
      scroll () {
        this.scrollTop = this.$refs.scroll.scrollTop
        this.clientHeight = this.$refs.scroll.clientHeight
        this.scrollHeight = this.$refs.scroll.scrollHeight
        if (this.$refs.scroll.scrollTop > 100) {
          this.showToTop = true
        } else {
          this.showToTop = false
        }
      },
      handleVisitNum (number) {
        if (number >= 10000) {
          const num = number / 10000
          return `${Math.round(num * 10) / 10}万`
        } else {
          return number
        }
      },
      // 播放当前歌曲
      playSong (song) {
        this.insertSong(song)
      },
      // 添加到下一首播放
      addNext (song) {
        this.addToNext(song)
      },
      // 播放整个列表
      playSongList (tag, songList) {
        this.selectPlay(
          {
            list: songList,
            index: 0
          }
        )
      },
      ...mapActions([
        'selectPlay',
        'insertSong',
        'addToNext'
      ])
    },
    watch: {
      '$route.params.singerName' () {
        this.singerName = this.$route.params.singerName
        this.singerMid = this.$route.params.singerMid
        this._initSingerInfo()
      },
      screenHeight () {
        this.$refs.singerBox.$el.style.height = `${window.innerHeight - 102.1}px`
      }
    }
  }
</script>

<style lang="less">
    @import "../../../../../common/css/theme/theme";

    .m-singer-detail-box {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        width: 100%;
        overflow: hidden;

        ::selection {
            background: #d3d3d3;
            color: #ffffff;
        }

        .m-singer-detail-box-content {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 0 30px 20px 30px;

            .singer-detail {
                padding-top: 20px;
                position: relative;

                .singer-detail-header {
                    height: 200px;
                    padding-left: 200px;

                    .img-box {
                        position: absolute;
                        left: 0;
                        width: 200px;
                        height: 200px;
                        float: left;

                        .singer-detail-img {
                            width: 100%;
                            height: 100%;
                            display: block;
                            border-radius: 50%
                        }
                    }

                    .singer-detail-info-box {
                        margin-top: 20px;
                        padding-left: 30px;
                        width: 100%;
                        height: 200px;
                        float: left;

                        .singer-name {
                            color: #E7E7E7;
                            font-size: 20px;
                            user-select: text;

                            h2 {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        .singer-desc {
                            margin-top: 10px;
                            color: #f2f2f2;
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                            .desc {
                                margin-right: 20px;
                                font-size: 12px;
                                user-select: text;
                            }
                        }

                        .singer-concern {
                            margin-top: 10px;
                            color: #999999;

                            span {
                                margin-right: 20px;
                                font-size: 12px;
                                user-select: text;
                            }
                        }

                        .song-sum {
                            margin-top: 10px;
                            color: #999999;

                            span {
                                margin-right: 20px;
                                font-size: 12px;
                                user-select: text;
                            }
                        }
                    }
                }

                .nav-tag {
                    height: 40px;

                    .item {
                        list-style: none;
                        float: left;
                        color: #f2f2f2;

                        .box {
                            margin-right: 80px;

                            span:hover {
                                cursor: pointer;
                                color: #2cb5e8;
                            }
                        }

                        .active {
                            color: #2cb5e8 !important;
                            border-bottom: 2px solid #2cb5e8;
                        }
                    }
                }
            }
        }

        .loading {
            margin-top: 200px;
        }

        .m-singer-detail-box-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        // 火狐
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;

        .m-singer-detail-box-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-singer-detail-box-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-singer-detail-box-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-singer-detail-box-content::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .m-singer-detail-box-content::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }
    }

</style>
