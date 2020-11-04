import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './common/font-icon/font-awesome-4.7.0/css/font-awesome.min.css'
import 'view-design/dist/styles/iview.css'
import VueLazyload from 'vue-lazyload'
import defLazyImg from './resources/images/playlist_300.png'
import Router from 'vue-router'
import routerStack from './RouterStack'

Vue.prototype.routerStack = routerStack.routerStack

// 解决连续点击相同路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueLazyload, {
  error: defLazyImg,
  loading: defLazyImg
})

router.beforeEach((to, from, next) => {
  if (to.name) {
    next()
  } else {
    next(false)
  }
})

new Vue(
  {
    render: h => h(App),
    router,
    store
  }
).$mount('#app')
