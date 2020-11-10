<template>
    <div class="song-list">
        <div class="song-item" v-for="(song,index) in songList" :key="index"
             :class="[index === curSelectSong?'song-select':'',song.id + '' === currentPlaySong.id + ''?'song-playing':'']"
             @click="selectSong(index)"
             @dblclick="selectItem(song,index)"
        >
            <div class="play-status-icon" v-if="song.mid === currentPlaySong.mid">
                <Icon type="ios-play" size="17" v-if="playStatus"/>
                <Icon type="ios-pause" size="17" v-else/>
            </div>
            <div class="song-info-box">
                <div class="song-name">
                    <span class="title" v-html="song.title"></span>
                    <span class="subTitle" v-if="song.subTitle" v-html="'('+song.subTitle+')'"></span>
                </div>
                <div class="song-singer-and-time">
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
        </div>
    </div>
</template>

<script>

  import { Icon } from 'view-design'
  import { handleTime } from '../../../../common/js/util'

  export default {
    name: 'm-play-list-song-list',
    components: {
      Icon
    },
    props: {
      currentPlaySong: {
        type: Object
      },
      songList: {
        type: Array
      },
      playStatus: {
        type: Boolean
      },
      curSelectSong: {
        type: Number
      }
    },
    methods: {
      selectSong (index) {
        this.$emit('selectSong', index)
      },
      selectItem (song, index) {
        this.$emit('selectItem', song, index)
      },
      toSingerDetail (singer) {
        this.$emit('toSingerDetail', singer)
      },
      // 处理歌曲播放时长
      _handleTime (duration) {
        return handleTime(duration)
      }
    }
  }
</script>

<style lang="less">
    .song-list {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-flow: column;

        .song-item {
            width: 100%;
            position: relative;
            height: 80px;
            padding-left: 30px;
            background: var(--play-list-background-color);
            display: flex;
            justify-content: center;
            align-items: center;

            .play-status-icon {
                position: absolute;
                left: 0;
                width: 30px;
                color: var(--font-active-color);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .song-info-box {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-flow: column;

                .song-name {
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                    color: var(--font-base-color);

                    .subTitle {
                        color: var(--font-tow-color) !important;
                    }
                }

                .song-singer-and-time {
                    font-size: 12px;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .singer {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: var(--font-tow-color);

                        span {
                            margin-right: 5px;
                            cursor: pointer;
                        }

                        span:hover {
                            color: var(--font-active-color);
                        }
                    }

                    .song-time {
                        width: 40px;
                        color: var(--font-tow-color);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }

        .song-item:hover {
            background: var(--song-list-hover-background-color);

            .song-info-box {

                .song-singer-and-time {

                    .singer {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: var(--font-base-color);
                    }
                }
            }
        }

        .song-select {
            background: var(--song-list-hover-background-color) !important;

            .song-info-box {

                .song-singer-and-time {

                    .singer {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: var(--font-base-color);
                    }
                }
            }
        }

        .song-playing {
            background: var(--song-list-hover-background-color) !important;

            .song-info-box {

                .song-name {
                    color: var(--font-active-color);

                    .subTitle {
                        color: var(--font-active-color) !important;
                    }
                }

                .song-singer-and-time {

                    .singer {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: var(--font-active-color) !important;
                    }

                    .song-time {
                        color: var(--font-active-color) !important;
                    }
                }
            }
        }
    }
</style>
