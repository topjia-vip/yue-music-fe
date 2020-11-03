<template>
    <div ref="wrapper" class="wrapper">
        <slot></slot>
    </div>
</template>

<script>
  export default {
    name: 'm-slider',
    methods: {
      scrollTo (element, to, time) {
        clearInterval(this.timer)
        let scrollTop = element.scrollTop
        let stepSize = (scrollTop - to) / (time / 10)
        this.timer = setInterval(() => {
          scrollTop -= stepSize
          element.scrollTop = scrollTop
          if (stepSize > 0) {
            if (element.scrollTop <= to) {
              element.scrollTop = to
              clearInterval(this.timer)
            }
          } else {
            if (element.scrollTop >= to) {
              element.scrollTop = to
              clearInterval(this.timer)
            } else {
              // 滚动到底部检查
              this.checkScrollToBottom(element)
            }
          }
        }, 10)
      },
      checkScrollToBottom (element) {
        let parentNode = element.parentNode
        let clientHeight = parentNode.clientHeight
        let scrollTop = element.scrollTop
        let scrollHeight = element.scrollHeight
        if (scrollTop + clientHeight === scrollHeight) {
          clearInterval(this.timer)
        }
      },
      scrollToTop (element, time) {
        clearInterval(this.timer)
        let scrollTop = element.scrollTop
        let stepSize = scrollTop / (time / 10)
        this.timer = setInterval(() => {
          scrollTop -= stepSize
          element.scrollTop = scrollTop
          if (element.scrollTop <= 0) {
            element.scrollTop = 0
            clearInterval(this.timer)
          }
        }, 10)
      },
      scrollToBottom (element, bottom, time) {
        clearInterval(this.timer)
        let scrollTop = element.scrollTop
        let stepSize = (bottom - scrollTop) / (time / 10)
        this.timer = setInterval(() => {
          scrollTop += stepSize
          element.scrollTop = scrollTop
          if (element.scrollTop >= bottom) {
            element.scrollTop = bottom
            clearInterval(this.timer)
          }
        }, 10)
      }
    }
  }
</script>

<style lang="less">
    .wrapper {
        user-select: none;
        width: 100%;
        height: 100%;
    }
</style>
