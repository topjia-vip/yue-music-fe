<template>
    <div class="m-tips" ref="mTips" v-html="tips"
         :style="{ width: width+'px', height: height + 'px' }"
    >
    </div>
</template>

<script>
export default {
  name: 'm-tips',
  props: {
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 80
    }
  },
  data () {
    return {
      tips: ''
    }
  },
  methods: {
    showTips (tips) {
      this.tips = tips
      this.$refs.mTips.style.opacity = 1
      this.$refs.mTips.style.zIndex = 9999
    },
    closeTips () {
      this.$refs.mTips.style.opacity = 0
      this.$refs.mTips.style.zIndex = -10
    }
  }
}
</script>

<style lang="less">
    .m-tips {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
        width: 120px;
        height: 80px;
        line-height: 80px;
        border-radius: 10px;
        background: #101010f5;
        opacity: 0;
        z-index: -1;
        color: #ffffff;
        transition: 0.5s;

        .dot {
            font-family: simsun;
        }

        .dot {
            display: inline-block;
            width: 1.5em;
            vertical-align: bottom;
            overflow: hidden;
        }

        @-webkit-keyframes dot {
            0% {
                width: 0;
                margin-right: 1.5em;
            }
            33% {
                width: .5em;
                margin-right: 1em;
            }
            66% {
                width: 1em;
                margin-right: .5em;
            }
            100% {
                width: 1.5em;
                margin-right: 0;
            }
        }

        .dot {
            -webkit-animation: dot 1s infinite step-start;
        }

        @keyframes dot {
            0% {
                width: 0;
                margin-right: 1.5em;
            }
            33% {
                width: .5em;
                margin-right: 1em;
            }
            66% {
                width: 1em;
                margin-right: .5em;
            }
            100% {
                width: 1.5em;
                margin-right: 0;
            }
        }

        .dot {
            animation: dot 1s infinite step-start;
        }
    }
</style>
