<template>
    <div class="m-menu-box" :style="{top:top+'px',left:left+'px'}">
        <div class="item play-song" @click="operation(1)">
            <Icon class="icon" type="ios-play" size="16"/>
            <span>播放</span>
        </div>
        <div class="item add-to-next-play" @click="operation(2)">
            <Icon class="icon" type="ios-add-circle" size="13"/>
            <span>下一首播放</span>
        </div>
        <div class="line"></div>
        <div class="item down-load-song">
            <Icon class="icon" type="md-download" size="16"/>
            <span>下载</span>
        </div>
    </div>
</template>

<script>
import { Icon } from 'view-design'

export default {
  name: 'm-right-click-menu',
  components: {
    Icon
  },
  props: {
    left: {
      type: Number,
      default: 0
    },
    top: {
      type: Number,
      default: 0
    }
  },
  methods: {
    operation (type) {
      this.$emit('operation', type)
    }
  }
}
</script>

<style lang="less">
    .m-menu-box {
        position: absolute;
        z-index: 10;
        width: 200px;
        height: 300px;
        background: #29292B;
        padding: 15px 0;

        .item {
            padding: 0 15px;
            height: 30px;
            line-height: 30px;
            color: #F1F1F1;

            .icon {
                margin-right: 5px;
            }
        }

        .play-song {

        }

        .add-to-next-play {
            margin-bottom: 10px;
        }

        .line {
            width: 100%;
            height: 0.5px;
            background: #4c4c4c36;
            margin-bottom: 10px;
        }

        .item:hover {
            cursor: pointer;
            background: #434345;
        }
    }
</style>
