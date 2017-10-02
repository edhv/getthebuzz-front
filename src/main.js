require('reset-css')
require('./assets/styles/styles.scss')
require('./assets/svg/getthebuzz_logo.svg')
require('./assets/js/app.js')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Meta from 'vue-meta'
import {VueMasonryPlugin} from 'vue-masonry'
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(VueMasonryPlugin)
Vue.use(Meta)
Vue.use(infiniteScroll)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  created: function() {
    console.log('bymarkbrand.com');
  }
})
