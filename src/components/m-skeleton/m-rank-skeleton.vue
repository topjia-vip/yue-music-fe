<template>
    <div class="rank-skeleton-box">
        <div class="rank-skeleton">
            <h2 class="title"></h2>
            <ul>
                <li class="rank-1-item" v-for="(index) in list" :key="index">
                    <div ref="item" class="skeleton item-box"></div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'm-rank-skeleton',
    data () {
      return {
        list: new Array(10),
        width: ''
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .rank-skeleton {
        margin-right: -2%;

        .rank-1-item {
            position: relative;
            width: 48%;
            list-style: none;
            height: 150px;
            cursor: pointer;
            display: inline-block;
            margin-top: 20px;
            margin-right: 2%;

            .item-box {
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 6;
                border-radius: 10px;
                position: relative;
                transition: 0.2s ease-in-out;
            }

            .item-box:hover {
                top: -10px;
            }
        }

        @media (min-width: 1250px) {
            .item-box {
                width: 31%;
            }
        }
    }
</style>
