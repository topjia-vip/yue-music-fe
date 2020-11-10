<template>
    <div ref="sliderWrapper" id="slider-wrapper" @mouseenter="enter" @mouseleave="leave">
        <div class="btn-box">
            <div class="btn prev-btn" @click="perv">
                <i class="icon fa fa-chevron-left" aria-hidden="true"></i>
            </div>
            <div class="btn next-btn" @click="next">
                <i class="icon fa fa-chevron-right" aria-hidden="true"></i>
            </div>
        </div>
        <div ref="dot" id="dot"></div>
    </div>
</template>

<script>
  let imgWidth = 490
  export default {
    name: 'm-rotation-chart',
    data () {
      return {
        currentIndex: 0,
        autoPlayTimer: null,
        imgElements: null,
        dots: null,
        length: 0,
        sliderWrapperWidth: 0,
        screenWidth: document.body.clientWidth
      }
    },
    props: {
      images: {
        type: Array
      },
      timeOut: {
        type: Number
      }
    },
    mounted () {
      this.imgElements = document.getElementsByClassName('img-item')
      this.dots = document.getElementsByClassName('dot')
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth
      }
      this.sliderWrapperWidth = this.screenWidth - 261 > 1040 ? 1040 : this.screenWidth - 261
      this._createSlider()
    },
    methods: {
      enter () {
        this.stopPlay()
      },
      leave () {
        this.autoPlay()
      },
      _createSlider () {
        // 创建轮播图
        let root = document.querySelector('#slider-wrapper')
        this.imgElements = this.images.map((it, i) => {
          let div = document.createElement('img')
          div.setAttribute('src', `${it.picInfo}`)
          div.setAttribute('class', 'img-item img-item-back')
          return div
        })
        this.replaceClass(this.imgElements[0], 'img-item-back', 'img-item-front')
        this.replaceClass(this.imgElements[1], 'img-item-back', 'img-item-right')
        this.replaceClass(this.imgElements[this.imgElements.length - 1], 'img-item-back', 'img-item-left')
        this.imgElements.forEach(it => root.appendChild(it))
        // 创建dot
        let dot = document.querySelector('#dot')
        this.dots = this.images.map((it, i) => {
          let dotBox = document.createElement('div')
          let dot = document.createElement('div')
          dot.setAttribute('class', 'dot')

          dotBox.addEventListener('mouseenter', () => {
            let tempCur = (this.currentIndex + this.imgElements.length) % this.imgElements.length
            this.stopPlay()
            let prevCount = i - (this.imgElements.length + this.currentIndex)
            let nextCount = i - tempCur
            let count = prevCount
            if (Math.abs(prevCount) >= Math.abs(nextCount)) {
              count = nextCount
            }
            while (count < 0) {
              this.perv()
              count++
            }
            while (count > 0) {
              this.next()
              count--
            }
          })
          dotBox.setAttribute('class', 'dot-box')
          dotBox.appendChild(dot)
          return dotBox
        })
        this.addClass(this.dots[this.currentIndex % this.imgElements.length].children[0], 'active')
        this.dots.forEach(item => dot.appendChild(item))
        this.$refs.dot.style.right = `${(this.sliderWrapperWidth - this.$refs.dot.clientWidth) / 2}px`
        this.setTransform()
        this.autoPlay()
      },
      autoPlay () {
        this.addClass(this.dots[this.currentIndex % this.imgElements.length].children[0], 'active')
        this.autoPlayTimer = setInterval(() => {
          this.next()
        }, this.timeOut)
      },
      stopPlay () {
        clearInterval(this.autoPlayTimer)
      },
      next () {
        let cur = this.currentIndex
        let imgEles = this.imgElements
        this.replaceClass(imgEles[(cur - 1 + imgEles.length) % imgEles.length], 'img-item-left', 'img-item-back')
        this.replaceClass(imgEles[(cur + imgEles.length) % imgEles.length], 'img-item-front', 'img-item-left')
        this.replaceClass(imgEles[(cur + 1 + imgEles.length) % imgEles.length], 'img-item-right', 'img-item-front')
        this.replaceClass(imgEles[(cur + 2 + imgEles.length) % imgEles.length], 'img-item-back', 'img-item-right')
        this.setTransform()
        this.currentIndex = (cur + 1 + imgEles.length) % imgEles.length
        this.removeClass(this.dots[(this.currentIndex - 1 + imgEles.length) % imgEles.length].children[0], 'active')
        this.addClass(this.dots[(this.currentIndex + imgEles.length) % imgEles.length].children[0], 'active')
      },
      perv () {
        let cur = this.currentIndex
        let imgEles = this.imgElements
        this.replaceClass(imgEles[(cur - 2 + imgEles.length) % imgEles.length], 'img-item-back', 'img-item-left')
        this.replaceClass(imgEles[(cur - 1 + imgEles.length) % imgEles.length], 'img-item-left', 'img-item-front')
        this.replaceClass(imgEles[(cur + imgEles.length) % imgEles.length], 'img-item-front', 'img-item-right')
        this.replaceClass(imgEles[(cur + 1 + imgEles.length) % imgEles.length], 'img-item-right', 'img-item-back')
        this.setTransform()
        this.currentIndex = (cur - 1 + imgEles.length) % imgEles.length
        this.removeClass(this.dots[(this.currentIndex + 1 + imgEles.length) % imgEles.length].children[0], 'active')
        this.addClass(this.dots[(this.currentIndex + imgEles.length) % imgEles.length].children[0], 'active')
      },
      replaceClass (element, oldClazz, newClazz) {
        this.removeClass(element, oldClazz)
        this.addClass(element, newClazz)
      },
      addClass (element, clazz) {
        let oldClazz = element.className
        let regexp = RegExp(`(\\s|^)${clazz}(\\s|$)`)
        if (oldClazz.search(regexp) === -1) {
          element.setAttribute('class', `${oldClazz} ${clazz}`)
        }
      },
      removeClass (element, clazz) {
        let oldClazz = element.className
        let regexp = RegExp(`(\\s|^)${clazz}(\\s|$)`)
        element.setAttribute('class', oldClazz.replace(regexp, ''))
      },
      setTransform () {
        // 中间图片
        let front = document.getElementsByClassName('img-item-front')[0]
        front.style.transform = `translate3d(${(this.sliderWrapperWidth - imgWidth) / 2}px, 0px, 0px) scale(1.1)`
        // 右边图片
        let right = document.getElementsByClassName('img-item-right')[0]
        right.style.transform = `translate3d(${this.sliderWrapperWidth - imgWidth}px, 0px, 0px) scale(1)`
        // 左边图片
        let left = document.getElementsByClassName('img-item-left')[0]
        left.style.transform = `translate3d(0, 0, 0) scale(1)`
        // 其他图片
        let backs = document.getElementsByClassName('img-item-back')
        for (let i = 0; i < backs.length; i++) {
          backs[i].style.transform = `translate3d(${(this.sliderWrapperWidth - imgWidth) / 2}px, 0px, 0px) scale(1)`
        }
        this.$refs.dot.style.right = `${(this.sliderWrapperWidth - this.$refs.dot.clientWidth) / 2}px`
      },
      reload () {
        this.sliderWrapperWidth = this.screenWidth - 261 > 1040 ? 1040 : this.screenWidth - 261
        this.setTransform()
      }
    },
    watch: {
      screenWidth () {
        if (this.$route.path === '/findMusic/recommend') {
          this.reload()
        }
      }
    }
  }
</script>

<style lang="less">
    #slider-wrapper {
        width: 100%;
        height: 100%;
        z-index: 0;
        position: absolute;
        overflow-x: hidden;

        .btn {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            position: absolute;
            z-index: 15;
            width: 40px;
            height: 80px;
            background: #ffffff08;
            top: 70px;
            transition: transform 300ms, background-color 100ms;

            .icon {
                color: #9e9e9d;
            }
        }

        .btn:hover {
            background: #ffffff1a;

            .icon {
                color: #ded5d6;
            }
        }

        .prev-btn {
            left: -40px;
            transform: translateX(0);
        }

        .next-btn {
            right: -40px;
            transform: translateX(0);
        }

        .img-item {
            position: absolute;
            display: inline-block;
            margin-top: 10px;
            width: 490px;
            height: 200px;
            border-radius: 10px;
            background-repeat: no-repeat;
            background-size: cover;
            transition: transform 500ms, filter 500ms, opacity 500ms, z-index 500ms;
        }

        .img-item-front {
            transform: translate3d(200px, 0px, 0px) scale(1.1);
            filter: brightness(100%);
            z-index: 10;
            opacity: 1;
        }

        .img-item-right {
            transform: translate3d(400px, 0px, 0px) scale(1);
            filter: brightness(30%);
            z-index: 1;
            opacity: 1;
        }

        .img-item-left {
            transform: translate3d(0px, 0px, 0px) scale(1);
            filter: brightness(30%);
            z-index: 1;
            opacity: 1;
        }

        .img-item-back {
            transform: translate3d(200px, 0px, 0px) scale(1);
            filter: brightness(30%);
            z-index: -1;
            opacity: 0;
        }

        #dot {
            margin-top: 15px;
            position: absolute;
            bottom: 0;
        }

        .dot-box {
            display: inline;
            cursor: pointer;
        }

        .dot {
            display: inline-block;
            background-color: var(--dot-background-color);
            margin-right: 5px;
            width: 10px;
            height: 3px;
            transition-property: width;
            transition-duration: 300ms;
        }

        .active {
            width: 20px;
            background-color: var(--dot-active-background-color);
        }
    }

    #slider-wrapper:hover {
        .prev-btn {
            transform: translateX(40px);
        }

        .next-btn {
            transform: translateX(-40px);
        }
    }
</style>
