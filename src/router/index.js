import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store';

const Home=(resolve) => {
  import('@/components/home').then((module) => {
    resolve(module)
  })
}


Vue.use(Router)

const router=new Router({
  routes: [
    {
      path: '/',
      redirect:'/home'
    },
    {
      name:'home',
      path:'/home',
      component:Home
    }
  ]
})



export default router;
