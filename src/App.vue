<template>
    <Layout class="body-bg">
        <div ref="main">
            <!--导航栏-->
            <m-header ref="header" @changeTheme="changeTheme"/>
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
  import { THEME_TYPE, themes } from './common/js/theme-config'

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
      this.loadTheme()
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
      loadTheme () {
        // LocalStorage获取上次保存的主题颜色
        let themeType = localStorage.getItem('theme')
        if (themeType) {
          this.changeTheme(themeType)
        } else {
          this.changeTheme('light')
        }
      },
      // 改变主题颜色
      changeTheme (themeType) {
        let theme
        switch (themeType) {
          case THEME_TYPE.light: {
            theme = themes.light
            break
          }
          case THEME_TYPE.dark: {
            theme = themes.dark
            break
          }
        }
        for (let i = 0; i < theme.length; i++) {
          document.documentElement.style.setProperty(theme[i].cssName, theme[i].cssValue)
        }
        // 保存主题
        localStorage.setItem('theme', themeType)
      },
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
    .body-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        font: 14px/1.5 Tahoma, Helvetica, Arial, '宋体', sans-serif;
        overflow: hidden;
        background-color: var(--background-color-base);

        .line {
            width: 100%;
            height: 2px;
            background-color: var(--header-background-color);
        }

        .play-list {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 10000;
            transform: translateX(110%);
            transition: transform 200ms;
        }

        .ivu-layout {
            background-color: var(--background-color-base);
        }
    }
</style>
