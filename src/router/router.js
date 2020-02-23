import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouterPrefetch from 'vue-router-prefetch'

// router setup
import routes from './routes'
import initProgress from '../progressbar';
import { defaultOptions } from '../vue-apollo'

Vue.use(VueRouter)
Vue.use(VueRouterPrefetch)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active',
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  }
})

initProgress(router);

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !localStorage.getItem(defaultOptions.tokenName)) {
    return next({path: '/login'});
  }
  if (to.path === '/login' && localStorage.getItem(defaultOptions.tokenName)) {
    return next({path: '/'});
  }
  return next();
})

export default router;