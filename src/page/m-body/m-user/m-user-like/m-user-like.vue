<template>
    <Content ref="userLikeBox" class="user-like-box" v-if="loginUser">
        <m-slider ref="wrapper">
            <div class="m-user-like-box-content" ref="scroll" @scroll="scroll">
                <div class="user-like-detail">
                    <div class="user-like-header">
                        <h1>我喜欢</h1>
                    </div>
                    <div class="tags">
                        <div class="btn song" @click="changeTag(1)" :class="tag === 1?'active':''">
                            歌曲{{favoriteSongList.length+1}}
                        </div>
                        <!--                    <div class="btn disst" @click="changeTag(2)" :class="tag === 2?'active':''">-->
                        <!--                        歌单{{userFavoriteDissts.totaldiss}}-->
                        <!--                    </div>-->
                    </div>
                    <song-list v-if="tag === 1"
                               :songList="favoriteSongList"
                               :selectSong="selectSong"
                               :playList="playList"
                               :currentPlaySong="currentPlaySong"
                               :playStatus="playStatus"
                               @selectItem="selectItem"
                               @playSong="playSong"
                               @playAll="playAll"
                               @openMenu="openMenu"
                    />
                </div>
                <m-right-click-menu :left="left" :top="top" v-if="isShowMenu" @operation="operation"/>
            </div>
        </m-slider>
        <loading class="loading" v-if="!isShow"/>
        <scroll-top v-if="showToTop" @toTop="toTop"/>
        <m-location-play-song v-if="_listHasSong" @location="location"/>
    </Content>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { Content } from 'view-design'
  import SongList from './songlist/song-list'
  import Loading from '../../../../components/loading/loading'
  import ScrollTop from '../../../../components/scrollTop/scroll-top'
  import MLocationPlaySong from '../../../../components/m-location-play-song/m-location-play-song'
  import { listHasSong } from '../../../../common/js/util'
  import MRightClickMenu from '../../../../components/m-right-click-menu/m-right-click-menu'
  import { operationType, timeOut } from '../../../../common/js/config'
  import MSlider from '../../../../components/m-slider/m-slider'

  export default {
    name: 'm-user-like',
    components: {
      MSlider,
      MRightClickMenu,
      MLocationPlaySong,
      ScrollTop,
      Loading,
      SongList,
      Content
    },
    computed: {
      ...mapGetters([
        'loginUser',
        'currentPlaySong',
        'playList',
        'playStatus',
        'favoriteSongList'
      ]),
      _listHasSong () {
        return listHasSong(this.favoriteSongList, this.currentPlaySong)
      }
    },
    data () {
      return {
        tag: 1,
        isShow: false,
        showToTop: false,
        top: 0,
        left: 0,
        isShowMenu: false,
        showDesc: false,
        playingSong: {},
        selectSong: {},
        screenHeight: document.body.clientHeight
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
        this.resize()
      })
    },
    methods: {
      resize () {
        this.$refs.userLikeBox.$el.style.height = `${window.innerHeight - 102.1}px`
      },
      changeTag (tag) {
        if (this.tag === tag) {
          return
        }
        this.tag = tag
      },
      scroll () {
        if (this.$refs.scroll.scrollTop > 100) {
          this.showToTop = true
        } else {
          this.showToTop = false
        }
      },
      toTop () {
        this.$refs.wrapper.scrollToTop(this.$refs.scroll, timeOut)
      },
      // 定位
      location () {
        let index = this.favoriteSongList.findIndex((item) => item.id + '' === this.currentPlaySong.id + '')
        let location = 60 * (index + 1)
        this.$refs.wrapper.scrollTo(this.$refs.scroll, location, timeOut)
      },
      // 右键打开菜单栏
      openMenu (e, index) {
        this.selectItem(index)
        let dom = document.getElementsByClassName('m-user-like-box-content')[0]
        let disst = document.getElementsByClassName('user-like-detail')[0]
        let scrollY = this.$refs.scroll.scrollTop
        // 左边过界判断
        if (window.innerWidth - e.pageX < 200) {
          this.left = e.pageX - ((dom.clientWidth - disst.clientWidth) / 2 + 170) - 200
        } else {
          this.left = e.pageX - ((dom.clientWidth - disst.clientWidth) / 2 + 170)
        }
        let toBottomHeight = e.pageY - 51
        // 屏幕下面过界判断
        if (window.innerHeight - e.pageY - 50 < 300) {
          this.top = (toBottomHeight + scrollY) - 300
        } else {
          this.top = (toBottomHeight + scrollY)
        }
        this.isShowMenu = true
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
      selectItem (index) {
        this.selectSong = this.favoriteSongList[index]
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
      playAll () {
        this.selectPlay(
          {
            list: this.favoriteSongList,
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
      screenHeight () {
        this.resize()
      }
    }
  }
</script>

<style lang="less">
    .user-like-box {
        position: relative;
        z-index: 0;
        user-select: none;
        background: #16181C;
        min-width: 820px;
        width: 100%;
        overflow: hidden;
        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;

        .m-user-like-box-content {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 0 30px 20px 30px;

            .user-like-detail {
                padding-top: 20px;
                position: relative;

                .user-like-header {
                    color: #ffffff;
                    font-size: 20px;
                    margin-top: 20px;
                }

                .tags {
                    margin-top: 20px;
                    color: #999999;
                    height: 30px;
                    line-height: 30px;

                    .song {
                        display: inline-block;
                        margin-right: 60px;
                    }

                    .disst {
                        display: inline-block;
                    }

                    .btn:hover {
                        cursor: pointer;
                        color: #ffffff;
                    }

                    .active {
                        color: #ffffff;
                        border-bottom: 1px solid #ffffff;
                    }
                }
            }
        }

        .m-user-like-box-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .m-user-like-box-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-user-like-box-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-user-like-box-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-user-like-box-content::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .m-user-like-box-content::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }
    }
</style>
