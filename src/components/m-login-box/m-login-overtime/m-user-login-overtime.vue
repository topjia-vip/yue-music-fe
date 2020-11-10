<template>
    <div class="max" ref="loginOverTime">
        <div class="user-login-overtime">
            <div class="header">
                <span>登录超时</span>
                <Icon class="close" type="ios-close" size="24" @click="closeBox"/>
            </div>
            <div class="division-line"></div>
            <div class="content">
                <div class="box">
                    <Icon class="icon" type="ios-alert-outline" size="40"/>
                </div>
                <p>检测到您本次登录会话超时，请重新登录</p>
            </div>
            <div class="btns">
                <div class="btn close-btn" @click="closeBox">取消</div>
                <div class="btn yes-btn" @click="toLogin">重新登录</div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'

  export default {
    name: 'm-user-login-overtime',
    components: {
      Icon
    },
    methods: {
      closeBox () {
        this.closeLoginOverTimePage()
        setTimeout(() => {
          this.$emit('closeBox')
        }, 200)
      },
      toLogin () {
        this.closeLoginOverTimePage()
        setTimeout(() => {
          this.$emit('toLogin')
        }, 200)
      },
      openLoginOverTimePage () {
        this.$refs.loginOverTime.style.zIndex = 100
        this.$refs.loginOverTime.style.opacity = 1
        this.$refs.loginOverTime.style.transform = 'translate3d(0, 0, 0) scale(1)'
      },
      closeLoginOverTimePage () {
        this.$refs.loginOverTime.style.opacity = 0
        this.$refs.loginOverTime.style.transform = 'translate3d(0, 0, 0) scale(.7)'
        setTimeout(() => {
          this.$refs.loginOverTime.style.zIndex = -100
        }, 200)
      }
    }
  }
</script>

<style lang="less">
    .max {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -100;
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(.7);
        transition: transform 200ms, opacity 200ms;

        .user-login-overtime {
            position: fixed;
            width: 600px;
            height: 230px;
            background: var(--select-dropdown-background-color);
            color: var(--font-base-color);
            z-index: -10;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            user-select: none;
            box-shadow: 0 0 20px 0px #171717;

            .header {
                padding: 0 20px;
                height: 60px;
                line-height: 60px;
                font-size: 16px;

                .close {
                    position: absolute;
                    right: 10px;
                    top: 15px;
                    color: var(--font-tow-color);
                }

                .close:hover {
                    cursor: pointer;
                    color: var(--font-active-color);
                }
            }

            .division-line {
                width: 100%;
                height: 1px;
                background: var(--select-active-background-color);
            }

            .content {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 129px;
                padding: 0 40px;

                .box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 40px;
                    height: 40px;

                    .icon {
                        display: inline-block;
                        margin-right: 10px;
                    }
                }

                p {
                    display: inline-block;
                }
            }

            .btns {
                .btn {
                    text-align: center;
                    display: inline-block;
                    width: 100px;
                    height: 30px;
                    line-height: 30px;
                    float: right;
                    margin-right: 10px;
                    border-radius: 30px;
                }

                .close-btn {
                    background: var(--select-active-background-color);
                }

                .close-btn:hover {
                    cursor: pointer;
                    background: var(--select-dropdown-hover-background-color);
                }

                .yes-btn {
                    background: var(--select-dropdown-hover-background-color);
                }

                .yes-btn:hover {
                    cursor: pointer;
                    background: var(--select-active-background-color);
                }
            }
        }
    }
</style>
