<template>
    <div ref="tags" class="m-tags">
        <div class="m-tags-box">
            <ul class="tags-ul">
                <li class="tags-item">
                    <div class="tag-title">在线音乐</div>
                    <ul class="tag-ul">
                        <li>
                            <div class="tag-item" @click.stop="pushRouter('/findMusic/recommend')"
                                 :class="this.$route.path.indexOf('/findMusic')!== -1?'tag-item-active':''">
                                <Icon class="tag-icon" type="md-musical-notes" size="18"/>
                                发现音乐
                            </div>
                        </li>
                        <li>
                            <div class="tag-item" @click.stop="pushRouter('/video')"
                                 :class="this.$route.path.indexOf('/video')!== -1?'tag-item-active':''">
                                <Icon class="tag-icon" type="md-videocam" size="18"/>
                                视频
                            </div>
                        </li>
                    </ul>
                </li>
                <li class="tags-item">
                    <div class="tag-title">我的音乐</div>
                    <ul class="tag-ul">
                        <li v-if="loginUser">
                            <div @click.stop="pushRouter('/like')" class="tag-item"
                                 :class="this.$route.path === '/like'?'tag-item-active':''"
                            >
                                <Icon class="tag-icon" type="md-heart" size="18"/>
                                我喜欢
                                <div class="dot" ref="dot"></div>
                                <div class="playing-icon" v-if="_listHasSong(favoriteSongList)">
                                    <img src="../../resources/images/wave.gif" alt="">
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="tag-item">
                                <Icon class="tag-icon" type="ios-musical-notes" size="18"/>
                                本地音乐
                            </div>
                        </li>
                        <li>
                            <div class="tag-item">
                                <Icon class="tag-icon" type="md-cloud-download" size="18"/>
                                下载管理
                            </div>
                        </li>
                    </ul>
                </li>
                <!--                <li class="tags-item" v-if="loginUser && userFavoriteDissts && favoriteSongList">-->
                <!--                    <div class="tag-title">创建的歌单-->
                <!--                        <Icon v-if="createDisstShow" class="tool-btn" type="ios-arrow-up" size="18" title="收起"-->
                <!--                              @click="createDisstShow = false"/>-->
                <!--                        <Icon v-else class="tool-btn" type="ios-arrow-down" size="18" title="展开"-->
                <!--                              @click="createDisstShow = true"/>-->
                <!--                    </div>-->
                <!--                    <ul v-if="createDisstShow">-->
                <!--                        <li v-for="(myDisst) in loginUser.mydiss.list" :key="myDisst.dissid" :title="myDisst.title">-->
                <!--                            <router-link tag="div" class="tag-item"-->
                <!--                                         :to="{name: 'userCreateDisst', params: { disstId: myDisst.dissid }}"-->
                <!--                            >-->
                <!--                                <Icon class="tag-icon" type="md-musical-note" size="18"/>-->
                <!--                                <span v-html="myDisst.title"></span>-->
                <!--                                <div class="playing-icon" v-if="showPlayingIcon(myDisst.dissid)">-->
                <!--                                    <img src="../../resources/images/wave.gif" alt="">-->
                <!--                                </div>-->
                <!--                            </router-link>-->
                <!--                        </li>-->
                <!--                    </ul>-->
                <!--                </li>-->
                <li class="tags-item" v-if="loginUser">
                    <div class="tag-title">收藏的歌单
                        <Icon v-if="favoriteDisstShow" class="tool-btn" type="ios-arrow-up" size="18" title="收起"
                              @click="favoriteDisstShow=false"/>
                        <Icon v-else class="tool-btn" type="ios-arrow-down" size="18" title="展开"
                              @click="favoriteDisstShow=true"/>
                    </div>
                    <ul class="tag-ul" v-show="favoriteDisstShow">
                        <li v-for="(favoriteDisst) in userFavoriteDissts" :key="favoriteDisst.disstId"
                            :title="favoriteDisst.disstName">
                            <div class="tag-item" @click.stop="songListDetail(favoriteDisst)"
                                 :class="$route.path === `/user/${favoriteDisst.disstId}`?'tag-item-active':''"
                            >
                                <Icon class="tag-icon" type="md-musical-note" size="18"/>
                                <span class="disst-name" v-html="favoriteDisst.disstName"></span>
                                <!--                                <div class="playing-icon" v-if="showPlayingIcon(favoriteDisst.dissid)">-->
                                <!--                                    <img src="../../resources/images/wave.gif" alt="">-->
                                <!--                                </div>-->
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { mapGetters, mapMutations } from 'vuex'
  import { listHasSong } from '../../common/js/util'

  export default {
    name: 'm-tags',
    components: {
      Icon
    },
    data () {
      return {
        createDisstShow: true,
        favoriteDisstShow: true,
        screenHeight: document.body.clientHeight
      }
    },
    computed: {
      ...mapGetters([
        'loginUser',
        'sequenceList',
        'currentPlaySong',
        'userFavoriteDissts',
        'favoriteSongList'
      ])
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.screenHeight = window.innerHeight
      })
      this.$refs.tags.style.height = `${window.innerHeight - 102.1}px`
    },
    methods: {
      pushRouter (router) {
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      songListDetail (songList) {
        let router = `/user/${songList.disstId}`
        if (this.$route.path !== router) {
          this.routerStack.push(router)
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace({
            path: router
          })
        }
      },
      _listHasSong (list) {
        return listHasSong(list, this.currentPlaySong)
      },
      ...mapMutations({
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    },
    watch: {
      sequenceList (newSequenceList) {
        if (newSequenceList.length > 0) {
          this.$refs.tags.style.paddingBottom = '60px'
        } else {
          this.$refs.tags.style.paddingBottom = '0'
        }
      },
      favoriteSongList (newValue, oldValue) {
        if (newValue === null || oldValue === null) {
          return
        }
        if (newValue.length > oldValue.length) {
          this.$refs.dot.style.opacity = 1
        }
      },
      '$route.path' (newValue, oldValue) {
        if (newValue === '/like' && newValue !== oldValue) {
          this.$refs.dot.style.opacity = 0
        }
      },
      screenHeight () {
        this.$refs.tags.style.height = `${window.innerHeight - 102.1}px`
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .m-tags {
        width: 200px;
        max-width: 200px;
        min-width: 200px;
        user-select: none;
        background: @tags-background-color;

        .m-tags-box {
            overflow-x: hidden;
            overflow-y: scroll;
            border-right: 0.1px solid @tags-border-color;

            .tags-ul {
                height: 30px;
                line-height: 30px;
                padding: 0 2px 0 10px;

                .tags-item {
                    margin-bottom: 10px;

                    .tag-title {
                        position: relative;
                        padding-left: 20px;
                        font-size: 12px;
                        color: @tags-title-text-color;

                        .tool-btn {
                            height: 30px;
                            line-height: 30px;
                            width: 30px;
                            margin-left: 20px;
                        }

                        .tool-btn:hover {
                            cursor: pointer;
                            color: @tags-text-hover-color;
                        }
                    }

                    .tag-ul {
                        width: 100%;
                        height: 100%;

                        .tag-item {
                            color: @tags-text-color;
                            padding-left: 20px;
                            position: relative;
                            padding-right: 30px;
                            width: 100%;
                            border-radius: 5px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin: 10px 0;

                            .tag-icon {
                                font-weight: bold;
                                margin-right: 3px;
                            }

                            .dot {
                                display: inline-block;
                                width: 6px;
                                height: 6px;
                                border-radius: 50%;
                                background: @favorite-color;
                                position: absolute;
                                top: 12px;
                                margin-left: 5px;
                                opacity: 0;
                                transition: all 0.2s ease-in-out;
                            }

                            .playing-icon {
                                position: absolute;
                                display: inline-block;
                                right: 0;
                                margin-right: 20px;
                            }
                        }

                        .tag-item-active {
                            background: @player-bar-color !important;
                            color: @tags-text-hover-color !important;
                        }

                        .tag-item:hover {
                            cursor: pointer;
                            background: #2e2e2f;
                        }
                    }
                }
            }
        }

        .m-tags-box {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        .m-tags-box {
            height: 100%;
        }

        .m-tags-box::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-tags-box::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-tags-box::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: @scrollbar-thumb-background-color;
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-tags-box::-webkit-scrollbar-thumb:hover {
            background-color: @scrollbar-thumb-hover-color;
        }

        .m-tags-box::-webkit-scrollbar-thumb:active {
            background-color: @scrollbar-thumb-active-color;
        }
    }
</style>
