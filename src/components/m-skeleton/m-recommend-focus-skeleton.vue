<template>
    <div class="skeleton focus-skeleton">
    </div>
</template>

<script>
  export default {
    name: 'm-recommend-focus-skeleton'
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .focus-skeleton {
        width: 100%;
        height: 240px;
        position: relative;
        z-index: 0;
    }
</style>
