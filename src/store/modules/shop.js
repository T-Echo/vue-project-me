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
  info: {},
  cartFoods: []
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
      // 将新点的food添加到cartFoods数组
      state.cartFoods.push(food)
    }else {
      food.count++
    }
  },
  [REDUCE_FOOD_COUNT] (state,{food}){
    if (food.count > 0) {
      food.count--

      // 如果food.count === 0,就将当前food从cartFoods数组中删除
      if (food.count === 0){
        state.cartFoods.splice(state.cartFoods.indexOf(food), 1)
      }
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
  /*cartGoods(state){
    // 这个方法在每次goods发生变化时都会重新计算cartGoods属性，效率低
    // 定义一个空数组
    const foods = []
    // 遍历状态数据goods
    state.goods.forEach(good => {
      // 遍历foods，得到每一个食物
      good.foods.forEach(food => {
        if (food.count>0){
          // 如果food.count的数量大于0，就将food添加到数组中
          foods.push(food)
        }
      })
    })
    return foods
  }*/

  totalCount(state){
    return state.cartFoods.reduce((pre, food) => pre + food.count, 0)
  },
  totalPrice(state){
    return state.cartFoods.reduce((pre,food) => pre + food.count * food.price , 0)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
