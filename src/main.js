// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import HelloWorld from './components/HelloWorld'
import Travel from './components/Travel'
import TravelItemDetail from './components/TravelItemDetail'
import ElementUI from '../node_modules/element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
import BootstrapVue from '../node_modules/bootstrap-vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(ElementUI)

const store = new Vuex.Store({
  state: {
    items: []
  },
  getters: {
    loadedItems: (state) => {
      return state.items
    }
  },
  mutations: {
    items_fetched (state, data) {
      state.items = data
    }
  }
})
const routes = [
  { path: '/', component: Travel },
  { path: '/hello', component: HelloWorld },
  { path: '/items/:id', component: TravelItemDetail, props: true }
]

const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  components: { App },
  template: '<App/>',
  router,
  store
})
