<template>
    <div ref="popTip" class="pop-tip" :style="{'width':`${width}px`,'height':`${height}px`}">
        <div class="content-box" v-html="content"></div>
    </div>
</template>

<script>
  export default {
    name: 'm-poptip',
    props: {
      content: {
        type: String
      },
      width: {
        type: Number,
        default: 150
      },
      height: {
        type: Number
      }
    },
    methods: {
      openTip () {
        this.$refs.popTip.style.opacity = 1
        this.$refs.popTip.style.transform = ' translate3d(0, 0, 0) scale(1)'
        this.$refs.popTip.style.zIndex = 10
      },
      closeTip () {
        this.$refs.popTip.style.opacity = 0
        this.$refs.popTip.style.transform = 'translate3d(0, 0, 0) scale(.7)'
        setTimeout(() => {
          this.$refs.popTip.style.zIndex = -1
        }, 100)
      }
    }
  }
</script>

<style lang="less">
    .pop-tip {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3px 10px;
        background: #000000db;
        border-radius: 5px;
        z-index: -1;
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(.7);
        transition: transform 100ms, opacity 100ms;

        .content-box {
            color: #FFFFFF;
            text-align: center;
        }

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
