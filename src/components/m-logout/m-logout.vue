<template>
    <div class="max" ref="logout">
        <div class="m-logout-box">
            <div class="header">
                <span>退出登录</span>
                <Icon class="close" type="ios-close" size="24" @click="closeLogoutPage"/>
            </div>
            <div class="division-line"></div>
            <div class="content">
                <div class="box">
                    <Icon class="icon" type="ios-alert-outline" size="40"/>
                </div>
                <p>您确定要退出或切换账号吗？</p>
            </div>
            <div class="btns">
                <div class="btn close-btn" @click="closeLogoutPage">取消</div>
                <div class="btn yes-btn" @click="logout">确定</div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'

  export default {
    name: 'm-logout',
    components: {
      Icon
    },
    methods: {
      openLogoutPage () {
        this.$refs.logout.style.zIndex = 100
        this.$refs.logout.style.opacity = 1
        this.$refs.logout.style.transform = 'translate3d(0, 0, 0) scale(1)'
      },
      closeLogoutPage () {
        this.$refs.logout.style.opacity = 0
        this.$refs.logout.style.transform = 'translate3d(0, 0, 0) scale(.7)'
        setTimeout(() => {
          this.$refs.logout.style.zIndex = -100
        }, 200)
      },
      logout () {
        this.closeLogoutPage()
        this.$emit('logout')
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

        .m-logout-box {
            position: fixed;
            width: 600px;
            height: 230px;
            background: #29292b;
            z-index: 15;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            user-select: none;

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
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 129px;
                padding: 0 40px;

                .box {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

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
                    background: #343438;
                }

                .close-btn:hover {
                    cursor: pointer;
                    background: #3b3c3f;
                }

                .yes-btn {
                    background: #4f4f4f;
                }

                .yes-btn:hover {
                    cursor: pointer;
                    background: #686868;
                }
            }
        }
    }
</style>
