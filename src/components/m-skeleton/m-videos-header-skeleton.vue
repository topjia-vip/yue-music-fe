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

    .skeleton {
        background: linear-gradient(90deg, #303031 25%, #373737 37%, #303031 63%);
        background-size: 400% 100%;
        animation: skeleton-loading 2s ease infinite;
    }

    @keyframes skeleton-loading {
        0% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0 50%;
        }
    }
</style>
