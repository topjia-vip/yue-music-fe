<template>
    <div class="m-rank-info-box-content-skeleton">
        <div class="rank-info-skeleton">
            <div class="rank-info-header-skeleton">
                <div class="skeleton img-box-skeleton">
                </div>
                <div class="rank-info-box-skeleton">
                    <div class="skeleton rank-name-skeleton">
                    </div>
                    <div class="skeleton select-week-skeleton">
                    </div>
                    <div class="tools-skeleton">
                        <div class="skeleton btn-skeleton">
                        </div>
                    </div>
                </div>
            </div>
            <m-song-list-skeleton/>
        </div>
    </div>
</template>

<script>
  import MSongListSkeleton from './m-song-list-skeleton'

  export default {
    name: 'm-rank-info-skeleton',
    components: { MSongListSkeleton }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .m-rank-info-box-content-skeleton {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 0 30px 20px 30px;

        .rank-info-skeleton {
            padding-top: 20px;
            position: relative;

            .rank-info-header-skeleton {
                height: 170px;
                padding-left: 200px;

                .img-box-skeleton {
                    position: absolute;
                    left: 0;
                    width: 170px;
                    height: 170px;
                    float: left;
                }

                .rank-info-box-skeleton {
                    width: 100%;
                    height: 200px;
                    float: left;

                    .rank-name-skeleton {
                        width: 80px;
                        height: 30px;
                    }

                    .select-week-skeleton {
                        height: 20px;
                        width: 100px;
                        margin-top: 35px;
                        margin-bottom: 35px;
                    }

                    .tools-skeleton {
                        position: relative;
                        bottom: 0;
                        height: 30px;
                        line-height: 30px;
                        margin-top: 20px;

                        .btn-skeleton {
                            cursor: pointer;
                            position: relative;
                            width: 120px;
                            height: 30px;
                            border-radius: 20px;
                            margin-right: 10px;
                            display: inline-block;
                        }
                    }
                }
            }

            .song-list {
                margin-top: 30px;
            }
        }
    }
</style>
