<template>
    <div class="loading">
        <scale-loader :color="color"></scale-loader>
    </div>
</template>

<script>
  import ScaleLoader from 'vue-spinner/src/ScaleLoader'

  export default {
    name: 'loading',
    components: {
      ScaleLoader
    },
    props: {
      color: {
        type: String,
        default: '#FFFFFF'
      }
    }
  }
</script>

<style lang="less">
    .loading {
        width: 100%;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font: 14px/1.5 Tahoma, Helvetica, Arial, '宋体', sans-serif;

        img {
            width: 16px;
            height: 16px;
            vertical-align: middle;
            margin-right: 5px;
        }

        .desc {
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5);
            display: inline-block;
        }
    }
</style>
