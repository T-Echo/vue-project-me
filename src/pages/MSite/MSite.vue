<template>
    <div class="msite">
      <!--首页头部-->
      <NavHeader :title="address.name || '正在定位中...'">
        <a class="header_search" slot="left">
          <i class="iconfont icon-sousuo" @click="$router.replace('/search')"></i>
        </a>
        <a class="header_login" slot="right">
          <span class="header_login_text" v-if="!user._id" @click="$router.push('/login')">登录|注册</span>
          <i class="iconfont icon-person" v-else @click="$router.replace('/userinfo')"></i>
        </a>
      </NavHeader>
      <!--首页导航-->
      <nav class="msite_nav border-1px">
        <div class="swiper-container" v-if="categorysArr.length>0">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(categorys,index) in categorysArr" :key="index">
              <a href="javascript:" class="link_to_food" v-for="(category,index) in categorys" :key="index">
                <div class="food_container">
                  <img :src="'https://fuss10.elemecdn.com' + category.image_url">
                </div>
                <span>{{category.title}}</span>
              </a>
            </div>
          </div>
          <!-- Add Pagination -->
          <div class="swiper-pagination"></div>
        </div>
        <img src="./images/msite_back.svg" alt="back" v-else>
      </nav>
      <!--首页附近商家-->
      <div class="msite_shop_list border-1px">
        <div class="shop_header">
          <i class="iconfont icon-xuanxiang"></i>
          <span class="shop_header_title">附近商家</span>
        </div>
        <ShopList/>
      </div>
    </div>
  </template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  import {mapState} from 'vuex'
  import ShopList from '../../components/ShopList/ShopList.vue'
  export default {
    mounted(){
      this.$store.dispatch('getShops')
      this.$store.dispatch('getCategorys')
    },
    computed: {
      // ...mapState(['address','categorys']),
      ...mapState({
        address: state => state.msite.address,
        categorys: state => state.msite.categorys,
        user: state => state.user.user
      }),

      // 根据从state中获取到的数据添加计算属性(获取到的数据是一个一维数组，不方便遍历显示到页面上，要加工成二维数组)
      categorysArr(){
        // 拿到获取到的数据
        const {categorys} = this
        // 定义两个数组（一个外层的大数组，一个内部的小数组）
        const bigArr = []
        let smallArr = []
        // 遍历获取的数据
        categorys.forEach(c => {
          // 在小数组的长度为0时添加到大数组中
          if (smallArr.length === 0){
            bigArr.push(smallArr)
          }
          // 将每次遍历的数据(对象类型)添加到小数组中
          smallArr.push(c)
          // 小数组的长度最大是8
          if (smallArr.length === 8){
            smallArr = []
          }
        })
        return bigArr
      }
    },
    watch: {
      categorys(){
        this.$nextTick(() => {
          new Swiper('.swiper-container',{
            loop: true, // 循环轮播
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            },
          })
        })
      }
    },
    components: {
      ShopList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"

  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px
</style>
