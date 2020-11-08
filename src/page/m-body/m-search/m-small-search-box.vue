<template>
    <div>
        <div class="m-small-search-box" ref="smallSearchBox">
            <div class="hot-search-title" ref="hotSearch" v-if="smartSearch === null">
                <!--历史搜索记录-->
                <div class="search-history" v-if="searchHistory.length > 0">
                    <div class="search-history-title">
                        <div class="text">搜索历史</div>
                        <div class="delete-all-icon" title="清空搜索记录" @click="deleteSearch()">
                            <Icon type="md-trash" size="16"/>
                            清空
                        </div>
                    </div>
                    <div class="history-search-box">
                        <div class="history-search-key"
                             v-for="(key,index) in searchHistory" :key="index"
                        >
                            <div class="key-text" @click="quickSearch(key)">{{key}}</div>
                            <div class="delete-icon" title="删除搜索记录" @click="deleteSearchItem(key)">
                                <Icon type="md-trash" size="16"/>
                            </div>
                        </div>
                    </div>
                </div>
                <!--热搜榜-->
                <div class="hot-title-box">
                    <div class="hot-title">热搜</div>
                    <clip-loader style="display: inline-block;" v-if="hotKey === null"
                                 :color="'rgba(255, 255, 255, 0.5)'"
                                 :size="'10px'"></clip-loader>
                </div>
                <ul v-if="hotKey !== null">
                    <li class="hot-key-item" v-for="(item,index) in hotKey" :key="index" @click="quickSearch(item.k)">
                        <div class="num" :style="index < 3?'color:#ff3332':''">{{index + 1}}</div>
                        <div class="title">{{item.k}}</div>
                        <div class="search-num">{{item.n}}</div>
                    </li>
                </ul>
            </div>
            <div class="search-result-box" ref="searchResultBox" v-else>
                <!--搜索结果显示-->
                <!---->
                <div class="search-key" @click="search(searchKey)">
                    <span>搜"<span class="highlight">{{searchKey}}</span>"相关的结果</span>
                    <i class="fa fa-angle-right"></i>
                </div>
                <!--专辑-->
                <div class="small-search-album" v-if="smartSearch.album.count !== 0">
                    <div class="title">专辑</div>
                    <ul>
                        <li class="item" v-for="(album,index) in smartSearch.album.itemlist" :key="index">
                            <div class="name" v-html="handleHighlightText(`${album.name}-${album.singer}`)"></div>
                        </li>
                    </ul>
                </div>
                <!--歌手-->
                <div class="small-search-singer" v-if="smartSearch.singer.count !== 0">
                    <div class="title">歌手</div>
                    <ul>
                        <li class="item" v-for="(singer,index) in smartSearch.singer.itemlist" :key="index"
                            @click="toSingerDetail(singer)">
                            <div class="name" v-html="handleHighlightText(singer.name)"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <m-tips ref="tips" :width="220"/>
    </div>
</template>

<script>
  import { getHotKey } from '../../../api/search'
  import { createHotKeyData } from '../../../common/js/createReqData'
  import { ERR_OK } from '../../../api/config'
  import { Icon } from 'view-design'
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import ClipLoader from 'vue-spinner/src/ClipLoader'
  import MTips from '../../../components/m-tips/m-tips'

  export default {
    name: 'm-small-search-box',
    props: {
      searchKey: {
        type: String
      },
      smartSearch: {
        type: Object
      }
    },
    data () {
      return {
        hotKey: null,
        open: false
      }
    },
    components: {
      MTips,
      Icon,
      ClipLoader
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ])
    },
    created () {
      document.addEventListener('mousedown', e => {
        const x = document.getElementsByClassName('m-small-search-box')[0]
        const y = document.getElementsByClassName('search_box')[0]
        if (x && y) {
          if (!x.contains(event.target) && !y.contains(event.target)) {
            this.closeSmallSearchBox()
          }
        }
      })
      this.readSearchHistory()
    },
    methods: {
      deleteSearch () {
        this.deleteSearchHistory()
      },
      deleteSearchItem (key) {
        this.deleteSearchHistoryByKey(key)
      },
      quickSearch (key) {
        this.$emit('quickSearch', key)
      },
      search (key) {
        this.$emit('search', key)
      },
      openTips (tips) {
        this.$refs.tips.showTips(tips)
      },
      closeTips () {
        this.$refs.tips.closeTips()
      },
      async openSmallSearchBox () {
        this.open = true
        if (this.hotKey === null) {
          let reqData = createHotKeyData()
          let res = await getHotKey(reqData)
          if (res.code !== ERR_OK) {
            // 提示用户
            this.openTips(`≥﹏≤，获取热搜出现了点小问题`)
            // 下一首
            setTimeout(() => {
              this.closeTips()
            }, 2000)
            return
          }
          this.hotKey = res.data.hotkey
          this.$nextTick(() => {
            this.$refs.smallSearchBox.style.width = this.$refs.hotSearch.clientWidth + 8 + 'px'
            this.$refs.smallSearchBox.style.height = this.$refs.hotSearch.clientHeight + 'px'
          })
        }
      },
      closeSmallSearchBox () {
        this.open = false
      },
      // 处理高亮
      handleHighlightText (text) {
        const index = text.indexOf(this.searchKey)
        if (index !== -1) {
          return `${text.substring(0, index)}<span class="highlight">${this.searchKey}</span>${text.substring(
            index + this.searchKey.length)}`
        }
        return text
      },
      toSingerDetail (singer) {
        this.closeSmallSearchBox()
        let router = `/singer/${singer.singer.split('(')[0].trim()}/${singer.mid}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      }),
      ...mapActions([
        'readSearchHistory',
        'deleteSearchHistoryByKey',
        'deleteSearchHistory'
      ])
    },
    watch: {
      smartSearch (newValue) {
        if (newValue === null) {
          // hotSearch
          this.$nextTick(() => {
            this.$refs.smallSearchBox.style.width = this.$refs.hotSearch.clientWidth + 8 + 'px'
            this.$refs.smallSearchBox.style.height = this.$refs.hotSearch.clientHeight + 'px'
          })
        } else {
          this.$nextTick(() => {
            this.$refs.smallSearchBox.style.width = this.$refs.searchResultBox.clientWidth + 'px'
            this.$refs.smallSearchBox.style.height = this.$refs.searchResultBox.clientHeight + 'px'
          })
        }
      },
      open (newValue) {
        if (newValue) {
          if (this.smartSearch === null) {
            this.$nextTick(() => {
              this.$refs.smallSearchBox.style.width = this.$refs.hotSearch.clientWidth + 8 + 'px'
              this.$refs.smallSearchBox.style.height = this.$refs.hotSearch.clientHeight + 'px'
            })
          } else {
            this.$nextTick(() => {
              this.$refs.smallSearchBox.style.width = this.$refs.searchResultBox.clientWidth + 'px'
              this.$refs.smallSearchBox.style.height = this.$refs.searchResultBox.clientHeight + 'px'
            })
          }
        } else {
          this.$nextTick(() => {
            this.$refs.smallSearchBox.style.height = '0px'
          })
        }
      }
    }
  }
</script>

<style lang="less">
    .m-small-search-box {
        position: absolute;
        top: 36px;
        left: 0;
        height: 0;
        width: 408px;
        background: #2d2f33;
        z-index: 15;
        transition-property: width, height;
        transition-duration: 0.5s;
        transform: translateZ(0);
        overflow-y: scroll;
        overflow-x: hidden;

        .highlight {
            color: #2e6bb0;
        }

        .hot-search-title {
            width: 400px;
            max-height: 500px;
            text-align: left;

            .search-history {
                .search-history-title {
                    color: #828385;
                    height: 60px;
                    line-height: 60px;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .delete-all-icon {
                        font-size: 14px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .delete-all-icon:hover {
                        cursor: pointer;
                        color: #FFFFFF;
                    }
                }

                .history-search-box {
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-flow: row;
                    flex-wrap: wrap;
                    padding: 0 10px;

                    .history-search-key {
                        position: relative;
                        font-size: 12px;
                        padding: 5px 16px;
                        background-color: #1a1c20;
                        margin: 5px;
                        border-radius: 5px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: #cccccc;

                        .key-text {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 20px;
                        }

                        .delete-icon {
                            position: absolute;
                            right: 2px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 20px;
                            font-size: 14px;
                            z-index: -10;
                            opacity: 0;
                            transition: opacity 200ms;
                        }

                        .key-text:hover {
                            color: #FFFFFF;
                        }

                        .delete-icon:hover {
                            color: #FFFFFF;
                        }
                    }

                    .history-search-key:hover {
                        cursor: pointer;

                        .delete-icon {
                            z-index: 10;
                            opacity: 1;
                        }
                    }
                }
            }

            .hot-title-box {
                color: #828385;
                height: 60px;
                line-height: 60px;
                padding-left: 20px;

                .hot-title {
                    display: inline-block;
                }

                .loading {
                    width: 100px;
                    text-align: left;
                    display: inline-block;
                }
            }

            .hot-key-item {
                list-style: none;
                height: 60px;
                line-height: 60px;
                padding-left: 20px;

                .num {
                    font-size: 16px;
                    width: 30px;
                    display: inline-block;
                }

                .title {
                    display: inline-block;
                }

                .search-num {
                    display: inline-block;
                    color: #5b5b5b;
                    font-size: 12px;
                }
            }

            .hot-key-item:hover {
                cursor: pointer;
                background: #2a2c30;
            }
        }

        .search-result-box {
            text-align: left;
            width: 300px;
            font-size: 12px;
            overflow: hidden;

            .search-key {
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                color: #828385;
            }

            .search-key:hover {
                cursor: pointer;
                color: #ffffff;
            }

            .title {
                height: 20px;
                line-height: 20px;
                padding-left: 20px;
                background: #303236;
            }

            .item {
                color: #a5a7a8;
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                list-style: none;

                .play-icon {
                    position: relative;
                    top: -10px;
                    font-size: 0;
                }

                .name {
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }

            .item:hover {
                cursor: pointer;
                background: #2a2c30;

                .play-icon {
                    font-size: 12px;
                }
            }
        }

        // 火狐
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;
    }

    .m-small-search-box {
        /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
        -ms-overflow-style: none;
    }

    .m-small-search-box::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }

    /*定义滚动条轨道 内阴影+圆角*/

    .m-small-search-box::-webkit-scrollbar-track-piece {
        -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em;
    }

    /*定义滑块 内阴影+圆角*/

    .m-small-search-box::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background-color: #414346;
    }

    /*---鼠标点击滚动条显示样式--*/

    .m-small-search-box::-webkit-scrollbar-thumb:hover {
        background-color: #4c4d51;
    }

    .m-small-search-box::-webkit-scrollbar-thumb:active {
        background-color: #4c4d51;
    }
</style>
