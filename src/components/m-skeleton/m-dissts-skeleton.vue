<template>
    <div class="dissts-skeleton-box">
        <div class="heard">
            <div class="skeleton left"></div>
            <div class="skeleton right"></div>
        </div>
        <m-disst-list-skeleton/>
    </div>
</template>

<script>
import MDisstListSkeleton from './m-disst-list-skeleton'

export default {
  name: 'm-dissts-skeleton',
  components: { MDisstListSkeleton },
  data () {
    return {
      list: new Array(30)
    }
  }
}
</script>

<style lang="less">
    .dissts-skeleton-box {
        .heard {
            width: 100%;
            height: 22px;

            .left {
                width: 80px;
                height: 22px;
                float: left;
                display: inline-block;
            }

            .right {
                width: 100px;
                height: 22px;
                float: right;
                display: inline-block;
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
    }
</style>
