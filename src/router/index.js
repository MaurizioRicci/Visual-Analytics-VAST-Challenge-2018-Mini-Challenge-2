import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import OutliersPage1 from '@/components/OutliersPage1'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: HomePage
    },
    {
      path: '/outliers_table',
      name: 'outliers_table',
      component: OutliersPage1
    }
  ]
})
