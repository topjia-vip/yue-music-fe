<template>
    <div class="login-box" ref="login">
        <div class="header">
            <span>登录</span>
            <Icon class="close" type="ios-close" size="24" @click="closeLoginPage"/>
        </div>
        <div class="division-line"></div>
        <div class="content">
            <div class="user-name-input">
                <div class="user-name-box" ref="userNameInput">
                    <Icon type="md-person" size="18"/>
                    <input :value="account" @input="changeInputAccount($event)" class="user-name"
                           @keypress.enter.prevent="login" ref="userInput" placeholder="手机号/邮箱"/>
                </div>
                <div class="error-tips" ref="userNameErrorTips"></div>
            </div>
            <div class="password-input">
                <div class="password-box" ref="passwordInput">
                    <Icon type="md-lock" size="18"/>
                    <form style="display: contents">
                        <input type="password" :value="password" @input="changeInputPassword($event)" class="password"
                               placeholder="密码" autocomplete="off"
                               @keypress.enter.prevent="login" ref="password"/>
                    </form>
                </div>
                <div class="error-tips" ref="passwordErrorTips"></div>
            </div>
            <div class="to-register-box">
                <span @click="toRegister">没有账号?点击前往注册</span>
            </div>
            <div class="login-btn" @click="login">
                立即登录
            </div>
        </div>
        <m-poptip class="tips" ref="tips" :content="tips" :height="80"></m-poptip>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { checkLoginUserToken, login } from '../../../api/user'
  import { ERR_OK } from '../../../api/config'
  import { mapGetters, mapMutations } from 'vuex'
  import { _normalizeSongs } from '../../../common/js/util'
  import MPoptip from '../../m-poptip/m-poptip'

  export default {
    name: 'm-login',
    components: {
      MPoptip,
      Icon
    },
    props: {
      openLogin: {
        type: Boolean
      }
    },
    data () {
      return {
        account: '',
        password: '',
        tips: '',
        isLogin: false
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      login () {
        // 防止多次点击登录，重复登录
        if (this.isLogin) {
          return
        } else {
          this.isLogin = true
        }
        this.$refs.userInput.blur()
        this.$refs.password.blur()
        // 校验
        if (!this.account || !this.password) {
          this.tips = '请输入账号信息'
          this.$refs.tips.openTip()
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$refs.tips.closeTip()
            this.isLogin = false
          }, 1000)
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
                // 登录成功
                this.loginSuccess()
                // 存储用户登录保存信息，区分用户歌单、歌曲收藏数据与用户登录数据
                this.setLoginUser(res.data.data.user)
                this.setUserToken(res.data.data.token)
                this.setUserFavoriteDisst(res.data.data.favoriteDissts)
                this.setUserFavoriteSongList(_normalizeSongs(res.data.data.favoriteSongs))
                // 开启心跳检测登录用户有效期
                this.checkLoginUser()
              } else {
                if (res.data.status === 3) {
                  // 密码错误
                  this.loginErrorStatus(this.$refs.passwordInput, this.$refs.passwordErrorTips, res.data.message)
                  this.$refs.passwordInput.focus()
                } else {
                  // 用户未注册
                  this.loginErrorStatus(this.$refs.userNameInput, this.$refs.userNameErrorTips, res.data.message)
                  this.$refs.userInput.focus()
                }
                this.loginError(res.data.message)
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
              // TODO 弹窗+强制退出当前登录账号
              this.logout()
              this.$emit('showTips')
            }
          })
        }, 5000)
      },
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
      closeLoginPage () {
        this.closeLoginBox()
        setTimeout(() => {
          this.account = ''
          this.password = ''
          this.loginDefaultStatus(this.$refs.passwordInput, this.$refs.passwordErrorTips)
          this.loginDefaultStatus(this.$refs.userNameInput, this.$refs.userNameErrorTips)
          this.$emit('closeLoginPage')
        }, 200)
      },
      toRegister () {
        if (window.ipcRenderer) {
          window.ipcRenderer.send('open-url', 'http://www.topjia.cn/')
        } else {
          window.open('http://www.topjia.cn/')
        }
      },
      changeInputAccount (e) {
        this.account = e.target.value
        this.loginDefaultStatus(this.$refs.userNameInput, this.$refs.userNameErrorTips)
      },
      changeInputPassword (e) {
        this.password = e.target.value
        this.loginDefaultStatus(this.$refs.passwordInput, this.$refs.passwordErrorTips)
      },
      loginSuccess () {
        this.tips = '登录成功'
        this.loginSuccessStatus(this.$refs.passwordInput, this.$refs.passwordErrorTips)
        this.loginSuccessStatus(this.$refs.userNameInput, this.$refs.userNameErrorTips)
        setTimeout(() => {
          this.$refs.tips.closeTip()
          setTimeout(() => {
            this.closeLoginPage()
            this.isLogin = false
          }, 100)
        }, 1000)
      },
      loginError (msg) {
        this.tips = msg
        setTimeout(() => {
          this.$refs.tips.closeTip()
          this.isLogin = false
        }, 1000)
      },
      loginErrorStatus (line, tips, msg) {
        line.style.borderBottom = '1px solid red'
        tips.style.opacity = 1
        tips.innerHTML = msg
      },
      loginSuccessStatus (line, tips) {
        line.style.borderBottom = '1px solid #8BC34A'
        tips.style.opacity = 0
      },
      loginDefaultStatus (line, tips) {
        line.style.borderBottom = '1px solid #424242'
        tips.style.opacity = 0
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
    .login-box {
        position: fixed;
        width: 320px;
        height: 340px;
        background: #29292b;
        z-index: -10;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 10px;
        margin: auto;
        color: #ffffff;
        box-shadow: 0 0 5px 0 #000000;
        user-select: none;
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(.7);
        transition: transform 200ms, opacity 200ms;

        .header {
            padding: 0 20px;
            height: 60px;
            line-height: 60px;
            font-size: 16px;

            .close {
                position: absolute;
                right: 10px;
                top: 15px;
                color: #999999;
            }

            .close:hover {
                cursor: pointer;
                color: #ffffff;
            }
        }

        .division-line {
            width: 100%;
            height: 1px;
            background: #424242;
        }

        .content {
            margin-top: 30px;
            padding: 0 40px;

            ::selection {
                background: #ff938b;
            }

            .user-name-input {
                width: 100%;
                color: #999999;
                height: 70px;
                line-height: 30px;

                .user-name-box {
                    position: relative;
                    height: 30px;
                    border-bottom: 1px solid #424242;
                    transition: 0.5s;

                    .user-name {
                        margin-left: 10px;
                        user-select: text;
                        display: inline-block;
                        height: 26px;
                        width: 200px;
                        border: none;
                        outline: none;
                        color: #ffffff;
                        background: #29292b;
                    }
                }

                .error-tips {
                    transition: 0.5s;
                    font-size: 12px;
                    color: red;
                    opacity: 0;
                }
            }

            .password-input {
                width: 100%;
                color: #999999;
                height: 70px;
                line-height: 30px;

                .password-box {
                    height: 30px;
                    border-bottom: 1px solid #424242;
                    transition: 0.5s;

                    .password {
                        margin-left: 10px;
                        user-select: text;
                        display: inline-block;
                        height: 26px;
                        width: 200px;
                        border: none;
                        outline: none;
                        color: #ffffff;
                        background: #29292b;
                    }
                }

                .error-tips {
                    transition: 0.5s;
                    font-size: 12px;
                    color: red;
                    opacity: 0;
                }
            }

            .to-register-box {
                font-size: 12px;
                height: 30px;
                line-height: 30px;

                span:hover {
                    cursor: pointer;
                    color: #2cb5e8;
                }
            }

            .login-btn {
                margin-top: 20px;
                width: 100%;
                height: 40px;
                background: #636363;
                border-radius: 40px;
                text-align: center;
                line-height: 40px;
            }

            .login-btn:hover {
                background: #787878;
                cursor: pointer;
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
