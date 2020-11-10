<template>
    <div class="list-box">
        <ul>
            <li class="item-box" v-for="index in list" :key="index">
                <div ref="item" class="skeleton item"></div>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'm-disst-list-skeleton',
    mounted () {
      window.addEventListener(('resize'), () => {
        this.width = window.innerWidth
      })
      this.setHeight()
    },
    data () {
      return {
        list: new Array(30),
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

    .list-box {
        margin-top: 20px;
        margin-right: -15px;

        .item-box {
            position: relative;
            width: 25%;
            list-style: none;
            padding: 0 15px 20px 0;
            display: inline-block;

            .item {
                height: 200px;
                border-radius: 10px;
            }
        }

        @media (min-width: 1070px) {
            .item-box {
                width: 20%;
            }
        }
    }
</style>
