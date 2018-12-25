import ajax from './ajax'

const BASE = '/api'
// [1、根据经纬度获取位置详情](#1根据经纬度获取位置详情)<br/>  (参数类型是param参数，相当于调用ajax(),参数传的是url)
export const reqAddress = (longitude, latitude) => ajax(BASE + `/position/${latitude},${longitude}`)

// [2、获取食品分类列表](#2获取食品分类列表)<br/>
export const reqCategorys = () => ajax(BASE + `/index_category`)

// [3、根据经纬度获取商铺列表](#3根据经纬度获取商铺列表)<br/>   (参数类型是query参数，相当于调用ajax(),参数传的是url和data)
export const reqShops = (longitude, latitude) => ajax(BASE + `/shops`,{longitude,latitude})

// [6、用户名密码登陆](#6用户名密码登陆)<br/>
export const reqPwdLogin = (name,pwd,captcha) => ajax(BASE + `/login_pwd`,{name,pwd,captcha},'POST')

// [7、发送短信验证码](#7发送短信验证码)<br/>
export const reqSendCode = (phone) => ajax(BASE + `/sendcode`,{phone})

// [8、手机号验证码登陆](#8手机号验证码登陆)<br/>
export const reqSmsLogin = (phone,code) => ajax(BASE + `/login_sms`,{phone,code},'POST')

// [9、根据会话获取用户信息](#9根据会话获取用户信息)<br/>
export const reqUser = () => ajax(BASE + `/userinfo`)

// 商家页面数据接口请求函数
export const reqGoods = () => ajax('/goods')
export const reqRatings = () => ajax('/ratings')
export const reqInfo = () => ajax('/info')
