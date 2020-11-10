<template>
    <div class="m-singer-detail-skeleton">
        <div class="singer-detail">
            <div class="header">
                <div class="img-box">
                    <div class="skeleton img-skeleton"></div>
                </div>
                <div class="singer-detail-info-box">
                    <div class="skeleton singer-name-skeleton"></div>
                    <div class="singer-desc-skeleton">
                        <div class="skeleton desc" v-for="(index) in descNum" :key="index"></div>
                    </div>
                    <div class="skeleton singer-concern-skeleton"></div>
                    <div class="skeleton song-sum-skeleton"></div>
                </div>
            </div>
        </div>
        <m-song-list-skeleton></m-song-list-skeleton>
    </div>
</template>

<script>
  import MSongListSkeleton from './m-song-list-skeleton'

  export default {
    name: 'm-singer-detail-skeleton',
    components: { MSongListSkeleton },
    data () {
      return {
        descNum: new Array(4)
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .m-singer-detail-skeleton {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0 30px 20px 30px;

        .singer-detail {
            padding-top: 20px;
            position: relative;

            .header {
                height: 200px;
                padding-left: 200px;

                .img-box {
                    position: absolute;
                    left: 0;
                    width: 200px;
                    height: 200px;
                    float: left;

                    .img-skeleton {
                        width: 100%;
                        height: 100%;
                        display: block;
                        border-radius: 50%
                    }
                }

                .singer-detail-info-box {
                    margin-top: 20px;
                    padding-left: 30px;
                    width: 100%;
                    height: 200px;
                    float: left;

                    .singer-name-skeleton {
                        height: 45px;
                        width: 200px;
                    }

                    .singer-desc-skeleton {
                        margin-top: 10px;
                        width: 100%;

                        .desc {
                            margin-right: 20px;
                            height: 21px;
                            width: 60px;
                            display: inline-block;
                        }
                    }

                    .singer-concern-skeleton {
                        margin-top: 10px;
                        height: 21px;
                        width: 80px;
                    }

                    .song-sum-skeleton {
                        margin-top: 10px;
                        height: 21px;
                        width: 80px;
                    }
                }
            }
        }
    }
</style>
