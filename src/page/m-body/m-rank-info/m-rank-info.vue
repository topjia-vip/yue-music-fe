<template>
    <Content ref="rankBox" class="m-rank-info-box">
        <m-slider ref="wrapper" v-if="isShow && !isError">
            <div class="m-rank-info-box-content" ref="scroll" @scroll="scroll">
                <div class="rank-info">
                    <div class="rank-info-header">
                        <div class="img-box">
                            <img class="rank-info-img" ondragstart="return false" v-lazy="currentTop.headPicUrl"
                                 :alt="currentTop.topId" :key="currentTop.headPicUrl">
                            <div class="rank-intro">
                                <Tooltip max-width="600" placement="bottom-start">
                                    <Icon class="info icon" type="ios-alert-outline" size="25"/>
                                    <div slot="content">
                                        <p v-html="topDetail.intro"></p>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                        <div class="rank-info-box">
                            <div class="rank-name">
                                <h2 v-html="currentTop.topTitle"></h2>
                            </div>
                            <div class="select-week" v-if="topDetail.topHistory.year.length > 0">
                            <span class="select-text" @click="showSelect = !showSelect">
                                第{{week}}周
                                <Icon type="ios-arrow-down" size="18"/>
                            </span>
                                <div class="select-box" v-if="showSelect">
                                    <div class="select select-year-box">
                                        <ul>
                                            <li class="item year-item" :class="itemYear === year?'selected':''"
                                                v-for="(itemYear,index) in this.topDetail.topHistory.year" :key="index"
                                                @click="selectYear(index)"
                                            >
                                                <span>{{itemYear}}</span>
                                                <Icon type="ios-arrow-forward"/>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="select select-week-box">
                                        <ul>
                                            <li class="item week-item"
                                                :class="`${year+'_'+itemWeek}` === period?'selected':''"
                                                v-for="(itemWeek,index) in  this.topDetail.topHistory.subPeriod[yearIndex]"
                                                :key="index"
                                                @click="selectWeek(index)"
                                            >
                                                <span>第{{itemWeek}}周</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="update-time" v-else>
                                <span>更新时间：{{topDetail.updateTime}}</span>
                            </div>
                            <div class="tools">
                                <div class="btn play-btn" @click="playRankList">
                                    <i class="icon play-icon fa fa-play" aria-hidden="true"></i>
                                    <span>播放全部</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <m-song-list class="song-list"
                                 v-if="showSongList"
                                 :songlist="topSongList"
                                 :selectSong="selectSong"
                                 :currentPlaySong="currentPlaySong"
                                 :playStatus="playStatus"
                                 :playList="playList"
                                 @selectItem="selectItem"
                                 @playSong="playSong"
                                 @openMenu="openMenu"
                    />
                    <m-song-list-skeleton v-if="!showSongList"/>
                    <m-right-click-menu :left="left" :top="top" v-if="isShowMenu" @operation="operation"/>
                    <m-location-play-song v-if="_listHasSong" @location="location"/>
                </div>
            </div>
        </m-slider>
        <m-rank-info-skeleton v-if="!isShow && !isError"/>
        <scroll-top v-if="showToTop" @toTop="toTop"/>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </Content>
</template>

<script>
  import { Content, Icon, Tooltip } from 'view-design'
  import { mapActions, mapGetters } from 'vuex'
  import { getTopListData } from '../../../common/js/requestData'
  import { getSign } from '../../../common/js/sign'
  import { createReqData } from '../../../common/js/createReqData'
  import { initTopDetail } from '../../../api/rank'
  import { ERR_OK } from '../../../api/config'
  import { _normalizeSongs, listHasSong, sleep } from '../../../common/js/util'
  import Loading from '../../../components/loading/loading'
  import MRightClickMenu from '../../../components/m-right-click-menu/m-right-click-menu'
  import MLocationPlaySong from '../../../components/m-location-play-song/m-location-play-song'
  import { operationType, timeOut } from '../../../common/js/config'
  import ScrollTop from '../../../components/scrollTop/scroll-top'
  import MSongList from '../../../components/m-song-list/m-song-list'
  import MSlider from '../../../components/m-slider/m-slider'
  import MErrorPage from '../../../components/m-error-page/m-error-page'
  import MSongListSkeleton from '../../../components/m-skeleton/m-song-list-skeleton'
  import MRankInfoSkeleton from '../../../components/m-skeleton/m-rank-info-skeleton'

  export default {
    name: 'm-rank-info',
    components: {
      MRankInfoSkeleton,
      MSongListSkeleton,
      MErrorPage,
      MSlider,
      MSongList,
      ScrollTop,
      MLocationPlaySong,
      MRightClickMenu,
      Loading,
      Content,
      Icon,
      Tooltip
    },
    computed: {
      ...mapGetters([
        'currentPlaySong',
        'playList',
        'playStatus',
        'currentTop'
      ]),
      _listHasSong () {
        return listHasSong(this.topSongList, this.currentPlaySong)
      }
    },
    data () {
      return {
        top: 0,
        left: 0,
        isShow: false,
        topDetail: {},
        topSongList: [],
        showSelect: false,
        showSongList: false,
        isShowMenu: false,
        showToTop: false,
        selectSong: {},
        year: -1,
        week: -1,
        period: '',
        yearIndex: -1,
        weekIndex: -1,
        screenHeight: document.body.clientHeight,
        isError: false
      }
    },
    created () {
      if (!this.currentTop) {
        this.$router.replace('/findMusic/recommend')
      } else {
        this._initTopInfo()
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.addEventListener('click', e => {
          const v = document.getElementsByClassName('select-week')[0]
          if (v) {
            if (!v.contains(event.target)) {
              this.showSelect = false
            }
          }
          const b = document.getElementsByClassName('m-menu-box')[0]
          if (b) {
            if (!b.contains(event.target)) {
              this.isShowMenu = false
            }
          }
        })
        window.addEventListener('resize', () => {
          this.screenHeight = window.innerHeight
        })
        this.$refs.rankBox.$el.style.height = `${window.innerHeight - 102.1}px`
      })
    },
    methods: {
      async _initTopInfo () {
        this.isShow = false
        this.showSongList = false
        let data = getTopListData(this.currentTop.topId, this.currentTop.period)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await initTopDetail(reqData)
        for (let i = 0; i < 5; i++) {
          // 5次容错
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await initTopDetail(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        this.topDetail = res.topDetail.topDetail
        this.topSongList = _normalizeSongs(res.topDetail.top_song_list)
        if (this.topDetail.topHistory.year.length > 0) {
          this.year = this.topDetail.topHistory.year[0]
          this.yearIndex = 0
          this.week = this.topDetail.topHistory.subPeriod[0][0]
          this.period = this.topDetail.period
        }
        this.isShow = true
        this.showSongList = true
      },
      refresh () {
        this.isError = false
        this._initTopInfo()
      },
      async changeWeek () {
        this.showSongList = false
        let data = getTopListData(this.currentTop.topId, this.period)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await initTopDetail(reqData)
        for (let i = 0; i < 5; i++) {
          // 5次容错
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await initTopDetail(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        this.topDetail = res.topDetail.topDetail
        this.topSongList = _normalizeSongs(res.topDetail.top_song_list)
        if (this.topDetail.topHistory.year.length > 0) {
          this.year = this.topDetail.topHistory.year[this.yearIndex]
          this.week = this.topDetail.topHistory.subPeriod[this.yearIndex][this.weekIndex]
        }
        this.showSongList = true
      },
      selectYear (index) {
        this.yearIndex = index
        this.year = this.topDetail.topHistory.year[this.yearIndex]
      },
      selectWeek (index) {
        this.weekIndex = index
        this.week = this.topDetail.topHistory.subPeriod[this.yearIndex][this.weekIndex]
        if (this.year + '_' + this.week === this.period) {
          this.showSelect = false
          return
        }
        this.period = this.year + '_' + this.week
        this.showSelect = false
        this.changeWeek()
      },
      toTop () {
        this.$refs.wrapper.scrollToTop(this.$refs.scroll, timeOut)
      },
      scroll () {
        if (this.$refs.scroll.scrollTop > 100) {
          this.showToTop = true
        } else {
          this.showToTop = false
        }
      },
      // 定位
      location () {
        let index = this.topSongList.findIndex((item) => item.id + '' === this.currentPlaySong.id + '')
        let location = 60 * (index + 1)
        this.$refs.wrapper.scrollTo(this.$refs.scroll, location, timeOut)
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
      // 右键打开菜单栏
      openMenu (e, index) {
        this.selectItem(index)
        let dom = document.getElementsByClassName('m-rank-info-box-content')[0]
        let disst = document.getElementsByClassName('rank-info')[0]
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
      selectItem (index) {
        this.selectSong = this.topSongList[index]
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
      playRankList () {
        this.selectPlay(
          {
            list: this.topSongList,
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
      currentTop () {
        this._initTopInfo()
      },
      screenHeight () {
        this.$refs.rankBox.$el.style.height = `${window.innerHeight - 102.1}px`
      }
    }
  }
</script>

<style lang="less">
    .m-rank-info-box {
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

        .m-rank-info-box-content {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 0 30px 20px 30px;

            .rank-info {
                padding-top: 20px;
                position: relative;

                .rank-info-header {
                    height: 170px;
                    padding-left: 200px;

                    .img-box {
                        position: absolute;
                        left: 0;
                        width: 170px;
                        height: 170px;
                        float: left;

                        .rank-info-img {
                            width: 100%;
                            height: 100%;
                            display: block;
                            border-radius: 10px
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

                    .rank-info-box {
                        width: 100%;
                        height: 200px;
                        float: left;

                        .rank-name {
                            color: #E7E7E7;
                            font-size: 20px;
                            user-select: text;

                            h2 {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        .select-week {
                            position: relative;
                            width: 70px;
                            height: 65px;
                            line-height: 65px;
                            color: #999999;
                            margin-top: 5px;

                            .select-text:hover {
                                cursor: pointer;
                                color: #ffffff;
                            }

                            .select-box {
                                position: absolute;
                                top: 50px;
                                width: 200px;
                                height: 150px;
                                font-size: 12px;
                                z-index: 10;
                                border-radius: 5px;
                                overflow: hidden;

                                .item {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 30px;
                                    line-height: 30px;
                                    list-style: none;
                                    text-align: center;
                                }

                                .item:hover {
                                    cursor: pointer;
                                    color: #ffffff;
                                }

                                .selected {
                                    color: #ffffff;
                                    background: #2b2d32;
                                }

                                .select-year-box {
                                    width: 80px;
                                    height: 100%;
                                    float: left;
                                    background: #1e1f23;
                                }

                                .select-week-box {
                                    width: 120px;
                                    height: 100%;
                                    float: left;
                                    background: #2b2d32;
                                    padding: 0 10px;
                                    overflow-x: hidden;
                                    overflow-y: scroll;
                                }

                                .select {
                                    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
                                    -ms-overflow-style: none;
                                }

                                .select::-webkit-scrollbar {
                                    /*滚动条整体样式*/
                                    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
                                    height: 1px;
                                }

                                /*定义滚动条轨道 内阴影+圆角*/

                                .select::-webkit-scrollbar-track-piece {
                                    -webkit-border-radius: 2em;
                                    -moz-border-radius: 2em;
                                    border-radius: 2em;
                                }

                                /*定义滑块 内阴影+圆角*/

                                .select::-webkit-scrollbar-thumb {
                                    /*滚动条里面小方块*/
                                    border-radius: 10px;
                                    background-color: #3B3C40;
                                }

                                /*---鼠标点击滚动条显示样式--*/

                                .select::-webkit-scrollbar-thumb:hover {
                                    background-color: #3B3C40;
                                }

                                .select::-webkit-scrollbar-thumb:active {
                                    background-color: #3B3C40;
                                }
                            }

                        }

                        .update-time {
                            height: 65px;
                            line-height: 65px;
                            color: #999999;
                            margin-top: 5px;
                        }

                        .tools {
                            position: relative;
                            bottom: 0;
                            height: 30px;
                            line-height: 30px;
                            margin-top: 20px;

                            .btn {
                                cursor: pointer;
                                position: relative;
                                width: 120px;
                                height: 30px;
                                border-radius: 20px;
                                text-align: center;
                                margin-right: 10px;
                                line-height: 30px;
                                display: inline-block;
                                transition: all 0.2s ease-in-out;
                            }

                            .play-btn {
                                background-image: linear-gradient(141deg, rgb(17, 224, 246) 0%, rgb(203, 52, 218) 51%, rgb(230, 57, 162) 75%);
                                color: #E7E7E7;
                            }

                            .play-btn:hover {
                                background-image: linear-gradient(141deg, rgb(4, 195, 246) 0%, rgb(183, 46, 218) 51%, rgb(230, 34, 164) 75%);
                            }
                        }
                    }
                }

                .song-list {
                    margin-top: 30px;
                }
            }
        }

        .m-rank-info-box-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .m-rank-info-box-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-rank-info-box-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-rank-info-box-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-rank-info-box-content::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .m-rank-info-box-content::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }
    }
</style>
