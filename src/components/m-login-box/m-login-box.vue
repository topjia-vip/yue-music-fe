<template>
    <div class="box">
        <!--登录框-->
        <m-login-page ref="login" @closeLoginPage="closeBox" @showTips="showTips"></m-login-page>
        <!--登录过期提示框-->
        <m-user-login-overtime ref="userLoginOverTime" @closeBox="closeBox"
                               @toLogin="toLogin"></m-user-login-overtime>
    </div>
</template>

<script>
  import MLogin from './m-login/m-login'
  import { mapGetters, mapMutations } from 'vuex'
  import { Icon } from 'view-design'
  import MUserLoginOvertime from './m-login-overtime/m-user-login-overtime'
  import MLoginPage from './m-login/m-login-page'

  export default {
    name: 'm-login-box',
    components: { MLoginPage, MUserLoginOvertime, MLogin, Icon },
    computed: {
      ...mapGetters([
        'needLogin'
      ])
    },
    methods: {
      closeBox () {
        this.setNeedLogin(false)
      },
      showTips () {
        this.$nextTick(() => {
          this.$refs.userLoginOverTime.openLoginOverTimePage()
        })
      },
      toLogin () {
        this.$nextTick(() => {
          this.$refs.login.openLoginBox()
        })
      },
      ...mapMutations({
        setNeedLogin: 'SET_NEED_LOGIN'
      })
    },
    watch: {
      needLogin (newValue) {
        if (newValue) {
            this.toLogin()
        }
      }
    }
  }
</script>

<style lang="less">
</style>
