import {
  reqAddress,
  reqCategorys,
  reqShops
} from '../../api'

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
} from '../mutation-type'

const state = {
  latitude: 40.10038, // 纬度
  longitude: 116.36867, // 经度
  address: {}, // 地址信息对象
  categorys: [], // 食品分类数组
  shops: [], // 商家数组
}
const mutations = {
  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address
  },
  [RECEIVE_CATEGORYS] (state, {categorys}) {
    state.categorys = categorys
  },
  [RECEIVE_SHOPS] (state, {shops}) {
    state.shops = shops
  }
}

const actions = {
  async getAddress({commit,state}){
    // 发异步ajax请求 获取地址数据
    const {latitude,longitude} = state
    const result = await reqAddress(longitude,latitude)
    // 判断请求是否成功，请求成功获取到数据后，调用commit函数触发mutation
    if (result.code === 0){
      const address = result.data
      commit(RECEIVE_ADDRESS,{address})
    }
  },
  async getCategorys({commit}){
    // 发异步ajax请求，获取食品分类列表
    const result = await reqCategorys()
    // 判断请求是否成功，请求成功获取到数据后，调用commit函数触发mutation
    if (result.code === 0){
      const categorys = result.data
      commit(RECEIVE_CATEGORYS,{categorys})
    }
  },
  async getShops({commit,state}){
    // 发异步ajax请求，获取食品分类列表
    const {latitude,longitude} = state
    const result = await reqShops(longitude,latitude)
    // 判断请求是否成功，请求成功获取到数据后，调用commit函数触发mutation
    if (result.code === 0){
      const shops = result.data
      commit(RECEIVE_SHOPS,{shops})
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
