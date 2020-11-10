<template>
    <div class="info-page-skeleton">
        <div class="m-singer-tags-skeleton">
            <div class="skeleton tags tags-top"></div>
            <div class="skeleton tags tags-bottom"></div>
        </div>
        <m-singer-list-skeleton></m-singer-list-skeleton>
    </div>
</template>

<script>
  import MSingerListSkeleton from './m-singer-list-skeleton'

  export default {
    name: 'm-singers-skeleton',
    components: { MSingerListSkeleton }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .info-page-skeleton {
        .m-singer-tags-skeleton {
            .tags {
                height: 30px;
                margin-bottom: 20px;
            }

            .tags-top {
                width: 600px;
            }

            .tags-bottom {
                width: 400px;
            }
        }
    }
</style>
