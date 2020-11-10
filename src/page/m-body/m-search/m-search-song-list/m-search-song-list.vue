<template>
    <div class="m-search-song-list">
        <ul>
            <li class="song-info-title">
                <div class="song-info-name">歌曲</div>
                <div class="song-info-singer">歌手</div>
                <div class="song-info-album">专辑</div>
                <div class="song-info-time">时长</div>
            </li>
            <li class="item song-info" v-for="(song,index) in hiLights" :key="index"
                @click="selectItem(index)"
                @dblclick="playSong(songlist[index])"
                @contextmenu.prevent="openMenu($event,index)"
                :style="songlist[index] === selectSong?'background: var(--song-list-hover-background-color);':''"
                :class="handleIsPlay(songlist[index])"
            >
                <div class="play-status-icon" v-if="currentPlaySong.mid === songlist[index].mid">
                    <Icon type="ios-play" size="17" v-if="playStatus"/>
                    <Icon type="ios-pause" size="17" v-else/>
                </div>
                <div class="song-num" v-else>{{_handleNum(index+1)}}</div>
                <div class="song-name-box">
                    <!--收藏按钮-->
                    <i class="love-btn fa fa-heart-o" aria-hidden="true" title="收藏"
                       @click.stop="saveFavoriteSong(songlist[index])"
                       v-if="isFavoriteSong(songlist[index])"></i>
                    <i class="unlove-btn fa fa-heart" aria-hidden="true" title="取消收藏"
                       @click.stop="deleteFavoriteSong(songlist[index])"
                       v-else></i>
                    <!--歌曲名称-->
                    <span class="song-name"
                          :title="`${song.song_name}${song.song_subtitle === ''?'':`-(${song.song_subtitle })`}`"
                          v-html="song.songname_hilight"></span>
                    <span :title="`${song.song_name}${song.song_subtitle === ''?'':`-(${song.song_subtitle })`}`"
                          class="subTitle"
                          v-if="song.song_subtitle" v-html="'('+song.song_subtitle+')'"></span>
                </div>
                <div class="singer">
                                <span v-for="(singer,singerIndex) in song.singer_hilight" :key="singerIndex"
                                      v-html="singer.singer_name_hiLight" :title="singer.singer_name"
                                      @click.stop="toSingerDetail(songlist[index].singers[singerIndex])"
                                      @dblclick.stop=""></span>
                </div>
                <div class="album">
                    <span class="album-title" v-html="song.albumname_hilight"></span>
                </div>
                <div class="song-time">{{_handleTime(song.duration)}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { mapGetters, mapMutations } from 'vuex'
  import { deleteSong, saveSong } from '../../../../api/song'
  import { ERR_OK } from '../../../../api/config'
  import { _normalizeSongs, handleTime } from '../../../../common/js/util'

  export default {
    name: 'm-search-song-list',
    components: {
      Icon
    },
    props: {
      hiLights: {
        type: Array
      },
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
        this.$emit('toSingerDetail', singer)
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
        setNeedLogin: 'SET_NEED_LOGIN',
        setUserFavoriteSongList: 'SET_LOGIN_USER_FAVORITE_SONG_LIST'
      })
    }
  }
</script>

<style lang="less">
    .m-search-song-list {
        padding: 0 30px 20px 30px;

        .song-info-title {
            height: 30px;
            list-style: none;
            line-height: 30px;
            padding: 0 60px 0 55px;
            font-size: 12px;
            color: var(--font-base-color);

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
                right: 30px;
                width: 60px;
            }
        }

        em {
            font-style: normal;
            color: var(--player-bar-color) !important;
        }

        .item {
            list-style: none;
            height: 60px;
            line-height: 60px;
            color: #ADAFB2;
            padding: 0 60px 0 55px;

            .play-status-icon {
                position: absolute;
                left: 30px;
                width: 55px;
                color: var(--font-active-color);
                padding-left: 10px;
            }

            .song-num {
                position: absolute;
                left: 30px;
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
                    color: var(--no-favorite-color);
                    margin-right: 5px;
                }

                .love-btn:hover {
                    color: var(--favorite-color);
                    cursor: pointer;
                    margin-right: 5px;
                }

                .unlove-btn {
                    color: var(--favorite-color);
                    cursor: pointer;
                    margin-right: 5px;
                }

                .song-name-title {
                    display: inline-block;
                }

                .song-name {
                    color: var(--font-base-color);
                }

                .subTitle {
                    color: var(--font-tow-color);
                }
            }

            .singer {
                width: 25%;
                float: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 10px;

                span {
                    margin-right: 5px;
                    color: var(--font-base-color);
                }

                span:hover {
                    cursor: pointer;
                    color: var(--font-active-color);
                }
            }

            .album {
                width: 30%;
                float: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 10px;

                .album-title {
                    color: var(--font-base-color);
                }

                span:hover {
                    cursor: pointer;
                    color: var(--font-active-color);
                }
            }

            .song-time {
                position: absolute;
                right: 30px;
                width: 60px;
            }
        }

        .item:hover {
            background: var(--song-list-hover-background-color);
        }

        .song-playing {
            color: var(--font-active-color);
            background: var(--song-list-hover-background-color) !important;

            .song-name-box {
                .song-name {
                    color: var(--font-active-color);
                }

                .subTitle {
                    color: var(--font-active-color);
                }
            }

            .singer {
                span {
                    color: var(--font-active-color);
                }
            }

            .album {
                .album-title {
                    color: var(--font-active-color);
                }
            }
        }
    }
</style>
