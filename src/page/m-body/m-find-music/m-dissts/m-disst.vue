<template>
    <div class="m-disst-box">
        <div class="info-page" v-if="isShow && !isError">
            <div class="m-list-btn" @click="isShowSelect = !isShowSelect">
                <span v-html="categoryName"/>
                <Icon type="ios-arrow-down"></Icon>
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
                                <div class="content">
                                    <div class="list-btn category-item"
                                         v-for="(item,itemIndex) in categoryGroup.categories"
                                         :key="itemIndex"
                                         @click="selectTag(item.categoryId,item.categoryName)"
                                         :class="categoryId ===item.categoryId?'btn-active':'' ">
                                        <span v-html="item.categoryName"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sort-box">
                <span class="btn new" :class="this.sortId === 5?'btn-active':''" @click="changeSort(5)">最新</span>
                <span class="btn hot" :class="this.sortId === 2?'btn-active':''" @click="changeSort(2)">最热</span>
            </div>
            <!-- 歌单列表 -->
            <m-disst-list :dissts="disstsData.dissts" v-if="isShowDisst"
                          @songListDetail="songListDetail"
                          @playDisst="playDisst"
            />
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
  import MDisstList from './m-disst-list/m-disst-list'

  // 每页加载歌单的个数（QQ音乐API每页最大加载60个歌单）
  const DISST_NUM = 60
  export default {
    name: 'm-disst',
    components: {
      MDisstList,
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
            background: var(--select-dropdown-background-color);
            font-size: 12px;
            min-width: 55px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            border-radius: 4px;
            color: var(--font-base-color);
            padding: 0 10px;
            display: inline-block;

            .m-select {
                .triangle {
                    position: absolute;
                    color: var(--select-dropdown-background-color);
                    top: 32px;
                    left: 33px;
                }

                .m-list {
                    transition: 0s;
                    background: var(--select-dropdown-background-color);
                    width: 540px;
                    height: 410px;
                    border-radius: 4px;
                    position: absolute;
                    z-index: 10;
                    top: 49px;
                    left: 0;

                    .list-title {
                        font-size: 14px;
                        color: var(--font-base-color);
                        height: 50px;
                        line-height: 50px;
                        padding: 0 20px;
                    }

                    .list-line {
                        height: 1px;
                        background: var(--select-dropdown-background-color);
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
                            color: var(--font-base-color);
                            background: var(--select-active-background-color);
                        }

                        .list-btn:hover {
                            color: var(--font-base-color);
                            background: var(--select-active-background-color);
                        }

                        .all-dissts {
                            width: 100%;
                            margin-top: 10px;
                        }

                        .disst-category {
                            display: flex;
                            justify-content: flex-start;
                            align-items: flex-start;

                            .category-group-name {
                                width: 17%;
                                color: var(--font-base-color);
                                float: left;
                                text-align: center;
                                position: relative;
                                top: 12px;
                                font-size: 17px;
                            }

                            .content {
                                width: 82%;
                                margin-bottom: 20px;
                                margin-top: 10px;
                                display: flex;
                                justify-content: flex-start;
                                align-items: center;
                                flex-wrap: wrap;

                                .category-item {
                                    width: 20%;
                                    display: inline-block;
                                }
                            }
                        }
                    }

                    .list-content {
                        /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
                        -ms-overflow-style: none;
                    }

                    // 火狐
                    scrollbar-color: transparent transparent;
                    scrollbar-track-color: transparent;
                    -ms-scrollbar-track-color: transparent;

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
                        background-color: var(--scrollbar-thumb-background-color);
                    }

                    /*---鼠标点击滚动条显示样式--*/

                    .list-content::-webkit-scrollbar-thumb:hover {
                        background-color: var(--scrollbar-thumb-hover-color);
                    }

                    .list-content::-webkit-scrollbar-thumb:active {
                        background-color: var(--scrollbar-thumb-active-color);
                    }
                }
            }
        }

        .m-list-btn:hover {
            background: var(--select-dropdown-hover-background-color);
        }

        .sort-box {
            color: var(--font-tow-color);
            float: right;
            display: inline-block;

            .btn {
                cursor: pointer;
            }

            .new {
                margin-right: 20px;
            }

            .btn-active {
                color: var(--font-active-color);
            }

            .btn:hover {
                color: var(--font-active-color);
            }
        }
    }
</style>
