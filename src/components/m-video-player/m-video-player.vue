<template>
    <div class="m-video-player-box">
        <video class="video" :src="playUrl?playUrl.url:''" autoplay>
        </video>
        <div class="video-controls-box">
            <div class="play-progress-bar-box">
                <div class="play-progress-bar"></div>
            </div>
            <div class="play-tools-box">
                <div class="tools left-tools">
                    <div class="btn-box play-btn-box">
                        <Icon class="btn" type="md-play" size="20"/>
                    </div>
                </div>
                <div class="tools right-tools">
                    <div class="btn-box volume-btn-box">
                        <Icon class="btn" type="md-volume-up" size="20"/>
                    </div>
                    <div class="btn-box play-url-btn-box"
                         v-if="playUrl"
                         @mouseenter="openOtherUrl = true"
                         @mouseleave="openOtherUrl=false">
                        <div class="play-url-btn" :title="`视频品质 ${playUrl.type}`">
                            <span>{{playUrl.type}}</span>
                        </div>
                        <div class="other-url-box" v-if="openOtherUrl">
                            <div class="url" v-for="(url,index) in videoUrls" :key="index">
                                <span class="text" :class="url.id === playUrl.id?'active':''" @click="changeUrl(url)">{{url.type}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'

  export default {
    name: 'm-video-player',
    components: {
      Icon
    },
    props: {
      playUrl: {
        type: Object
      },
      videoUrls: {
        type: Array
      }
    },
    data () {
      return {
        openOtherUrl: false
      }
    },
    methods: {
      changeUrl (url) {
        this.openOtherUrl = false
        if (url.id === this.playUrl.id) {
          return
        }
        this.$emit('changeUrl', url)
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .m-video-player-box {
        position: relative;
        width: 100%;
        max-height: 600px;
        background: #000000;

        .video {
            position: relative;
            width: 100%;
            max-height: 600px;
            min-height: 460px;
            outline: none;
            display: block;
        }

        .video-controls-box {
            position: absolute;
            width: 100%;
            bottom: 0;
            height: 48px;
            padding: 0 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-flow: column;
            background-color: #00000008;

            .play-progress-bar-box {
                width: 100%;
                height: 10px;

                .play-progress-bar {
                    width: 100%;
                    height: 2px;
                    background-color: #63696e;
                }
            }

            .play-tools-box {
                width: 100%;
                height: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .tools {
                    height: 100%;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    flex-flow: wrap;

                    .btn-box {
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .btn {
                            color: #aeadad;
                        }

                        .btn:hover {
                            cursor: pointer;
                            color: @player-bar-color;
                        }
                    }

                    .play-url-btn-box {
                        position: relative;
                        height: 22px;

                        .play-url-btn {
                            position: relative;
                            z-index: 10;
                            height: 20px;
                            width: 40px;
                            font-size: 12px;
                            color: #aeadad;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border: 1px solid #aeadad;
                            border-radius: 4px;
                        }

                        .play-url-btn:hover {
                            cursor: pointer;
                            color: @player-bar-color;
                            border: 1px solid @player-bar-color;
                        }

                        .other-url-box {
                            height: 130px;
                            width: 100%;
                            position: absolute;
                            bottom: 15px;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            flex-flow: column-reverse;

                            .url {
                                height: 25px;
                                display: flex;
                                justify-content: center;
                                align-items: center;

                                .text {
                                    color: #aeadad;
                                }

                                .text:hover {
                                    cursor: pointer;
                                    color: @player-bar-color;
                                }

                                .active {
                                    color: @player-bar-color !important;
                                }
                            }
                        }
                    }
                }

                .left-tools {

                }

                .right-tools {
                }
            }
        }
    }
</style>
