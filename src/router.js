import Vue from 'vue'
import Router from 'vue-router'
import index from './views/index.vue'
import Login from "@/views/Login";
import studentDetail from "./views/studentDetail";
import unitsDetail from "./views/unitsDetail";
import questionDetail from "./views/questionDetail";
import finishStatus from "./views/finishStatus";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/login',
      name:'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/studentDetail',
      name: 'studentDetail',
      component: studentDetail
    },
    {
      path: '/unitsDetail',
      name: 'unitsDetail',
      component: unitsDetail
    },
    {
      path: '/questionDetail',
      name: 'questionDetail',
      component: questionDetail,
      props: true
    },
    {
      path: '/finishStatus',
      name: 'finishStatus',
      component: finishStatus,
      props: true
    }
  ]
})
