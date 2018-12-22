/*
* ajax请求函数模块
*/

import axios from 'axios'

export default function ajax(url, data={}, method='GET'){
  // 返回一个自己定义的promise
  return new Promise(function (resolve,reject) {
    let promise
    //判断请求方式
    if (method === 'GET'){
      // 执行异步ajax请求, axios返回值是promise
      promise = axios.get(url,{params:data})
    }else{
      promise = axios.post(url,data)
    }
    //promise.then(data => {})  data是后台响应回来的数据
    promise.then(response => { // response就是响应回来的数据
      resolve(response.data)
    }).catch(error => {
      alert('请求错误:' + error.message)
    })
  })
}
