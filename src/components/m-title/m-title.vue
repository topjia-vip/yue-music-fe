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
        color: var(--font-base-color);
        font-size: 20px;
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            font-weight: bold;
            display: inline-block;
        }

        .more {
            display: inline-block;
            float: right;
            font-size: 12px;
            color: var(--font-tow-color);
        }

        .more:hover {
            cursor: pointer;
            color: var(--font-active-color);

            span {
                border-bottom: 1px solid var(--font-active-color);
            }
        }
    }
</style>
