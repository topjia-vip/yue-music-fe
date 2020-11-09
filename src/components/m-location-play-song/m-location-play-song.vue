<template>
    <div class="location-song" @click="location">
        <div class="location">
            <Icon type="ios-pin-outline"/>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'

  export default {
    name: 'm-location-play-song',
    components: {
      Icon
    },
    methods: {
      location () {
        this.$emit('location')
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .location-song {
        bottom: 115px;
        right: 15px;
        z-index: 2;
        position: fixed;
        cursor: pointer;
        background: @to-top-background-color;

        .location {
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border: 1px solid @to-top-color;
            color: @to-top-color;
        }

        .location:hover {
            border: 1px solid @to-top-hover-color;
            color: @to-top-hover-color;
        }
    }
</style>
