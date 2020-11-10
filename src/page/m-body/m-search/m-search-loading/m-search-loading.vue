<template>
    <div class="search-loading">
        <img ondragstart="return false" class="loading-img" src="./search-loading.gif" alt="">
    </div>
</template>

<script>
  export default {
    name: 'm-search-loading'
  }
</script>

<style lang="less">
    .search-loading {
        width: 200px;
        height: 200px;
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;

        .loading-img {
            width: 100%;
            height: 100%;
            display: block;
        }
    }
</style>
