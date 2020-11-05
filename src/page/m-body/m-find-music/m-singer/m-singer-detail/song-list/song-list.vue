<template>
    <div class="singer-song-list">
        <div class="tools">
            <div class="play-btn" @click="playSongList">
                <Icon class="play-icon" type="ios-play" size="24"/>
                <span>播放全部</span>
            </div>
            <div class="sort">
                <span class="hot-new-btn" :class="sortId === 1?'active':''" @click="changeSort(1)">最热</span>
                <span class="hot-new-btn" :class="sortId === 5?'active':''" @click="changeSort(5)">最新</span>
            </div>
        </div>
        <m-singer-song-list v-if="isShow"
                            class="song-list"
                            :songlist="songList"
                            :selectSong="selectSong"
                            :currentPlaySong="currentPlaySong"
                            :playStatus="playStatus"
                            :playList="playList"
                            @selectItem="selectItem"
                            @playSong="playSong"
                            @openMenu="openMenu"
        />
        <loading class="loading" v-if="!isShow"/>
        <m-location-play-song v-if="_listHasSong" @location="location"/>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import MSongList from '../../../../../../components/m-song-list/m-song-list'
  import { getSingerSongListData } from '../../../../../../common/js/requestData'
  import { getSign } from '../../../../../../common/js/sign'
  import { getSingerSongList } from '../../../../../../api/singer'
  import { ERR_OK } from '../../../../../../api/config'
  import { _normalizeSongs, listHasSong } from '../../../../../../common/js/util'
  import Loading from '../../../../../../components/loading/loading'
  import { createReqData } from '../../../../../../common/js/createReqData'
  import MLocationPlaySong from '../../../../../../components/m-location-play-song/m-location-play-song'
  import MSingerSongList from '../../../../../../components/m-singer-song-list/m-singer-song-list'

  export default {
    name: 'song-list',
    components: {
      MSingerSongList,
      MLocationPlaySong,
      Loading,
      MSongList,
      Icon
    },
    props: {
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
      scrollTop: {
        type: Number
      },
      scrollHeight: {
        type: Number
      },
      clientHeight: {
        type: Number
      },
      songListTotal: {
        type: Number
      }
    },
    data () {
      return {
        songList: [],
        sortId: 1,
        begin: 0,
        hasSong: false,
        isShow: false
      }
    },
    computed: {
      _listHasSong () {
        return listHasSong(this.songList, this.currentPlaySong)
      }
    },
    created () {
      this.initSongList()
    },
    methods: {
      initSongList () {
        this.isShow = false
        let songListData = getSingerSongListData(this.$route.params.singerMid, this.begin, this.sortId, 30)
        let songListSign = getSign(songListData)
        let reqData = createReqData(songListSign, songListData)
        getSingerSongList(reqData).then(res => {
          if (res.code === ERR_OK) {
            this.songList = _normalizeSongs(res.data.songs)
            this.hasSong = this.songListTotal > this.songList.length
          }
          this.isShow = true
        })
      },
      loadMoreSong () {
        this.begin += 30
        let songListData = getSingerSongListData(this.$route.params.singerMid, this.begin, this.sortId, 30)
        let songListSign = getSign(songListData)
        let reqData = createReqData(songListSign, songListData)
        getSingerSongList(reqData).then(res => {
          if (res.code === ERR_OK) {
            this.songList = this.songList.concat(_normalizeSongs(res.data.songs))
            this.hasSong = this.songListTotal > this.songList.length
          }
        })
      },
      changeSort (sortId) {
        if (this.sortId === sortId) {
          return
        }
        this.sortId = sortId
        this.initSongList()
      },
      // 定位
      location () {
        let index
        index = this.songList.findIndex((item) => item.id + '' === this.currentPlaySong.id + '')
        let location = 60 * (index + 1)
        this.$emit('location', location)
      },
      selectItem (index) {
        let selectSong = this.songList[index]
        this.$emit('selectItem', selectSong)
      },
      playSong (song) {
        this.$emit('playSong', song)
      },
      openMenu (e, index) {
        let selectSong = this.songList[index]
        this.$emit('openMenu', e, selectSong)
      },
      playSongList () {
        this.$emit('playSongList', 'all', this.songList)
      }
    },
    watch: {
      scrollTop (scrollTop) {
        if (scrollTop + this.clientHeight >= this.scrollHeight - 10) {
          if (this.hasSong) {
            this.loadMoreSong()
          }
        }
      }
    }
  }
</script>

<style lang="less">
    .singer-song-list {
        position: relative;
        margin-top: 30px;
        height: 30px;

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

            .play-icon {
                position: relative;
                top: 3px;
            }
        }

        .play-btn:hover {
            background-image: linear-gradient(141deg, rgb(4, 195, 246) 0%, rgb(183, 46, 218) 51%, rgb(230, 34, 164) 75%);
        }

        .sort {
            float: right;
            height: 30px;
            line-height: 30px;
            font-size: 12px;

            .hot-new-btn {
                margin-left: 10px;
                color: #999999;
            }

            .hot-new-btn:hover {
                cursor: pointer;
                color: #f2f2f2;
            }

            .active {
                color: #f2f2f2;
            }
        }

        .song-list {
            margin-top: 20px;
        }

        .loading {
            margin-top: 200px;
        }
    }
</style>
