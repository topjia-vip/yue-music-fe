<template>
    <div class="album-list-box">
        <div class="album-header">
            <span class="hot" :class="sortId === 1?'active':''" @click="changeSortId(1)">最热</span>
            <span class="new" :class="sortId === 0?'active':''" @click="changeSortId(0)">最新</span>
        </div>
        <m-album-list class="album-list" :albums="singerAlbums" v-if="isShow"/>
        <loading v-if="!isShow"/>
    </div>
</template>

<script>
import MAlbumList from '../../../../components/m-album-list/m-album-list'
import Loading from '../../../../components/loading/loading'
import { getSingerAlbumsData } from '../../../../common/js/requestData'
import { getSign } from '../../../../common/js/sign'
import { getSingerAlbums } from '../../../../api/singer'
import { ERR_OK } from '../../../../api/config'
import { createReqData } from '../../../../common/js/createReqData'

export default {
  name: 'albums',
  components: { Loading, MAlbumList },
  props: {
    singerMid: {
      type: String
    }
  },
  data () {
    return {
      sortId: 0,
      isShow: false,
      singerAlbums: []
    }
  },
  created () {
    this.initAlbums()
  },
  methods: {
    initAlbums () {
      this.isShow = false
      let singerAlbumsData = getSingerAlbumsData(this.singerMid, 0, this.sortId, 50)
      let singerAlbumsSign = getSign(singerAlbumsData)
      let reqData = createReqData(singerAlbumsSign, singerAlbumsData)
      getSingerAlbums(reqData).then(res => {
        if (res.code === ERR_OK) {
          this.singerAlbums = res.data.albums
        }
        this.isShow = true
      })
    },
    changeSortId: function (id) {
      if (this.sortId === id) {
        return
      }
      this.sortId = id
      this.initAlbums()
    }
  }
}
</script>

<style lang="less">
    .album-list-box {
        width: 100%;

        .album-header {
            margin-top: 10px;
            height: 60px;
            line-height: 60px;
            font-size: 12px;
            color: #999999;

            .hot {
                margin-right: 10px;
            }

            .hot:hover {
                cursor: pointer;
                color: #ffffff;
            }

            .new:hover {
                cursor: pointer;
                color: #ffffff;
            }

            .active {
                color: #ffffff;
            }
        }

        .album-list {
            margin-top: 10px;
        }
    }
</style>
