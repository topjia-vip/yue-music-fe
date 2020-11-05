<template>
    <div class="focus-box">
        <m-rotation-chart ref="slider" :images="focus" :time-out="5000"/>
    </div>
</template>

<script>
  import { Carousel, CarouselItem, Icon } from 'view-design'
  import Loading from '../../../../../components/loading/loading'
  import MRotationChart from '../../../../../components/m-rotation-chart/m-rotation-chart'

  export default {
    name: 'm-focus',
    components: {
      MRotationChart,
      Loading,
      Icon,
      Carousel,
      CarouselItem
    },
    props: {
      focus: {
        type: Array
      }
    }
  }
</script>

<style lang="less">
    .focus-box {
        width: 100%;
        height: 240px;
        min-height: 240px;
        position: relative;
        z-index: 0;
    }
</style>
