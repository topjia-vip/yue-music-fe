<template>
    <div class="title-box">
        <p class="title">{{title}}</p>
        <p class="more" @click="moreClick">
            <span>更多</span>
        </p>
    </div>
</template>

<script>
  export default {
    name: 'm-title',
    props: {
      title: {
        type: String
      }
    },
    methods: {
      moreClick () {
        this.$emit('moreClick')
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .title-box {
        color: @font-base-color;
        font-size: 20px;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            display: inline-block;
        }

        .more {
            display: inline-block;
            float: right;
            font-size: 12px;
            color: @font-tow-color;
        }

        .more:hover {
            cursor: pointer;
            color: @font-active-color;

            span {
                border-bottom: 1px solid @font-active-color;
            }
        }
    }
</style>
