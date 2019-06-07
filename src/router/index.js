import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import OutliersTable from '@/components/OutliersTable'

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
      name: 'second_page',
      component: OutliersTable
    }
  ]
})
