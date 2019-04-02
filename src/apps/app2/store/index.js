/**
 * view或者业务逻辑发出，dispatch派发事件给actions=>actions 会commit事件给mutations,操作state
 */

import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
