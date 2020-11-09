<template>
    <div class="singer-info-box">
        <!--歌手简介-->
        <h2 class="title">歌手简介</h2>
        <div class="singer-desc" v-if="singerInfo.desc">
            <span v-html="singerInfo.desc"></span>
        </div>
        <!--歌手基本信息-->
        <div class="singer-base-info" v-if="singerInfo.basic && singerInfo.basic.length > 0">
            <h2 class="title">基本资料</h2>
            <div class="base-info-box">
                <div class="base-info" v-for="(basic,index) in singerInfo.basic" v-html="basic.value"
                     :key="index"></div>
            </div>
        </div>
        <!--歌手其他信息-->
        <div class="singer-other-info" v-if="singerInfo.other && singerInfo.other.length>0">
            <div class="other-info-box" v-for="(other,index) in singerInfo.other" :key="index">
                <h2 class="title" v-html="other.key"></h2>
                <div class="info" v-html="handleTxT(other.value)"></div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'singer-info',
    props: {
      singerInfo: {
        type: Object
      }
    },
    methods: {
      handleTxT (txt) {
        if (!txt || txt === '') {
          return '该歌手暂无简介'
        }
        let res = `${txt.replace(/(\r\n|\n|\r)/gm, '<br />')}`
        return res
      }
    }
  }
</script>

<style lang="less">
    @import "../../../../../../common/css/theme/theme";

    .singer-info-box {
        margin-top: 30px;
        user-select: text;

        .singer-desc {
            margin-top: 20px;
            color: @font-tow-color
        }

        .title {
            color: @font-base-color;
        }

        .singer-base-info {
            margin-top: 20px;

            .base-info-box {
                margin-top: 20px;
                color: @font-tow-color;

                .base-info {
                    margin-bottom: 15px;
                }
            }
        }

        .singer-other-info {

            .other-info-box {
                margin-top: 20px;

                .info {
                    color: @font-tow-color;
                    margin-top: 20px;
                }
            }
        }
    }
</style>
