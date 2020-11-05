<template>
    <Content class="m-search-box" ref="searchBox">
        <m-slider ref="wrapper">
            <div class="search-content-box" ref="scroll" @scroll="scroll">
                <div class="search-title">
                    搜索"<span class="highlight">{{searchKey}}</span>"
                    <span v-if="searchRes">，找到{{searchRes.totalnum}}首歌曲</span>
                </div>
                <div class="search-tags">
                    <div class="tag song">
                        <span class="active">歌曲</span>
                        <div class="active-line"></div>
                    </div>
                    <div class="tag album">专辑</div>
                    <div class="tag song-list">歌单</div>
                    <div class="tag lyric">歌词</div>
                </div>
                <!--单曲搜索-->
                <div class="search-song-result-box" v-if="isShow && !isError">
                    <!--最佳匹配-->
                    <div class="best-search" v-if="bestSearch">
                        <div class="title">最佳匹配</div>
                        <div class="best-search-content">
                            <div class="content" @click="toSingerDetail(bestSearch.singer)">
                                <div class="img-box">
                                    <img ondragstart="return false"
                                         v-lazy="handleLazyImage(bestSearch.singer.singerPic)"
                                         :key="bestSearch.singer.singerPic"
                                         :alt="bestSearch.singer.singerName"
                                    >
                                </div>
                                <div class="info-content">
                                    <div class="info name">
                                        <span>歌手：{{bestSearch.singer.singerName}}</span>
                                    </div>
                                    <div class="info song-num">
                                        <span>歌曲：{{bestSearch.songNum}}首</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--搜索的单曲-->
                    <m-search-song-list
                            class="song-list"
                            :hiLights="searchRes.hiLights"
                            :songlist="searchRes.songList"
                            :selectSong="selectSong"
                            :currentPlaySong="currentPlaySong"
                            :playStatus="playStatus"
                            :playList="playList"
                            @selectItem="selectItem"
                            @playSong="playSong"
                            @toSingerDetail="toSingerDetail"
                    />
                    <!--更多加载loading-->
                    <m-more-search-loading/>
                    <m-location-play-song v-if="_listHasSong" @location="location"/>
                </div>
            </div>
        </m-slider>
        <m-search-loading v-if="!isShow && !isError"/>
        <scroll-top v-if="showToTop" @toTop="toTop"/>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </Content>
</template>

<script>
  import { Content } from 'view-design'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { createSearchSongData } from '../../../common/js/createReqData'
  import { searchSong } from '../../../api/search'
  import MSongList from '../../../components/m-song-list/m-song-list'
  import MSearchSongList from './m-search-song-list/m-search-song-list'
  import ScrollTop from '../../../components/scrollTop/scroll-top'
  import { _normalizeSongs, listHasSong, sleep } from '../../../common/js/util'
  import MLocationPlaySong from '../../../components/m-location-play-song/m-location-play-song'
  import MSearchLoading from './m-search-loading/m-search-loading'
  import MMoreSearchLoading from './m-search-loading/m-more-search-loading'
  import MSlider from '../../../components/m-slider/m-slider'
  import { timeOut } from '../../../common/js/config'
  import MErrorPage from '../../../components/m-error-page/m-error-page'
  import SingerDefLazyImg from '../../../resources/images/singer_300.png'

  export default {
    name: 'm-search',
    components: {
      MErrorPage,
      MSlider,
      MMoreSearchLoading,
      MSearchLoading,
      MLocationPlaySong,
      ScrollTop,
      MSearchSongList,
      MSongList,
      Content
    },
    computed: {
      ...mapGetters([
        'searchKey',
        'currentPlaySong',
        'playList',
        'playStatus'
      ]),
      _listHasSong () {
        return listHasSong(this.searchRes.songList, this.currentPlaySong)
      },
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
    data () {
      return {
        page: 1,
        num: 30,
        searchRes: null,
        bestSearch: null,
        type: 1,
        selectSong: {},
        showToTop: false,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        isShow: false,
        screenHeight: document.body.clientHeight,
        isError: false
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.screenHeight = window.innerHeight
      })
      this.$refs.searchBox.$el.style.height = `${window.innerHeight - 102.1}px`
    },
    created () {
      this._search()
    },
    methods: {
      // 定位
      location () {
        let index = this.searchRes.songList.findIndex((item) => item.id + '' === this.currentPlaySong.id + '')
        let location = 60 * (index + 1)
        this.$refs.wrapper.scrollTo(this.$refs.scroll, location, timeOut)
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
      toTop () {
        this.$refs.wrapper.scrollToTop(this.$refs.scroll, timeOut)
      },
      toSingerDetail (singer) {
        let router = `/singer/${singer.singerName}/${singer.singerMid}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      selectItem (index) {
        this.selectSong = this.searchRes.songList[index]
      },
      // 播放当前歌曲
      playSong (song) {
        this.insertSong(song)
      },
      async _search () {
        this.isShow = false
        if (this.type === 1) {
          let reqData = createSearchSongData(this.searchKey, this.num, this.page)
          let res = await searchSong(reqData)
          for (let i = 0; i < 5; i++) {
            if (res.message !== 'success') {
              sleep(500)
              res = await searchSong(reqData)
            } else {
              break
            }
          }
          if (res.message !== 'success') {
            this.isError = true
            return
          }
          this.searchRes = res
          if (res.zhida !== null) {
            this.bestSearch = res.zhida
          } else {
            this.bestSearch = null
          }
          this.isShow = true
        }
      },
      _searchMore () {
        this.page += 1
        if (this.type === 1) {
          let reqData = createSearchSongData(this.searchKey, this.num, this.page)
          searchSong(reqData).then(res => {
            if (res.message === 'success') {
              this.searchRes.songList = this.searchRes.songList.concat(_normalizeSongs(res.songList))
              this.searchRes.hiLights = this.searchRes.hiLights.concat(res.hiLights)
              if (res.zhida !== null) {
                this.bestSearch = res.zhida
              } else {
                this.bestSearch = null
              }
            }
          })
        }
      },
      refresh () {
        this.isError = false
        this._search()
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER',
        setNeedLogin: 'SET_NEED_LOGIN'
      }),
      ...mapActions([
        'selectPlay',
        'insertSong',
        'addToNext'
      ])
    },
    watch: {
      searchKey () {
        this._search()
      },
      scrollTop (scrollTop) {
        if (scrollTop + this.clientHeight >= this.scrollHeight - 10) {
          setTimeout(() => {
            this._searchMore()
          }, 200)
        }
      },
      screenHeight () {
        this.$refs.searchBox.$el.style.height = `${window.innerHeight - 102.1}px`
      }
    }
  }
</script>

<style lang="less">
    @import "../../../common/css/theme/theme";

    .m-search-box {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .search-content-box {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;

            .highlight {
                color: #2e6bb0;
            }

            .search-title {
                height: 80px;
                line-height: 80px;
                color: #dcdde4;
                padding: 0 30px 20px 30px;
            }

            .search-tags {
                width: 100%;
                height: 30px;
                line-height: 30px;
                padding: 0 30px 20px 30px;

                .tag {
                    display: inline-block;
                    width: 60px;
                    font-size: 16px;
                    color: #dcdde4;

                    .active {
                        color: #2e6bb0;
                    }

                    .active-line {
                        height: 4px;
                        width: 32px;
                        background: #2e6bb0;
                        border-radius: 4px;
                    }
                }
            }

            .search-song-result-box {
                margin-top: 10px;

                .title {
                    height: 30px;
                    line-height: 30px;
                    color: #828385;
                    background: #1c1e23;
                    padding: 0 30px 20px 30px;
                }

                .best-search-content {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    height: 80px;
                    padding: 10px 30px;
                    border-bottom: 1px solid #333333;

                    .content {
                        width: 200px;
                        height: 60px;
                        padding: 5px 5px;
                        background: #1c1e22;

                        .img-box {
                            width: 50px;
                            height: 50px;
                            float: left;

                            img {
                                width: 100%;
                                height: 100%;
                                display: block;
                            }
                        }

                        .info-content {
                            display: flex;
                            justify-content: space-around;
                            align-items: start;
                            flex-flow: column;
                            height: 50px;
                            font-size: 14px;
                            color: #dcdde4;
                            padding-left: 10px;

                            .info {
                                width: 100%;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }

                            .song-num {
                                color: #918e8e;
                                font-size: 12px;
                            }
                        }
                    }

                    .content:hover {
                        cursor: pointer;
                        background: #202226;
                    }
                }
            }
        }

        .search-content-box {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .search-content-box::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .search-content-box::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .search-content-box::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .search-content-box::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .search-content-box::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }
    }
</style>
