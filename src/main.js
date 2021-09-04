import Vue from 'vue'
import App from './App.vue'
import axios from "axios";
import VueAxios from 'vue-axios'
Vue.config.productionTip = false
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import router from './router'
import Vuex from 'vuex'
Vue.use(VueRouter)
Vue.use(ElementUI);
Vue.use(VueAxios,axios)
Vue.use(Vuex)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
