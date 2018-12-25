import {
  reqUser
} from '../../api'

import {
  RECEIVE_USER,
  RESET_USER
} from '../mutation-type'

const state = {
  user: {} // 用户信息
}
const mutations = {
  [RECEIVE_USER] (state, {user}){
    state.user = user
  },
  [RESET_USER] (state){
    state.user = {}
  }
}

const actions = {
  async getUser({commit}){
    const result = await reqUser()
    if (result.code === 0){
      const user = result.data
      commit(RECEIVE_USER,{user})
    }
  },
  saveUser({commit},user){
    commit(RECEIVE_USER,{user})
  },
  logout({commit}){
    commit(RESET_USER)
  }
}
const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
