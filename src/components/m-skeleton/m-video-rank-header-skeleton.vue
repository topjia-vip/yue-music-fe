<template>
    <!--头部-->
    <div class="mv-rank-skeleton-header">
        <!--图片-->
        <div class="rank-image-skeleton-box">
            <div class="skeleton image"/>
        </div>
        <div class="rank-skeleton-info">
            <div class="skeleton rank-skeleton-title">
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'm-video-rank-header-skeleton'
  }
</script>

<style lang="less">
    .mv-rank-skeleton-header {
        height: 200px;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .rank-image-skeleton-box {
            position: relative;
            width: 200px;
            height: 200px;

            .image {
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 10px;
            }
        }

        .rank-skeleton-info {
            height: 100%;
            margin-left: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .rank-skeleton-title {
                width: 80px;
                height: 30px;
            }
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
