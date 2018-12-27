import Vue from 'vue'
import moment from 'moment'

// 日期格式化
Vue.filter('data-format',(value,format) => {
  return moment(value).format(format || 'YY-MM-DD HH-mm-ss')
})
