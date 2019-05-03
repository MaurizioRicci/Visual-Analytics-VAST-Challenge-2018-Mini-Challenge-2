import Vue from 'vue'
import Router from 'vue-router'
import SAP from '@/components/SinglePageApp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: SAP
    }
  ]
})
