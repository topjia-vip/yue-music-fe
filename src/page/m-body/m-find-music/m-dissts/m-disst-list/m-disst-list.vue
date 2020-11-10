<template>
    <div class="container">
        <div class="m-dissts-box">
            <div class="item disst-item"
                 v-for="(disst,index) in dissts" :key="disst.disstId">
                <div class="disst-bottom"></div>
                <div class="disst-img-box">
                    <div class="visitnum-box">
                        <div class="visitnum">
                            <Icon type="ios-headset"/>
                            <span>{{handleVisitNum(disst.visitnum)}}</span>
                        </div>
                    </div>
                    <img ondragstart="return false" class="disst-img"
                         v-lazy="handleLazyImage(disst.disstLogo)"
                         :alt="disst.disstName"
                         :key="disst.disstLogo"
                    >
                    <div class="img-mask" @click="songListDetail(disst)"></div>
                    <m-play-btn class="play-icon-box" :font-size="60"
                                @play="playDisst(index)"/>
                    <div class="create-user">
                        <div class="user-name-box">
                            <i class="fa fa-user-o" aria-hidden="true"></i>
                            <div v-html="disst.nickname"/>
                        </div>
                    </div>
                </div>
                <div class="disst-name" @click="songListDetail(disst)">
                    <span class="text" v-html="disst.disstName"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import MPlayBtn from '../../../../../components/m-play-btn/m-play-btn'
  import DisstDefLazyImg from '../../../../../resources/images/album_300.png'

  export default {
    name: 'm-disst-list',
    components: { MPlayBtn, Icon },
    props: {
      dissts: {
        type: Array
      }
    },
    computed: {
      handleVisitNum () {
        return (number) => {
          if (number >= 10000) {
            const num = number / 10000
            return `${Math.round(num * 10) / 10}万`
          } else {
            return number
          }
        }
      },
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: DisstDefLazyImg,
            loading: DisstDefLazyImg
          }
        }
      }
    },
    methods: {
      songListDetail (disst) {
        this.$emit('songListDetail', disst)
      },
      playDisst (index) {
        this.$emit('playDisst', index)
      }
    }
  }
</script>

<style lang="less">
    .container {
        margin-right: -15px;

        .m-dissts-box {
            margin-top: 20px;
            width: 100%;
            position: relative;
            margin-right: -15px;
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;

            .item {
                position: relative;
                width: 25%;
                padding: 0 15px 20px 0;
            }

            @media (min-width: 1070px) {
                .item {
                    width: 20%;
                }
            }

            .disst-item {
                position: relative;

                .disst-img-box {
                    position: relative;
                    transition: 0.2s ease-in-out;
                    top: 0;
                    z-index: 8;
                    overflow: hidden;
                    border-radius: 10px;
                    /*transform: translateY(0px);*/

                    .visitnum-box {
                        position: absolute;
                        top: 0;
                        right: 0;
                        width: 100%;
                        height: 20px;
                        line-height: 20px;
                        color: #FFFFFF;
                        font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                        background-image: linear-gradient(to right, #ffffff00, #000000a6);
                        transform: translate3d(0, 0, 0);
                        transition: transform 300ms;

                        .visitnum {
                            float: right;

                            span {
                                margin-right: 5px;
                                font-size: 12px;
                            }
                        }
                    }

                    .img-mask {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        background: #2828287a;
                        border-radius: 10px;
                        opacity: 0;
                        z-index: 1;
                        transition: opacity 300ms;
                    }

                    .create-user {
                        height: 20px;
                        line-height: 20px;
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        padding-left: 10px;
                        color: #FFFFFF;
                        background-image: linear-gradient(to right, #000000a6, #ffffff00);
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        transform: translate3d(0, 0, 0);
                        transition: transform 300ms;

                        .user-name-box {
                            float: left;

                            div {
                                display: inline-block;
                                margin-right: 5px;
                                font-size: 12px;
                            }
                        }

                        .user-name {
                            display: inline-block;
                            font-size: 12px;
                        }
                    }

                    .play-icon-box {
                        z-index: 11;
                        opacity: 0;
                        transform: translate3d(0, 0, 0) scale(.7);
                        transition: transform 300ms, opacity 300ms;
                    }

                    .disst-img {
                        display: block;
                        width: auto;
                        height: auto;
                        max-width: 100%;
                        max-height: 100%;
                    }

                }

                .disst-bottom {
                    position: absolute;
                    height: 10px;
                    width: 100%;
                    padding-right: 15px;
                    bottom: 80px;
                    cursor: pointer;
                    z-index: 5;
                }

                .disst-bottom:hover + .disst-img-box {
                    cursor: pointer;
                    transform: translateY(-10px);

                    .visitnum-box {
                        transform: translate3d(0, -20px, 0);
                    }

                    .create-user {
                        transform: translate3d(0, 20px, 0);
                    }

                    .img-mask {
                        opacity: 1;
                        z-index: 1;
                    }

                    .play-icon-box {
                        z-index: 11;
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }

                .disst-img-box:hover {
                    cursor: pointer;
                    transform: translateY(-10px);

                    .visitnum-box {
                        transform: translate3d(0, -20px, 0);
                    }

                    .create-user {
                        transform: translate3d(0, 20px, 0);
                    }

                    .img-mask {
                        opacity: 1;
                    }

                    .play-icon-box {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }

                .disst-name {
                    margin-top: 5px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;

                    .text {
                        color: var(--font-base-color);
                    }

                    .text:hover {
                        cursor: pointer;
                        color: var(--font-active-color);
                    }
                }
            }
        }
    }
</style>
