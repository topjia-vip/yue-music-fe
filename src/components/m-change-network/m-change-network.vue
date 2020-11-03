<template>
    <div class="change-network-box" ref="networkBox">
        <div class="close-box">
            <Icon class="close-btn" type="ios-close" size="33" @click="close"/>
        </div>
        <div class="title">
            <span>修改网络连接</span>
        </div>
        <div class="connections">
            <div class="connection" :class="handleClass(connection)" v-for="(connection,index) in connections"
                 :key="index"
                 @click="selectConnection(connection)"
            >
                <div class="select-box">
                    <div class="inner" v-show="selectUrl === connection"></div>
                </div>
                <div class="content">{{connection}}</div>
            </div>
        </div>
        <div class="btn-tools">
            <div class="btn confirm-btn" @click="changeConnection">确认</div>
            <div class="btn cancel-btn" @click="close">取消</div>
        </div>
    </div>
</template>

<script>
  import { connections, BASE_URL, setBaseUrl } from '../../api/config'
  import { Icon } from 'view-design'

  export default {
    name: 'm-change-network',
    components: {
      Icon
    },
    data () {
      return {
        connections: connections,
        selectUrl: BASE_URL,
        currentUrl: BASE_URL
      }
    },
    computed: {
      handleClass () {
        return (connection) => {
          return connection === this.currentUrl ? 'selected' : ''
        }
      }
    },
    methods: {
      selectConnection (connection) {
        this.selectUrl = connection
      },
      changeConnection () {
        if (this.selectUrl !== BASE_URL) {
          setBaseUrl(this.selectUrl)
          this.currentUrl = this.selectUrl
        }
        this.close()
      },
      open () {
        this.$refs.networkBox.style.zIndex = 1100
        this.$refs.networkBox.style.opacity = 1
        this.$refs.networkBox.style.transform = 'translate3d(0, 0, 0) scale(1)'
      },
      close () {
        this.selectUrl = this.currentUrl
        this.$refs.networkBox.style.opacity = 0
        this.$refs.networkBox.style.transform = 'translate3d(0, 0, 0) scale(.7)'
        setTimeout(() => {
          this.$refs.networkBox.style.zIndex = -10
        }, 200)
      }
    }
  }
</script>

<style lang="less">
    .change-network-box {
        user-select: none;
        display: flex;
        justify-content: space-between;
        flex-flow: column;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 360px;
        height: 460px;
        padding: 40px;
        background-color: #2a2a2a;
        z-index: -10;
        opacity: 0;
        transform: translate3d(0, 0, 0) scale(.7);
        transition: transform 200ms, opacity 200ms;

        .close-box {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;

            .close-btn {
                color: #b3b3b3;
            }

            .close-btn:hover {
                cursor: pointer;
                color: #ffffff;
            }
        }

        .title {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFFFFF;
            height: 20px;
        }

        .connections {
            .connection {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: #a5a5a5;

                .select-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 16px;
                    width: 16px;
                    background-color: #0000007a;
                    border-radius: 50%;

                    .inner {
                        width: 10px;
                        height: 10px;
                        background-color: #4ea4dc;
                        border-radius: 50%;
                    }
                }

                .content {
                    margin-left: 20px;
                }
            }

            .connection:hover {
                cursor: pointer;
                color: #cccccc;
            }

            .selected {
                color: #FFFFFF !important;
            }
        }

        .btn-tools {
            display: flex;
            justify-content: space-around;
            align-items: center;

            .btn {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 45%;
                height: 30px;
                color: #FFFFFF;
            }

            .confirm-btn {
                background-color: #4ea4dc;
            }

            .confirm-btn:hover {
                background-color: #0aabfa;
            }

            .cancel-btn {
                background-color: #4d4d4d;
            }

            .cancel-btn:hover {
                background-color: #676767;
            }
        }
    }
</style>
