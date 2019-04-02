/**
 * state 相当于变量的储存
 * export default state 把state暴露出去
 */
// 优先从缓存中读取
let oldState = sessionStorage.getItem('mstate')
let state = oldState ? JSON.parse(oldState) : {
  // Todo
  page: ''
}

export default state
