<template>
    <div class="upload-mask" ref="uploadBox">
        <div class="upload-box">
            <div class="header">
                <span>上传头像</span>
                <Icon class="close" type="ios-close" size="24" @click="closeUploadPage"/>
            </div>
            <div class="division-line"></div>
            <div class="upload-image-box">
                <div class="right">
                    <!--图片裁剪区-->
                    <div class="cropper">
                        <vueCropper
                                ref="cropper"
                                :img="option.img"
                                :outputSize="option.size"
                                :outputType="option.outputType"
                                :info="true"
                                :full="option.full"
                                :canMove="option.canMove"
                                :canMoveBox="option.canMoveBox"
                                :original="option.original"
                                :autoCrop="option.autoCrop"
                                :autoCropWidth="option.autoCropWidth"
                                :autoCropHeight="option.autoCropHeight"
                                :fixedBox="option.fixedBox"
                                :fixedNumber="option.fixedNumber"
                                :centerBox="option.centerBox"
                                :canScale="option.canScale"
                                :fixed="option.fixed"
                                @realTime="realTime"
                        >
                        </vueCropper>
                    </div>
                </div>
                <div class="left">
                    <!--预览区-->
                    <div class="big-image-box">
                        <div :style="previewStyle">
                            <div :style="previews.div">
                                <img ondragstart="return false" :src="previews.url" :style="previews.img">
                            </div>
                        </div>
                        <p class="title">大尺寸头像预览</p>
                    </div>
                    <div class="small-image-box">
                        <div :style="previewStyleSmall">
                            <div :style="previews.div">
                                <img ondragstart="return false" :src="previews.url" :style="previews.img">
                            </div>
                        </div>
                        <p class="title">小尺寸头像预览</p>
                    </div>
                </div>
            </div>
            <div class="btn-box">
                <label for="uploads">
                    <div class="reload btn">重新选择</div>
                </label>
                <div class="upload btn" @click="upload('blob')">上传头像</div>
            </div>
            <!--            <div class="tips" ref="tips" v-html="tips">-->
            <!--            </div>-->
            <m-poptip class="tips" ref="tips" :content="tips"></m-poptip>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import { VueCropper } from 'vue-cropper'
  import MPoptip from '../m-poptip/m-poptip'

  export default {
    name: 'upload-image',
    components: {
      MPoptip,
      Icon,
      VueCropper
    },
    props: {
      option: {
        type: Object
      },
      fileName: {
        type: String
      },
      tips: {
        type: String
      }
    },
    data () {
      return {
        previewStyle: {},
        previewStyleSmall: {},
        previews: {},
        canUpload: true
      }
    },
    methods: {
      closeUploadPage () {
        this.$emit('closeUploadPage')
      },
      // 实时预览函数
      realTime (data) {
        let previews = data
        this.previewStyle = {
          width: previews.w + 'px',
          height: previews.h + 'px',
          overflow: 'hidden',
          margin: '0',
          zoom: 120 / previews.h
        }

        this.previewStyleSmall = {
          width: previews.w + 'px',
          height: previews.h + 'px',
          overflow: 'hidden',
          margin: '0',
          zoom: 60 / previews.h
        }
        this.previews = data
      },
      // 上传图片（点击上传按钮）
      upload (type) {
        // 防止多次点击上传
        if (this.canUpload) {
          this.canUpload = false
          let formData = new FormData()
          if (type === 'blob') {
            this.$refs.cropper.getCropBlob((data) => {
              formData.append('file', data, this.fileName)
              this.$emit('upload', formData)
            })
          }
        }
      },
      openUploadBox () {
        this.$refs.uploadBox.style.opacity = 1
        this.$refs.uploadBox.style.transform = 'translate3d(0, 0, 0) scale(1)'
        this.$refs.uploadBox.style.zIndex = 100
      },
      closeUploadBox () {
        this.$refs.uploadBox.style.opacity = 0
        this.$refs.uploadBox.style.transform = 'translate3d(0, 0, 0) scale(.7)'
        setTimeout(() => {
          this.$refs.uploadBox.style.zIndex = -100
        }, 200)
      }
    }
  }
</script>

<style lang="less">
    .upload-mask {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -100;
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(.7);
        transition: transform 200ms, opacity 200ms;

        .upload-box {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 600px;
            height: 400px;
            box-shadow: 0 0 5px 0 #000000;

            .header {
                height: 60px;
                line-height: 60px;
                background: #2d2f33;
                padding: 0 20px;
                color: #f2f2f2;
                font-size: 18px;

                .close {
                    position: absolute;
                    right: 10px;
                    top: 15px;
                    color: #999999;
                }

                .close:hover {
                    cursor: pointer;
                    color: #ffffff;
                }
            }

            .division-line {
                width: 100%;
                height: 1px;
                background: #424242;
            }

            .upload-image-box {
                height: 280px;
                background: #2d2f33;

                .right {
                    position: relative;
                    height: 100%;
                    width: 70%;
                    float: left;

                    .cropper {
                        position: absolute;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        margin: auto;
                        width: 240px;
                        height: 240px;
                    }
                }

                .left {
                    height: 100%;
                    width: 30%;
                    display: inline-block;

                    .big-image-box {
                        height: 60%;
                        width: 100%;
                        padding: 20px;

                        .big-image {
                            width: 100px;
                            height: 100px;
                        }
                    }

                    .small-image-box {
                        height: 40%;
                        width: 100%;
                        padding: 20px;

                        .small-image {
                            width: 50px;
                            height: 50px;
                        }
                    }

                    .title {
                        color: #5f5f63;
                        font-size: 12px;
                        margin-top: 5px;
                    }
                }
            }

            .btn-box {
                height: 60px;
                background: #292b2f;
                padding: 10px 190px;

                .btn {
                    cursor: pointer;
                    width: 100px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border-radius: 5px;
                    font-size: 16px;
                }

                .reload {
                    float: left;
                    color: #a5a7a8;
                    background: #37383c;
                }

                .reload:hover {
                    background: #3d3f43;
                }

                .upload {
                    float: right;
                    color: #ffffff;
                    background: #2e4e7e;
                }

                .upload:hover {
                    background: #3a6098;
                }
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
    }
</style>
