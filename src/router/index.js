import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store';

const Home=(resolve) => {
  import('@/components/home').then((module) => {
    resolve(module)
  })
}

const HomeSearch=(resolve) => {
  import('@/components/home_search').then((module) => {
    resolve(module)
  })
}

const Checkin=(resolve) => {
  import('@/components/checkin').then((module) => {
    resolve(module)
  })
}
const Mineinfo=(resolve) => {
  import('@/components/mineinfo').then((module) => {
    resolve(module)
  })
}
const Details=(resolve) => {
  import('@/components/details').then((module) => {
    resolve(module)
  })
}
const Claimpage=(resolve) => {
  import('@/components/claimpage').then((module) => {
    resolve(module)
  })
}

const Search=(resolve) => {
  import('@/components/search').then((module) => {
    resolve(module)
  })
}

const Printorder=(resolve) => {
  import('@/components/printorder').then((module) => {
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
    },
    {
      name:'checkin',
      path:'/checkin',
      component:Checkin
    },
    {
      name:'mineinfo',
      path:'/mineinfo',
      component:Mineinfo
    },
    {
      name:'details',
      path:'/details',
      component:Details
    },
    {
      name:'claimpage',
      path:'/claimpage',
      component:Claimpage
    },
    {
      name:'search',
      path:'/search',
      component:Search
    },
    {
      name:'print',
      path:'/print',
      component:Printorder
    },{
      name:'homesearch',
      path:'/homesearch',
      component:HomeSearch
    }
  ]
})



export default router;
