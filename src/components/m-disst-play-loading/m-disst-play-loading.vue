<template>
    <div ref="disstLoading" class="disst-play-loading">
        <p>请稍等</p>
        <p>音乐准备中</p>
        <p>
            <span class="dot">...</span>
        </p>
    </div>
</template>

<script>
  export default {
    name: 'm-disst-play-loading',
    data () {
      return {
        screenWidth: document.body.clientWidth
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
      })
      this.$refs.disstLoading.style.left = `${(window.innerWidth - 200) / 2 + 150}px`
    },
    methods: {
      openLoading () {
        this.$refs.disstLoading.style.opacity = 1
        this.$refs.disstLoading.style.zIndex = 15
        this.$refs.disstLoading.style.transform = 'scale(1)'
      },
      closeLoading () {
        this.$refs.disstLoading.style.opacity = 0
        this.$refs.disstLoading.style.transform = 'scale(.7)'
        setTimeout(() => {
          this.$refs.disstLoading.style.zIndex = -10
        }, 100)
      }
    },
    watch: {
      screenWidth () {
        this.$refs.disstLoading.style.left = `${(window.innerWidth - 200) / 2 + 150}px`
      }
    }
  }
</script>

<style lang="less">
    .disst-play-loading {
        position: fixed;
        top: 0;
        bottom: 0;
        margin: auto 0;
        left: 55%;
        width: 100px;
        height: 100px;
        background: #000000de;
        border-radius: 5px;
        color: #ffffff;
        text-align: center;
        opacity: 0;
        z-index: -10;
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        align-items: center;
        padding: 3px 10px;
        transition: transform 100ms, opacity 100ms;

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
