<template>
    <div class="top_box" @click="toTop">
        <div class="top">
            <Icon type="ios-arrow-up"/>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'

  export default {
    name: 'scroll-top',
    components: {
      Icon
    },
    methods: {
      toTop () {
        this.$emit('toTop')
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .top_box {
        bottom: 80px;
        right: 15px;
        z-index: 8;
        position: fixed;
        cursor: pointer;
        background: @to-top-background-color;

        .top {
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border: 1px solid @to-top-color;
            color: @to-top-color;
        }

        .top:hover {
            border: 1px solid @to-top-hover-color;
            color: @to-top-hover-color;
        }
    }
</style>
