<template>
    <div class="more-search-loading">
        <img ondragstart="return false" class="loading-img" src="./search-loading.gif" alt="">
        <div class="loading-text">拼命加载中..</div>
    </div>
</template>

<script>
  export default {
    name: 'm-more-search-loading'
  }
</script>

<style lang="less">
    .more-search-loading {
        position: relative;
        width: 100px;
        left: 0;
        right: 0;
        margin: 0 auto;

        .loading-img {
            width: 30px;
            height: 30px;
        }

        .loading-text {
            color: #ADAFB2;
            width: 70px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            float: right;
        }
    }
</style>
