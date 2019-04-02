import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { Users } from './users'

export default {
  init () {
    let adapter = new MockAdapter(axios)
    // config Todo
    adapter.onGet('/users').reply(200, {
      code: 1, msg: '请求成功', Users, server: 'mocks'
    })
  }
}
