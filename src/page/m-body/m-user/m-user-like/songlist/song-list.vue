<template>
    <div class="song-list-box">
        <div class="tool-box">
            <div class="play-all-btn" @click="playAll">
                <Icon class="play-icon" type="ios-play" size="24"/>
                <span>播放全部</span>
            </div>
        </div>
        <user-song-list class="song-list"
                        :songlist="songList"
                        :selectSong="selectSong"
                        :currentPlaySong="currentPlaySong"
                        :playStatus="playStatus"
                        :playList="playList"
                        @selectItem="selectItem"
                        @playSong="playSong"
                        @openMenu="openMenu"
        />
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import UserSongList from '../../user-song-list/user-song-list'

  export default {
    name: 'song-list',
    components: {
      UserSongList,
      Icon
    },
    props: {
      songList: {
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
    methods: {
      selectItem (index) {
        this.$emit('selectItem', index)
      },
      playSong (song) {
        this.$emit('playSong', song)
      },
      openMenu (e, index) {
        this.$emit('openMenu', e, index)
      },
      playAll () {
        this.$emit('playAll')
      }
    }
  }
</script>

<style lang="less">
    .song-list-box {
        width: 100%;
        margin-top: 20px;

        .tool-box {
            height: 30px;
            line-height: 30px;

            .play-all-btn {
                cursor: pointer;
                position: relative;
                width: 100px;
                height: 30px;
                background-image: linear-gradient(141deg, rgb(17, 224, 246) 0%, rgb(203, 52, 218) 51%, rgb(230, 57, 162) 75%);
                border-radius: 20px;
                text-align: center;
                color: #E7E7E7;
                font-size: 12px;

                .play-icon {
                    position: relative;
                    top: 3px;
                }
            }

            .play-all-btn:hover {
                background-image: linear-gradient(141deg, rgb(4, 195, 246) 0%, rgb(183, 46, 218) 51%, rgb(230, 34, 164) 75%);
            }
        }

        .song-list {
            margin-top: 30px;
        }
    }
</style>
