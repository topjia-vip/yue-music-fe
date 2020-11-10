<template>
    <div class="m-play-btn-box">
        <span class="play-btn icon iconfont icon-play-btn" :style="`font-size:${fontSize}px`" @click.stop="play"></span>
    </div>
</template>

<script>
  import './font/iconfont.css'

  export default {
    name: 'm-play-btn',
    props: {
      fontSize: {
        type: Number
      }
    },
    methods: {
      play () {
        this.$emit('play')
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme-active";

    .m-play-btn-box {
        position: absolute;
        width: 60px;
        height: 60px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
        line-height: 60px;
    }

    .m-play-btn-box .play-btn {
        color: #ffffff;
        transition: color 200ms;
    }

    .m-play-btn-box .play-btn:hover {
        color: @player-bar-color;
    }
</style>
