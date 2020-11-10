<template>
    <!--推荐页骨架屏-->
    <div class="recommend-skeleton-box">
        <div class="skeleton focus-skeleton">
        </div>
        <div class="disst-skeleton">
            <m-title :title="'推荐歌单'"/>
            <div class="skeleton-box">
                <ul>
                    <li ref="item" class="item" v-for="(index) in list" :key="index">
                        <div class="skeleton img-box">
                        </div>
                    </li>
                </ul>
            </div>
            <m-title :title="'最新音乐'"/>
            <div class="list-box">
                <ul>
                    <li class="skeleton list-item" v-for="(index) in list" :key="index"></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  import MTitle from '../m-title/m-title'

  export default {
    name: 'm-recommend-skeleton',
    components: { MTitle },
    mounted () {
      window.addEventListener(('resize'), () => {
        this.width = window.innerWidth
      })
      this.setHeight()
    },
    data () {
      return {
        list: new Array(10),
        width: ''
      }
    },
    methods: {
      setHeight () {
        let items = this.$refs.item
        for (let i = 0; i < items.length; i++) {
          items[i].style.height = this.$refs.item[0].clientWidth + 'px'
        }
      }
    },
    watch: {
      width () {
        this.setHeight()
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/skeleton/skeleton";

    .recommend-skeleton-box {
        .focus-skeleton {
            width: 100%;
            height: 240px;
            position: relative;
            z-index: 0;
        }

        .disst-skeleton {
            margin-top: 10px;

            .skeleton-box {
                margin-top: 10px;
                margin-right: -10px;

                .item {
                    list-style: none;
                    padding: 10px 10px 0 0;
                    width: 20%;
                    display: inline-block;

                    .img-box {
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            .list-box {
                margin-top: 10px;

                .list-item {
                    width: 50%;
                    height: 60px;
                    display: inline-block;
                    list-style: none;
                }
            }
        }
    }
</style>
