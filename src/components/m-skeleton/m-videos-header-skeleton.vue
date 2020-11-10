<template>
    <div class="m-videos-tags-skeleton-box">
        <div class="skeleton area-tags-skeleton">

        </div>
        <div class="skeleton version-tags-skeleton">
        </div>
    </div>
</template>

<script>
  export default {
    name: 'm-videos-header-skeleton'
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .m-videos-tags-skeleton-box {
        margin-top: 20px;
        height: 100px;
        width: 100%;
        display: flex;
        flex-flow: column;
        justify-content: space-around;
        align-items: flex-start;

        .area-tags-skeleton {
            height: 100%;
            width: 60%;
        }

        .version-tags-skeleton {
            height: 100%;
            width: 50%;
        }
    }
</style>
