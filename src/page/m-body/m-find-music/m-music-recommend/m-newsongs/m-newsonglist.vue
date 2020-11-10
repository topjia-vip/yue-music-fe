<template>
    <div class="m-newsonglist-box">
        <!--最新音乐-->
        <m-song-list :songlist="newSongList"
                     :selectSong="selectSong"
                     :currentPlaySong="currentPlaySong"
                     :playStatus="playStatus"
                     :playList="playList"
                     @selectItem="selectItem"
                     @playSong="playSong"
        />
    </div>
</template>

<script>
  import Title from '../../../../../components/m-title/m-title'
  import { Icon } from 'view-design'
  import { mapActions, mapGetters } from 'vuex'
  import MRightClickMenu from '../../../../../components/m-right-click-menu/m-right-click-menu'
  import SongDefLazyImg from '../../../../../resources/images/playlist_300.png'
  import MSongList from '../../../../../components/m-song-list/m-song-list'

  export default {
    name: 'm-newsonglist',
    components: { MSongList, MRightClickMenu, Title, Icon },
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
      },
      ...mapGetters([
        'currentPlaySong',
        'playList',
        'playStatus',
        'loginUser',
        'userFavoriteDissts'
      ])
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
      selectItem (index) {
        this.selectSong = this.newSongList[index]
      },
      playSong (song) {
        this.insertSong(song)
      },
      addNext (song) {
        this.addToNext(song)
      },
      ...mapActions([
        'insertSong',
        'addToNext'
      ])
    }
  }
</script>

<style lang="less">
    .m-newsonglist-box {
        position: relative;
        width: 100%;
        margin-bottom: 20px;
        margin-top: 20px;
    }
</style>
