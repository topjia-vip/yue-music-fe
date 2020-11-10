<template>
    <Content ref="userDisstBox" class="m-user-create-disst-box">
        <m-slider ref="wrapper" v-if="isShow">
            <div class="m-user-create-disst-box-content" ref="scroll" @scroll="scroll">
                <div class="m-disst-detail">
                    <div class="disst-detail-header">
                        <div class="img-box">
                            <img class="disst-detail-img" ondragstart="return false" v-lazy="disst.disstLogo"
                                 :alt="disst.disstId" :key="disst.disstLogo">
                        </div>
                        <div class="disst-detail-info-box">
                            <div class="disst-title">
                                <h2 v-html="disst.disstName"></h2>
                            </div>
                            <div class="create-user-box">
                                <div class="user-img-box">
                                    <img class="user-img" ondragstart="return false"
                                         v-lazy="handleLazyImage(disst.headUrl)"
                                         :key="disst.headUrl"
                                         :alt="disst.nickname">
                                </div>
                                <div class="user-name">
                                    <span v-html="disst.nickname"></span>
                                </div>
                                <div class="disst-tag" v-if="disst.tags.length === 0">
                                    <span class="add-tag">添加标签</span>
                                </div>
                                <div class="disst-tag" v-else>
                                    <span v-for="(tag) in disst.tags" :key="tag.id" v-html="`#${tag.name}`"></span>
                                </div>
                            </div>
                            <div class="disst-desc-box" v-if="disst.desc === ''">
                                <div class="disst-desc">
                                    <div class="desc">精心完善歌单信息有机会获得推荐，让更多用户看到你的大作</div>
                                </div>
                            </div>
                            <div class="disst-desc-box" v-else>
                                <div ref="descBox" class="disst-desc">
                                    <div class="desc">
                                        <span ref="descText" class="desc-text" v-html="handleDesc(disst.desc)"></span>
                                    </div>
                                    <div class="open-desc-btn" @click="showDesc = true" v-if="showDetailBtn">[详情]</div>
                                </div>
                                <div class="desc-box" v-if="showDesc">
                                    <div class="desc" v-html="handleDesc(disst.desc)"></div>
                                </div>
                            </div>
                            <m-tools-btn @playAll="playDisstSong" :is-like-disst="_listHasDisst"
                                         @save="saveDisst(disst)"
                                         @unSave="unSave(disst.disstId)"/>
                        </div>
                    </div>
                    <div class="disst-song-count">
                        <span v-html="`歌曲${disst.songNum}`"></span>
                    </div>
                    <user-song-list class="song-list"
                                    :songlist="disst.songlist"
                                    :selectSong="selectSong"
                                    :showLocation="showLocation"
                                    :currentPlaySong="currentPlaySong"
                                    :playStatus="playStatus"
                                    :playList="playList"
                                    @selectItem="selectItem"
                                    @playSong="playSong"
                                    @openMenu="openMenu"
                    />
                </div>
                <m-right-click-menu :left="left" :top="top" v-if="isShowMenu" @operation="operation"/>
                <m-location-play-song v-if="_listHasSong" @location="location"/>
                <m-tips class="tips" ref="tips" :width="180"/>
            </div>
        </m-slider>
        <m-disstdetail-skeleton v-if="!isShow"/>
        <scroll-top v-if="showToTop" @toTop="toTop"/>
    </Content>
</template>

<script>
  import { Content, Icon } from 'view-design'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { createDisstDetailData } from '../../../../common/js/createReqData'
  import { deleteDisst, disstDetail, saveDisst } from '../../../../api/disst'
  import { _normalizeSongs, listHasSong } from '../../../../common/js/util'
  import { operationType, timeOut } from '../../../../common/js/config'
  import UserSongList from '../user-song-list/user-song-list'
  import Loading from '../../../../components/loading/loading'
  import ScrollTop from '../../../../components/scrollTop/scroll-top'
  import MLocationPlaySong from '../../../../components/m-location-play-song/m-location-play-song'
  import MRightClickMenu from '../../../../components/m-right-click-menu/m-right-click-menu'
  import MToolsBtn from '../../../../components/m-tools-btn/m-tools-btn'
  import { ERR_OK } from '../../../../api/config'
  import MTips from '../../../../components/m-tips/m-tips'
  import MSlider from '../../../../components/m-slider/m-slider'
  import UserDefLazyImg from '../../../../resources/images/person_300.png'
  import MDisstdetailSkeleton from '../../../../components/m-skeleton/m-disstdetail-skeleton'

  export default {
    name: 'm-user-create-disst',
    components: {
      MDisstdetailSkeleton,
      MSlider,
      MTips,
      MToolsBtn,
      MRightClickMenu,
      MLocationPlaySong,
      ScrollTop,
      Loading,
      UserSongList,
      Content,
      Icon
    },
    data () {
      return {
        isShow: false,
        showToTop: false,
        showLocation: false,
        top: 0,
        left: 0,
        isShowMenu: false,
        showDesc: false,
        playingSong: {},
        disst: {},
        selectSong: {},
        disstId: '',
        showDetailBtn: true,
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight
      }
    },
    created () {
      this.disstId = this.$route.params.disstId
      this._initDisstDetail(this.$route.params.disstId)
    },
    computed: {
      ...mapGetters([
        'currentPlaySong',
        'playList',
        'playStatus',
        'loginUser',
        'userFavoriteDissts'
      ]),
      _listHasDisst () {
        if (this.loginUser === null || this.userFavoriteDissts === null) {
          return false
        }
        let index = this.userFavoriteDissts.findIndex(item => item.disstId === this.disst.disstId)
        return index > -1
      },
      _listHasSong () {
        return listHasSong(this.disst.songlist, this.currentPlaySong)
      },
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: UserDefLazyImg,
            loading: UserDefLazyImg
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.addEventListener('click', e => {
          const v = document.getElementsByClassName('m-menu-box')[0]
          if (v) {
            if (!v.contains(event.target)) {
              this.isShowMenu = false
            }
          }
          const b = document.getElementsByClassName('desc-box')[0]
          const c = document.getElementsByClassName('open-desc-btn')[0]
          if (b && c) {
            if (!b.contains(event.target) && !c.contains(event.target)) {
              this.showDesc = false
            }
          }
        })
        window.addEventListener('resize', () => {
          window.screenWidth = document.body.clientWidth
          this.screenWidth = window.screenWidth
          this.screenHeight = window.innerHeight
        })
        this.$refs.userDisstBox.$el.style.height = `${window.innerHeight - 102.1}px`
      })
    },
    updated () {
      if (this.$refs.descBox) {
        this.showDetailBtn = this.$refs.descBox.clientWidth - 40 <= this.$refs.descText.offsetWidth
      }
    },
    methods: {
      _initDisstDetail (disstId) {
        this.isShow = false
        let reqData = createDisstDetailData(disstId)
        disstDetail(reqData).then(res => {
          this.disst = res.disst
          this.disst.songlist = _normalizeSongs(res.disst.songlist)
          this.isShow = true
        })
      },
      // 收藏歌单
      saveDisst (disst) {
        if (this.loginUser === null) {
          // 收藏动作需要登录，未登录弹出登录框，返回
          this.setNeedLogin(true)
          return
        }
        // 封装数据
        let data = {
          disstId: disst.disstId,
          desc: disst.desc,
          disstLogo: disst.disstLogo,
          disstName: disst.disstName,
          headUrl: disst.headUrl,
          nickname: disst.nickname,
          songNum: disst.songNum,
          visitnum: disst.visitnum
        }
        saveDisst(data).then(res => {
          if (res.code === 0) {
            // 请求失败
            this.$refs.tips.showTips('歌单收藏成功')
            setTimeout(() => {
              this.$refs.tips.closeTips()
            }, 2000)
            this.setLoginUserFavoriteDissts(res.data.data)
          } else {
            // 请求失败
            this.$refs.tips.showTips(res.data.message)
            setTimeout(() => {
              this.$refs.tips.closeTips()
            }, 2000)
          }
        }).catch(() => {
          // token校验失败，用户登录失效，清除当前用户信息，重定向到首页
          this.$refs.tips.showTips('用户登录过期')
          setTimeout(() => {
            this.$refs.tips.closeTips()
            this.logout()
          }, 1000)
        })
      },
      scroll () {
        if (this.$refs.scroll.scrollTop > 100) {
          this.showToTop = true
        } else {
          this.showToTop = false
        }
      },
      // 取消收藏
      unSave (disstId) {
        deleteDisst(disstId).then(res => {
          if (res.code === ERR_OK) {
            // 请求失败
            this.$refs.tips.showTips('歌单取消收藏成功')
            setTimeout(() => {
              this.$refs.tips.closeTips()
            }, 2000)
            this.setLoginUserFavoriteDissts(res.data.data)
          } else {
            // 请求失败
            this.$refs.tips.showTips(res.data.message)
            setTimeout(() => {
              this.$refs.tips.closeTips()
            }, 2000)
          }
        }).catch(() => {
          // token校验失败，用户登录失效，清除当前用户信息，重定向到首页
          this.$refs.tips.showTips('用户登录过期')
          setTimeout(() => {
            this.$refs.tips.closeTips()
            this.logout()
          }, 1000)
        })
      },
      logout () {
        this.setLoginUser(null)
        this.setToken(null)
        this.$router.replace('/findMusic')
        this.routerStack.init()
        this.routerStack.push('/findMusic/recommend')
        this.setRouterStackPointer(this.routerStack.pointer)
      },
      // 定位
      location () {
        let index = this.disst.songlist.findIndex((item) => item.id + '' === this.currentPlaySong.id + '')
        let location = 60 * (index + 1)
        this.$refs.wrapper.scrollTo(this.$refs.scroll, location, timeOut)
      },
      // 处理简介的<br>
      handleDesc (text) {
        text = text.replace(/<br>/g, '')
        return text.replace(/&lt;br&gt;/g, '')
      },
      toTop () {
        this.$refs.wrapper.scrollToTop(this.$refs.scroll, timeOut)
      },
      // 菜单操作选项
      operation (type) {
        this.isShowMenu = false
        if (type === operationType.play) {
          this.playSong(this.selectSong)
        } else if (type === operationType.addToNext) {
          this.addNext(this.selectSong)
        }
      },
      // 右键打开菜单栏
      openMenu (e, index) {
        this.selectItem(index)
        let dom = document.getElementsByClassName('m-user-create-disst-box-content')[0]
        let disst = document.getElementsByClassName('m-disst-detail')[0]
        let scrollY = this.$refs.scroll.scrollTop
        // 左边过界判断
        if (window.innerWidth - e.pageX < 200) {
          this.left = e.pageX - ((dom.clientWidth - disst.clientWidth) / 2 + 170) - 200
        } else {
          this.left = e.pageX - ((dom.clientWidth - disst.clientWidth) / 2 + 170)
        }
        let toBottomHeight = e.pageY - 51
        // 屏幕下面过界判断
        if (window.innerHeight - e.pageY - 50 < 300) {
          this.top = (toBottomHeight + scrollY) - 300
        } else {
          this.top = (toBottomHeight + scrollY)
        }
        this.isShowMenu = true
      },
      selectItem (index) {
        this.selectSong = this.disst.songlist[index]
      },
      // 播放当前歌曲
      playSong (song) {
        this.insertSong(song)
      },
      // 添加到下一首播放
      addNext (song) {
        this.addToNext(song)
      },
      // 播放整个列表
      playDisstSong () {
        this.selectPlay(
          {
            list: this.disst.songlist,
            index: 0
          }
        )
      },
      ...mapActions([
        'selectPlay',
        'insertSong',
        'addToNext'
      ]),
      ...mapMutations({
        setNeedLogin: 'SET_NEED_LOGIN',
        setLoginUserFavoriteDissts: 'SET_LOGIN_USER_FAVORITE_DISSTS',
        setLoginUser: 'SET_LOGIN_USER',
        setToken: 'SET_USER_TOKEN',
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    },
    watch: {
      '$route.params.disstId' (newId) {
        this._initDisstDetail(newId)
      },
      curPlaySongListId (newValue) {
        if (this.disstId + '' === newValue) {
          this.showLocation = true
        } else {
          this.showLocation = false
        }
      },
      screenWidth () {
        this.showDetailBtn = this.$refs.descBox.clientWidth - 40 <= this.$refs.descText.offsetWidth
      },
      screenHeight () {
        this.$refs.userDisstBox.$el.style.height = `${window.innerHeight - 102.1}px`
      }
    }
  }
</script>

<style lang="less">
    .m-user-create-disst-box {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        width: 100%;
        overflow: hidden;

        .m-user-create-disst-box-content {
            position: relative;
            height: 100%;
            width: 100%;
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 0 30px 20px 30px;

            .m-disst-detail {
                padding-top: 20px;
                position: relative;

                .disst-detail-header {
                    height: 200px;
                    padding-left: 200px;

                    .img-box {
                        position: absolute;
                        left: 0;
                        width: 200px;
                        height: 200px;
                        float: left;

                        .disst-detail-img {
                            width: 100%;
                            height: 100%;
                            display: block;
                            border-radius: 10px;
                        }
                    }

                    .disst-detail-info-box {
                        padding-left: 30px;
                        width: 100%;
                        height: 200px;
                        float: left;

                        .disst-title {
                            color: var(--font-base-color);
                            font-size: 20px;

                            h2 {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                        }

                        .create-user-box {
                            height: 30px;
                            margin-top: 20px;
                            font-size: 12px;

                            .user-img-box {
                                height: 30px;
                                width: 30px;
                                line-height: 30px;
                                float: left;

                                .user-img {
                                    width: 100%;
                                    height: 100%;
                                    display: block;
                                    border-radius: 50%;
                                }
                            }

                            .user-name {
                                height: 30px;
                                line-height: 30px;
                                max-width: 50%;
                                float: left;
                                margin-left: 5px;
                                color: var(--font-base-color);

                                span {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }

                            .disst-tag {
                                float: left;
                                line-height: 30px;
                                color: var(--font-tow-color);

                                span {
                                    margin-left: 10px;
                                }

                                .add-tag:hover {
                                    cursor: pointer;
                                    color: #f2f2f2;
                                }
                            }
                        }

                        .disst-desc-box {
                            position: relative;
                            height: 40px;
                            margin-top: 20px;
                            user-select: text;

                            .disst-desc {
                                position: relative;
                                width: 100%;
                                color: var(--font-tow-color);
                                font-size: 12px;
                                padding: 0 40px 0 0;

                                .desc {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }

                                .open-desc-btn {
                                    width: 40px;
                                    color: #ADAFB2;
                                    position: absolute;
                                    display: inline-block;
                                    right: 0;
                                    top: 0
                                }

                                .open-desc-btn:hover {
                                    cursor: pointer;
                                    color: var(--font-active-color);
                                }

                                .desc {
                                    padding-right: 10px;
                                }
                            }

                            .desc-box {
                                position: absolute;
                                color: var(--font-tow-color);
                                background: #29292B;
                                padding: 10px 10px;
                                left: -10px;
                                top: -10px;
                                font-size: 12px;
                                border-radius: 7px;
                                z-index: 1;

                                .desc {
                                    padding-right: 10px;
                                }
                            }
                        }
                    }
                }
            }

            .disst-song-count {
                margin-top: 30px;
                height: 30px;
                line-height: 30px;
                color: var(--font-base-color);
                display: inline-block;
                border-bottom: 2px solid var(--font-base-color);
            }

            .song-list {
                margin-top: 30px;
            }
        }

        .loading {
            margin-top: 200px;
        }

        .m-user-create-disst-box-content {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        // 火狐
        scrollbar-color: transparent transparent;
        scrollbar-track-color: transparent;
        -ms-scrollbar-track-color: transparent;

        .m-user-create-disst-box-content::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        .m-user-create-disst-box-content::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        .m-user-create-disst-box-content::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: var(--scrollbar-thumb-background-color);
        }

        /*---鼠标点击滚动条显示样式--*/

        .m-user-create-disst-box-content::-webkit-scrollbar-thumb:hover {
            background-color: var(--scrollbar-thumb-hover-color);
        }

        .m-user-create-disst-box-content::-webkit-scrollbar-thumb:active {
            background-color: var(--scrollbar-thumb-active-color);
        }
    }
</style>
