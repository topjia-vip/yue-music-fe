<template>
    <div class="m-new-song-box">
        <div class="new-song-content">
            <div class="new-song-header">
                <div class="title">
                    <h1>新歌首发</h1>
                </div>
                <div class="new-song-tags-box" v-if="showTag">
                    <div class="new-song-tags">
                        <div class="new-song-tag" v-for="(tag) in tags" :key="tag.type">
                            <div class="text"
                                 :class="type === tag.type?'active':''"
                                 @click="selectTag(tag.type)"
                                 v-html="tag.lan"
                            />
                            <div class="active-line" v-if="type === tag.type"></div>
                        </div>
                    </div>
                </div>
                <div class="tags-skeleton" v-else></div>
            </div>
            <div class="play-btn-box">
                <div class="play-btn">
                    <Icon class="play-icon" type="ios-play" size="24"/>
                    <span>播放全部</span>
                </div>
            </div>
            <div class="song-list">
                <m-song-list
                        v-if="!showLoading && !isError"
                        :songlist="newSongList"
                        :selectSong="selectSong"
                        :currentPlaySong="currentPlaySong"
                        :playStatus="playStatus"
                        :playList="playList"
                        @selectItem="selectItem"
                        @playSong="playSong"
                        @openMenu="openMenu"
                />
                <m-song-list-skeleton v-if="showLoading && !isError"/>
                <m-right-click-menu :left="left" :top="top" v-if="isShow" @operation="operation"/>
            </div>
        </div>
        <m-location-play-song v-if="_listHasSong" @location="location"/>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { getNewSong } from '../../../../api/recommend'
  import { ERR_OK } from '../../../../api/config'
  import { _normalizeSongs, handleTime, listHasSong, sleep } from '../../../../common/js/util'
  import Loading from '../../../../components/loading/loading'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import MRightClickMenu from '../../../../components/m-right-click-menu/m-right-click-menu'
  import { operationType } from '../../../../common/js/config'
  import { getNewSongData } from '../../../../common/js/requestData'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import MErrorPage from '../../../../components/m-error-page/m-error-page'
  import SongDefLazyImg from '../../../../resources/images/playlist_300.png'
  import MSongList from '../../../../components/m-song-list/m-song-list'
  import MLocationPlaySong from '../../../../components/m-location-play-song/m-location-play-song'
  import MSongListSkeleton from '../../../../components/m-skeleton/m-song-list-skeleton'

  export default {
    name: 'm-new-song',
    components: { MSongListSkeleton, MLocationPlaySong, MSongList, MErrorPage, MRightClickMenu, Loading, Icon },
    data () {
      return {
        type: 5,
        tags: [],
        newSongList: [],
        selectSong: {},
        cur_index: -1,
        top: 0,
        left: 0,
        isShow: false,
        showTag: false,
        showLoading: true,
        findMusicBox: null,
        isError: false
      }
    },
    computed: {
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: SongDefLazyImg,
            loading: SongDefLazyImg
          }
        }
      },
      _listHasSong () {
        return listHasSong(this.newSongList, this.currentPlaySong)
      },
      ...mapGetters([
        'currentPlaySong',
        'playList',
        'playStatus',
        'loginUser'
      ])
    },
    created () {
      this._getNewSong()
    },
    mounted () {
      document.addEventListener('click', e => {
        const v = document.getElementsByClassName('m-menu-box')[0]
        if (v) {
          if (!v.contains(event.target)) {
            this.isShow = false
          }
        }
      })
      this.findMusicBox = document.getElementsByClassName('m-find-music-box')[0]
    },
    methods: {
      async _getNewSong () {
        this.showLoading = true
        let data = getNewSongData(this.type)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getNewSong(reqData)
        for (let i = 0; i < 5; i++) {
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await getNewSong(reqData)
          } else {
            this.showLoading = false
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        this.tags = res.data.lanlist
        this.newSongList = _normalizeSongs(res.data.newSongList)
        this.showLoading = false
        this.showTag = true
      },
      refresh () {
        this.isError = false
        this._getNewSong()
      },
      // 定位
      location () {
        let index = this.newSongList.findIndex((item) => item.id + '' === this.currentPlaySong.id + '')
        let location = 60 * (index + 1)
        this.$emit('location', location)
      },
      // 右键打开菜单栏
      openMenu (e, index) {
        this.selectItem(index)
        let dom = document.getElementsByClassName('m-find-music-box')[0]
        let newSongBox = document.getElementsByClassName('m-new-song-box')[0]
        let scrollY = parseInt(newSongBox.getAttribute('scrolltop'))
        // 左边过界判断
        if (window.innerWidth - e.pageX < 200) {
          this.left = e.pageX - ((dom.clientWidth - newSongBox.clientWidth) / 2 + 200) - 200
        } else {
          this.left = e.pageX - ((dom.clientWidth - newSongBox.clientWidth) / 2 + 200)
        }
        let toBottomHeight = e.pageY - 101
        // 屏幕下面过界判断
        if (window.innerHeight - e.pageY - 50 < 300) {
          this.top = (toBottomHeight + scrollY) - 300
        } else {
          this.top = (toBottomHeight + scrollY)
        }
        this.isShow = true
      },
      // 菜单操作选项
      operation (type) {
        this.isShow = false
        if (type === operationType.play) {
          this.playSong(this.selectSong)
        } else if (type === operationType.addToNext) {
          this.addNext(this.selectSong)
        }
      },
      selectItem (index) {
        this.cur_index = index
        this.selectSong = this.newSongList[index]
      },
      selectTag (type) {
        if (this.type !== type) {
          this.type = type
          this._getNewSong()
        }
      },
      handleNum (num) {
        if (num < 10) {
          return '0' + num
        } else {
          return num
        }
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
      // 处理歌曲播放时长
      _handleTime (duration) {
        return handleTime(duration)
      },
      // 播放当前歌曲
      playSong (song) {
        this.insertSong(song)
      },
      // 添加到下一首播放
      addNext (song) {
        this.addToNext(song)
      },
      // 播放正个列表
      playAllNewSong () {
        this.selectPlay(
          {
            list: this.newSongList,
            index: 0
          }
        )
      },
      ...mapActions([
        'selectPlay',
        'insertSong',
        'addToNext'
      ]),
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    }
  }
</script>

<style lang="less">
    .m-new-song-box {
        position: relative;
        padding-top: 20px;
        max-width: 1040px;
        margin: 0 auto;
        width: 100%;
        height: 100%;

        .new-song-content {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;

            .new-song-header {
                width: 100%;
                height: 150px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                flex-flow: column;

                .title {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    color: var(--font-base-color);
                    font-size: 20px;
                }

                .new-song-tags-box {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    .new-song-tags {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .new-song-tag {
                            width: 60px;
                            height: 30px;
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            flex-flow: column;
                            color: var(--font-tow-color);

                            .active-line {
                                width: 27px;
                                height: 4px;
                                border-radius: 4px;
                                background-color: var(--font-active-color);
                            }

                            .text:hover {
                                cursor: pointer;
                                color: var(--font-active-color);
                            }

                            .active {
                                color: var(--font-active-color) !important;
                            }
                        }
                    }
                }

                .tags-skeleton {
                    width: 100%;
                    height: 30px;
                }
            }

            .play-btn-box {
                width: 100%;
                height: 60px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .play-btn {
                    display: inline-block;
                    cursor: pointer;
                    position: relative;
                    width: 120px;
                    height: 30px;
                    background-image: linear-gradient(141deg, rgb(17, 224, 246) 0%, rgb(203, 52, 218) 51%, rgb(230, 57, 162) 75%);
                    border-radius: 20px;
                    text-align: center;
                    color: #FFFFFF;

                    .play-icon {
                        position: relative;
                        top: 3px;
                    }
                }

                .play-btn:hover {
                    background-image: linear-gradient(141deg, rgb(4, 195, 246) 0%, rgb(183, 46, 218) 51%, rgb(230, 34, 164) 75%);
                }
            }

            .song-list {
                width: 100%;
                margin-bottom: 20px;
            }
        }

        .loading {
            margin-top: 50px;
        }
    }
</style>
