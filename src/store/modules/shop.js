import Vue from 'vue'

import {
  reqGoods,
  reqRatings,
  reqInfo
} from '../../api'

import {
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,
  REDUCE_FOOD_COUNT,
  ADD_FOOD_COUNT
} from '../mutation-type'

const state = {
  goods: [],
  ratings: [],
  info: {}
}
const mutations = {
  [RECEIVE_GOODS] (state, {goods}) {
    state.goods = goods
  },
  [RECEIVE_RATINGS] (state, {ratings}) {
    state.ratings = ratings
  },
  [RECEIVE_INFO] (state, {info}) {
    state.info = info
  },
  [ADD_FOOD_COUNT] (state,{food}){
    if (!food.count){
      // food.count = 1
      Vue.set(food, 'count', 1)
    }else {
      food.count++
    }
  },
  [REDUCE_FOOD_COUNT] (state,{food}){
    if (food.count > 0) {
      food.count--
    }
  }
}

const actions = {
  async getGoods({commit},cb){
    const result = await reqGoods()
    if (result.code === 0){
      const goods = result.data
      commit(RECEIVE_GOODS,{goods})
    }
    typeof cb==='function' && cb()
  },
  async getRatings({commit}){
    const result = await reqRatings()
    if (result.code === 0){
      const ratings = result.data
      commit(RECEIVE_RATINGS,{ratings})
    }
  },
  async getInfo({commit}){
    const result = await reqInfo()
    if (result.code === 0){
      const info = result.data
      commit(RECEIVE_INFO,{info})
    }
  },
  updateFoodCount({commit},{isAdd,food}){
    if (isAdd){
      commit(ADD_FOOD_COUNT,{food})
    }else {
      commit(REDUCE_FOOD_COUNT,{food})
    }
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
