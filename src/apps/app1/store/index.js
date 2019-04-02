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

// 引入代理防止页面跳出后状态被清楚
let mstate = new Proxy(state, {
  set (target, key, value, receiver) {
    let oldState = sessionStorage.getItem('mstate') || '{}'
    oldState = JSON.parse(oldState)
    oldState[key] = value
    sessionStorage.setItem('mstate', JSON.stringify(oldState))
    return Reflect.set(target, key, value, receiver)
  }
})

export default new Vuex.Store({
  actions,
  getters,
  state: mstate,
  mutations
})
