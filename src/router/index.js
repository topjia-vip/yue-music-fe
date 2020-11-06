import Vue from 'vue'
import VueRouter from 'vue-router'
import FindMusic from '../page/m-body/m-find-music/m-find-music'
import Recommend from '../page/m-body/m-find-music/m-music-recommend/m-recommend'
import Disst from '../page/m-body/m-find-music/m-dissts/m-disst'
import Rank from '../page/m-body/m-find-music/m-rank/m-rank'
import Singer from '../page/m-body/m-find-music/m-singer/m-singer'
import NewSong from '../page/m-body/m-find-music/m-new-song/m-new-song'
import DisstDetail from '../page/m-body/m-find-music/m-dissts/m-disst-detail/m-disst-detail'
import SingerDetail from '../page/m-body/m-find-music/m-singer/m-singer-detail/m-singer-detail'
import UserCreateDisst
  from '../page/m-body/m-user/m-user-create-disst/m-user-create-disst'
import UserLike from '../page/m-body/m-user/m-user-like/m-user-like'
import TopInfo from '../page/m-body/m-find-music/m-rank/m-rank-info/m-rank-info'
import UserDetail from '../page/m-body/m-user/m-user-detail/m-user-detail'
import UserEdit from '../page/m-body/m-user/m-user-edit/m-user-edit'
import Search from '../page/m-body/m-search/m-search'
import Video from '../page/m-body/m-video/m-video'
import VideoRecommend from '../page/m-body/m-video/m-video-recommend/m-video-recommend'
import VideoRank from '../page/m-body/m-video/m-video-rank/m-video-rank'
import Videos from '../page/m-body/m-video/m-videos/m-videos'
import VideoPlayer from '../page/m-body/m-video/m-video-play-page/m-video-play-page'

Vue.use(VueRouter)

// 配置路由
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/findMusic'
    },
    {
      path: '/findMusic',
      name: 'findMusic',
      component: FindMusic,
      children: [
        {
          path: 'recommend',
          name: 'recommend',
          component: Recommend,
          meta: {
            title: '推荐',
            keepAlive: true,
            index: 0
          }
        },
        {
          path: 'dissts',
          name: 'dissts',
          component: Disst,
          meta: {
            title: '歌单',
            keepAlive: true,
            index: 1
          }
        },
        {
          path: 'rank',
          name: 'rank',
          component: Rank,
          meta: {
            title: '排行榜',
            keepAlive: true,
            index: 2
          }
        },
        {
          path: 'singer',
          name: 'singer',
          component: Singer,
          meta: {
            title: '歌手',
            keepAlive: true,
            index: 3
          }
        },
        {
          path: 'new_song',
          name: 'new_song',
          component: NewSong,
          meta: {
            title: '新歌推荐',
            keepAlive: true,
            index: 4
          }
        }
      ],
      redirect: '/findMusic/recommend'
    },
    {
      path: '/video',
      name: 'video',
      component: Video,
      children: [
        {
          path: 'recommend',
          name: 'recommend',
          component: VideoRecommend,
          meta: {
            title: '视频推荐',
            keepAlive: true,
            index: 0
          }
        },
        {
          path: 'rank',
          name: 'rank',
          component: VideoRank,
          meta: {
            title: '视频排行榜',
            keepAlive: true,
            index: 1
          }
        },
        {
          path: 'videos',
          name: 'videos',
          component: Videos,
          meta: {
            title: '视频库',
            keepAlive: true,
            index: 2
          }
        }
      ],
      redirect: '/video/recommend'
    },
    {
      path: '/video/:videoId',
      name: 'video_player',
      component: VideoPlayer,
      meta: {
        title: '视频播放',
        keepAlive: false,
        index: 5
      }
    },
    {
      path: '/disst/:disstId',
      name: 'disst',
      component: DisstDetail,
      meta: {
        title: '歌单详情',
        keepAlive: false,
        index: 5
      }
    },
    {
      path: '/singer/:singerName/:singerMid',
      name: 'singerDetail',
      component: SingerDetail,
      meta: {
        title: '歌手详情',
        keepAlive: false,
        index: 5
      }
    },
    {
      path: '/user/:disstId',
      name: 'userCreateDisst',
      component: UserCreateDisst,
      meta: {
        title: '用户收藏歌单',
        keepAlive: false,
        index: 5
      }
    },
    {
      path: '/like',
      name: 'userLike',
      component: UserLike,
      meta: {
        title: '我喜欢',
        keepAlive: true,
        index: 5
      }
    },
    {
      path: '/rank/:topId',
      name: 'rankInfo',
      component: TopInfo,
      meta: {
        title: '排行榜详情',
        keepAlive: false,
        index: 5
      }
    },
    {
      path: '/user_info/:userId',
      name: 'userDetail',
      component: UserDetail,
      meta: {
        title: '用户详情',
        keepAlive: true,
        index: 5
      }
    },
    {
      path: '/user_edit/:userId',
      name: 'userEdit',
      component: UserEdit,
      meta: {
        title: '用户详情',
        keepAlive: true,
        index: 5
      }
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: {
        title: '搜索',
        keepAlive: false,
        index: 5
      }
    }
  ]
})
