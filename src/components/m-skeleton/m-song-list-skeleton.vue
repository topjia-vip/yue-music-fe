<template>
    <div class="song-list-skeleton">
        <ul>
            <li class="song-info-title">
                <div class="song-info-name-skeleton">
                    <div class="skeleton"></div>
                </div>
                <div class="song-info-singer-skeleton">
                    <div class="skeleton"></div>
                </div>
                <div class="song-info-album-skeleton">
                    <div class="skeleton"></div>
                </div>
                <div class="song-info-time-skeleton">
                    <div class="skeleton"></div>
                </div>
            </li>
            <li class="item" v-for="index in list" :key="index">
                <div class="skeleton num-skeleton"></div>
                <div class="song-name-skeleton">
                    <div class="skeleton"></div>
                </div>
                <div class="song-singer-skeleton">
                    <div class="skeleton"></div>
                </div>
                <div class="song-album-skeleton">
                    <div class="skeleton"></div>
                </div>
                <div class="song-time-skeleton">
                    <div class="skeleton"></div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'm-song-list-skeleton',
    data () {
      return {
        list: new Array(20)
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .song-list-skeleton {
        margin-top: 20px;

        .song-info-title {
            list-style: none;
            height: 60px;
            padding: 0 60px 0 55px;

            .song-info-name-skeleton {
                width: 45%;
                float: left;

                div {
                    height: 30px;
                    width: 80px;
                }
            }

            .song-info-singer-skeleton {
                width: 25%;
                float: left;

                div {
                    height: 30px;
                    width: 80px;
                }
            }

            .song-info-album-skeleton {
                width: 30%;
                float: left;

                div {
                    height: 30px;
                    width: 80px;
                }
            }

            .song-info-time-skeleton {
                position: absolute;
                right: 30px;
                width: 60px;

                div {
                    height: 30px;
                    width: 60px;
                }
            }
        }

        .item {
            position: relative;
            list-style: none;
            height: 50px;
            padding: 0 60px 0 55px;
            margin-bottom: 10px;

            .num-skeleton {
                position: absolute;
                left: 0;
                height: 50px;
                width: 45px;
                padding-left: 10px;
            }

            .song-name-skeleton {
                width: 45%;
                float: left;

                div {
                    height: 50px;
                    width: 99%;
                }
            }

            .song-singer-skeleton {
                width: 25%;
                float: left;

                div {
                    height: 50px;
                    width: 99%;
                }
            }

            .song-album-skeleton {
                width: 30%;
                float: left;

                div {
                    height: 50px;
                    width: 99%;
                }
            }

            .song-time-skeleton {
                position: absolute;
                right: 0;
                width: 60px;

                div {
                    height: 50px;
                    width: 60px;
                }
            }
        }
    }
</style>
