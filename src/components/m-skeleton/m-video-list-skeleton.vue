<template>
    <div class="video-skeleton-box">
        <div class="video-skeleton-item" v-for="(index) in dataArray" :key="index">
            <div class="video-skeleton-image">
                <img ondragstart="return false" class="image" src="../../resources/images/mv_300.png">
            </div>
            <div class="skeleton mv-skeleton-title">
            </div>
            <div class="skeleton mv-skeleton-singers">
            </div>
            <div class="skeleton mv-skeleton-create-time">
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'm-video-list-skeleton',
    data () {
      return {
        dataArray: new Array(20)
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .video-skeleton-box {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-flow: wrap;
        margin-right: -15px;

        .video-skeleton-item {
            width: 33%;
            padding-right: 15px;
            margin-top: 20px;

            .video-skeleton-image {
                position: relative;
                border-radius: 8px;
                overflow: hidden;
                transform: translate3d(0, 0, 0);
                transition: transform 300ms;

                .image {
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            }

            .video-image:hover {
                cursor: pointer;
                transform: translate3d(0, -10px, 0);
            }

            .mv-skeleton-title {
                margin-top: 5px;
                width: 40%;
                height: 20px;
            }

            .mv-skeleton-singers {
                margin-top: 5px;
                width: 30%;
                height: 20px;
            }

            .mv-skeleton-create-time {
                margin-top: 5px;
                width: 30%;
                height: 20px;
            }
        }

        @media (min-width: 1070px) {
            .video-skeleton-item {
                width: 33%;
            }
        }

        @media (min-width: 1200px) {
            .video-skeleton-item {
                width: 25%;
            }
        }

        @media (min-width: 1400px) {
            .video-skeleton-item {
                width: 20%;
            }
        }
    }
</style>
