<template>
    <div class="m-album-list-box">
        <ul>
            <li class="album" v-for="(album) in albums" :key="album.albumID">
                <div class="album-bottom"></div>
                <div class="album-img-box">
                    <img ondragstart="return false" class="album-img" v-lazy="handleLazyImage(album.img)"
                         :alt="album.albumID">
                    <div class="img-mask"></div>
                    <m-play-btn class="play-icon-box" :font-size="60"/>
                </div>
                <div class="album-name">
                    <span class="name" v-html="album.albumName"></span>
                    <p class="time" v-html="album.publishDate"></p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
  import { Icon } from 'view-design'
  import MPlayBtn from '../m-play-btn/m-play-btn'
  import DisstDefLazyImg from '../../resources/images/album_300.png'

  export default {
    name: 'm-album-list',
    components: {
      MPlayBtn,
      Icon
    },
    props: {
      albums: {
        type: Array
      }
    },
    computed: {
      // 图片懒加载 v-lazy配置对象
      handleLazyImage () {
        return (ImgSrc) => {
          return {
            src: ImgSrc,
            error: DisstDefLazyImg,
            loading: DisstDefLazyImg
          }
        }
      }
    }
  }
</script>

<style lang="less">
    @import "../../common/css/theme/theme";

    .m-album-list-box {
        position: relative;
        width: 100%;
        margin-right: -25px;

        .album {
            position: relative;
            list-style: none;
            width: 20%;
            height: 30%;
            display: inline-block;
            padding: 0 25px 0 0;

            .album-img-box {
                position: relative;
                top: 0;
                z-index: 6;
                transform: translateY(0px);
                transition: transform 200ms;

                .album-img {
                    display: block;
                    width: auto;
                    height: auto;
                    max-width: 100%;
                    max-height: 100%;
                    border-radius: 10px;
                }

                .img-mask {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    background: #2828287a;
                    border-radius: 10px;
                    opacity: 0;
                    z-index: -10;
                }

                .play-icon-box {
                    opacity: 0;
                    transform: translate3d(0, 0, 0) scale(.7);
                    transition: transform 300ms;
                }

            }

            .album-img-box:hover {
                cursor: pointer;
                transform: translateY(-10px);

                .img-mask {
                    opacity: 1;
                    z-index: 1;
                }

                .play-icon-box {
                    opacity: 1;
                    z-index: 10;
                    transform: translate3d(0, 0, 0) scale(1);
                }
            }

            .album-bottom {
                cursor: pointer;
                position: absolute;
                z-index: 5;
                height: 10px;
                width: 100%;
                bottom: 65px;
            }

            .album-bottom:hover + .album-img-box {
                cursor: pointer;
                transform: translateY(-10px);

                .img-mask {
                    opacity: 1;
                    z-index: 1;
                }

                .play-icon-box {
                    z-index: 11;
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }
            }

            .album-name {
                margin-top: 5px;
                height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                color: @font-base-color;
                padding-top: 5px;
                font-size: 12px;

                .name {
                    display: block;
                }

                .name:hover {
                    cursor: pointer;
                    color: @font-active-color;
                }

                .time {
                    color: @font-tow-color;
                }
            }
        }
    }
</style>
