<template>
    <div class="page-box">
        <Page :total="total" :current="curPageNum" :page-size="pageSize" @on-change="changePage"/>
    </div>
</template>

<script>
  import { Page } from 'view-design'

  export default {
    name: 'm-page',
    components: {
      Page
    },
    props: {
      total: {
        type: Number
      },
      curPageNum: {
        type: Number
      },
      pageSize: {
        type: Number
      }
    },
    methods: {
      changePage (pageNum) {
        this.$emit('changePage', pageNum)
      }
    }
  }
</script>

<style lang="less">
    .page-box {
        text-align: center;
        margin-bottom: 30px;

        .ivu-page {

            .ivu-page-prev, .ivu-page-next {
                display: inline-block;
                vertical-align: middle;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                height: 25px;
                width: 25px;
                min-width: 25px;
                min-height: 25px;
                line-height: 25px;
                list-style: none;
                text-align: center;
                cursor: pointer;
                color: #828385;
                border: 1px solid #333539;
                border-radius: 0;
                background: #25272B;
                transition: 0s;
            }

            .ivu-page-item {
                display: inline-block;
                vertical-align: middle;
                height: 25px;
                min-width: 25px;
                min-height: 25px;
                line-height: 25px;
                margin-right: 4px;
                text-align: center;
                list-style: none;
                background-color: transparent;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                cursor: pointer;
                font-weight: 500;
                border: 1px solid transparent;
                border-radius: 0;
                transition: 0s;
                padding: 0 5px;

                a {
                    color: #828385;
                    margin: 0;
                }
            }

            .ivu-page-item-active {
                font-weight: 600;

                a {
                    color: #DCDDE4;
                }
            }

            .ivu-page-item:hover {
                border: 1px solid #282B32;
                background: #282B32;
                font-weight: 600;

                a {
                    color: #DCDDE4;
                    margin: 0;
                }
            }

            .ivu-page-item-active:hover {
                cursor: default;
                background: none;
                border: 1px solid transparent;

                a {
                    cursor: default;
                    color: #DCDDE4;
                }
            }

            .ivu-page-prev:hover, .ivu-page-next:hover {
                border: 1px solid #282B32;
                background: #282B32;

                a {
                    color: #828385;
                }
            }

            .ivu-page-item-jump-next, .ivu-page-item-jump-prev {
                color: #828385;
                display: inline-block;
                vertical-align: middle;
                width: 25px;
                height: 25px;
                min-width: 25px;
                min-height: 25px;
                line-height: 25px;
                margin-right: 4px;
                text-align: center;
                list-style: none;
                background-color: transparent;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                cursor: pointer;
                font-weight: 500;
                border: 1px solid transparent;
                border-radius: 0;
                transition: 0s;
                padding: 0 5px;

                a {
                    color: #828385;
                }
            }

            .ivu-page-item-jump-next:hover, .ivu-page-item-jump-prev:hover {
                font-weight: 600;

                a {
                    color: #DCDDE4;
                    margin: 0;
                }
            }

            .ivu-page-disabled {
                cursor: default;

                a {
                    cursor: default;
                    color: #32343B;
                }
            }

            .ivu-page-disabled:hover {
                border: 1px solid #333539;
                background: #25272B;

                a {
                    color: #32343B;
                }
            }
        }

        /*#282B32*/

    }
</style>
