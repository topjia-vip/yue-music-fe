<template>
    <div ref="singerBox" class="m-singer-box">
        <div class="info-page" v-if="isShow && !isError">
            <!-- 标签栏-->
            <div class="m-singer-tags-box">
                <!--地区-->
                <ul>
                    <li class="tag-item" v-for="(areaItem) in tags.area" :key="areaItem.tagId">
                        <div class="tag-title" :class="area === areaItem.tagId?'tag-item-active':''"
                             @click="selectTag(areaItem.tagId,'area')" v-html="areaItem.tagName"/>
                    </li>
                </ul>
                <!--性别-->
                <ul>
                    <li class="tag-item" v-for="(sexItem) in tags.sex" :key="sexItem.tagId">
                        <div class="tag-title" :class="sex === sexItem.tagId?'tag-item-active':''"
                             @click="selectTag(sexItem.tagId,'sex')" v-html="sexItem.tagName"/>
                    </li>
                </ul>
                <div class="select-box">
                    <!--流派-->
                    <div class="select-tag-box genre-tag-box">
                        <div class="genre-tag-name tag-name" @click="showGenre = !showGenre">
                            <span v-html="genreTitle"></span>
                            <Icon type="ios-arrow-down"></Icon>
                        </div>
                    </div>
                    <div class="genre-select" v-if="showGenre">
                        <i class="genre-triangle fa fa-caret-up fa-2x" aria-hidden="true"></i>
                        <div class="genre-item">
                            <ul>
                                <li class="tag" v-for="(genreItem) in tags.genre" :key="genreItem.tagId">
                                    <div @click="selectTag(genreItem.tagId,genreItem.tagName)" class="tag-title"
                                         v-html="genreItem.tagName"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--名字索引-->
                    <div class="select-tag-box index-tag-box">
                        <div class="index-tag-name tag-name" @click="showIndex = !showIndex">
                            <span v-html="indexTitle"></span>
                            <Icon type="ios-arrow-down"></Icon>
                        </div>
                    </div>
                    <div class="index-select" v-if="showIndex">
                        <i class="index-triangle fa fa-caret-up fa-2x" aria-hidden="true"></i>
                        <div class="index-item">
                            <ul>
                                <li class="tag">
                                    <div class="tag-title" @click="isShowIndexTags(false)">热门</div>
                                </li>
                                <li class="tag">
                                    <div class="tag-title" @click="isShowIndexTags(true)">A-Z</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!--A-Z-->
            <div class="AtoZ-box" v-if="showIndexTag">
                <ul>
                    <li class="A-Z-item" v-for="(indexTag) in tags.index" :key="indexTag.tagId">
                        <div :class="index === indexTag.tagId?'index-tag-active':''" class="index-tag-title"
                             v-html="indexTag.tagName" @click="selectTag(indexTag.tagId,'index')"></div>
                    </li>
                </ul>
            </div>
            <!--歌手显示栏-->
            <div class="singer-list" v-if="isShowSingers">
                <!--各分类热门歌手-->
                <div class="hot-singer-box">
                    <ul>
                        <li class="item hot-singer" v-for="(hotSinger) in hotSingerList" :key="hotSinger.singerId">
                            <!--图片-->
                            <div class="hot-singer-img-box" @click="toSingerDetail(hotSinger)">
                                <img ondragstart="return false" class="hot-singer-img"
                                     v-lazy="handleLazyImage(hotSinger.singerPic)"
                                     :alt="hotSinger.singerName"
                                     :key="hotSinger.singerPic"
                                >
                            </div>
                            <!--姓名-->
                            <div class="hot-singer-name">
                                <span v-html="hotSinger.singerName" @click="toSingerDetail(hotSinger)"></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!--非热门歌手-->
                <div class="singer-box">
                    <ul>
                        <li class="item singer" v-for="(singer) in singerList" :key="singer.singerId">
                            <!--姓名-->
                            <div class="singer-name">
                                <span v-html="singer.singerName" @click="toSingerDetail(singer)"></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <!--没有更多歌手显示栏-->
                <div class="not-singer" v-if="showNoSinger">没有更多歌手啦~</div>
            </div>
            <m-singer-list-skeleton v-if="!isShowSingers"></m-singer-list-skeleton>
        </div>
        <!--loading-->
        <m-singers-skeleton v-if="!isShow && !isError"></m-singers-skeleton>
        <m-error-page v-if="isError" @refresh="refresh"/>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { getSingerList } from '../../../../api/singer'
  import { ERR_OK } from '../../../../api/config'
  import ScrollTop from '../../../../components/scrollTop/scroll-top'
  import { mapMutations } from 'vuex'
  import { getSingerListData } from '../../../../common/js/requestData'
  import { getSign } from '../../../../common/js/sign'
  import { createReqData } from '../../../../common/js/createReqData'
  import Loading from '../../../../components/loading/loading'
  import MErrorPage from '../../../../components/m-error-page/m-error-page'
  import { sleep } from '../../../../common/js/util'
  import MSingersSkeleton from '../../../../components/m-skeleton/m-singers-skeleton'
  import MSingerListSkeleton from '../../../../components/m-skeleton/m-singer-list-skeleton'
  import SingerDefLazyImg from '../../../../resources/images/singer_300.png'

  export default {
    name: 'm-singer',
    components: {
      MSingerListSkeleton,
      MSingersSkeleton,
      MErrorPage,
      Loading,
      ScrollTop,
      Icon
    },
    props: {
      scrollTop: {
        type: Number
      },
      scrollHeight: {
        type: Number
      },
      clientHeight: {
        type: Number
      }
    },
    data () {
      return {
        tags: {},
        singerList: [],
        hotSingerList: [],
        area: -100,
        index: -100,
        sex: -100,
        genre: -100,
        genreTitle: '全部',
        indexTitle: '热门',
        sin: 0, // 80
        cur_page: 1, // 2
        showGenre: false,
        showIndex: false,
        showIndexTag: false,
        showNoSinger: false,
        isShow: false,
        isShowSingers: true,
        isError: false
      }
    },
    computed: {
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: SingerDefLazyImg,
            loading: SingerDefLazyImg
          }
        }
      }
    },
    created () {
      this._getSingerList()
    },
    mounted () {
      this.$nextTick(() => {
        document.addEventListener('click', e => {
          let v = document.getElementsByClassName('genre-tag-name')[0]
          let b = document.getElementsByClassName('genre-item')[0]
          if (v && b) {
            if (!v.contains(event.target) && !b.contains(event.target)) {
              this.showGenre = false
            }
          }
          v = document.getElementsByClassName('index-tag-name')[0]
          b = document.getElementsByClassName('index-item')[0]
          if (v && b) {
            if (!v.contains(event.target) && !b.contains(event.target)) {
              this.showIndex = false
            }
          }
        })
      })
    },
    methods: {
      async _getSingerList (type = 'init') {
        this.showNoSinger = false
        if (type === 'change') {
          this.isShowSingers = false
        } else {
          this.isShow = false
        }
        let data = getSingerListData(this.area, this.genre, this.index, this.sex, this.sin, this.cur_page)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getSingerList(reqData)
        for (let i = 0; i < 5; i++) {
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await getSingerList(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        if (res.data.singerList.length === 0) {
          this.showNoSinger = true
          this.hotSingerList = []
          this.singerList = []
        } else {
          this.hotSingerList = res.data.singerList.slice(0, 10)
          this.singerList = res.data.singerList.slice(10)
        }
        this.tags = res.data.tags
        if (type === 'change') {
          this.isShowSingers = true
        } else {
          this.isShow = true
        }
      },
      async getMoreSinger () {
        // 检查能否加载更多歌手
        this.sin += 80
        this.cur_page += 1
        let data = getSingerListData(this.area, this.genre, this.index, this.sex, this.sin, this.cur_page)
        let sign = getSign(data)
        let reqData = createReqData(sign, data)
        let res = await getSingerList(reqData)
        for (let i = 0; i < 5; i++) {
          if (res.code !== ERR_OK) {
            sleep(500)
            res = await getSingerList(reqData)
          } else {
            break
          }
        }
        if (res.code !== ERR_OK) {
          this.isError = true
          return
        }
        if (res.data.singerList.length === 0) {
          this.showNoSinger = true
        } else {
          this.singerList = this.singerList.concat(res.data.singerList)
        }
      },
      refresh () {
        this.isError = false
        this._getSingerList()
      },
      toSingerDetail (singer) {
        let router = `/singer/${singer.singerName}/${singer.singerMid}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      selectTag (id, type) {
        if (type === 'index') {
          if (this.index === id) {
            return
          }
          this.index = id
        } else if (type === 'area') {
          if (this.area === id) {
            return
          }
          this.area = id
        } else if (type === 'sex') {
          if (this.sex === id) {
            return
          }
          this.sex = id
        } else {
          this.showGenre = false
          if (this.genre === id) {
            return
          }
          this.genreTitle = type
          this.genre = id
        }
        this.sin = 0
        this.cur_page = 1
        this._getSingerList('change')
      },
      isShowIndexTags (flag) {
        this.showIndex = false
        if (this.showIndexTag === flag) {
          return
        }
        if (flag) {
          this.indexTitle = 'A-Z'
        } else {
          this.indexTitle = '热门'
          this.selectTag(-100, 'index')
        }
        this.showIndexTag = flag
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    },
    watch: {
      scrollTop (scrollTop) {
        if (scrollTop + this.clientHeight >= this.scrollHeight - 10) {
          if (!this.showNoSinger) {
            // 加载更多歌手
            this.getMoreSinger()
          }
        }
      }
    }
  }
</script>

<style lang="less">
    .m-singer-box {
        position: relative;
        padding-top: 20px;
        max-width: 1040px;
        margin: 0 auto;
        width: 100%;
        height: 100%;

        .m-singer-tags-box {
            position: relative;
            width: 100%;

            ul {
                margin-bottom: 20px;
            }

            .tag-item {
                list-style: none;
                display: inline-block;

                .tag-title {
                    cursor: pointer;
                    width: 75px;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 20px;
                    border: 1px solid #383839;
                    background: none;
                    color: #BBBBBB;
                    margin-right: 10px;
                }

                .tag-title:hover {
                    background: #2b2b2c7a;
                }

                .tag-item-active {
                    border: 1px solid #3a3b3b !important;
                    color: #fff0f6 !important;
                    background: #3a3b3b !important;
                }
            }

            .select-box {
                position: absolute;
                bottom: 0;
                right: 0;

                .select-tag-box {
                    cursor: pointer;
                    background: #25272B;
                    font-size: 12px;
                    min-width: 55px;
                    height: 22px;
                    text-align: center;
                    line-height: 22px;
                    color: #BBBBBB;
                    display: inline-block;
                    border-radius: 4px;

                    .tag-name {
                        padding: 0 10px;
                    }

                }

                .genre-tag-box {
                    margin-right: 30px;
                }

                .tag-name:hover {
                    border-radius: 4px;
                    color: #DCDDE4;
                    background: #2C2E32;
                }
            }

            .genre-select {
                position: absolute;

                .genre-triangle {
                    position: relative;
                    top: -11px;
                    right: -35px;
                    color: #29292B;
                }

                .genre-item {
                    position: absolute;
                    max-height: 200px;
                    top: 8px;
                    width: 60px;
                    background: #29292B;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    text-align: center;
                    color: #BBBBBB;
                    overflow-y: scroll;

                    ul {
                        margin-bottom: 0;

                        .tag {
                            list-style: none;
                            height: 30px;
                            line-height: 30px;
                            border-bottom: 1px solid #383839;
                        }

                        .tag:hover {
                            color: #DCDDE4;
                            background: #49484880;
                        }
                    }
                }

                .genre-item {
                    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
                    -ms-overflow-style: none;
                }

                .genre-item::-webkit-scrollbar {
                    /*滚动条整体样式*/
                    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
                    height: 1px;
                }

                /*定义滚动条轨道 内阴影+圆角*/

                .genre-item::-webkit-scrollbar-track-piece {
                    -webkit-border-radius: 2em;
                    -moz-border-radius: 2em;
                    border-radius: 2em;
                }

                /*定义滑块 内阴影+圆角*/

                .genre-item::-webkit-scrollbar-thumb {
                    /*滚动条里面小方块*/
                    border-radius: 10px;
                    background-color: #2F3134;
                }

                /*---鼠标点击滚动条显示样式--*/

                .genre-item::-webkit-scrollbar-thumb:hover {
                    background-color: #3B3C40;
                }

                .genre-item::-webkit-scrollbar-thumb:active {
                    background-color: #3B3C40;
                }
            }

            .index-select {
                position: absolute;

                .index-triangle {
                    position: relative;
                    top: -11px;
                    right: -127px;
                    color: #29292B;
                }

                .index-item {
                    position: absolute;
                    max-height: 200px;
                    top: 8px;
                    right: -136px;
                    width: 60px;
                    background: #29292B;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    text-align: center;
                    color: #BBBBBB;
                    overflow: hidden;

                    ul {
                        margin-bottom: 0;

                        .tag {
                            list-style: none;
                            height: 30px;
                            line-height: 30px;
                            border-bottom: 1px solid #383839;
                        }

                        .tag:hover {
                            color: #DCDDE4;
                            background: #49484880;
                        }
                    }
                }
            }
        }

        .AtoZ-box {
            width: 100%;

            .A-Z-item {
                list-style: none;
                display: inline-block;

                .index-tag-title {
                    padding: 4px 5px;
                    margin-right: 4px;
                    cursor: pointer;
                    height: 30px;
                    line-height: 30px;
                    color: #999999;
                }

                .index-tag-title:hover {
                    color: #f2f2f2;
                }

                .index-tag-active {
                    color: #f2f2f2 !important;
                }
            }
        }

        .item {
            list-style: none;
            width: 25%;
            display: inline-block;
            padding-right: 15px;
            margin-bottom: 25px;
        }

        @media (min-width: 1180px) {
            .item {
                width: 20%;
            }
        }

        @media (min-width: 1360px) {
            .item {
                width: 16.6%;
            }
        }

        .hot-singer-box {
            padding-top: 20px;
            margin-right: -15px;

            .hot-singer {

                .hot-singer-img-box {
                    margin-bottom: 10px;

                    .hot-singer-img {
                        cursor: pointer;
                        display: block;
                        width: 100%;
                        border-radius: 50%;
                    }
                }

                .hot-singer-name {
                    width: 100%;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    font-size: 17px;
                    color: #999999;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    span:hover {
                        cursor: pointer;
                        color: #f2f2f2;
                    }
                }
            }
        }

        .singer-box {
            margin-right: -15px;

            .singer {

                .singer-name {
                    width: 100%;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    font-size: 17px;
                    color: #999999;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    span:hover {
                        cursor: pointer;
                        color: #f2f2f2;
                    }
                }
            }
        }

        .loading {
            margin-top: 200px;
        }

        .not-singer {
            text-align: center;
            margin: 0 0 20px 0;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.5)
        }
    }
</style>
