<template>
    <div class="m-newsonglist-box">
        <Title :title="'最新音乐'" @moreClick="_toNewSongPage"/>
        <!--最新音乐-->
        <div class="m-newsonglist">
            <ul class="left-list">
                <li class="item" v-for="(item,index) in newSongList.slice(0,5)"
                    :style="index % 2 === 0?'background:#16181C':'background:#1A1C20'"
                    :key="item.id" @dblclick="playSong(item)"
                    @contextmenu.prevent="openMenu($event,index,'left')"
                >
                    <div class="item-info" :class="curIndex === index?'item-info-active':''"
                         @click="selectItem(index,'left')">
                        <div class="num">0{{index+1}}</div>
                        <div class="img-box" @click.prevent="playSong(item)">
                            <img ondragstart="return false" class="img" v-lazy="handleLazyImage(item.image)"
                                 :alt="item.name" :key="item.image">
                            <div class="play-icon">
                                <Icon class="icon" type="ios-play" size="14"/>
                            </div>
                        </div>
                        <div class="song-info">
                            <div class="song-name">{{item.name}}</div>
                            <div class="singer">
                                <span v-for="(singer) in item.singers"
                                      :key="singer.singerMid"
                                      v-html="singer.singerName"
                                      :title="singer.singerName" @click="toSingerDetail(singer)"
                                      @dblclick.stop=""></span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <ul class="right-list">
                <li class="item" v-for="(item,index) in newSongList.slice(5,10)"
                    :style="index % 2 === 0?'background:#16181C':'background:#1A1C20'"
                    :key="item.id" @dblclick="playSong(item)"
                    @contextmenu.prevent="openMenu($event,index,'right')"
                >
                    <div class="item-info" :class="curIndex === (index+5)?'item-info-active':''"
                         @click="selectItem(index,'right')">
                        <div class="num">{{index+6>=10?'':'0'}}{{index+6}}</div>
                        <div class="img-box" @click="playSong(item)">
                            <img ondragstart="return false" class="img"
                                 v-lazy="handleLazyImage(item.image)" :alt="item.name" :key="item.image">
                            <div class="play-icon">
                                <Icon class="icon" type="ios-play" size="14"/>
                            </div>
                        </div>
                        <div class="song-info">
                            <div class="song-name">{{item.name}}</div>
                            <div class="singer">
                                <span v-for="(singer) in item.singers" :key="singer.singerMid"
                                      v-html="singer.singerName" :title="singer.singerName"
                                      @click="toSingerDetail(singer)" @dblclick.stop=""></span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <!--右键菜单栏-->
        <m-right-click-menu v-if="isShow" :top="top" :left="left" @operation="operation"/>
    </div>
</template>

<script>
  import Title from '../../../../../components/m-title/m-title'
  import { Icon } from 'view-design'
  import { scrollToTop } from '../../../../../common/js/util'
  import { mapActions, mapMutations } from 'vuex'
  import MRightClickMenu from '../../../../../components/m-right-click-menu/m-right-click-menu'
  import { operationType } from '../../../../../common/js/config'
  import SongDefLazyImg from '../../../../../resources/images/playlist_300.png'

  export default {
    name: 'm-newsonglist',
    components: { MRightClickMenu, Title, Icon },
    props: {
      newSongList: {
        type: Array
      }
    },
    data () {
      return {
        curIndex: -1,
        isShow: false,
        selectSong: {},
        top: 0,
        left: 0,
        findMusicBox: null
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
      openMenu (e, index, type) {
        this.selectItem(index, type)
        let dom = document.getElementsByClassName('m-find-music-box')[0]
        let recommend = document.getElementsByClassName('m-recommend-box')[0]
        // 左边过界判断
        if (window.innerWidth - e.pageX < 200) {
          this.left = e.pageX - ((dom.clientWidth - recommend.clientWidth) / 2 + 200) - 200
        } else {
          this.left = e.pageX - ((dom.clientWidth - recommend.clientWidth) / 2 + 200)
        }
        let toBottomHeight = window.innerHeight - e.pageY
        if (toBottomHeight - 50 > 300) {
          this.top = (-toBottomHeight + 460)
        } else {
          this.top = (-toBottomHeight + 140)
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
      selectItem (index, type) {
        if (type === 'left') {
          this.curIndex = index
          this.selectSong = this.newSongList[this.curIndex]
        } else {
          this.curIndex = index + 5
          this.selectSong = this.newSongList[this.curIndex]
        }
      },
      playSong (song) {
        this.insertSong(song)
      },
      addNext (song) {
        this.addToNext(song)
      },
      _toNewSongPage () {
        let router = '/findMusic/new_song'
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
          scrollToTop('m-find-music-box')
        }
      },
      ...mapActions([
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
    .m-newsonglist-box {
        position: relative;
        width: 100%;
        margin-bottom: 20px;

        .m-newsonglist {
            margin-top: 10px;

            .left-list {
                width: 50%;
                height: 100%;
                display: inline-block;
            }

            .right-list {
                width: 50%;
                height: 100%;
                position: absolute;
                right: 0;
                display: inline-block;
            }

            .item {
                list-style: none;
                border: 1px solid #303030;
                margin: 0 0 -1px -1px;

                .item-info {
                    height: 60px;
                    line-height: 40px;
                    padding: 10px 0;

                    .num {
                        width: 40px;
                        text-align: center;
                        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                        color: #4E4E52;
                        font-size: 12px;
                        float: left;
                    }

                    .img-box {
                        position: relative;
                        width: 40px;
                        height: 40px;
                        float: left;

                        .img {
                            cursor: pointer;
                            width: 40px;
                            height: 40px;
                        }

                        .play-icon {
                            cursor: pointer;
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
                                top: -9px;
                                left: 1.2px
                            }
                        }

                        .play-icon:hover {
                            background: #000000;
                            color: #FFFFFF;
                        }
                    }

                    .song-info {
                        margin-left: 10px;
                        float: left;
                        line-height: 20px;
                        width: 60%;

                        .song-name {
                            color: #FFFFFF;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                        }

                        .singer {
                            font-size: 12px;
                            color: #5F5F63;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;

                            span {
                                cursor: pointer;
                                margin-right: 5px;
                            }
                        }
                    }
                }

                .item-info-active {
                    background: #232529;

                    .num {
                        color: #FFFFFF;
                    }

                    .img-box {

                        .play-icon {
                            opacity: 1;
                            z-index: 10;
                        }
                    }

                    .song-info {
                        .singer {
                            color: #FFFFFF;
                        }
                    }
                }

                .item-info:hover {
                    background: #232529;

                    .img-box {

                        .play-icon {
                            opacity: 1;
                            z-index: 10;
                        }
                    }

                    .singer {
                        color: #FFFFFF;

                        span {
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
</style>
