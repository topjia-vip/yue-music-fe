<template>
    <div class="handpick-box">
        <!--热门歌曲-->
        <div class="singer-hot-songList">
            <div class="header">
                <h2 class="title">热门歌曲</h2>
                <div class="play-btn" @click="playSongList">
                    <Icon class="play-icon" type="ios-play" size="24"/>
                    <span>播放全部</span>
                </div>
                <p class="more" @click="toAllSongPage">
                    <span>更多</span>
                </p>
            </div>
            <m-singer-song-list :songlist="hotSongList"
                                :selectSong="selectSong"
                                :currentPlaySong="currentPlaySong"
                                :playStatus="playStatus"
                                :playList="playList"
                                @selectItem="selectItem"
                                @playSong="playSong"
                                @openMenu="openMenu"
            />
        </div>
        <!--热门专辑-->
        <div class="singer-hot-albums">
            <div class="header">
                <h2 class="title">热门专辑</h2>
                <p class="more" @click="toAlbums">
                    <span>更多</span>
                </p>
            </div>
            <div class="hot-album-box">
                <m-album-list :albums="singerAlbums"/>
            </div>
        </div>
        <m-location-play-song v-if="_listHasSong" @location="location"/>
    </div>
</template>

<script>
  import MSongList from '../../../../components/m-song-list/m-song-list'
  import { Icon } from 'view-design'
  import MAlbumList from '../../../../components/m-album-list/m-album-list'
  import MLocationPlaySong from '../../../../components/m-location-play-song/m-location-play-song'
  import { listHasSong } from '../../../../common/js/util'
  import MSingerSongList from '../../../../components/m-singer-song-list/m-singer-song-list'

  export default {
    name: 'handpick',
    components: {
      MSingerSongList,
      MLocationPlaySong,
      MAlbumList,
      MSongList,
      Icon
    },
    props: {
      hotSongList: {
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
      },
      singerAlbums: {
        type: Array
      }
    },
    computed: {
      _listHasSong () {
        return listHasSong(this.hotSongList, this.currentPlaySong)
      }
    },
    methods: {
      // 定位
      location () {
        let index
        index = this.hotSongList.findIndex((item) => item.id + '' === this.currentPlaySong.id + '')
        let location = 60 * (index + 1)
        this.$emit('location', location)
      },
      selectItem (index) {
        let selectSong = this.hotSongList[index]
        this.$emit('selectItem', selectSong)
      },
      playSong (song) {
        this.$emit('playSong', song)
      },
      openMenu (e, index) {
        let selectSong = this.hotSongList[index]
        this.$emit('openMenu', e, selectSong)
      },
      playSongList () {
        this.$emit('playSongList', 'hot', this.hotSongList)
      },
      toAllSongPage () {
        this.$emit('toAllSongPage')
      },
      toAlbums () {
        this.$emit('toAlbums')
      }
    }
  }
</script>

<style lang="less">
    .handpick-box {
        margin-top: 30px;

        .singer-hot-songList {
            width: 100%;

            .header {
                width: 100%;
                margin-bottom: 20px;
                height: 30px;
                line-height: 30px;

                .title {
                    color: #f2f2f2;
                    display: inline-block;
                }

                .play-btn {
                    display: inline-block;
                    cursor: pointer;
                    position: relative;
                    width: 120px;
                    height: 30px;
                    background-image: linear-gradient(141deg, rgb(17, 224, 246) 0%, rgb(203, 52, 218) 51%, rgb(230, 57, 162) 75%);
                    border-radius: 20px;
                    text-align: center;
                    color: #E7E7E7;
                    margin-left: 10px;

                    .play-icon {
                        position: relative;
                        top: 3px;
                    }
                }

                .play-btn:hover {
                    background-image: linear-gradient(141deg, rgb(4, 195, 246) 0%, rgb(183, 46, 218) 51%, rgb(230, 34, 164) 75%);
                }

                .more {
                    display: inline-block;
                    float: right;
                    font-size: 12px;
                    color: #999999;
                }

                .more:hover {
                    cursor: pointer;
                    color: #FFFFFF;

                    span {
                        border-bottom: 1px solid #FFFFFF;
                    }
                }
            }
        }

        .singer-hot-albums {
            width: 100%;
            margin-top: 40px;

            .header {
                width: 100%;
                height: 30px;
                line-height: 30px;

                .title {
                    color: #f2f2f2;
                    display: inline-block;
                }

                .more {
                    display: inline-block;
                    float: right;
                    font-size: 12px;
                    color: #999999;
                }

                .more:hover {
                    cursor: pointer;
                    color: #FFFFFF;

                    span {
                        border-bottom: 1px solid #FFFFFF;
                    }
                }
            }

            .hot-album-box {
                margin-top: 20px;
            }
        }
    }
</style>
