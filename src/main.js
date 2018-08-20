// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import * as FastClick from "fastclick"
import Axios from 'axios'
import store from './store/store'
import App from './App'
import router from './router'
import './rem/rem'

import JsBridg from '@/functions/bridge'


var VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})

import { Lazyload } from 'vant';
Vue.use(Lazyload, {
  error:require('./assets/img/image@3x.png'),
  loading: require('./assets/img/image@3x.png')
})

import {Commpn_api} from '@/api/api';
import Functions from './functions/function.js'
import CheckFormat from './functions/checkformat'
import Tools from './functions/commonTools'
import './assets/css/base.styl'
import 'vant/lib/vant-css/index.css'


FastClick.attach(document.body)
Vue.prototype.$bridge = JsBridg
Vue.prototype.$http = Axios;
Vue.prototype.$function=Functions;
Vue.prototype.$check=CheckFormat;
Vue.prototype.$Tools=Tools;
Vue.prototype.$CommonApi=Commpn_api;

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  beforeCreate(){
      /*获取登录信息*/
      this.$bridge.callHandler(
        'submitFromWeb'
        , ''
        , (responseData) => {
          let data1 = JSON.parse(responseData)
          this.$store.commit('saveLogininfo',data1.loginResp.employee)
        }
      )
  },
  components: { App },
  template: '<App/>'
})
