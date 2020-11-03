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
    .title-box {
        color: #FFFFFF;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #303030;

        .title {
            display: inline-block;
        }

        .more {
            display: inline-block;
            float: right;
            font-size: 12px;
            color: #999999;
        }

        .more:hover {
            cursor: pointer;
            color: #FFFFFF;

            span {
                border-bottom: 1px solid #FFFFFF;
            }
        }
    }
</style>
