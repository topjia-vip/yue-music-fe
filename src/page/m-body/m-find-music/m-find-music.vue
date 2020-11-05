<template>
    <Content ref="content" class="m-find-music">
        <!--导航栏-->
        <div class="m-find-music-nav">
            <div class="tag-box">
                <div class="tag" @click.stop="selectRouter('recommend')">
                    <div class="title" :class="this.$route.path==='/findMusic/recommend'?'active':''">个性推荐</div>
                </div>

                <div class="tag" @click.stop="selectRouter('dissts')">
                    <div class="title" :class="this.$route.path==='/findMusic/dissts'?'active':''">歌单</div>
                </div>

                <div class="tag" @click.stop="selectRouter('rank')">
                    <div class="title" :class="this.$route.path==='/findMusic/rank'?'active':''">排行榜</div>
                </div>

                <div class="tag" @click.stop="selectRouter('singer')">
                    <div class="title" :class="this.$route.path==='/findMusic/singer'?'active':''">歌手</div>
                </div>

                <div class="tag" @click.stop="selectRouter('new_song')">
                    <div class="title" :class="this.$route.path==='/findMusic/new_song'?'active':''">最新音乐</div>
                </div>
                <div class="active-line-box" ref="activeLine">
                    <div class="active-line"></div>
                </div>
            </div>
        </div>
        <m-slider ref="wrapper">
            <div ref="musicBox" class="m-find-music-box" @scroll="scrollValue">
                <!--分类内容区-->
                <transition :name="transitionName">
                    <keep-alive>
                        <router-view :scrollTop="scrollTop" :clientHeight="clientHeight" :scrollHeight="scrollHeight"/>
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
  import ScrollTop from '../../../components/scrollTop/scroll-top'
  import { mapMutations } from 'vuex'
  import MSlider from '../../../components/m-slider/m-slider'
  import { timeOut } from '../../../common/js/config'

  export default {
    name: 'm-find-music',
    components: {
      MSlider,
      ScrollTop,
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
      selectRouter (router) {
        let allRouter = '/findMusic/' + router
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
          case 'dissts': {
            translate = 1
            break
          }
          case 'rank': {
            translate = 2
            break
          }
          case 'singer': {
            translate = 3
            break
          }
          case 'new_song': {
            translate = 4
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
        this.changeActiveLineStyle(to.path.replace('/findMusic/', ''))
      }
    }
  }
</script>

<style lang="less">
    @import "../../../common/css/theme/theme";

    .m-find-music {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        overflow: hidden;

        .m-find-music-nav {
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
                    color: #828385;

                    .title {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 50px;
                        width: 80px;
                    }

                    .active {
                        color: #FFFFFF !important;
                    }

                    .title:hover {
                        cursor: pointer;
                        color: #cccccc;
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
                        background-color: @player-bar-color;
                    }
                }
            }
        }

        .nav-line {
            width: 100%;
            height: 1px;
            background: #303030;
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

        .m-find-music-box {
            overflow-x: hidden;
            overflow-y: scroll;
            height: 94%;
            padding: 0 22px 0 30px;
        }

        .m-find-music-box {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .m-find-music-box::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-find-music-box::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-find-music-box::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-find-music-box::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .m-find-music-box::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }
    }
</style>
