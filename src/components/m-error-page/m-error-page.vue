<template>
    <div class="error-page-box">
        <div class="error-content-box">
            <div class="emoticons">
                <h1>(°ー°〃)!!!</h1>
            </div>
            <br>
            <div class="message">
                <h4>震惊,服务器居然开小差了~</h4>
                <br>
                <h4>稍等片刻，点击下方刷新按钮，重试一下~</h4>
            </div>
            <div class="refresh-btn" @click="refresh">
                刷新页面
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'm-error-page',
    methods: {
      refresh () {
        this.$emit('refresh')
      }
    }
  }
</script>

<style lang="less">
    .error-page-box {
        z-index: 0;
        user-select: none;
        background: #16181C;
        min-width: 820px;
        overflow: hidden;
        width: 100%;
        height: 100%;

        .error-content-box {
            width: 400px;
            height: 300px;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            margin: auto;

            .emoticons {
                color: #716f6f;
            }

            .message {
                color: #b2b2b2;
            }

            .refresh-btn {
                font-size: 12px;
                height: 24px;
                width: 80px;
                line-height: 24px;
                text-align: center;
                background-color: #3a3a3a;
                margin-top: 30px;
                border-radius: 12px;
                color: #b2b2b2;
            }

            .refresh-btn:hover {
                cursor: pointer;
                background-color: #5b5b5b;
                color: #ffffff;
            }
        }
    }
</style>
