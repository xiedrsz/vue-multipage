import Vue from 'vue'
import Router from 'vue-router'
import Page1 from '@app2/pages/Page1'
import Page2 from '@app2/pages/Page2'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Page1',
    component: Page1
  }, {
    path: '/page2',
    name: 'Page2',
    component: Page2
  }]
})
