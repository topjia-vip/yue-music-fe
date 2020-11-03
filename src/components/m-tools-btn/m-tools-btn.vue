<template>
    <div class="tools">
        <div class="btn play-btn" @click="playAll">
            <i class="icon play-icon fa fa-play" aria-hidden="true"></i>
            <span>播放全部</span>
        </div>
        <div class="btn save-btn" @click="save" v-if="!isLikeDisst">
            <i class="icon save-icon fa fa-heart-o" aria-hidden="true"></i>
            <span>收藏歌单</span>
        </div>
        <div class="btn unSave-btn" @click="unSave" v-else>
            <i class="icon save-icon fa fa-heart" aria-hidden="true"></i>
            <span>取消收藏</span>
        </div>
    </div>
</template>

<script>
export default {
  name: 'm-tools-btn',
  props: {
    isLikeDisst: {
      type: Boolean
    }
  },
  methods: {
    playAll () {
      this.$emit('playAll')
    },
    save () {
      this.$emit('save')
    },
    unSave () {
      this.$emit('unSave')
    }
  }
}
</script>

<style lang="less">
    .tools {
        height: 30px;
        line-height: 30px;

        .btn {
            cursor: pointer;
            position: relative;
            width: 120px;
            height: 30px;
            border-radius: 20px;
            text-align: center;
            margin-right: 10px;
            line-height: 30px;
            display: inline-block;
            transition: all 0.2s ease-in-out;
        }

        .play-btn {
            background-image: linear-gradient(141deg, rgb(17, 224, 246) 0%, rgb(203, 52, 218) 51%, rgb(230, 57, 162) 75%);
            color: #E7E7E7;
        }

        .save-btn {
            background: #303031;
            color: #E7E7E7;
        }

        .unSave-btn {
            background: #303031;
            color: #E7E7E7;

            .icon {
                color: #d65958;
            }
        }

        .play-btn:hover {
            background-image: linear-gradient(141deg, rgb(4, 195, 246) 0%, rgb(183, 46, 218) 51%, rgb(230, 34, 164) 75%);
        }

        .save-btn:hover, .unSave-btn:hover {
            background: #3b3b3c;
        }
    }
</style>
