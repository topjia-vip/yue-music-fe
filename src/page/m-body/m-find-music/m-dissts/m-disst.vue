<template>
    <div class="m-disst-box">
        <div class="info-page" v-if="isShow && !isError">
            <div class="m-list-btn" @click="isShowSelect = !isShowSelect">
                <span v-html="categoryName"/>
                <Icon type="ios-arrow-down"></Icon>
            </div>
            <div class="sort-box">
                <span class="btn new" :class="this.sortId === 5?'btn-active':''" @click="changeSort(5)">最新</span>
                <span class="btn hot" :class="this.sortId === 2?'btn-active':''" @click="changeSort(2)">最热</span>
            </div>
            <!--下拉菜单-->
            <div class="m-select" v-if="isShowSelect">
                <i class="triangle fa fa-caret-up fa-2x" aria-hidden="true"></i>
                <div class="m-list">
                    <div class="list-title">
                        添加标签
                    </div>
                    <div class="list-line"></div>
                    <div class="list-content">
                        <div class="list-btn all-dissts" @click="selectTag(10000000,'全部歌单')"
                             :class="categoryId ===10000000?'btn-active':'' ">
                            全部歌单
                        </div>
                        <div class="disst-category"
                             v-for="(categoryGroup,index) in categoryGroups"
                             v-if="index != 0"
                             :key="index">
                            <div class="category-group-name">
                                {{categoryGroup.categoryGroupName}}
                            </div>
                            <ul>
                                <li class="list-btn category-item"
                                    v-for="(item,itemIndex) in categoryGroup.categories"
                                    :key="itemIndex"
                                    @click="selectTag(item.categoryId,item.categoryName)"
                                    :class="categoryId ===item.categoryId?'btn-active':'' ">
                                    <span v-html="item.categoryName"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!--歌单展示-->
            <div class="container" v-if="isShowDisst">
                <div class="m-dissts-box">
                    <ul>
                        <li class="item disst-item"
                            v-for="(disst,index) in disstsData.dissts" :key="disst.disstId">
                            <div class="disst-bottom"></div>
                            <div class="disst-img-box">
                                <div class="visitnum-box">
                                    <div class="visitnum">
                                        <Icon type="ios-headset"/>
                                        <span>{{handleVisitNum(disst.visitnum)}}</span>
                                    </div>
                                </div>
                                <img ondragstart="return false" class="disst-img"
                                     v-lazy="handleLazyImage(disst.disstLogo)"
                                     :alt="disst.disstName"
                                     :key="disst.disstLogo"
                                >
                                <div class="img-mask" @click="songListDetail(disst)"></div>
                                <m-play-btn class="play-icon-box" :font-size="60"
                                            @play="playDisst(index)"/>
                                <div class="create-user">
                                    <div class="user-name-box">
                                        <i class="fa fa-user-o" aria-hidden="true"></i>
                                        <div v-html="disst.nickname"/>
                                    </div>
                                </div>
                            </div>
                            <div class="disst-name" @click="songListDetail(disst)">
                                {{disst.disstName}}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <m-disst-list-skeleton v-else/>
            <router-view></router-view>
            <m-disst-play-loading ref="disstLoading"/>
            <!--分页器-->
            <MPage :pageSize="pageSize" :curPageNum="curPageNum"
                   :total="disstsData.disstSum"
                   @changePage="changePage"/>
        </div>
        <!--骨架屏-->
        <m-dissts-skeleton v-if="!isShow && !isError"/>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import {
    dissList,
    disstCategoryGroup,
    disstDetailSongList
  } from '../../../../api/disst'
  import { ERR_OK } from '../../../../api/config'
  import MPage from '../../../../components/m-page/m-page'
  import Loading from '../../../../components/loading/loading'
  import { _normalizeSongs, scrollToTop, sleep } from '../../../../common/js/util'
  import { mapActions, mapMutations } from 'vuex'
  import {
    createDisstCategoryGroupData,
    createDisstDetailData,
    createDisstListData
  } from '../../../../common/js/createReqData'
  import MDisstPlayLoading
    from '../../../../components/m-disst-play-loading/m-disst-play-loading'
  import MPlayBtn from '../../../../components/m-play-btn/m-play-btn'
  import MErrorPage from '../../../../components/m-error-page/m-error-page'
  import MDisstsSkeleton from '../../../../components/m-skeleton/m-dissts-skeleton'
  import MDisstListSkeleton from '../../../../components/m-skeleton/m-disst-list-skeleton'
  import DisstDefLazyImg from '../../../../resources/images/album_300.png'

  // 每页加载歌单的个数（QQ音乐API每页最大加载60个歌单）
  const DISST_NUM = 60
  export default {
    name: 'm-disst',
    components: {
      MDisstListSkeleton,
      MDisstsSkeleton,
      MErrorPage,
      MPlayBtn,
      MDisstPlayLoading,
      Loading,
      Icon,
      MPage
    },
    data () {
      return {
        categoryGroups: [],
        categoryId: 10000000,
        categoryName: '全部歌单',
        disstsData: {},
        sin: 0,
        ein: 1,
        sortId: 5,
        curPageNum: 1,
        pageSize: DISST_NUM,
        isShowSelect: false,
        isShow: false,
        isShowDisst: true,
        isError: false
      }
    },
    computed: {
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: DisstDefLazyImg,
            loading: DisstDefLazyImg
          }
        }
      }
    },
    created () {
      this.$nextTick(() => {
        this._disstCategoryGroup()
        this._getDisstList()
        document.addEventListener('click', e => {
          const v = document.getElementsByClassName('m-select')[0]
          const b = document.getElementsByClassName('m-list-btn')[0]
          if (v && b) {
            if (!v.contains(event.target) && !b.contains(event.target)) {
              this.isShowSelect = false
            }
          }
        })
      })
    },
    methods: {
      _disstCategoryGroup () {
        let reqData = createDisstCategoryGroupData()
        disstCategoryGroup(reqData).then(res => {
          if (res.code === ERR_OK) {
            this.categoryGroups = res.categoryGroups
          }
        })
      },
      async _getDisstList () {
        let reqData = createDisstListData(this.categoryId, this.sortId,
          this.sin * DISST_NUM, this.ein * DISST_NUM)
        let res = await dissList(reqData)
        for (let i = 0; i < 5; i++) {
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await dissList(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        this.disstsData = res.data
        this.isShow = true
      },
      async _changeSelect () {
        let reqData = createDisstListData(this.categoryId, this.sortId,
          this.sin * DISST_NUM, this.ein * DISST_NUM)
        let res = await dissList(reqData)
        for (let i = 0; i < 5; i++) {
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await dissList(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        this.disstsData = res.data
        this.isShowDisst = true
      },
      refresh () {
        this.isError = false
        this._getDisstList()
      },
      selectTag (id, name) {
        if (this.categoryId === id) {
          return
        }
        this.categoryId = id
        this.categoryName = name
        this.isShowSelect = false
        this.isShowDisst = false
        this.handlePage()
        this.$nextTick(() => {
          this._changeSelect()
        })
      },
      changeSort (sortId) {
        if (this.sortId === sortId) {
          return
        }
        this.sortId = sortId
        this.isShowDisst = false
        this.handlePage()
        this.$nextTick(() => {
          this._changeSelect()
        })
      },
      changePage (pageNum) {
        if (pageNum !== this.curPageNum) {
          this.curPageNum = pageNum
          this.isShowDisst = false
          this.handlePage(pageNum)
          scrollToTop('m-find-music-box')
          this.$nextTick(() => {
            this._changeSelect()
          })
        }
      },
      handlePage (curPageNum = 1) {
        this.curPageNum = curPageNum
        this.sin = curPageNum - 1
        this.ein = curPageNum
      },
      handleVisitNum (number) {
        if (number >= 10000) {
          const num = number / 10000
          return `${Math.round(num * 10) / 10}万`
        } else {
          return number
        }
      },
      songListDetail (songList) {
        let router = `/disst/${songList.disstId}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      playDisst (index) {
        let disst = this.disstsData.dissts[index]
        if (this.disstId !== disst.disstId) {
          if (disst.songlist === null) {
            this.$refs.disstLoading.openLoading()
            let reqData = createDisstDetailData(disst.disstId)
            disstDetailSongList(reqData).then(res => {
              if (res.code === ERR_OK) {
                this.disstsData.dissts[index].songlist = _normalizeSongs(
                  res.songs)
              }
              this.playDisstSong(this.disstsData.dissts[index])
              this.$refs.disstLoading.closeLoading()
            })
          } else {
            this.playDisstSong(disst)
          }
        }
      },
      // 播放整个列表
      playDisstSong (disst) {
        this.selectPlay(
          {
            list: disst.songlist,
            index: 0
          }
        )
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      }),
      ...mapActions([
        'selectPlay'
      ])
    }
  }
</script>

<style lang="less">
    .m-disst-box {
        position: relative;
        padding-top: 20px;
        max-width: 1040px;
        margin: 0 auto;
        width: 100%;
        height: 100%;

        .m-list-btn {
            cursor: pointer;
            background: #25272B;
            font-size: 12px;
            min-width: 55px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            border-radius: 4px;
            color: #DCDDE4;
            padding: 0 10px;
            display: inline-block;
        }

        .m-list-btn:hover {
            background: #2C2E32;
        }

        .sort-box {
            color: #828385;
            float: right;
            display: inline-block;

            .btn {
                cursor: pointer;
            }

            .new {
                margin-right: 20px;
            }

            .btn-active {
                color: #DCDDE4;
            }

            .btn:hover {
                color: #DCDDE4;
            }
        }

        .triangle {
            position: absolute;
            color: #2D2F33;
            top: 32px;
            left: 33px;
        }

        .m-list {
            transition: 0s;
            background: #2D2F33;
            width: 540px;
            height: 410px;
            border-radius: 4px;
            position: absolute;
            z-index: 10;
            top: 51px;

            .list-title {
                font-size: 14px;
                color: #DCDDE4;
                height: 50px;
                line-height: 50px;
                padding: 0 20px;
            }

            .list-line {
                height: 1px;
                background: #37393D;
            }

            .list-content {
                height: 359px;
                overflow-y: scroll;
                padding: 0 20px;

                .list-btn {
                    position: relative;
                    height: 30px;
                    line-height: 30px;
                    cursor: pointer;
                    color: #828385;
                    text-align: center;
                    font-size: 12px;
                    border: 1px solid #37393D;
                    margin: 0 0 -1px -1px;
                }

                .btn-active {
                    color: #DCDDE4;
                    background: #37393D;
                }

                .list-btn:hover {
                    color: #DCDDE4;
                    background: #37393D;
                }

                .all-dissts {
                    width: 100%;
                    margin-top: 10px;
                }

                .disst-category {
                    .category-group-name {
                        width: 17%;
                        color: #DCDDE4;
                        float: left;
                        text-align: center;
                        position: relative;
                        top: 12px;
                        font-size: 17px;
                    }

                    ul {
                        width: 82%;
                        list-style: none;
                        float: left;
                        margin-bottom: 20px;
                        margin-top: 10px;

                        .category-item {
                            width: 20%;
                            display: inline-block;
                        }
                    }
                }
            }
        }

        .container {
            margin-right: -15px;

            .m-dissts-box {
                margin-top: 20px;
                width: 100%;
                position: relative;
                margin-right: -15px;

                .item {
                    position: relative;
                    width: 25%;
                    list-style: none;
                    padding: 0 15px 20px 0;
                    display: inline-block;
                }

                @media (min-width: 1070px) {
                    .item {
                        width: 20%;
                    }
                }

                .disst-item {
                    position: relative;

                    .disst-img-box {
                        position: relative;
                        transition: 0.2s ease-in-out;
                        top: 0;
                        z-index: 8;
                        overflow: hidden;
                        border-radius: 10px;
                        /*transform: translateY(0px);*/

                        .visitnum-box {
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 100%;
                            height: 20px;
                            line-height: 20px;
                            color: #FFFFFF;
                            font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
                            background-image: linear-gradient(to right, #ffffff00, #000000a6);
                            transform: translate3d(0, 0, 0);
                            transition: transform 300ms;

                            .visitnum {
                                float: right;

                                span {
                                    margin-right: 5px;
                                    font-size: 12px;
                                }
                            }
                        }

                        .img-mask {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            top: 0;
                            background: #2828287a;
                            border-radius: 10px;
                            opacity: 0;
                            z-index: 1;
                            transition: opacity 300ms;
                        }

                        .create-user {
                            height: 20px;
                            line-height: 20px;
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            padding-left: 10px;
                            color: #FFFFFF;
                            background-image: linear-gradient(to right, #000000a6, #ffffff00);
                            display: block;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            transform: translate3d(0, 0, 0);
                            transition: transform 300ms;

                            .user-name-box {
                                float: left;

                                div {
                                    display: inline-block;
                                    margin-right: 5px;
                                    font-size: 12px;
                                }
                            }

                            .user-name {
                                display: inline-block;
                                font-size: 12px;
                            }
                        }

                        .play-icon-box {
                            z-index: 11;
                            opacity: 0;
                            transform: translate3d(0, 0, 0) scale(.7);
                            transition: transform 300ms, opacity 300ms;
                        }

                        .disst-img {
                            display: block;
                            width: auto;
                            height: auto;
                            max-width: 100%;
                            max-height: 100%;
                        }

                    }

                    .disst-bottom {
                        position: absolute;
                        height: 10px;
                        width: 100%;
                        padding-right: 15px;
                        bottom: 80px;
                        cursor: pointer;
                        z-index: 5;
                    }

                    .disst-bottom:hover + .disst-img-box {
                        cursor: pointer;
                        transform: translateY(-10px);

                        .visitnum-box {
                            transform: translate3d(0, -20px, 0);
                        }

                        .create-user {
                            transform: translate3d(0, 20px, 0);
                        }

                        .img-mask {
                            opacity: 1;
                            z-index: 1;
                        }

                        .play-icon-box {
                            z-index: 11;
                            opacity: 1;
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                    }

                    .disst-img-box:hover {
                        cursor: pointer;
                        transform: translateY(-10px);

                        .visitnum-box {
                            transform: translate3d(0, -20px, 0);
                        }

                        .create-user {
                            transform: translate3d(0, 20px, 0);
                        }

                        .img-mask {
                            opacity: 1;
                        }

                        .play-icon-box {
                            opacity: 1;
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                    }

                    .disst-name {
                        position: relative;
                        margin-top: 10px;
                        height: 50px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        color: #ADAFB2;
                        padding-top: 5px;
                    }

                    .disst-name:hover {
                        cursor: pointer;
                        color: #FFFFFF;
                    }
                }
            }
        }

        .list-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .list-content {
            overflow: auto;
            height: 100%;
        }

        .list-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .list-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .list-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #414346;
        }

        /*---鼠标点击滚动条显示样式--*/

        .list-content::-webkit-scrollbar-thumb:hover {
            background-color: #4D4E52;
        }

        .list-content::-webkit-scrollbar-thumb:active {
            background-color: #4D4E52;
        }
    }
</style>
