<template>
    <Content ref="content" class="m-video">
        <!--导航栏-->
        <div class="m-video-nav">
            <div class="tag-box">
                <div class="tag" @click.stop="selectRouter('recommend')">
                    <div class="title" :class="this.$route.path==='/video/recommend'?'active':''">推荐</div>
                </div>

                <div class="tag" @click.stop="selectRouter('rank')">
                    <div class="title" :class="this.$route.path==='/video/rank'?'active':''">排行榜</div>
                </div>

                <div class="tag" @click.stop="selectRouter('videos')">
                    <div class="title" :class="this.$route.path==='/video/videos'?'active':''">视频库</div>
                </div>
                <div class="active-line-box" ref="activeLine">
                    <div class="active-line"></div>
                </div>
            </div>
        </div>
        <m-slider ref="wrapper">
            <div ref="musicBox" class="m-video-box" @scroll="scrollValue">
                <!--分类内容区-->
                <transition :name="transitionName">
                    <keep-alive>
                        <router-view :scrollTop="scrollTop" :clientHeight="clientHeight" :scrollHeight="scrollHeight"
                                     @toSingerDetail="toSingerDetail" @playVideo="playVideo"/>
                    </keep-alive>
                </transition>
            </div>
        </m-slider>
        <!--Top按钮-->
        <scroll-top v-if="showToTop" @toTop="toTop"/>
    </Content>
</template>

<script>
  import { Content } from 'view-design'
  import MSlider from '../../../components/m-slider/m-slider'
  import ScrollTop from '../../../components/scrollTop/scroll-top'
  import { timeOut } from '../../../common/js/config'
  import { mapMutations } from 'vuex'

  export default {
    name: 'm-video',
    components: {
      ScrollTop,
      MSlider,
      Content
    },
    data () {
      return {
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        showToTop: false,
        screenHeight: document.body.clientHeight,
        transitionName: 'my-slide-left'
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.screenHeight = window.innerHeight
      })
      this.$refs.content.$el.style.height = `${window.innerHeight - 102.1}px`
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
      playVideo (video) {
        let router = `/video/${video.vid}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      selectRouter (router) {
        let allRouter = '/video/' + router
        this.changeActiveLineStyle(router)
        this.pushRouter(allRouter)
      },
      changeActiveLineStyle (router) {
        let translate = 1
        switch (router) {
          case 'recommend': {
            translate = 0
            break
          }
          case 'rank': {
            translate = 1
            break
          }
          case 'videos': {
            translate = 2
            break
          }
        }
        this.$refs.activeLine.style.transform = `translate3d(${translate * 100}%, 0, 0)`
      },
      scrollValue () {
        this.scrollTop = this.$refs.musicBox.scrollTop
        this.scrollHeight = this.$refs.musicBox.scrollHeight
        this.clientHeight = this.$refs.musicBox.clientHeight
        if (this.scrollTop > 100) {
          this.showToTop = true
        } else {
          this.showToTop = false
        }
      },
      pushRouter (router) {
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      toTop () {
        this.$refs.wrapper.scrollToTop(this.$refs.musicBox, timeOut)
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    },
    watch: {
      screenHeight () {
        this.$refs.content.$el.style.height = `${window.innerHeight - 102.1}px`
      },
      '$route' (to, from) {
        const toIndex = to.meta.index
        const fromIndex = from.meta.index
        if (fromIndex === undefined) {
          this.transitionName = 'my-slide-left'
          return
        }
        this.transitionName = toIndex < fromIndex ? 'my-slide-right' : 'my-slide-left'
        this.changeActiveLineStyle(to.path.replace('/video/', ''))
      }
    }
  }
</script>

<style lang="less">
    .m-video {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        overflow: hidden;

        .m-video-nav {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;

            .tag-box {
                position: relative;
                height: 50px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .tag {
                    color: var(--font-base-color);

                    .title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 50px;
                        width: 80px;
                    }

                    .active {
                        color: var(--font-active-color) !important;
                    }

                    .title:hover {
                        cursor: pointer;
                        color: var(--font-active-color);
                    }
                }

                .active-line-box {
                    position: absolute;
                    left: 0;
                    bottom: 2px;
                    width: 80px;
                    height: 4px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transform: translate3d(0, 0, 0);
                    transition: transform 300ms ease;

                    .active-line {
                        width: 60px;
                        height: 100%;
                        border-radius: 5px;
                        background-color: var(--font-active-color);
                    }
                }
            }
        }

        .my-slide-right-enter-active,
        .my-slide-left-enter-active {
            transition: all 200ms ease-in-out;
            position: relative;
        }

        .my-slide-right-enter {
            opacity: 0;
            transform: translate3d(-40px, 0, 0);
        }

        .my-slide-left-enter {
            opacity: 0;
            transform: translate3d(40px, 0, 0);
        }

        .m-video-box {
            overflow-x: hidden;
            overflow-y: scroll;
            height: 94%;
            padding: 0 22px 0 30px;
        }

        .m-video-box {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        // 火狐
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;

        .m-video-box::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-video-box::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-video-box::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: var(--scrollbar-thumb-background-color);
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-video-box::-webkit-scrollbar-thumb:hover {
            background-color: var(--scrollbar-thumb-hover-color);
        }

        .m-video-box::-webkit-scrollbar-thumb:active {
            background-color: var(--scrollbar-thumb-active-color);
        }
    }
</style>
