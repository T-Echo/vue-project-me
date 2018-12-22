import ajax from './ajax'

const BASE = '/api'
// [1、根据经纬度获取位置详情](#1根据经纬度获取位置详情)<br/>  (参数类型是param参数，相当于调用ajax(),参数传的是url)
export const reqAddress = (longitude, latitude) => ajax(BASE + `/position/${latitude},${longitude}`)

// [2、获取食品分类列表](#2获取食品分类列表)<br/>
export const reqCategorys = () => ajax(BASE + `/index_category`)

// [3、根据经纬度获取商铺列表](#3根据经纬度获取商铺列表)<br/>   (参数类型是query参数，相当于调用ajax(),参数传的是url和data)
export const reqShops = (longitude, latitude) => ajax(BASE + `/shops`,{longitude,latitude})
