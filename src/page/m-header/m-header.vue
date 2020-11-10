<template>
    <Header class="m-header">
        <div class="m-header-wrapper" ref="wrapper">
            <div class="header-left">
                <!--Logo-->
                <div class="logo-box">
                    <img ondragstart="return false" class="logo_img" src="../../resources/logo/logo(完整).png"
                         alt="logo"/>
                </div>
                <!--前进后退栏-->
                <div class="prev-next">
                    <div class="prev">
                        <Icon class="icon" type="ios-arrow-back" size="18" title="后退" @click="prev"
                              v-if="canBack"/>
                        <Icon class="icon disabled" type="ios-arrow-back" size="18" v-else/>
                    </div>
                    <div class="next">
                        <Icon class="icon" type="ios-arrow-forward" size="18" title="前进" @click="next" v-if="canNext"/>
                        <Icon class="icon disabled" type="ios-arrow-forward" size="18" v-else/>
                    </div>
                </div>
                <!--搜索框-->
                <div class="search_box">
                    <input ref="searchInput" class="search" :value="key" placeholder="搜索音乐、歌手、歌词"
                           @input="changeInput($event)"
                           @focus="openSmallSearch" @keypress.enter.prevent="search(key)"/>
                    <div class="search-icon-box">
                        <Icon ref="searchIcon" type="ios-search" size="18" @click="search(key)"/>
                    </div>
                    <!--迷你搜索栏-->
                    <m-small-search-box v-show="canShowSmallSearchBox" ref="smallSearch" :smartSearch="smartSearch"
                                        :searchKey="searchKey"
                                        @search="search" @quickSearch="quickSearch"/>
                </div>
            </div>
            <div class="header-right">
                <div class="tools_box">
                    <div class="close-box" title="关闭" @click="close">
                        <Icon type="ios-close" size="24"/>
                    </div>
                    <div class="maximize-box" @click="clickMaximize">
                        <Icon class="btn" type="ios-expand" title="最大化" size="18" v-if="!isMaximize"/>
                        <Icon class="btn" type="ios-contract" title="还原" size="18" v-else/>
                    </div>
                    <div class="minimize-box" title="最小化" @click="clickMinimize">
                        <Icon type="ios-remove" size="24"/>
                    </div>
                </div>
                <div class="setting-box" title="设置">
                    <Icon type="md-settings" size="18"/>
                </div>
                <div class="setting-network" title="改变网络连接" @click="openChangeNetwork">
                    <Icon type="ios-globe-outline" size="20"/>
                </div>
                <div class="setting-theme">
                    <Icon class="theme-icon" type="ios-shirt-outline" title="主题切换" size="18"
                          @click="canTheme=!canTheme"/>
                    <div class="themes-box" v-if="canTheme">
                        <div class="theme-item" v-for="(theme,index) in themeInfo" :key="index"
                             @click="changeTheme(theme.themeType)">
                            <span>{{theme.themeName}}</span>
                        </div>
                    </div>
                </div>
                <div class="user-login-info" v-if="loginUser === null">
                    <div class="user-name-box" @click="_needLogin">
                        <div class="user-name">{{loginStatus}}</div>
                        <div class="down-select-icon">
                            <Icon type="md-arrow-dropdown"/>
                        </div>
                    </div>
                    <div class="user-head-img-box" @click="_needLogin">
                        <img ondragstart="return false" class="img" src="../../resources/images/person_300.png"
                             alt="请登录">
                    </div>
                </div>

                <div class="user-login-info" v-else>
                    <div class="user-name-box user-name-box-login" @click="openSmallInfo">
                        <div class="user-name" v-html="loginUser.userNick"></div>
                        <div class="down-select-icon">
                            <Icon type="md-arrow-dropdown"/>
                        </div>
                    </div>
                    <div class="user-head-img-box">
                        <img ondragstart="return false" class="img"
                             v-lazy="handleLazyImage(loginUser.userHeaderURL === ''?'https://y.gtimg.cn/mediastyle/global/img/person_300.png?max_age=2592000':loginUser.userHeaderURL)"
                             :alt="loginUser.userNick"
                             @click="toUserPage"
                             :key="loginUser.userHeaderURL === ''?'https://y.gtimg.cn/mediastyle/global/img/person_300.png?max_age=2592000':loginUser.userHeaderURL"
                        >
                    </div>
                    <m-user-small-info ref="smallInfo" class="small-info" @changeUser="changeUser"
                                       @toUserPage="toUserPage"/>
                </div>
            </div>
        </div>
        <m-change-network ref="networkBox"/>
        <!--退出登录提示框-->
        <m-logout ref="logoutBox" @logout="logout"/>
        <m-tips ref="tips" :width="200"/>
    </Header>
</template>

<script>
  import { Header, Icon, Input } from 'view-design'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import MLogin from '../../components/m-login-box/m-login/m-login'
  import MUserSmallInfo from '../../components/m-user-small-info/m-user-small-info'
  import MLogout from '../../components/m-logout/m-logout'
  import MSmallSearchBox from '../m-body/m-search/m-small-search-box'
  import { createSmartSearchData } from '../../common/js/createReqData'
  import { smartSearch } from '../../api/search'
  import MTips from '../../components/m-tips/m-tips'
  import UserDefLazyImg from '../../resources/images/person_300.png'
  import MChangeNetwork from '../../components/m-change-network/m-change-network'
  import { themeInfo } from '../../common/js/theme-config'

  export default {
    name: 'm-header',
    components: {
      MChangeNetwork,
      MTips,
      MSmallSearchBox,
      MLogout,
      MUserSmallInfo,
      MLogin,
      Header,
      Input,
      Icon
    },
    data () {
      return {
        key: '',
        searchKey: '',
        smartSearch: null,
        isMaximize: false,
        canBack: false,
        canNext: false,
        canShowSmallSearchBox: false,
        canTheme: false,
        loginStatus: '点击登录',
        themeInfo: themeInfo
      }
    },
    computed: {
      ...mapGetters([
        'loginUser',
        'routerStackPointer'
      ]),
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: UserDefLazyImg,
            loading: UserDefLazyImg
          }
        }
      }
    },
    created () {
      this.$nextTick(() => {
        document.addEventListener('click', e => {
          const v = document.getElementsByClassName('setting-theme')[0]
          if (v) {
            if (!v.contains(event.target)) {
              this.canTheme = false
            }
          }
        })
      })
    },
    mounted () {
      if (window.ipcRenderer) {
        window.ipcRenderer.on('max', (event, arg) => {
          this.isMaximize = true
        })

        window.ipcRenderer.on('min', (event, arg) => {
          this.isMaximize = false
        })
      }
    },
    methods: {
      changeTheme (themeType) {
        this.canTheme = false
        this.$emit('changeTheme', themeType)
      },
      quickSearch (key) {
        this.key = key.trim()
        this._smartSearch()
        this.closeSmallSearch()
        this.search(this.key)
      },
      search (key) {
        if (key === '') {
          return
        }
        this.closeSmallSearch()
        this.$refs.searchInput.blur()
        let router = `/search`
        this.setSearchKey(key)
        this.addSearchHistory(key)
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      openChangeNetwork () {
        this.$refs.networkBox.open()
      },
      openTips (tips) {
        this.$refs.tips.showTips(tips)
      },
      closeTips () {
        this.$refs.tips.closeTips()
      },
      // 打开迷你搜索框
      openSmallSearch () {
        this.canShowSmallSearchBox = true
        this.$refs.smallSearch.openSmallSearchBox()
      },
      closeSmallSearch () {
        this.canShowSmallSearchBox = false
        this.$refs.smallSearch.closeSmallSearchBox()
      },
      changeInput (e) {
        this.key = e.target.value
        if (this.key === ' ' || this.key === '') {
          this.smartSearch = null
        } else {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            this._smartSearch()
          }, 200)
        }
      },
      async _smartSearch () {
        if (this.key === '') {
          this.smartSearch = null
          return
        }
        let key = this.key
        let reqData = createSmartSearchData(key)
        let res = await smartSearch(reqData)
        if (res.code === 500) {
          // 提示用户
          this.openTips(`≥﹏≤，搜索出现了点小问题`)
          // 下一首
          setTimeout(() => {
            this.closeTips()
          }, 2000)
          return
        }
        let data = res.data
        if (data && data.singer.count === 0 && data.album.count === 0 && data.song.count === 0) {
          // 搜索结果为空，不保留
          return
        }
        if (this.key !== key) {
          // 输入框已经改变，但请求没有完成，放弃本次请求结果
          return
        }
        this.searchKey = this.key
        this.smartSearch = res.data
      },
      logout () {
        this.setLoginUser(null)
        this.setToken(null)
        this.setUserFavoriteDisst(null)
        this.setUserFavoriteSongList(null)
        this.openLogOut = false
        this.$router.push('/findMusic')
        this.routerStack.init()
        this.routerStack.push('/findMusic/recommend')
        this.setRouterStackPointer(this.routerStack.pointer)
      },
      _needLogin () {
        this.setNeedLogin(true)
      },
      changeUser () {
        this.$refs.logoutBox.openLogoutPage()
      },
      toUserPage () {
        this.$refs.smallInfo.closeSmallInfo()
        let router = `/user_info/${this.loginUser.id}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      openSmallInfo () {
        this.$refs.smallInfo.openSmallInfo()
      },
      searchBlur () {
        this.$emit('searchBlur')
      },
      prev () {
        if (this.routerStack.canBack()) {
          let router = this.routerStack.back()
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace(router)
        }
      },
      next () {
        if (this.routerStack.canNext()) {
          let router = this.routerStack.next()
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace(router)
        }
      },
      clickMaximize () {
        if (window.ipcRenderer) {
          if (this.isMaximize) {
            window.ipcRenderer.send('max')
          } else {
            window.ipcRenderer.send('max')
          }
        }
      },
      close () {
        if (window.ipcRenderer) {
          window.ipcRenderer.send('close')
        }
      },
      clickMinimize () {
        if (window.ipcRenderer) {
          window.ipcRenderer.send('min')
        }
      },
      ...mapMutations({
        setSearchKey: 'SET_SEARCH_KEY',
        setLoginUser: 'SET_LOGIN_USER',
        setToken: 'SET_USER_TOKEN',
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER',
        setNeedLogin: 'SET_NEED_LOGIN',
        setUserFavoriteDisst: 'SET_LOGIN_USER_FAVORITE_DISSTS',
        setUserFavoriteSongList: 'SET_LOGIN_USER_FAVORITE_SONG_LIST'
      }),
      ...mapActions([
        'addSearchHistory'
      ])
    },
    watch: {
      routerStackPointer () {
        this.canBack = this.routerStack.canBack()
        this.canNext = this.routerStack.canNext()
      }
    }
  }
</script>

<style scoped lang="less">
    .m-header {
        user-select: none;
        width: 100%;
        background-color: var(--header-background-color);
        height: 50px;
        min-width: 1020px;
        padding: 12px 16px;
        position: relative;
        -webkit-app-region: drag;
        color: var(--font-base-color);

        .m-header-wrapper {
            height: 26px;
            line-height: 26px;

            .header-left {
                height: 26px;
                float: left;

                .logo-box {
                    float: left;
                    height: 26px;
                    margin-right: 60px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    width: 120px;
                    position: relative;
                    top: -3px;

                    .logo_img {
                        width: 100%;
                        user-select: none;
                    }
                }

                .prev-next {
                    height: 26px;
                    width: 60px;
                    float: left;
                    color: var(--header-button-icon-color);
                    margin-right: 10px;
                    position: relative;
                    -webkit-app-region: no-drag;

                    .prev {
                        width: 30px;
                        height: 26px;
                        line-height: 26px;
                        text-align: center;
                        float: left;
                        margin-right: -1px;

                        .icon:hover {
                            cursor: pointer;
                            color: var(--font-active-color);
                        }
                    }

                    .next {
                        width: 30px;
                        height: 26px;
                        line-height: 26px;
                        text-align: center;
                        float: left;
                        left: 17px;

                        .icon:hover {
                            cursor: pointer;
                            color: var(--font-active-color);
                        }
                    }

                    .disabled {
                        cursor: default !important;
                        color: var(--header-button-icon-disable-color) !important;
                    }
                }

                .search_box {
                    position: relative;
                    -webkit-app-region: no-drag;
                    float: left;
                    height: 26px;
                    width: 220px;
                    padding: 0 0 0 15px;
                    border-radius: 26px;
                    background: var(--search-background-color);
                    text-align: center;

                    .search {
                        display: inline-block;
                        height: 26px;
                        width: 175px;
                        border: none;
                        outline: none;
                        color: var(--font-base-color);
                        background: var(--search-background-color);
                    }

                    .search-icon-box {
                        color: var(--header-button-icon-color);
                        float: right;
                        height: 26px;
                        width: 26px;
                    }

                    .search-icon-box:hover {
                        color: var(--font-active-color);
                        cursor: pointer;
                    }
                }
            }

            .header-right {
                height: 26px;
                float: right;

                .tools_box {
                    margin-left: 20px;
                    display: inline-block;
                    float: right;
                    text-align: center;
                    -webkit-app-region: no-drag;

                    .close-box {
                        color: var(--header-button-icon-color);
                        float: right;
                        height: 26px;
                        width: 26px;
                    }

                    .maximize-box {
                        color: var(--header-button-icon-color);
                        float: right;
                        height: 26px;
                        width: 26px;
                        margin: 0 5px;
                    }

                    .minimize-box {
                        color: var(--header-button-icon-color);
                        float: right;
                        height: 26px;
                        width: 26px;
                    }

                    .close-box:hover {
                        color: var(--font-active-color);
                        cursor: pointer;
                    }

                    .maximize-box:hover {
                        color: var(--font-active-color);
                        cursor: pointer;
                    }

                    .minimize-box:hover {
                        color: var(--font-active-color);
                        cursor: pointer;
                    }
                }

                .setting-box {
                    float: right;
                    display: inline-block;
                    width: 30px;
                    text-align: center;
                    border-right: 1px solid #000000;
                    color: var(--header-button-icon-color);
                    -webkit-app-region: no-drag;
                }

                .setting-box:hover {
                    color: var(--font-active-color);
                    cursor: pointer;
                }

                .setting-network {
                    float: right;
                    display: inline-block;
                    width: 30px;
                    text-align: center;
                    color: var(--header-button-icon-color);
                    -webkit-app-region: no-drag;
                }

                .setting-network:hover {
                    color: var(--font-active-color);
                    cursor: pointer;
                }

                .setting-theme {
                    position: relative;
                    float: right;
                    display: inline-block;
                    width: 30px;
                    text-align: center;
                    color: var(--header-button-icon-color);
                    -webkit-app-region: no-drag;

                    .themes-box {
                        position: absolute;
                        width: 80px;
                        z-index: 10;
                        background-color: var(--select-active-background-color);
                        left: -23px;

                        .theme-item:hover {
                            cursor: pointer;
                            color: var(--font-active-color);
                        }
                    }

                    .theme-icon:hover {
                        color: var(--font-active-color);
                        cursor: pointer;
                    }
                }

                .user-login-info {
                    position: relative;
                    height: 26px;
                    width: 120px;
                    display: inline-block;
                    -webkit-app-region: no-drag;

                    .user-head-img-box {
                        height: 26px;
                        width: 26px;
                        float: right;

                        .img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            display: block;
                            cursor: pointer;
                        }
                    }

                    .user-name-box {
                        float: right;
                        padding: 0 14px 0 10px;
                        max-width: 94px;
                        position: relative;

                        .user-name {
                            color: var(--font-tow-color);
                            height: 26px;
                            line-height: 26px;
                            font-size: 12px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .down-select-icon {
                            color: var(--header-button-icon-color);
                            position: absolute;
                            right: 0;
                            top: 0;
                        }
                    }

                    .user-name-box:hover {
                        cursor: pointer;

                        .user-name {
                            color: var(--font-active-color);
                        }

                        .down-select-icon {
                            color: var(--font-active-color);
                        }
                    }

                    .small-info {
                        position: absolute;
                    }
                }
            }
        }
    }
</style>
