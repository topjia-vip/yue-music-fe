<template>
    <Content class="m-search-box" ref="searchBox">
        <!-- 搜索提示 -->
        <div class="search-title">
            搜索"<span class="highlight">{{searchKey}}</span>"
        </div>
        <!-- 标签tag -->
        <div class="search-tags">
            <div class="tags-box">
                <div class="tag song">
                <span class="text" :class="mode===0?'active':''"
                      @mousedown="tagMousedown('song')"
                      @mouseup="tagMouseup('song')"
                      @mouseleave="tagMouseleave('song')"
                      @click="selectMode(0)">
                    歌曲
                </span>
                    <div class="active-line" v-if="mode===0"></div>
                </div>
                <div class="tag video">
                <span class="text" :class="mode===1?'active':''"
                      @mousedown="tagMousedown('video')"
                      @mouseup="tagMouseup('video')"
                      @mouseleave="tagMouseleave('video')"
                      @click="selectMode(1)">
                    视频
                </span>
                    <div class="active-line" v-if="mode===1"></div>
                </div>
                <div class="tag album">
                <span class="text" :class="mode===2?'active':''"
                      @mousedown="tagMousedown('album')"
                      @mouseup="tagMouseup('album')"
                      @mouseleave="tagMouseleave('album')"
                      @click="selectMode(2)">
                    专辑
                </span>
                    <div class="active-line" v-if="mode===2"></div>
                </div>
                <div class="tag song-list">
                <span class="text" :class="mode===3?'active':''"
                      @mousedown="tagMousedown('song-list')"
                      @mouseup="tagMouseup('song-list')"
                      @mouseleave="tagMouseleave('song-list')"
                      @click="selectMode(3)">
                    歌单
                </span>
                    <div class="active-line" v-if="mode===3"></div>
                </div>
                <div class="tag lyric">
                <span class="text" :class="mode===4?'active':''"
                      @mousedown="tagMousedown('lyric')"
                      @mouseup="tagMouseup('lyric')"
                      @mouseleave="tagMouseleave('lyric')"
                      @click="selectMode(4)">
                    歌词
                </span>
                    <div class="active-line" v-if="mode===4"></div>
                </div>
                <div class="tag singer">
                <span class="text" :class="mode===5?'active':''"
                      @mousedown="tagMousedown('singer')"
                      @mouseup="tagMouseup('singer')"
                      @mouseleave="tagMouseleave('singer')"
                      @click="selectMode(5)">
                    歌手
                </span>
                    <div class="active-line" v-if="mode===5"></div>
                </div>
            </div>
            <span class="search-result-num" v-if="searchRes">找到{{searchRes.totalnum}}首歌曲</span>
        </div>
        <!-- 搜索内容 -->
        <m-slider class="wrapper" ref="wrapper">
            <div class="search-content-box" ref="scroll" @scroll="scroll">
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
        isError: false,
        mode: 0
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
      selectMode (mode) {
        if (this.mode === mode) {
          return
        }
        this.mode = mode
        this.toTop()
        // TODO 根据mode改变搜索内容
      },
      // 鼠标点击标签时样式改变
      tagMousedown (className) {
        let dom = document.getElementsByClassName(className)[0]
        dom.style.transform = 'translate3d(2px,2px,0)'
      },
      tagMouseup (className) {
        let dom = document.getElementsByClassName(className)[0]
        dom.style.transform = 'translate3d(0,0,0)'
      },
      tagMouseleave (className) {
        let dom = document.getElementsByClassName(className)[0]
        dom.style.transform = 'translate3d(0,0,0)'
      },
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
              this.searchRes.totalnum = res.totalnum
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
    .m-search-box {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .highlight {
            color: var(--font-active-color);
        }

        .search-title {
            height: 80px;
            padding: 0 30px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: var(--search-tip-background-color);
            color: #919192;
            font-size: 16px;
        }

        .search-tags {
            width: 100%;
            padding: 0 30px 20px 30px;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .tags-box {
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .tag {
                    width: 60px;
                    height: 30px;
                    font-size: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-flow: column;

                    .text {
                        color: var(--font-base-color);
                    }

                    .text:hover {
                        cursor: pointer;
                        color: var(--font-active-color);
                    }

                    .active {
                        color: var(--font-active-color);
                    }

                    .active-line {
                        height: 4px;
                        width: 32px;
                        background: var(--font-active-color);
                        border-radius: 4px;
                    }
                }
            }

            .search-result-num {
                color: var(--font-tow-color);
                font-size: 12px;
            }
        }

        .wrapper {
            padding-bottom: 150px;

            .search-content-box {
                position: relative;
                height: 100%;
                width: 100%;
                overflow-y: scroll;
                overflow-x: hidden;

                .search-song-result-box {
                    margin-top: 10px;

                    .best-search {

                        .title {
                            height: 30px;
                            line-height: 30px;
                            color: #828385;
                            background: var(--search-tip-background-color);
                            padding: 0 30px 20px 30px;
                        }

                        .best-search-content {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            height: 80px;
                            padding: 10px 30px;
                            border-bottom: 1px solid var(--search-tip-background-color);

                            .content {
                                width: 200px;
                                height: 60px;
                                padding: 5px 5px;
                                background: var(--search-tip-background-color);

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
                                    color: var(--font-base-color);
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
                                background: var(--search-baseRes-hover-background-color);
                            }
                        }
                    }
                }
            }

            .search-content-box {
                /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
                -ms-overflow-style: none;
            }

            // 火狐
            scrollbar-color: transparent transparent;
            scrollbar-track-color: transparent;
            -ms-scrollbar-track-color: transparent;

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
                background-color: var(--scrollbar-thumb-background-color);
            }

            /*---鼠标点击滚动条显示样式--*/

            .search-content-box::-webkit-scrollbar-thumb:hover {
                background-color: var(--scrollbar-thumb-hover-color);
            }

            .search-content-box::-webkit-scrollbar-thumb:active {
                background-color: var(--scrollbar-thumb-active-color);
            }
        }
    }
</style>
