<template>
    <div ref="playListBox" class="m-play-list">
        <div class="heard">
            <div class="btn-box">
                <div class="btn now-play-list" :class="listMode === 0?'btn-active':''" @click="listMode = 0">
                    <span>播放列表</span>
                </div>
                <div class="btn history-play-list" :class="listMode === 1?'btn-active':''" @click="listMode = 1">
                    <span>历史记录</span>
                </div>
                <div class="close" @click="closeList">
                    <Icon type="ios-close" size="24"/>
                </div>
            </div>
        </div>
        <!--工具栏-->
        <div class="play-list-tool">
            <div class="song-sum">
                <span>总<span class="num">{{listMode === 0 ? sequenceList.length : playHistory.length}}</span>首</span>
            </div>
            <div class="clear-all" @click="clearAll" v-if="listMode === 0">
                <Icon class="clear-icon" type="ios-trash-outline" size="18"/>
                <span class="name">清空播放列表</span>
            </div>
            <div class="clear-all" @click="clearAllPlayHistory" v-else>
                <Icon class="clear-icon" type="ios-trash-outline" size="18"/>
                <span class="name">清空历史记录</span>
            </div>
        </div>
        <div class="play-list-info" v-if="listMode === 0">
            <!--列表展示-->
            <div class="song-list">
                <div class="song-item" v-for="(song,index) in sequenceList" :key="index"
                     :class="[index%2===0?'':'odd',index === curSelectSong?'song-select':'',song.id + '' === currentPlaySong.id + ''?'song-playing':'']"
                     @click="selectSong(index)"
                     @dblclick="selectItem(song,index)"
                >
                    <div class="play-status-icon" v-if="song.mid === currentPlaySong.mid">
                        <Icon type="ios-play" size="17" v-if="playStatus"/>
                        <Icon type="ios-pause" size="17" v-else/>
                    </div>
                    <div class="song-name">
                        <span class="title" v-html="song.title"></span>
                        <span class="subTitle" v-if="song.subTitle" v-html="'('+song.subTitle+')'"></span>
                    </div>
                    <div class="singer">
                             <span v-for="(singer) in song.singers" :key="singer.singerMid"
                                   v-html="singer.singerName" :title="singer.singerName"
                                   @click="toSingerDetail(singer)" @dblclick.stop=""></span>
                    </div>
                    <div class="song-time">
                        {{_handleTime(song.duration)}}
                    </div>
                </div>
            </div>
            <!--没有列表时显示-->
            <div class="no-song-list" v-if="sequenceList.length === 0">
                <div class="tips">
                    <p>您还没有添加任何歌曲!</p>
                    <p>前往首页<span class="toFindMusic" @click="toFindMusicPage">发现音乐</span></p>
                </div>
            </div>
        </div>
        <div class="play-list-info history" v-else>
            <!--列表展示-->
            <div class="song-list">
                <ul>
                    <li class="song-item" v-for="(song,index) in playHistory" :key="index"
                        :class="[index%2===0?'':'odd',index === curSelectHistorySong?'song-select':'',song.id + '' === currentPlaySong.id + ''?'song-playing':'']"
                        @click="selectSong(index)"
                        @dblclick="selectItem(song,index)"
                    >
                        <div class="play-status-icon" v-if="song.mid === currentPlaySong.mid">
                            <Icon type="ios-play" size="17" v-if="playStatus"/>
                            <Icon type="ios-pause" size="17" v-else/>
                        </div>
                        <div class="song-name">
                            <span class="title" v-html="song.title"></span>
                            <span class="subTitle" v-if="song.subTitle" v-html="'('+song.subTitle+')'"></span>
                        </div>
                        <div class="singer">
                             <span v-for="(singer) in song.singers" :key="singer.singerMid"
                                   v-html="singer.singerName" :title="singer.singerName"
                                   @click="toSingerDetail(singer)" @dblclick.stop=""></span>
                        </div>
                        <div class="song-time">
                            {{_handleTime(song.duration)}}
                        </div>
                    </li>
                </ul>
            </div>
            <!--没有列表时显示-->
            <div class="no-song-list" v-if="playHistory.length === 0">
                <div class="tips">
                    <p>您还没有播放任何歌曲!</p>
                    <p>前往首页<span class="toFindMusic" @click="toFindMusicPage">发现音乐</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { handleTime, scrollToTop } from '../../../common/js/util'
  import { playMode } from '../../../common/js/config'

  export default {
    name: 'm-play-list',
    components: {
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
      window.addEventListener('resize', () => {
        this.$refs.playListBox.style.height = `${window.innerHeight - 52}px`
      })
      this.$refs.playListBox.style.height = `${window.innerHeight - 52}px`
      this.readPlayHistory()
    },
    methods: {
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
    @import '../../../common/css/theme/theme';

    .m-play-list {
        user-select: none;
        width: 600px;
        height: 300px;
        background: #2D2F33;
        box-shadow: 0 0 2px #000000;

        .heard {
            height: 40px;
            width: 100%;
            padding: 5px 200px;
            background: #282A2E;

            .btn-box {
                float: left;
                border: 0.5px solid #303030;
                border-radius: 6px;

                .btn {
                    cursor: pointer;
                    width: 95px;
                    height: 30px;
                    line-height: 30px;
                    font-size: 12px;
                    text-align: center;
                    color: #828385;
                }

                .now-play-list {
                    float: left;
                    border-radius: 6px 0 0 6px;
                }

                .history-play-list {
                    float: right;
                    border-radius: 0 6px 6px 0;
                }

                .btn:hover {
                    background: #313337;
                }

                .btn-active {
                    background: #3A3A3F !important;
                    color: #DCDDE4 !important;
                }
            }

            .close {
                position: absolute;
                right: 0;
                margin-right: 15px;
                color: #828385;
            }

            .close:hover {
                cursor: pointer;
                color: #DCDDE4;
            }
        }

        .play-list-tool {
            width: 100%;
            height: 30px;
            background: #2D2F33;
            padding: 0 30px;
            border-bottom: 0.5px solid #454545;

            .song-sum {
                color: #828385;
                line-height: 30px;
                font-size: 12px;
                display: inline-block;
            }

            .clear-all {
                float: right;
                height: 30px;
                line-height: 30px;
                cursor: pointer;
                color: #828385;

                .clear-icon {
                    position: relative;
                    top: 1px;
                }

                .name {
                    font-size: 12px;
                }
            }

            .clear-all:hover {
                color: #DCDDE4;
            }
        }

        .play-list-info {
            height: 95%;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 0 0 40px 0;

            .song-list {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                flex-flow: column;

                .song-item {
                    position: relative;
                    height: 30px;
                    font-size: 12px;
                    background: #2D2F33;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .play-status-icon {
                        position: absolute;
                        left: 0;
                        width: 30px;
                        color: @player-bar-color;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .song-name {
                        width: 360px;
                        padding-left: 30px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #DCDDE4;

                        .subTitle {
                            color: #5F5F63 !important;
                        }
                    }

                    .singer {
                        width: 160px;
                        padding-left: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #5F5F63;

                        span {
                            margin-right: 5px;
                            cursor: pointer;
                        }
                    }

                    .song-time {
                        width: 60px;
                        color: #828385;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                }

                .odd {
                    background: #303236
                }

                .song-item:hover {
                    background: #323438;

                    .singer {
                        color: #DCDDE4;
                    }

                    .song-time {
                        color: #DCDDE4;
                    }
                }

                .song-playing {
                    background: #3A3C40 !important;

                    .singer {
                        color: #DCDDE4;
                    }

                    .song-time {
                        color: #DCDDE4;
                    }
                }

                .song-select {
                    background: #3A3C40 !important;

                    .singer {
                        color: #DCDDE4;
                    }

                    .song-time {
                        color: #DCDDE4;
                    }
                }
            }

            .no-song-list {
                margin-top: 150px;
                text-align: center;
                color: #828385;

                .toFindMusic {
                    cursor: pointer;
                    color: #DCDDE4;
                    text-decoration: underline;
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
            background-color: #414347;
        }

        /*---鼠标点击滚动条显示样式--*/

        .play-list-info::-webkit-scrollbar-thumb:hover {
            background-color: #4C4D51;
        }

        .play-list-info::-webkit-scrollbar-thumb:active {
            background-color: #4C4D51;
        }
    }
</style>
