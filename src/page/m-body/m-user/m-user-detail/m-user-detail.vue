<template>
    <Content class="m-user-detail-box" v-if="loginUser !== null">
        <div class="m-user-detail-box-content">
            <div class="m-user-detail">
                <div class="user-detail-header">
                    <!--左侧的头像-->
                    <div class="user-header-img-box">
                        <img class="user-header-img" ondragstart="return false"
                             v-lazy="handleLazyImage(loginUser.userHeaderURL === ''?'https://y.gtimg.cn/mediastyle/global/img/person_300.png?max_age=2592000':loginUser.userHeaderURL)"
                             :alt="loginUser.userNick"
                             :key="loginUser.userHeaderURL === ''?'https://y.gtimg.cn/mediastyle/global/img/person_300.png?max_age=2592000':loginUser.userHeaderURL">
                    </div>
                    <!--用户信息-->
                    <div class="user-info-box">
                        <div class="user-nick">
                            <p v-html="loginUser.userNick"></p>
                            <div class="modify-user-info-btn" @click="toEditPage">编辑个人信息</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Content>
</template>

<script>
  import { Content } from 'view-design'
  import { mapGetters, mapMutations } from 'vuex'
  import UserDefLazyImg from '../../../../resources/images/person_300.png'

  export default {
    name: 'm-user-detail',
    components: {
      Content
    },
    computed: {
      ...mapGetters([
        'loginUser'
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
    methods: {
      toEditPage () {
        let router = `/user_edit/${this.loginUser.id}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    }
  }
</script>

<style lang="less">
    @import "../../../../common/css/theme/theme";

    .m-user-detail-box {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        width: 100%;
        overflow: hidden;

        ::selection {
            background: #d3d3d3;
            color: #ffffff;
        }

        .m-user-detail-box-content {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 0 30px 20px 30px;

            .m-user-detail {
                padding-top: 20px;
                position: relative;

                .user-detail-header {
                    height: 200px;
                    padding-left: 200px;

                    .user-header-img-box {
                        position: absolute;
                        left: 0;
                        width: 200px;
                        height: 200px;
                        float: left;

                        .user-header-img {
                            width: 100%;
                            height: 100%;
                            display: block;
                            border-radius: 10px;
                        }
                    }

                    .user-info-box {
                        padding-left: 30px;
                        width: 100%;
                        height: 200px;
                        float: left;

                        .user-nick {
                            p {
                                color: #f2f2f2;
                                font-size: 24px;
                                display: inline-block
                            }

                            .modify-user-info-btn {
                                font-size: 12px;
                                float: right;
                                color: #ffffff;
                                width: 90px;
                                height: 20px;
                                line-height: 20px;
                                text-align: center;
                                background: #2c2e32;
                                border-radius: 3px;
                                cursor: pointer;
                            }

                            .modify-user-info-btn:hover {
                                background: #46494f;
                            }
                        }
                    }
                }
            }
        }

        .m-user-detail-box-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .m-user-detail-box-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .m-user-detail-box-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-user-detail-box-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-user-detail-box-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-user-detail-box-content::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .m-user-detail-box-content::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }

        .m-user-detail-box-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-user-detail-box-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-user-detail-box-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-user-detail-box-content::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        .m-user-detail-box-content::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }
    }
</style>
