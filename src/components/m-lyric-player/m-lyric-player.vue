<template>
    <m-slider ref="wrapper">
        <div ref="lyricWrapper" class="lyric-wrapper">
            <div ref="box" v-if="currentLyric && !isCyy">
                <p ref="lyricLine"
                   class="text"
                   v-for="(line,index) in currentLyric.lines"
                   :key="index"
                   :class="{'current': currentLineNum ===index}"
                   v-html="line.txt"/>
            </div>
            <div class="no-lyric" v-if="!currentLyric">
                <p>悦音乐，放松自己~</p>
            </div>
            <div class="cyy" v-if="currentLyric && isCyy">
                <p>此歌曲为没有填词的纯音乐，请您欣赏</p>
            </div>
        </div>
    </m-slider>
</template>

<script>
  import Lyric from 'lyric-parser'
  import MSlider from '../m-slider/m-slider'

  export default {
    name: 'm-lyric-player',
    components: { MSlider },
    props: {
      lyric: {
        type: String
      }
    },
    data () {
      return {
        currentLyric: null,
        currentLineNum: 0,
        isCyy: false, // 是否为纯音乐
        screenHeight: document.body.clientHeight
      }
    },
    mounted () {
      this.resolverLyric(this.lyric)
      window.addEventListener('resize', () => {
        this.screenHeight = window.innerHeight
      })
    },
    methods: {
      resolverLyric (lyric) {
        if (lyric.indexOf('没有填词') !== -1) {
          this.isCyy = true
        }
        this.currentLyric = new Lyric(lyric, this.handleLyric)
      },
      stop () {
        this.currentLyric.stop()
      },
      seek (time) {
        this.currentLyric.seek(time * 1000)
      },
      togglePlay () {
        this.currentLyric.togglePlay()
      },
      play () {
        this.currentLyric.play()
      },
      handleLyric ({ lineNum }) {
        this.currentLineNum = lineNum
        let bottom = this.currentLyric.lines.length - lineNum
        let num = Math.floor(document.getElementsByClassName('lyric-wrapper')[0].clientHeight / 80) - 1
        if (lineNum > num && bottom > num) {
          this.$refs.wrapper.scrollTo(this.$refs.lyricWrapper, this.getHeight(lineNum - num), 200)
        } else if (bottom <= num) {
          this.$refs.wrapper.scrollToBottom(this.$refs.lyricWrapper,
            this.$refs.box.clientHeight - this.$refs.lyricWrapper.clientHeight, 500)
        } else {
          this.$refs.wrapper.scrollToTop(this.$refs.lyricWrapper, 500)
        }
      },
      getHeight (num) {
        let element = document.getElementsByClassName('text')
        let top = 0
        for (let i = 0; i < num; i++) {
          top += element[i].clientHeight
        }
        return top
      },
      clearLyric () {
        this.stop()
        this.currentLyric = null
        this.currentLineNum = 0
      }
    },
    watch: {
      screenHeight () {
        let num = Math.floor(document.getElementsByClassName('lyric-wrapper')[0].clientHeight / 80)
        this.$refs.lyricWrapper.scrollTop = (this.currentLineNum - num) * 40
      },
      lyric (newValue) {
        if (newValue !== '') {
          this.isCyy = false
          this.resolverLyric(newValue)
        }
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .lyric-wrapper {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        position: relative;

        .text {
            user-select: text;
            color: #ffffff;
            min-height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        ::selection {
            background: #d3d3d3;
            color: #ffffff;
        }

        .current {
            color: @player-bar-color;
        }

        .no-lyric, .cyy {
            width: 100%;
            color: #ffffff;
            position: absolute;
            top: 20%;
        }
    }

    .lyric-wrapper::-webkit-scrollbar {
        // 火狐
        display: none;
    }

    .lyric-wrapper {
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;
    }
</style>
