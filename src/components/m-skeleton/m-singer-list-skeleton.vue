<template>
    <div class="singer-list-skeleton">
        <div class="hot-singer-skeleton">
            <div class="item hot-singer" v-for="(index) in hotNum" :key="index">
                <img ondragstart="return false" class="hot-img"
                     src="../../resources/images/singer_300.png"/>
                <div class="skeleton hot-name">
                </div>
            </div>
        </div>
        <div class="item singer-skeleton" v-for="(index) in num" :key="index">
            <div class="skeleton singer-name"></div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'm-singer-list-skeleton',
    data () {
      return {
        hotNum: new Array(10),
        num: new Array(30)
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .singer-list-skeleton {
        padding-top: 20px;
        margin-right: -15px;

        .item {
            width: 25%;
            display: inline-block;
            padding-right: 15px;
            margin-bottom: 25px;
        }

        @media (min-width: 1180px) {
            .item {
                width: 20%;
            }
        }

        @media (min-width: 1360px) {
            .item {
                width: 16.6%;
            }
        }

        .hot-singer-skeleton {
            .hot-singer {
                .hot-img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    margin-bottom: 10px;
                }

                .hot-name {
                    width: 100%;
                    height: 30px;
                }
            }
        }

        .singer-skeleton {

            .singer-name {
                width: 100%;
                height: 30px;
            }
        }
    }
</style>
