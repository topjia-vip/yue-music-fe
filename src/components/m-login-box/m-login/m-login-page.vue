<template>
    <div class="login-page" ref="login">
        <div class="close-box">
            <Icon class="close-btn" type="ios-close" size="33" @click="closeLoginPage"/>
        </div>
        <div class="title">
            <h1 class="content">Yue Music</h1>
        </div>
        <form>
            <div class="yue-music-input">
                <div class="input-container" :class="handleClass('account')">
                    <Icon class="icon" :class="handleClass('account')" type="md-person" size="18"/>
                    <input ref="accountInput" type="text" :value="account"
                           autofocus="autofocus"
                           @input="changeInput($event,'account')"
                           @focus="focus('account')"
                           @blur="blur('account')"
                           @keypress.enter.prevent="login"
                    >
                    <div class="input-label" :class="account === ''?'':'label-at-top'">手机号/邮箱</div>
                </div>
                <div class="error-label" :class="accountError?'error-at-bottom':''">{{errorMessage}}</div>
            </div>
            <div class="baffle"></div>
            <div class="yue-music-input">
                <div class="input-container" :class="handleClass('password')">
                    <Icon class="icon" :class="handleClass('password')" type="md-lock" size="18"/>
                    <input ref="passwordInput" type="password" :value="password"
                           @input="changeInput($event,'password')"
                           @focus="focus('password')"
                           @blur="blur('password')"
                           @keypress.enter.prevent="login"
                    >
                    <div class="input-label" :class="password === ''?'':'label-at-top'">密码</div>
                </div>
                <div class="error-label" :class="passwordError?'error-at-bottom':''">{{errorMessage}}</div>
            </div>
        </form>
        <div class="to-register">
            <span class="tip">没有账号?点击右侧前往注册</span>
            <span class="to-register-btn" @click="toRegister">立即注册</span>
        </div>
        <div class="yue-music-button">
            <div class="submit-btn" @click="login">
                <span>登录</span>
            </div>
        </div>
        <m-poptip class="tips" ref="tips" :content="tips" :height="80"></m-poptip>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { mapGetters, mapMutations } from 'vuex'
  import { checkLoginUserToken, login } from '../../../api/user'
  import { ERR_OK } from '../../../api/config'
  import { _normalizeSongs } from '../../../common/js/util'
  import MPoptip from '../../m-poptip/m-poptip'

  export default {
    name: 'm-login-page',
    components: {
      MPoptip,
      Icon
    },
    data () {
      return {
        focusType: 0,
        account: '',
        password: '',
        accountError: false,
        passwordError: false,
        errorMessage: '',
        isLogin: false,
        tips: ''
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ]),
      handleClass () {
        return (type) => {
          switch (type) {
            case 'account': {
              if (this.accountError) {
                return 'error'
              } else {
                return this.focusType === 1 ? 'focus' : ''
              }
            }
            case 'password': {
              if (this.passwordError) {
                return 'error'
              } else {
                return this.focusType === 2 ? 'focus' : ''
              }
            }
          }
        }
      }
    },
    methods: {
      login () {
        // 防止多次点击登录，重复登录
        if (this.isLogin) {
          return
        } else {
          this.isLogin = true
        }
        this.$refs.accountInput.blur()
        this.$refs.passwordInput.blur()
        // 校验
        if (!this.account || !this.password) {
          this.tips = '请输入账号信息'
          this.$refs.tips.openTip()
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$refs.tips.closeTip()
            this.isLogin = false
          }, 1500)
          return
        }
        let reqData = {
          account: this.account,
          userPassword: this.password
        }
        this.tips = `登录中<span class="dot">...</span>`
        this.$refs.tips.openTip()
        setTimeout(() => {
          login(reqData).then(res => {
            if (res.code === ERR_OK) {
              if (res.data.status === 0) {
                // 存储用户登录保存信息，区分用户歌单、歌曲收藏数据与用户登录数据
                this.setLoginUser(res.data.data.user)
                this.setUserToken(res.data.data.token)
                this.setUserFavoriteDisst(res.data.data.favoriteDissts)
                this.setUserFavoriteSongList(_normalizeSongs(res.data.data.favoriteSongs))
                // 开启心跳检测登录用户有效期
                this.checkLoginUser()
                // 登录成功
                this.loginSuccess()
              } else {
                this.errorMessage = res.data.message
                if (res.data.status === 3) {
                  // 密码错误
                  this.loginError('password')
                } else {
                  // 用户未注册
                  this.loginError('account')
                }
              }
            } else {
              this.tips = '网络繁忙!'
              setTimeout(() => {
                this.$refs.tips.closeTip()
                this.isLogin = false
              }, 1000)
            }
          })
        }, 500)
      },
      // 登录成功
      loginSuccess () {
        this.tips = '登录成功'
        setTimeout(() => {
          this.$refs.tips.closeTip()
          setTimeout(() => {
            this.closeLoginPage()
            this.isLogin = false
          }, 100)
        }, 1000)
      },
      // 登录失败
      loginError (type) {
        switch (type) {
          case 'account': {
            this.accountError = true
            this.$refs.accountInput.focus()
            break
          }
          case 'password': {
            this.passwordError = true
            this.$refs.passwordInput.focus()
            break
          }
        }
        this.tips = this.errorMessage
        setTimeout(() => {
          this.$refs.tips.closeTip()
          this.isLogin = false
        }, 1000)
      },
      // 心跳检查登录用户是否过期
      checkLoginUser () {
        this.checkLoginhUserTimer = setInterval(() => {
          if (this.token === null) {
            clearInterval(this.checkLoginhUserTimer)
            return
          }
          checkLoginUserToken().then(res => {
            if (res.code !== ERR_OK) {
              // 登录用户token已过期
              clearInterval(this.checkLoginhUserTimer)
              console.log('用户登录过期')
              this.logout()
              this.closeLoginBox()
              this.$emit('showTips')
            }
          })
        }, 5000)
      },
      // 退出登录
      logout () {
        this.setLoginUser(null)
        this.setUserToken(null)
        this.setUserFavoriteDisst(null)
        this.setUserFavoriteSongList(null)
        this.openLogOut = false
        this.$router.push('/findMusic')
        this.routerStack.init()
        this.routerStack.push('/findMusic/recommend')
        this.setRouterStackPointer(this.routerStack.pointer)
      },
      // 关闭登录页面
      closeLoginPage () {
        this.closeLoginBox()
        setTimeout(() => {
          this.account = ''
          this.password = ''
          this.$emit('closeLoginPage')
        }, 200)
      },
      openLoginBox () {
        this.$refs.login.style.zIndex = 1100
        this.$refs.login.style.opacity = 1
        this.$refs.login.style.transform = 'translate3d(0, 0, 0) scale(1)'
      },
      closeLoginBox () {
        this.$refs.login.style.opacity = 0
        this.$refs.login.style.transform = 'translate3d(0, 0, 0) scale(.7)'
        setTimeout(() => {
          this.$refs.login.style.zIndex = -10
        }, 200)
      },
      // 打开浏览器注册
      toRegister () {
        if (window.ipcRenderer) {
          window.ipcRenderer.send('open-url', 'http://www.topjia.cn/')
        } else {
          window.open('http://www.topjia.cn/')
        }
      },
      // 输入框值改变事件
      changeInput (event, type) {
        switch (type) {
          case 'account': {
            this.accountInput(event.target.value)
            break
          }
          case 'password': {
            this.passwordInput(event.target.value)
            break
          }
        }
      },
      accountInput (value) {
        this.account = value
        this.accountError = false
      },
      passwordInput (value) {
        this.password = value
        this.passwordError = false
      },
      // 输入框聚焦
      focus (type) {
        switch (type) {
          case 'account': {
            this.focusType = 1
            break
          }
          case 'password': {
            this.focusType = 2
            break
          }
        }
      },
      // 输入框失焦
      blur (type) {
        switch (type) {
          case 'account': {
            this.focusType = 0
            break
          }
          case 'password': {
            this.focusType = 0
            break
          }
        }
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER',
        setLoginUser: 'SET_LOGIN_USER',
        setUserToken: 'SET_USER_TOKEN',
        setNeedLogin: 'SET_NEED_LOGIN',
        setUserFavoriteDisst: 'SET_LOGIN_USER_FAVORITE_DISSTS',
        setUserFavoriteSongList: 'SET_LOGIN_USER_FAVORITE_SONG_LIST'
      })
    }
  }
</script>

<style lang="less">
    @import "../../../common/css/theme/theme-active";

    .login-page {
        user-select: none;
        display: flex;
        justify-content: space-between;
        flex-flow: column;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 360px;
        height: 460px;
        padding: 40px;
        background-color: #FFFFFF;
        z-index: -10;
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(.7);
        transition: transform 200ms, opacity 200ms;
        box-shadow: 0 0 20px 0px #171717;

        .close-box {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            .close-btn {
                color: #b3b3b3;
            }

            .close-btn:hover {
                cursor: pointer;
                color: #1a1c20;
            }
        }

        .title {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            user-select: none;
            color: #4ea4dc;
        }

        .baffle {
            width: 100%;
            padding: 10px;
        }

        .yue-music-input {
            position: relative;
            width: 100%;
            padding-top: 20px;
            margin-bottom: 20px;

            .input-container {
                position: relative;
                display: flex;
                border-bottom: 1px solid #f5f5f5;
                padding-left: 20px;
                z-index: 10;
                background-color: #FFFFFF;

                .icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    left: 0;
                    height: 40px;
                    width: 20px;
                    color: #b3b3b3;
                    transition: color 200ms ease;
                }

                .focus {
                    color: #4ea4dc;
                }

                .error {
                    color: #f73131;
                }

                input {
                    user-select: text;
                    outline: none;
                    position: relative;
                    flex: 1;
                    z-index: 2;
                    border: none;
                    width: 100%;
                    height: 40px;
                    line-height: 28px;
                    font-size: 16px;
                    color: #4c4c4c;
                    font-weight: 300;
                    padding: 6px 0;
                    background-color: transparent;
                }

                ::selection {
                    color: #FFFFFF;
                    background-color: #b3b3b3;
                }

                .input-label {
                    position: absolute;
                    z-index: 1;
                    top: 0;
                    left: 20px;
                    height: 40px;
                    line-height: 28px;
                    padding: 6px 0;
                    font-size: 16px;
                    color: #b3b3b3;
                    transform: translate3d(0, 0, 0) scale(1);
                    transition: transform 200ms, font-size 200ms;
                    font-weight: 300;
                }

                .label-at-top {
                    transform: translate3d(-20px, -80%, 0) scale(0.95);
                }
            }

            .error-label {
                position: absolute;
                left: 0;
                top: 20px;
                height: 40px;
                padding: 6px 0;
                line-height: 28px;
                color: #f73131;
                opacity: 0;
                transform: translate3d(0, 0, 0);
                transition: transform 200ms, opacity 200ms ease;
            }

            .error-at-bottom {
                opacity: 1;
                transform: translate3d(0, 100%, 0);
            }

            .input-container:after {
                content: "";
                position: absolute;
                left: 0;
                bottom: -1px;
                width: 0;
                border-bottom: 1px solid #4ea4dc;
                transition: width .3s ease;
            }

            .input-container.focus:after {
                width: 100%;
            }

            .input-container.error:after {
                width: 100%;
                border-bottom: 1px solid #f73131;
            }
        }

        .to-register {
            user-select: none;
            height: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #4ea4dc;

            .tip {
                color: #b3b3b3;
            }

            .to-register-btn:hover {
                cursor: pointer;
                color: #0aabfa;
            }
        }

        .yue-music-button {
            user-select: none;
            height: 50px;
            width: 100%;
            border-radius: 5px;
            overflow: hidden;

            .submit-btn {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: #4ea4dc;
                color: #FFFFFF;
                font-size: 20px;
                font-weight: bold;
            }

            .submit-btn:hover {
                background-color: #0aabfa;
            }
        }

        .tips {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
        }
    }
</style>
