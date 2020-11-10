<template>
    <div ref="playListBox" class="m-play-list">
        <div class="play-list-heard">
            <div class="list-mode-title">
                <h2 v-if="listMode === 0">播放队列</h2>
                <h2 v-else>历史记录</h2>
                <Icon class="change-list" type="md-arrow-dropright" size="20" @click="changeList"/>
            </div>
            <div class="list-other-info">
                <div class="song-num-box">
                    <span class="num">{{listMode === 0 ? sequenceList.length : playHistory.length}}</span>首歌曲
                </div>
                <div class="play-list-tools">
                    <div class="clear-all" @click="clearAll" v-if="listMode === 0" title="清空播放队列">
                        <Icon class="clear-icon" type="md-trash" size="20"/>
                    </div>
                    <div class="clear-all" @click="clearAllPlayHistory" v-else title="清空历史记录">
                        <Icon class="clear-icon" type="md-trash" size="20"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="play-list-info" v-if="listMode === 0">
            <div class="no-song-list" v-if="sequenceList.length === 0">
                <div class="tips">
                    <p>您还没有添加任何歌曲!</p>
                    <p>前往首页<span class="toFindMusic" @click="toFindMusicPage">发现音乐</span></p>
                </div>
            </div>
            <m-play-list-song-list
                    class="play-list-song-list"
                    :curSelectSong="curSelectSong"
                    :current-play-song="currentPlaySong"
                    :play-status="playStatus"
                    :song-list="sequenceList"
                    @selectSong="selectSong"
                    @selectItem="selectItem"
                    @toSingerDetail="toSingerDetail"
                    v-else
            />
        </div>
        <div class="play-list-info history" v-else>
            <!--没有列表时显示-->
            <div class="no-song-list" v-if="playHistory.length === 0">
                <div class="tips">
                    <p>您还没有播放任何歌曲!</p>
                    <p>前往首页<span class="toFindMusic" @click="toFindMusicPage">发现音乐</span></p>
                </div>
            </div>
            <m-play-list-song-list
                    class="play-list-song-list"
                    :curSelectSong="curSelectHistorySong"
                    :current-play-song="currentPlaySong"
                    :play-status="playStatus"
                    :song-list="playHistory"
                    @selectSong="selectSong"
                    @selectItem="selectItem"
                    @toSingerDetail="toSingerDetail"
                    v-else
            />
        </div>
        <div class="play-list-footer">
            <div class="line"></div>
            <div class="close-play-list">
                <div class="icon-box" @click="closeList">
                    <span class="icon-btn play-list-icon iconfont icon-play-list"></span>
                    <span class="tip">收起</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import '../icon/font_icon/iconfont.css'
  import { Icon } from 'view-design'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { handleTime, scrollToTop } from '../../../common/js/util'
  import { playMode } from '../../../common/js/config'
  import MPlayListSongList from './m-play-list-song-list/m-play-list-song-list'

  export default {
    name: 'm-play-list',
    components: {
      MPlayListSongList,
      Icon
    },
    data () {
      return {
        curSelectSong: -1,
        curSelectHistorySong: -1,
        listMode: 0
      }
    },
    computed: {
      ...mapGetters([
        'playList',
        'sequenceList',
        'fullScreen',
        'currentPlaySong',
        'currentPlaySongIndex',
        'playStatus',
        'mode',
        'playHistory'
      ])
    },
    mounted () {
      this.readPlayHistory()
    },
    methods: {
      changeList () {
        if (this.listMode === 0) {
          this.listMode = 1
        } else {
          this.listMode = 0
        }
      },
      closeList () {
        this.$emit('closeList')
      },
      toFindMusicPage () {
        this.$emit('closeList')
        let router = '/findMusic/recommend'
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
        scrollToTop('m-find-music-box')
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
      selectSong (songIndex) {
        switch (this.listMode) {
          case 0: {
            this.curSelectSong = songIndex
            break
          }
          case 1: {
            this.curSelectHistorySong = songIndex
            break
          }
        }
      },
      clearAll () {
        this.$emit('clearAll')
      },
      clearAllPlayHistory () {
        this.cleanAllPlayHistorySong()
      },
      // 从播放列表中切换歌曲
      selectItem (item, index) {
        console.log(index)
        if (this.listMode === 1) {
          // 从历史记录里选取歌曲播放
          this.insertSong(item)
        } else {
          if (this.mode === playMode.random) {
            index = this.playList.findIndex((song) => {
              return song.id + '' === item.id + ''
            })
          }
          this.setCurrentPlaySongIndex(index)
        }
      },
      ...mapMutations({
        setCurrentPlaySongIndex: 'SET_CURRENT_PLAY_SONG_INDEX',
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      }),
      ...mapActions([
        'readPlayHistory',
        'insertSong',
        'cleanAllPlayHistorySong'
      ])
    }
  }
</script>

<style lang="less">
    .m-play-list {
        user-select: none;
        width: 300px;
        height: 100%;
        background: var(--play-list-background-color);
        box-shadow: 6px 2px 20px 0 #000000;

        .play-list-heard {
            height: 100px;
            width: 100%;
            padding: 0 30px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-flow: column;

            .list-mode-title {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: var(--font-base-color);

                .change-list {
                    color: var(--font-tow-color);
                }

                .change-list:hover {
                    cursor: pointer;
                    color: var(--font-active-color);
                }
            }

            .list-other-info {
                width: 100%;
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .song-num-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--font-tow-color);

                    .num {
                        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                    }
                }

                .play-list-tools {
                    .clear-all {
                        color: var(--font-tow-color);
                    }

                    .clear-all:hover {
                        cursor: pointer;
                        color: var(--font-active-color);
                    }
                }
            }
        }

        .play-list-info {
            height: calc(100% - 200px);
            overflow-y: scroll;
            overflow-x: hidden;

            .play-list-song-list {
                padding-left: 8px;
            }

            .no-song-list {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                color: var(--font-tow-color);

                .toFindMusic {
                    cursor: pointer;
                    color: var(--font-active-color);
                }
            }
        }

        .play-list-footer {
            width: 100%;
            height: 100px;
            padding: 0 30px 10px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-flow: column;

            .line {
                width: 100%;
                height: 2px;
                background-color: var(--select-active-background-color);
            }

            .close-play-list {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;

                .icon-box {
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--font-tow-color);

                    .icon-btn {
                        font-size: 24px;
                    }

                    .tip {
                        margin-left: 3px;
                        font-size: 12px;
                    }
                }

                .icon-box:hover {
                    cursor: pointer;
                    color: var(--font-active-color);
                }
            }
        }

        .play-list-info {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        // 火狐
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;

        .play-list-info::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .play-list-info::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .play-list-info::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: var(--scrollbar-thumb-background-color);
        }

        /*---鼠标点击滚动条显示样式--*/

        .play-list-info::-webkit-scrollbar-thumb:hover {
            background-color: var(--scrollbar-thumb-hover-color);
        }

        .play-list-info::-webkit-scrollbar-thumb:active {
            background-color: var(--scrollbar-thumb-active-color);
        }
    }
</style>
