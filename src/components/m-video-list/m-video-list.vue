<template>
    <div class="video-box" v-if="videos.length !== 0">
        <div class="video-item" v-for="(video,index) in videos" :key="index">
            <div class="video-image" ref="imageBox">
                <img class="image"
                     ondragstart="return false"
                     v-lazy="handleLazyImage(video.mvPicUrl)"
                     :key="video.mvPicUrl"
                     :alt="video.mvTitle"
                >
                <div class="img-mask"></div>
                <m-play-btn class="play-icon-box" :font-size="60"/>
                <div class="visit-num-box">
                    <div class="visit-num">
                        <Icon class="icon" type="md-videocam" size="16"/>
                        <span>{{handleVisitNum(video.listenNum)}}</span>
                    </div>
                </div>
                <div class="video-bottom"></div>
            </div>
            <div class="mv-title">
                <span class="title-text" v-html="video.mvTitle"/>
            </div>
            <div class="mv-singers">
                <div class="singer-name-box" v-for="(singer,singerIndex) in video.singers" :key="singerIndex">
                    <span class="singer-name" v-html="singer.singerName" @click="toSingerDetail(singer)"/>
                    <span class="division" v-if="singerIndex !== video.singers.length - 1">/</span>
                </div>
            </div>
            <div class="mv-create-time">{{handleTime(video.createTime)}}</div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import MPlayBtn from '../m-play-btn/m-play-btn'
  import MVDefLazyImg from '../../resources/images/mv_300.png'

  export default {
    name: 'm-video-list',
    components: { MPlayBtn, Icon },
    props: {
      videos: {
        type: Array
      }
    },
    data () {
      return {
        screenWidth: document.body.clientWidth
      }
    },
    computed: {
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: MVDefLazyImg,
            loading: MVDefLazyImg
          }
        }
      },
      handleTime () {
        return (time) => {
          if (isNaN(time)) {
            return `创建时间：${time}`
          }
          let timeInt = parseInt(time + '000')
          let date = new Date(timeInt)
          let year = date.getFullYear()
          let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
          let day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
          return `创建时间：${year}-${month}-${day}`
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          window.screenWidth = document.body.clientWidth
          this.screenWidth = window.screenWidth
        })
      })
      this.autoImageBoxHeight()
    },
    methods: {
      toSingerDetail (singer) {
        this.$emit('toSingerDetail', singer)
      },
      handleVisitNum (number) {
        if (number >= 10000) {
          const num = number / 10000
          return `${Math.round(num * 10) / 10}万`
        } else {
          return number
        }
      },
      autoImageBoxHeight () {
        let elements = this.$refs.imageBox
        for (let i = 0; i < elements.length; i++) {
          elements[i].style.height = `${elements[i].clientWidth * 0.56}px`
        }
      }
    },
    watch: {
      screenWidth () {
        this.autoImageBoxHeight()
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .video-box {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-flow: wrap;
        margin-right: -15px;

        .video-item {
            width: 33%;
            padding-right: 15px;
            margin-top: 20px;

            .video-image {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                transform: translate3d(0, 0, 0);
                transition: transform 300ms;

                .image {
                    width: 100%;
                    height: 100%;
                    display: block;
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

                .play-icon-box {
                    z-index: 11;
                    opacity: 0;
                    transform: translate3d(0, 0, 0) scale(.7);
                    transition: transform 300ms, opacity 300ms;
                }

                .visit-num-box {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    margin: 0 5px 5px 0;
                    padding: 3px 10px;
                    background: #000000b8;
                    border-radius: 15px;
                    transition: opacity 300ms;

                    .visit-num {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #FFFFFF;

                        .icon {
                            margin-right: 5px;
                        }
                    }
                }

                .video-bottom {
                    position: absolute;
                    height: 10px;
                    width: 100%;
                    padding-right: 15px;
                    bottom: 0;
                    cursor: pointer;
                    z-index: 5;
                }
            }

            .video-bottom:hover + .video-image {
                cursor: pointer;
                transform: translate3d(0, -10px, 0);

                .video-bottom {
                    bottom: -10px
                }

                .visit-num-box {
                    opacity: 0;
                }

                .img-mask {
                    opacity: 1;
                }

                .play-icon-box {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }
            }

            .video-image:hover {
                cursor: pointer;
                transform: translate3d(0, -10px, 0);

                .video-bottom {
                    bottom: -10px
                }

                .visit-num-box {
                    opacity: 0;
                }

                .img-mask {
                    opacity: 1;
                }

                .play-icon-box {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }
            }

            .mv-title {
                margin-top: 5px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;

                .title-text {
                    color: #FFFFFF;
                }

                .title-text:hover {
                    cursor: pointer;
                    color: @player-bar-color;
                }
            }

            .mv-singers {
                margin-top: 5px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .singer-name-box {
                    .singer-name {
                        color: #8b8b8c;
                    }

                    .division {
                        margin: 0 2px;
                    }

                    .singer-name:hover {
                        cursor: pointer;
                        color: @player-bar-color;
                    }
                }
            }

            .mv-create-time {
                margin-top: 5px;
                font-size: 12px;
                color: #8b8b8c;
            }
        }

        @media (min-width: 1070px) {
            .video-item {
                width: 33%;
            }
        }

        @media (min-width: 1200px) {
            .video-item {
                width: 25%;
            }
        }

        @media (min-width: 1400px) {
            .video-item {
                width: 20%;
            }
        }
    }
</style>
