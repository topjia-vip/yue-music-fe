<template>
    <div class="max">
        <div class="not-update-box">
            <div class="header">
                <div class="header">
                    <span>修改未保存</span>
                    <Icon class="close" type="ios-close" size="24" @click="closeNotUpdatePage"/>
                </div>
            </div>
            <div class="division-line"></div>
            <div class="content">修改的信息未保存,是否保存后再离开?</div>
            <div class="btn-box">
                <div class="back btn" @click="backNow">取消</div>
                <div class="save btn" @click="save">保存</div>
            </div>
        </div>
    </div>
</template>

<script>
  import { Icon } from 'view-design'

  export default {
    name: 'not-update',
    components: {
      Icon
    },
    methods: {
      closeNotUpdatePage () {
        this.$emit('closeNotUpdatePage')
      },
      save () {
        this.$emit('save')
      },
      backNow () {
        this.$emit('backNow')
      }
    }
  }
</script>

<style lang="less">
    .max {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .not-update-box {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            width: 400px;
            height: 260px;
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

            .content {
                height: 140px;
                background: #2d2f33;
                color: #f2f2f2;
                text-align: center;
                line-height: 140px;
            }

            .btn-box {
                height: 60px;
                background: #292b2f;
                padding: 10px 90px;

                .btn {
                    cursor: pointer;
                    width: 100px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border-radius: 5px;
                    font-size: 16px;
                }

                .back {
                    float: left;
                    color: #a5a7a8;
                    background: #37383c;
                }

                .back:hover {
                    background: #3d3f43;
                }

                .save {
                    float: right;
                    color: #ffffff;
                    background: #2e4e7e;
                }

                .save:hover {
                    background: #3a6098;
                }
            }

            .tips {
                position: absolute;
                text-align: center;
                width: 120px;
                height: 80px;
                line-height: 80px;
                border-radius: 10px;
                color: #f2f2f2;
                background: #000000;
                top: 0;
                right: 0;
                left: 0;
                bottom: 0;
                margin: auto;
                opacity: 0;
                z-index: -1;
                transition: 0.5s;

                .dot {
                    font-family: simsun;
                }

                .dot {
                    display: inline-block;
                    width: 1.5em;
                    vertical-align: bottom;
                    overflow: hidden;
                }

                @-webkit-keyframes dot {
                    0% {
                        width: 0;
                        margin-right: 1.5em;
                    }
                    33% {
                        width: .5em;
                        margin-right: 1em;
                    }
                    66% {
                        width: 1em;
                        margin-right: .5em;
                    }
                    100% {
                        width: 1.5em;
                        margin-right: 0;
                    }
                }

                .dot {
                    -webkit-animation: dot 3s infinite step-start;
                }

                @keyframes dot {
                    0% {
                        width: 0;
                        margin-right: 1.5em;
                    }
                    33% {
                        width: .5em;
                        margin-right: 1em;
                    }
                    66% {
                        width: 1em;
                        margin-right: .5em;
                    }
                    100% {
                        width: 1.5em;
                        margin-right: 0;
                    }
                }

                .dot {
                    animation: dot 3s infinite step-start;
                }
            }
        }
    }
</style>
