import Vue from 'vue'
import AxiosPlugin from '@/libs/AxiosPlugin'

Vue.use(AxiosPlugin)

// Todo
Vue.http.defaults.headers.post['Content-Type'] = 'application/json'

/**
 * axios 公共配置
 */
Vue.http.interceptors.request.use(config => {
  // Todo
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

Vue.http.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})
