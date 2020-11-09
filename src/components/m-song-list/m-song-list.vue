<template>
    <div class="m-song-list">
        <ul>
            <li class="song-info-title">
                <div class="song-info-name">歌曲</div>
                <div class="song-info-singer">歌手</div>
                <div class="song-info-album">专辑</div>
                <div class="song-info-time">时长</div>
            </li>
            <li class="item song-info" v-for="(song,index) in songlist" :key="index"
                @click="selectItem(index)"
                @dblclick="playSong(song)"
                @contextmenu.prevent="openMenu($event,index)"
                :style="song === selectSong?'background: #4342402e;':''"
                :class="handleIsPlay(song)"
            >
                <div class="play-status-icon" v-if="currentPlaySong.mid === song.mid">
                    <Icon type="ios-play" size="17" v-if="playStatus"/>
                    <Icon type="ios-pause" size="17" v-else/>
                </div>
                <div class="song-num" v-else>{{_handleNum(index+1)}}</div>
                <div class="song-name-box">
                    <!--收藏按钮-->
                    <i class="love-btn fa fa-heart-o" aria-hidden="true" title="收藏" @click.stop="saveFavoriteSong(song)"
                       v-if="isFavoriteSong(song)"></i>
                    <i class="unlove-btn fa fa-heart" aria-hidden="true" title="取消收藏"
                       @click.stop="deleteFavoriteSong(song)"
                       v-else></i>
                    <!--歌曲名称-->
                    <span :title="`${song.title}${song.subTitle === ''?'':`-(${song.subTitle })`}`" class="title"
                          v-html="song.title"></span>
                    <span :title="`${song.title}${song.subTitle === ''?'':`-(${song.subTitle })`}`" class="subTitle"
                          v-if="song.subTitle" v-html="'('+song.subTitle+')'"></span>
                </div>
                <div class="singer">
                    <div class="singer-name-box" v-for="(singer,singerIndex) in song.singers" :key="singerIndex">
                        <span class="singer-name" v-html="singer.singerName" @click="toSingerDetail(singer)"
                              @dblclick.stop=""/>
                        <span class="division" v-if="singerIndex !== song.singers.length - 1">/</span>
                    </div>
                </div>
                <div class="album">
                    <span class="album-title" v-html="song.album"></span>
                </div>
                <div class="song-time">{{_handleTime(song.duration)}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
  import { _normalizeSongs, handleTime } from '../../common/js/util'
  import { Icon } from 'view-design'
  import { mapGetters, mapMutations } from 'vuex'
  import { deleteSong, saveSong } from '../../api/song'
  import { ERR_OK } from '../../api/config'

  export default {
    name: 'm-song-list',
    components: {
      Icon
    },
    props: {
      songlist: {
        type: Array
      },
      selectSong: {
        type: Object
      },
      currentPlaySong: {
        type: Object
      },
      playStatus: {
        type: Boolean
      },
      playList: {
        type: Array
      }
    },
    computed: {
      ...mapGetters([
        'loginUser',
        'favoriteSongList'
      ]),
      isFavoriteSong () {
        return (song) => {
          // 未登录
          if (this.loginUser === null || this.favoriteSongList === null) {
            return true
          }
          return this.favoriteSongList.findIndex((item) => item.id + '' === song.id + '') === -1
        }
      }
    },
    methods: {
      saveFavoriteSong (song) {
        if (this.loginUser === null) {
          // 收藏动作，需要登录，未登录弹出登录框，返回
          this.setNeedLogin(true)
          return
        }
        // 进行收藏逻辑
        saveSong(song).then(res => {
          if (res.code === ERR_OK) {
            let data = res.data
            if (data.status === 0) {
              // 重新设置用户的收藏歌曲列表
              this.setUserFavoriteSongList(_normalizeSongs(data.data))
            }
          }
        }).catch(() => {
          // token校验失败，用户登录失效，清除当前用户信息，重定向到首页
          // this.updateTips = '用户登录过期'
          // setTimeout(() => {
          //   this.$refs.updateTips.style.opacity = 0
          //   this.$refs.updateTips.style.zIndex = -1
          //   this.canSubmit = false
          //   this.logout()
          // }, 1000)
        })
      },
      deleteFavoriteSong (song) {
        // 取消收藏
        deleteSong(song.id).then(res => {
          if (res.code === ERR_OK) {
            let data = res.data
            if (data.status === 0) {
              // 重新设置用户的收藏歌曲列表
              this.setUserFavoriteSongList(_normalizeSongs(data.data))
            }
          }
        })
      },
      // 处理歌曲播放时长
      _handleTime (duration) {
        return handleTime(duration)
      },
      selectItem (index) {
        this.$emit('selectItem', index)
      },
      playSong (song) {
        this.$emit('playSong', song)
      },
      openMenu (e, index) {
        this.$emit('openMenu', e, index)
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
      // 高亮显示当前歌单正在播放的播放的歌曲
      handleIsPlay (song) {
        if (this.playList.length > 0 && this.currentPlaySong.mid === song.mid) {
          return 'song-playing'
        }
        return ''
      },
      _handleNum (num) {
        if (num < 10) {
          return '0' + num
        }
        return num
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER',
        setNeedLogin: 'SET_NEED_LOGIN',
        setUserFavoriteSongList: 'SET_LOGIN_USER_FAVORITE_SONG_LIST'
      })
    }
  }
</script>

<style lang="less">
    @import '../../common/css/theme/theme';

    .m-song-list {
        .song-info-title {
            height: 30px;
            list-style: none;
            line-height: 30px;
            padding: 0 60px 0 55px;
            font-size: 12px;
            color: @font-tow-color;

            .song-info-name {
                width: 45%;
                float: left;
            }

            .song-info-singer {
                width: 25%;
                float: left;
            }

            .song-info-album {
                width: 30%;
                float: left;
            }

            .song-info-time {
                position: absolute;
                right: 0;
                width: 60px;
            }
        }

        .item {
            list-style: none;
            height: 60px;
            line-height: 60px;
            color: @font-base-color;
            padding: 0 60px 0 55px;
            display: flex;
            justify-content: flex-start;

            .play-status-icon {
                position: absolute;
                left: 0;
                width: 55px;
                color: @font-active-color;
                padding-left: 10px;
            }

            .song-num {
                position: absolute;
                left: 0;
                width: 55px;
                padding-left: 10px;
            }

            .song-name-box {
                position: relative;
                width: 45%;
                float: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 10px;

                .love-btn {
                    color: @no-favorite-color;
                    margin-right: 5px;
                }

                .love-btn:hover {
                    color: @favorite-color;
                    cursor: pointer;
                    margin-right: 5px;
                }

                .unlove-btn {
                    color: @favorite-color;
                    cursor: pointer;
                    margin-right: 5px;
                }

                .song-name-title {
                    display: inline-block;
                }

                .subTitle {
                    color: @font-tow-color;
                }
            }

            .singer {
                width: 25%;
                float: left;
                padding-right: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .singer-name-box {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;

                    .division {
                        margin: 0 2px;
                    }

                    .singer-name {
                        color: @font-tow-color;
                    }

                    .singer-name:hover {
                        cursor: pointer;
                        color: @font-active-color;
                    }
                }
            }

            .album {
                width: 30%;
                float: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 10px;
                color: @font-tow-color;

                span:hover {
                    cursor: pointer;
                    color: @font-active-color;
                }
            }

            .song-time {
                position: absolute;
                right: 0;
                width: 60px;
                color: @font-tow-color;
            }
        }

        .item:hover {
            background: #4342401f;
        }

        .song-playing {
            color: @font-active-color;
            background: rgba(97, 96, 94, 0.25) !important;

            .song-time {
                color: @font-active-color;
            }

            .singer {

                .singer-name-box {

                    .singer-name {
                        color: @font-active-color;
                    }
                }
            }

            .album {
                color: @font-active-color;
            }

            .song-name-box {

                .subTitle {
                    color: @font-active-color;
                }
            }
        }
    }
</style>
