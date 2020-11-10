<template>
    <div class="disstdetail-skeleton-box">
        <div class="content">
            <div class="header">
                <div class="skeleton img-skeleton"></div>
                <div class="right-content">
                    <div class="skeleton title-skeleton"></div>
                    <div class="user-skeleton">
                        <div class="skeleton user-img-skeleton"></div>
                        <div class="skeleton user-name-skeleton"></div>
                        <div class="skeleton tag-skeleton"></div>
                        <div class="skeleton tag-skeleton"></div>
                    </div>
                    <div class="skeleton desc-skeleton"></div>
                    <div class="skeleton btn-skeleton"></div>
                    <div class="skeleton btn-skeleton"></div>
                </div>
            </div>
            <div class="skeleton song-count-skeleton"></div>
            <m-song-list-skeleton/>
        </div>
    </div>
</template>

<script>
  import MSongListSkeleton from './m-song-list-skeleton'

  export default {
    name: 'm-disstdetail-skeleton',
    components: { MSongListSkeleton },
    data () {
      return {
        list: new Array(20)
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .disstdetail-skeleton-box {
        padding: 0 30px 20px 30px;

        .content {
            padding-top: 20px;

            .header {
                position: relative;
                height: 200px;
                padding-left: 200px;

                .img-skeleton {
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    left: 0;
                }

                .right-content {
                    padding-left: 30px;
                    width: 100%;
                    height: 200px;
                    float: left;

                    .title-skeleton {
                        height: 28px;
                    }

                    .user-skeleton {
                        height: 30px;
                        margin-top: 20px;
                        font-size: 12px;

                        .user-img-skeleton {
                            height: 30px;
                            width: 30px;
                            float: left;
                            border-radius: 50%;
                        }

                        .user-name-skeleton {
                            height: 30px;
                            width: 20%;
                            float: left;
                            margin-left: 5px;
                        }

                        .tag-skeleton {
                            float: left;
                            height: 30px;
                            width: 30px;
                            margin-left: 10px;
                        }
                    }

                    .desc-skeleton {
                        height: 40px;
                        margin-top: 20px;
                        width: 100%;
                    }

                    .btn-skeleton {
                        width: 120px;
                        height: 30px;
                        border-radius: 20px;
                        margin-right: 10px;
                        margin-top: 20px;
                        display: inline-block;
                    }
                }
            }

            .song-count-skeleton {
                height: 30px;
                width: 80px;
                margin-top: 30px;
            }

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
        }
    }
</style>
