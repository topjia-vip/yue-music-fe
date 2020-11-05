<template>
    <div class="m-new-song-box">
        <div class="info-page" v-if="!isError && !showLoading">
            <div class="title">新歌速递</div>
            <div class="tag-box">
                <ul>
                    <li class="tag-item" v-for="(tag) in tags" :key="tag.type">
                        <div class="tag-name" :class="type === tag.type?'tag-active':''" v-html="tag.lan"
                             @click="selectTag(tag.type)"></div>
                    </li>
                </ul>
            </div>
            <div class="new-song-list-box">
                <div class="new-song-list">
                    <ul>
                        <!--工具栏-->
                        <li class="tool-box">
                            <div class="play-all-btn" @click="playAllNewSong">
                                <div class="icon-box">
                                    <i class="play-all fa fa-play-circle-o" aria-hidden="true"></i>
                                </div>
                                <div class="btn-title">播放全部</div>
                            </div>
                        </li>
                        <!--歌曲展示-->
                        <li class="new-song" v-for="(newSong,index) in newSongList" :key="newSong.id"
                            :style="index % 2 !== 0?'background:#16181C':'background:#1A1C20'"
                            :class="cur_index === index?'new-song-select':''"
                            @click="selectItem(index)"
                            @dblclick="playSong(newSong)"
                            @contextmenu.prevent="openMenu($event,index)"
                        >
                            <div class="num">{{handleNum(index+1)}}</div>
                            <div class="song-img-box" @click.prevent="playSong(newSong)">
                                <img class="song-img" v-lazy="handleLazyImage(newSong.image)" :key="newSong.image"
                                     :alt="newSong.name">
                                <div class="play-icon">
                                    <Icon class="icon" type="ios-play" size="14"/>
                                </div>
                            </div>
                            <div class="song-info">
                                <div class="song-name">
                                    <span class="title" v-html="newSong.title"></span>
                                    <span class="subTitle" v-if="newSong.subTitle"
                                          v-html="'('+newSong.subTitle+')'"></span>
                                </div>
                                <div class="singer-name">
                                <span v-for="(singer) in newSong.singers" :key="singer.singerMid"
                                      v-html="singer.singerName" :title="singer.singerName"
                                      @click="toSingerDetail(singer)" @dblclick.stop=""></span>
                                </div>
                                <div class="album">
                                    <span v-html="newSong.album"></span>
                                </div>
                            </div>
                            <div class="song-time">{{_handleTime(newSong.duration)}}</div>
                        </li>
                    </ul>
                </div>
            </div>
            <m-right-click-menu :left="left" :top="top" v-if="isShow" @operation="operation"/>
        </div>
        <loading class="loading" v-if="showLoading && !isError"/>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { getNewSong } from '../../../../api/recommend'
  import { ERR_OK } from '../../../../api/config'
  import { _normalizeSongs, handleTime, sleep } from '../../../../common/js/util'
  import Loading from '../../../../components/loading/loading'
  import { mapActions, mapMutations } from 'vuex'
  import MRightClickMenu from '../../../../components/m-right-click-menu/m-right-click-menu'
  import { operationType } from '../../../../common/js/config'
  import { getNewSongData } from '../../../../common/js/requestData'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import MErrorPage from '../../../../components/m-error-page/m-error-page'
  import SongDefLazyImg from '../../../../resources/images/playlist_300.png'

  export default {
    name: 'm-new-song',
    components: { MErrorPage, MRightClickMenu, Loading, Icon },
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
      }
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
      },
      refresh () {
        this.isError = false
        this._getNewSong()
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

        .title {
            text-align: center;
            margin-top: 20px;
            color: #fff0f6;
        }

        .tag-box {
            margin-top: 20px;
            border-bottom: 0.1px solid #303030;

            .tag-item {
                list-style: none;
                display: inline-block;

                .tag-name {
                    cursor: pointer;
                    margin-right: 20px;
                    font-size: 17px;
                    color: #999999;
                }

                .tag-name:hover {
                    color: #f2f2f2;
                }

                .tag-active {
                    color: #f2f2f2;
                    border-bottom: 1.5px solid #999999;
                }
            }
        }

        .new-song-list-box {
            margin-top: 10px;
            margin-bottom: 30px;
            border: 1px solid #303030;

            .new-song-list {
                position: relative;

                ul {
                    list-style: none;
                }

                .tool-box {
                    width: 100%;
                    height: 40px;
                    background: #16181C;

                    .play-all-btn {
                        float: left;
                        width: 120px;
                        padding: 0 20px;
                        line-height: 40px;

                        .icon-box {
                            display: inline-block;
                            position: relative;
                            top: 3px;

                            .play-all {
                                color: #8c1e1e;
                                font-size: 18px;
                            }
                        }

                        .btn-title {
                            display: inline-block;
                            font-size: 12px;
                            color: #999999;
                        }

                    }

                    .play-all-btn:hover {
                        cursor: pointer;

                        .btn-title {
                            color: #f2f2f2;
                        }
                    }
                }

                .new-song {
                    width: 100%;
                    height: 60px;
                    line-height: 40px;
                    padding: 10px 60px 10px 80px;
                    color: #999999;
                    font-size: 12px;
                    background: #1A1C20;

                    .num {
                        position: absolute;
                        left: 0;
                        width: 40px;
                        text-align: center;
                        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                        display: inline-block;
                    }

                    .song-img-box {
                        cursor: pointer;
                        position: absolute;
                        left: 40px;
                        height: 40px;
                        width: 40px;

                        .song-img {
                            width: 100%;
                            height: 100%;
                            display: block;
                        }

                        .play-icon {
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            top: 0;
                            left: 0;
                            margin: auto;
                            width: 24px;
                            height: 24px;
                            color: #c2bebee3;
                            background: #00000059;
                            text-align: center;
                            border-radius: 50%;
                            border: 1px solid #FFFFFF;
                            opacity: 0;
                            z-index: -1;

                            .icon {
                                position: relative;
                                top: -8px;
                                left: 1.2px
                            }
                        }

                        .play-icon:hover {
                            background: #000000;
                            color: #FFFFFF;
                        }
                    }

                    .song-info {
                        width: 100%;
                        height: 40px;
                        color: #E2E2E2;
                        line-height: 40px;
                        position: relative;
                        display: inline-block;

                        .song-name {
                            width: 46%;
                            padding-left: 10px;
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                            .subTitle {
                                color: #999999 !important;
                            }
                        }

                        .singer-name {
                            width: 23%;
                            padding-left: 10px;
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                            span {
                                margin-right: 5px;
                                cursor: pointer;
                            }
                        }

                        .album {
                            width: 28%;
                            padding-left: 10px;
                            display: inline-block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                            span {
                                cursor: pointer;
                            }
                        }

                    }

                    .song-time {
                        position: absolute;
                        right: 0;
                        width: 60px;
                        text-align: center;
                        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                        display: inline-block;
                    }
                }

                .new-song:hover {
                    background: #232529 !important;

                    .play-icon {
                        opacity: 1;
                        z-index: 10;
                    }
                }

                .new-song-select {
                    background: #25272B !important;
                    color: #E2E2E2;

                    .play-icon {
                        opacity: 1;
                        z-index: 10;
                    }
                }
            }
        }

        .loading {
            margin-top: 50px;
        }
    }
</style>
