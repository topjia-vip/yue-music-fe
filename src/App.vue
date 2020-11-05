<template>
    <Layout class="body-bg">
        <div ref="main">
            <!--导航栏-->
            <m-header ref="header"/>
            <div class="line"></div>
            <Layout class="ivu-layout ivu-layout-has-sider">
                <!--侧边-->
                <m-tags class="tags"/>
                <!--内容体,装载具体内容-->
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"/>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"/>
            </Layout>
            <m-login-box ref="loginBox"/>
            <!--播放列表-->
            <m-play-list ref="playList" class="play-list" @clearAll="clearAll" @closeList="closeList"/>
            <!--播放器位置-->
            <m-player ref="player" @changeShowPlayListStatus="changeShowPlayListStatus" :Audio="this.$refs.audio"/>
        </div>
    </Layout>
</template>

<script>
  import { Layout } from 'view-design'
  import MHeader from './page/m-header/m-header'
  import MTags from './page/m-tags/m-tags'
  import MPlayer from './page/m-player/m-player'
  import MPlayList from './page/m-player/m-play-list/m-play-list'
  import { mapGetters } from 'vuex'
  import { scrollToIndex } from './common/js/util'
  import { playMode } from './common/js/config'
  import MLoginBox from './components/m-login-box/m-login-box'
  import 'vue2-animate/dist/vue2-animate.min.css'
  import MPlayerFullScreen from './page/m-player/m-player-full-screen/m-player-full-screen'

  export default {
    components: {
      MPlayerFullScreen,
      MLoginBox,
      MPlayList,
      MPlayer,
      MTags,
      MHeader,
      Layout
    },
    data () {
      return {
        showPlayList: false,
        transitionName: 'my-slide-left'
      }
    },
    mounted () {
      document.addEventListener('click', e => {
        const v = document.getElementsByClassName('player')[0]
        const b = document.getElementsByClassName('play-list')[0]
        if (v && b) {
          if (!v.contains(event.target) && !b.contains(event.target)) {
            this.closeList()
          }
        }
      })
    },
    computed: {
      ...mapGetters([
        'currentPlaySongIndex',
        'currentPlaySong',
        'sequenceList',
        'mode',
        'needLogin',
        'fullScreen'
      ])
    },
    methods: {
      changeShowPlayListStatus () {
        if (this.showPlayList) {
          // 关闭播放列表
          this.closeList()
        } else {
          // 打开播放列表
          this.openList()
        }
      },
      // 打开播放列表
      openList () {
        const playList = this.$refs.playList.$el
        playList.style.transform = 'translateX(0)'
        this.showPlayList = true
      },
      // 关闭播放列表
      closeList () {
        const playList = this.$refs.playList.$el
        playList.style.transform = 'translateX(110%)'
        this.showPlayList = false
        if (this.mode === playMode.random) {
          let index = this.sequenceList.findIndex(item => item.mid === this.currentPlaySong.mid)
          setTimeout(() => {
            scrollToIndex('play-list-info', index * 30 - 120)
          }, 100)
        } else {
          setTimeout(() => {
            scrollToIndex('play-list-info', this.currentPlaySongIndex * 30 - 120)
          }, 100)
        }
      },
      clearAll () {
        this.$refs.player.clearAll()
      }
    }
  }
</script>

<style lang="less">
    @import "common/css/theme/theme";

    .body-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        font: 14px/1.5 Tahoma, Helvetica, Arial, '宋体', sans-serif;
        overflow: hidden;
        background-color: @background-color-base;

        .line {
            width: 100%;
            height: 2px;
            background-image: linear-gradient(141deg, #4f4f4f 0%, #893e12 50%, #565656 100%);
        }

        .play-list {
            position: absolute;
            bottom: 50px;
            right: 0;
            z-index: 10;
            transform: translateX(100%);
            transition: transform 200ms;
        }

        .ivu-layout {
            background-color: #16181C;
        }
    }
</style>
