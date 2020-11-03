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
