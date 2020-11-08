<template>
    <div class="left-tools">
        <div class="play-mode-box">
            <span class="icon-btn mode loop iconfont icon-loop-play" v-if="mode === 0" @click="changePlayMode"></span>
            <span class="icon-btn mode single iconfont icon-single_play" v-if="mode === 1"
                  @click="changePlayMode"></span>
            <span class="icon-btn mode random iconfont icon-random-play" v-if="mode === 2"
                  @click="changePlayMode"></span>
            <div class="tips" ref="tips">{{handleTips}}</div>
        </div>
        <div class="lyric-box">
            <span class="icon-btn lyric iconfont icon-lyric"></span>
        </div>
        <div class="play-list-box">
            <div class="tips-box" ref="playingTips">
                <div class="playing-tips">开始播放啦~</div>
                <i class="playing-tips-icon fa fa-sort-desc" aria-hidden="true"></i>
            </div>
            <span class="icon-btn play-list-icon iconfont icon-play-list" :class="showPlayList?'play-list-open':''"
                  @click="changeShowPlayListStatus"></span>
        </div>
    </div>
</template>

<script>
  import './font_icon/iconfont.css'
  import { mapGetters } from 'vuex'
  import { playMode } from '../../../common/js/config'

  export default {
    name: 'm-player-font-icon',
    props: {
      showPlayList: {
        type: Boolean
      }
    },
    computed: {
      ...mapGetters([
        'mode',
        'playList',
        'currentPlaySongIndex'
      ]),
      handleTips () {
        const mode = this.mode
        if (mode === playMode.sequence) {
          return '顺序播放'
        } else if (mode === playMode.loop) {
          return '单曲循环'
        } else {
          return '随机播放'
        }
      }
    },
    methods: {
      changePlayMode () {
        this.$emit('changePlayMode')
        this.$refs.tips.style.opacity = 1
        this.$refs.tips.style.zIndex = 1
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.tips.style.opacity = 0
          this.$refs.tips.style.zIndex = -1
        }, 1000)
      },
      changeShowPlayListStatus () {
        this.$emit('changeShowPlayListStatus')
      }
    },
    watch: {
      playList (newPlayList, oldPlayList) {
        if (newPlayList.length > 0 && oldPlayList.length === 0) {
          this.$refs.playingTips.style.opacity = 1
          setTimeout(() => {
            this.$refs.playingTips.style.opacity = 0
          }, 4000)
        }
      }
    }
  }
</script>

<style lang="less">

    .left-tools {
        display: flex;
        justify-content: space-around;
        align-items: center;

        .icon-btn {
            color: #5c5c5c;
        }

        .icon-btn:hover {
            cursor: pointer;
            color: #d6d4d4;
        }

        .play-mode-box {
            position: relative;
            height: 40px;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            .mode {
                font-size: 25px;
            }

            .tips {
                position: absolute;
                height: 30px;
                width: 100px;
                line-height: 30px;
                transition: 0.5s;
                font-size: 12px;
                background: #000000;
                top: -35px;
                left: -30px;
                color: #d6d4d4;
                opacity: 0;
                z-index: -1;
                text-align: center;
            }
        }

        .lyric-box {
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            .lyric {
                font-size: 25px;
            }
        }

        .play-list-box {
            position: relative;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            .play-list-icon {
                font-size: 24px;
            }

            .play-list-open {
                color: #d6d4d4 !important;
            }

            .playing-tips {
                width: 80px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background: #2A2C30;
                color: #56565A;
                font-size: 12px;
                position: absolute;
                top: -30px;
                left: -38px;
                border-radius: 3px;
            }

            .playing-tips-icon {
                position: absolute;
                color: #2A2C30;
                top: -12px;
                font-size: 20px;
            }

            .tips-box {
                opacity: 0;
                transition: 0.5s;
            }
        }
    }
</style>
