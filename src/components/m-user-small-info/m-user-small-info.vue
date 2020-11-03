<template>
    <div class="m-user-small-info" v-if="isShow">
        <div class="header">
            <div class="my-song-list">歌单1</div>
            <div class="my-follow">关注1</div>
            <div class="my-fans">粉丝0</div>
        </div>
        <div class="division-line"></div>
        <div class="tools">
            <div class="my" @click="toUserPage">我的主页</div>
            <div class="change-user" @click="changeUser">切换账号</div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'm-user-small-info',
  mounted () {
    document.addEventListener('click', e => {
      const v = document.getElementsByClassName('m-user-small-info')[0]
      const b = document.getElementsByClassName('user-name-box-login')[0]
      if (v && b) {
        if (!v.contains(event.target) && !b.contains(event.target)) {
          this.isShow = false
        }
      }
    })
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    openSmallInfo () {
      this.isShow = true
    },
    closeSmallInfo () {
      this.isShow = false
    },
    changeUser () {
      this.isShow = false
      this.$emit('changeUser')
    },
    toUserPage () {
      this.$emit('toUserPage')
    }
  }
}
</script>

<style lang="less">
    .m-user-small-info {
        width: 240px;
        height: 140px;
        background: #29292b;
        border-radius: 10px;
        z-index: 10;
        top: 40px;
        right: -60px;
        color: #999999;

        .header {
            padding: 0 20px;
            height: 70px;
            line-height: 70px;

            div {
                float: left;
                width: 33%;
                text-align: center;
            }
        }

        .division-line {
            width: 100%;
            height: 1px;
            background: #424242;
        }

        .tools {
            padding: 0 20px;
            height: 70px;
            line-height: 70px;

            div {
                float: left;
                width: 50%;
                text-align: center;
            }
        }

        div :hover {
            cursor: pointer;
            color: #ffffff;
        }
    }
</style>
