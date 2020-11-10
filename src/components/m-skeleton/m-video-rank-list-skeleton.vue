<template>
    <div class="mv-rank-list-skeleton-box">
        <div class="mv-skeleton-item" v-for="(item,index) in data" :key="index">
            <!--排名-->
            <div class="rank-num-skeleton-box">
                <div class="num" :class="index < 3?'top':''">{{index+1}}</div>
            </div>
            <!--图片-->
            <div class="mv-image-skeleton-box">
                <div class="skeleton image"></div>
            </div>
            <!--基本信息-->
            <div class="mv-info-skeleton-box">
                <div class="skeleton mv-name-skeleton"/>
                <div class="skeleton mv-singer-skeleton-box"></div>
                <div class="skeleton create-time-skeleton"></div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'm-video-rank-list-skeleton',
    data () {
      return {
        data: new Array(20)
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme-active";
    @import "../../common/css/skeleton/skeleton";

    .mv-rank-list-skeleton-box {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-flow: column;

        .mv-skeleton-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 30px;
            width: 100%;
            height: 100px;

            .rank-num-skeleton-box {
                min-width: 60px;
                max-width: 60px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .num {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 15px;
                    height: 20px;
                    color: #FFFFFF;
                }

                .top {
                    border: none;
                    background-color: @player-bar-color;
                }
            }

            .mv-image-skeleton-box {
                position: relative;
                min-width: 200px;
                max-width: 200px;
                height: 100%;

                .image {
                    width: 100%;
                    height: 100%;
                    display: block;
                    border-radius: 10px;
                }
            }

            .mv-info-skeleton-box {
                margin-left: 20px;

                .mv-name-skeleton {
                    width: 360px;
                    height: 24px;
                }

                .mv-singer-skeleton-box {
                    width: 80px;
                    height: 24px;
                    margin-top: 5px;
                }

                .create-time-skeleton {
                    margin-top: 5px;
                    width: 120px;
                    height: 20px;
                }
            }
        }
    }
</style>
