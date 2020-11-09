<template>
    <Content class="m-user-edit-box" v-if="loginUser !== null">
        <div class="m-user-edit-content">
            <div class="title-box">
                <p class="title">编辑个人信息</p>
            </div>
            <div class="edit-box">
                <div class="info-edit">
                    <div class="nick-edit-box">
                        <span class="edit-title">昵称:</span>
                        <div class="input-box">
                            <input class="input" type="text" v-model="nick" @input="inputNick($event)"/>
                        </div>
                        <div class="error-tip" ref="errorTip">{{errorTip}}</div>
                    </div>
                    <div class="desc-edit-box">
                        <span class="edit-title">介绍:</span>
                        <div class="input-box">
                            <textarea v-model="desc" class="input" type="text" @input="inputDesc" placeholder="暂无简介"/>
                            <span class="tips-num">{{descInputNum}}/300</span>
                        </div>
                    </div>
                    <!--单选框（男女）-->
                    <div class="sex-edit-box">
                        <span class="edit-title">性别:</span>
                        <div class="radio-box">
                            <div class="radio-item">
                                <input id="0" type="radio" name="sex" value="0" v-model="sex" @change="getRadioVal"/>
                                <label for="0">保密</label>
                            </div>
                            <div class="radio-item">
                                <input id="1" type="radio" name="sex" value="1" v-model="sex" @change="getRadioVal"/>
                                <label for="1">男</label>
                            </div>
                            <div class="radio-item">
                                <input id="2" type="radio" name="sex" value="2" v-model="sex" @change="getRadioVal"/>
                                <label for="2">女</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="submit-btn-box">
                <div class="btn submit" v-if="canSubmit" @click="modifyUserInfo">保存</div>
                <div class="btn disabled-submit" v-else>保存</div>
                <div class="btn back" @click="back">取消</div>
            </div>
            <div class="user-header-img-box">
                <img class="img" ondragstart="return false"
                     v-lazy="handleLazyImage(loginUser.userHeaderURL === ''?'https://y.gtimg.cn/mediastyle/global/img/person_300.png?max_age=2592000':loginUser.userHeaderURL)"
                     :alt="loginUser.userNick"
                     :key="loginUser.userHeaderURL === ''?'https://y.gtimg.cn/mediastyle/global/img/person_300.png?max_age=2592000':loginUser.userHeaderURL"
                >
                <label for="uploads">
                    <div class="modify-user-header-img-btn">
                        修改头像
                    </div>
                </label>
                <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);"
                       accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
            </div>
            <!--头像裁剪+上传-->
            <upload-image ref="upload" :option="option" :fileName="fileName" :tips="tips"
                          @closeUploadPage="closeUploadPage"
                          @upload="upload"/>
            <!--修改提示-->
            <!--            <div class="tips" ref="updateTips" v-html="updateTips">-->
            <!--            </div>-->
            <m-poptip class="tips" ref="updateTips" :content="updateTips"></m-poptip>
            <!--未保存提示框-->
            <not-update v-if="openNotUpdate" @closeNotUpdatePage="closeNotUpdatePage" @save="save" @backNow="backNow"/>
        </div>
    </Content>
</template>

<script>
  import { Content } from 'view-design'
  import { mapGetters, mapMutations } from 'vuex'
  import UploadImage from '../../../../components/upload-image/upload-image'
  import { checkNickName, updateUser, upload } from '../../../../api/user'
  import { ERR_OK } from '../../../../api/config'
  import NotUpdate from '../../../../components/not-update/not-update'
  import MPoptip from '../../../../components/m-poptip/m-poptip'
  import UserDefLazyImg from '../../../../resources/images/person_300.png'

  const NICK = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]')
  export default {
    name: 'm-user-edit',
    components: {
      MPoptip,
      NotUpdate,
      UploadImage,
      Content
    },
    computed: {
      ...mapGetters([
        'loginUser'
      ]),
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
    data () {
      return {
        descInputNum: 0,
        nick: '',
        desc: '',
        sex: 0, // 0保密，1男生，2女生
        option: {
          img: '',
          outputSize: 1, // 剪切后的图片质量（0.1-1）
          full: false, // 输出原图比例截图 props名full
          outputType: 'png',
          canMove: false,
          original: false,
          canMoveBox: true,
          canScale: false,
          autoCrop: true,
          autoCropWidth: 260,
          autoCropHeight: 260,
          infoTrue: true,
          centerBox: true,
          fixed: true,
          fixedNumber: [1, 1]
        },
        imgFile: '',
        fileName: '',
        openUpload: false,
        openNotUpdate: false,
        tips: '',
        errorTip: '',
        updateTips: '',
        canSubmit: false // 是否可以保存信息
      }
    },
    // 路由进入时初始化数据
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.descInputNum = vm.desc.length
        vm.nick = vm.loginUser.userNick
        vm.desc = vm.loginUser.userDesc
        vm.sex = vm.loginUser.userSex
        vm.errorTip = ''
        vm.canSubmit = false
      }, true)
    },
    // 如果可以提交，而返回其他页面时提示
    beforeRouteLeave (to, from, next) {
      // 能否提交修改
      if (this.canSubmit) {
        // 可以提交 弹出提示框
        this.openNotUpdate = true
      } else {
        // 不可提交,直接放行
        next()
      }
    },
    created () {
      this.descInputNum = this.desc.length
      this.nick = this.loginUser.userNick
      this.desc = this.loginUser.userDesc
      this.sex = this.loginUser.userSex
    },
    methods: {
      closeUploadPage () {
        this.openUpload = false
        setTimeout(() => {
          this.imgFile = ''
          this.option.img = ''
          this.fileName = ''
        }, 200)
      },
      closeNotUpdatePage () {
        this.openNotUpdate = false
      },
      inputNick (e) {
        this.nick = e.target.value
        clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
          let data = await checkNickName(this.nick).catch(() => {
            // token校验失败，用户登录失效，清除当前用户信息，重定向到首页
            this.updateTips = '用户登录过期'
            this.$refs.updateTips.openTip()
            setTimeout(() => {
              this.$refs.updateTips.closeTip()
              this.canSubmit = false
              this.logout()
            }, 1000)
          })
          let length = this.getByteLength(this.nick)
          if (this.nick === '') {
            this.errorTip = '请输入昵称'
            this.$refs.errorTip.style.opacity = 1
            this.canSubmit = false
          } else if ((length < 4 && length <= 30) || NICK.test(this.nick)) {
            this.errorTip = '昵称长度在4~30个字,且不能包含特殊字符'
            this.$refs.errorTip.style.opacity = 1
            this.canSubmit = false
          } else if (data.data.data !== null) {
            // 检查昵称是否重复
            this.errorTip = '昵称已被占用!'
            this.$refs.errorTip.style.opacity = 1
            this.canSubmit = false
          } else {
            this.errorTip = ''
            this.$refs.errorTip.style.opacity = 0
            this.canSave()
          }
        }, 100)
      },
      inputDesc () {
        if (this.desc.length > 300) {
          this.desc = this.desc.substr(0, 300)
          return
        }
        this.descInputNum = this.desc.length
        this.canSave()
      },
      getRadioVal () {
        this.canSave()
      },
      // 获得输入框中字符长度
      getByteLength (val) {
        let bytesCount = 0
        for (let i = 0, n = val.length; i < n; i++) {
          let c = val.charCodeAt(i)
          if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
            bytesCount += 1
          } else {
            bytesCount += 2
          }
        }
        return bytesCount
      },
      canSave () {
        if (this.nick === this.loginUser.userNick &&
          this.desc === this.loginUser.userDesc &&
          this.sex === this.loginUser.userSex + '') {
          this.canSubmit = false
        } else {
          this.canSubmit = true
        }
      },
      save () {
        this.modifyUserInfo()
        this.canSubmit = false
        this.openNotUpdate = false
        this.routerStack.next()
      },
      backNow () {
        this.canSubmit = false
        this.openNotUpdate = false
        this.routerStack.next()
        if (this.routerStack.canBack()) {
          let router = this.routerStack.back()
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace(router)
        }
      },
      back () {
        if (this.routerStack.canBack()) {
          let router = this.routerStack.back()
          this.setRouterStackPointer(this.routerStack.pointer)
          this.$router.replace(router)
        }
      },
      // 修改信息
      modifyUserInfo () {
        let data = {
          id: this.loginUser.id,
          userNick: this.nick,
          userDesc: this.desc,
          userSex: this.sex
        }
        this.updateTips = `修改中<span class="dot">...</span>`
        this.$refs.updateTips.openTip()
        updateUser(data).then(res => {
          if (res.code === ERR_OK) {
            // token校验成功
            let data = res.data
            if (data.status === 0) {
              // 信息修改成功
              // 1、修改提示信息
              this.updateTips = '保存成功'
              // 2、设置登录用户信息
              this.setLoginUser(data.data.user)
              this.setToken(data.data.token)
              this.canSubmit = false
              setTimeout(() => {
                this.$refs.updateTips.closeTip()
              }, 2000)
            }
          }
        }).catch(() => {
          // token校验失败，用户登录失效，清除当前用户信息，重定向到首页
          this.updateTips = '用户登录过期'
          setTimeout(() => {
            this.$refs.updateTips.closeTip()
            this.canSubmit = false
            this.logout()
          }, 1000)
        })
      },
      // 上传图片
      upload (formData) {
        this.tips = `上传中<span class="dot">...</span>`
        this.$refs.upload.$refs.tips.openTip()
        upload(formData).then(res => {
          if (res.code === ERR_OK) {
            // token校验成功
            let data = res.data
            if (data.status === 0) {
              // 图片上传成功
              // 1、修改提示信息
              this.tips = '上传成功'
              // 2、设置登录用户信息
              this.setLoginUser(data.data.user)
              this.setToken(data.data.token)
              setTimeout(() => {
                this.$refs.upload.$refs.tips.closeTip()
                setTimeout(() => {
                  // 关闭裁剪框
                  this.closeUploadPage()
                  this.$refs.upload.canUpload = true
                }, 100)
              }, 1000)
            }
          } else {
            this.tips = '网络错误'
            setTimeout(() => {
              this.$refs.upload.$refs.tips.closeTip()
              this.$refs.upload.canUpload = true
            }, 1000)
          }
        }).catch(() => {
          // token校验失败，用户登录失效，清除当前用户信息，重定向到首页
          this.tips = '用户登录过期'
          setTimeout(() => {
            this.$refs.upload.$refs.tips.style.opacity = 0
            this.$refs.upload.$refs.tips.style.zIndex = -1
            this.canSubmit = false
            this.logout()
          }, 1000)
        })
      },
      logout () {
        this.setLoginUser(null)
        this.setToken(null)
        this.openLogOut = false
        this.$router.replace('/findMusic')
        this.routerStack.init()
        this.routerStack.push('/findMusic/recommend')
        this.setRouterStackPointer(this.routerStack.pointer)
      },
      // 选择本地图片
      uploadImg (e, num) {
        let _this = this
        let file = e.target.files[0]
        if (file === undefined) {
          return
        }
        _this.fileName = file.name
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
          alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
          return false
        }
        let reader = new FileReader()
        reader.onload = (e) => {
          let data
          if (typeof e.target.result === 'object') {
            data = window.URL.createObjectURL(new Blob([e.target.result]))
          } else {
            data = e.target.result
          }
          if (num === 1) {
            this.option.img = data
          } else if (num === 2) {
            this.example2.img = data
          }
        }
        reader.readAsArrayBuffer(file)
        this.openUpload = true
      },
      ...mapMutations({
        setLoginUser: 'SET_LOGIN_USER',
        setToken: 'SET_USER_TOKEN',
        setRouterStackPointer: 'SET_ROUTER_STACK_POINTER'
      })
    },
    watch: {
      openUpload (newValue) {
        if (newValue) {
          this.$refs.upload.openUploadBox()
        } else {
          this.$refs.upload.closeUploadBox()
        }
      }
    }
  }
</script>

<style lang="less">
    @import "../../../../common/css/theme/theme";

    /*TODO 重构样式 */
    .m-user-edit-box {
        position: relative;
        z-index: 0;
        user-select: none;
        min-width: 820px;
        width: 100%;
        overflow: hidden;

        .m-user-edit-content {
            position: relative;
            height: 100%;
            width: 100%;
            padding: 0 30px 20px 30px;

            .title-box {
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #5e5e5e;

                .title {
                    font-size: 20px;
                    color: #f2f2f2;
                }
            }

            .edit-box {
                margin-top: 40px;

                .nick-edit-box {
                    height: 60px;
                    line-height: 30px;

                    .edit-title {
                        color: #5f5f63;
                    }

                    .input-box {
                        padding: 0 10px;
                        margin-left: 10px;
                        display: inline-block;
                        background: #25272b;

                        .input {
                            height: 30px;
                            line-height: 30px;
                            width: 400px;
                            background: #25272b;
                            color: #828385;
                            border: none;
                            outline: none;
                            user-select: none;
                            font-size: 12px;
                        }

                        .input:focus {
                            color: #ffffff;
                        }
                    }

                    .error-tip {
                        color: red;
                        font-size: 12px;
                        margin-left: 50px;
                        transition: 0.5s;
                        opacity: 0;
                    }
                }

                .desc-edit-box {
                    position: relative;
                    margin-top: 20px;

                    .edit-title {
                        float: left;
                        color: #5f5f63;
                    }

                    .input-box {
                        position: relative;
                        padding: 10px 0 20px 10px;
                        margin-left: 14px;
                        display: inline-block;
                        background: #25272b;

                        .input {
                            height: 60px;
                            width: 410px;
                            background: #25272b;
                            color: #828385;
                            border: none;
                            outline: none;
                            user-select: none;
                            resize: none;
                            font-size: 12px;
                        }

                        .input:focus {
                            color: #ffffff;
                        }

                        .tips-num {
                            position: absolute;
                            bottom: 0;
                            right: 5px;
                            color: #828385;
                            font-size: 12px;
                        }
                    }
                }

                .sex-edit-box {
                    height: 30px;
                    line-height: 30px;
                    margin-top: 20px;

                    .edit-title {
                        color: #5f5f63;
                    }

                    .radio-box {
                        display: inline-block;
                        margin-left: 10px;

                        .radio-item {
                            margin-right: 30px;
                            display: inline-block;

                            label {
                                color: #5f5f63;
                            }
                        }
                    }
                }
            }

            .submit-btn-box {
                margin-top: 30px;
                padding-left: 40px;

                .btn {
                    height: 30px;
                    width: 80px;
                    margin-right: 10px;
                    line-height: 30px;
                    text-align: center;
                    border-radius: 3px;
                    display: inline-block;
                }

                .submit {
                    color: #f2f2f2;
                    background: #00658b;
                }

                .submit:hover {
                    cursor: pointer;
                    background: #07769f;
                }

                .disabled-submit {
                    color: #667180;
                    background: #26354b;
                }

                .back {
                    color: #f2f2f2;
                    background: #373737;
                }

                .back:hover {
                    cursor: pointer;
                    background: #515151;
                }
            }

            .user-header-img-box {
                position: absolute;
                top: 80px;
                left: 530px;
                width: 180px;
                height: 180px;

                .img {
                    width: 100%;
                    height: 100%;
                }

                .modify-user-header-img-btn {
                    height: 20px;
                    width: 80px;
                    font-size: 12px;
                    text-align: center;
                    line-height: 20px;
                    background: #25272b;
                    border-radius: 5px;
                    color: #f2f2f2;
                    left: 0;
                    right: 0;
                    margin: 10px auto 0 auto;
                }

                .modify-user-header-img-btn:hover {
                    cursor: pointer;
                    background: #2c2e32;
                }

            }
        }

        textarea {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
            // 火狐
            scrollbar-color: transparent transparent;
            scrollbar-track-color: transparent;
            -ms-scrollbar-track-color: transparent;
        }

        textarea {
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style: none;
        }

        textarea::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        textarea::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        textarea::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        textarea::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        textarea::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }

        textarea::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
        }

        /*定义滚动条轨道 内阴影+圆角*/

        textarea::-webkit-scrollbar-track-piece {
            -webkit-border-radius: 2em;
            -moz-border-radius: 2em;
            border-radius: 2em;
        }

        /*定义滑块 内阴影+圆角*/

        textarea::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background-color: #2F3134;
        }

        /*---鼠标点击滚动条显示样式--*/

        textarea::-webkit-scrollbar-thumb:hover {
            background-color: #3B3C40;
        }

        textarea::-webkit-scrollbar-thumb:active {
            background-color: #3B3C40;
        }

        .tips {
            position: absolute;
            height: 80px;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            margin: auto;
        }
    }
</style>
