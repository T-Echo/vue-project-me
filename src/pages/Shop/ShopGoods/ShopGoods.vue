<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul ref="leftUl">
          <!--current动态样式-->
          <li class="menu-item" @click="clickItem(index)" v-for="(good,index) in goods" :key="index" :class="{current: currentIndex===index}">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper">
        <ul ref="rightUl">
          <li class="food-list-hook" v-for="(good,index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food,index) in good.foods" :key="index">
                <div class="icon">
                  <img width="57" height="57"
                       :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span></div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {mapState} from 'vuex'
  export default {
    data(){
      return {
        scrollY: 0, // 右侧ul顶部的y轴坐标
        tops: [], // 存放右侧每一个li距离ul的top值
      }
    },
    mounted(){
      this.$store.dispatch('getGoods',() => {
        this.$nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      })
    },
    computed: {
      ...mapState({
        goods: state => state.shop.goods
      }),
      currentIndex(){ // 根据状态数据scrollY和tops 得到计算属性currentIndex
        const {scrollY,tops} = this
        // 根据scrollY的值，在tops中进行查找，与每一个li的top值进行比较，得到右侧每一个li的索引(对应左侧分类列表)
        // 如果currentIndex===当前分类列表的索引，就给当前左侧的分类列表添加动态样式属性
        const index = tops.findIndex((top,index) => {
          return scrollY>=top && scrollY < tops[index+1]
        })

        // 判断this.leftScroll是为了解决初始显示不会调用$nextTick()的问题，不调用，组件对象上就没有leftScroll属性
        if (index !== this.index && this.leftScroll){
          // 如果进入判断说明index发生了改变，就将新的index赋给this.index
          this.index = index
          // 根据index获取到左侧对应的分类列表
          const li = this.$refs.leftUl.children[index]
          // 利用better-scroll的语法，使左侧列表进行编码滑动
          this.leftScroll.scrollToElement(li,200)
        }
        return index
      }
    },
    methods: {
      _initScroll(){
        this.leftScroll = new BScroll('.menu-wrapper',{
          click: true
        })
        this.rightScroll = new BScroll('.foods-wrapper',{
          click: true,
          probeType: 1, // 非实时(每隔一定时间才) ,触摸
          // probeType: 2, // 实时,触摸
          // probeType: 3, // 实时,触摸/惯性/编码
        })

        // 监视右侧列表的滑动
        this.rightScroll.on('scroll',({x,y}) => {
          // 更新scrollY数据(y为负值，要取绝对值)
          this.scrollY = Math.abs(y)
        })
        // 监视右侧列表滑动结束(没有必要实时触发，所以配置对象中probeType:1，只需要得到滑动结束时的位置)
        this.rightScroll.on('scrollEnd',({x,y}) => {
          // 更新scrollY数据
          this.scrollY = Math.abs(y)
        })
      },
      _initTops(){
        // 定义一个空数组
        const tops = []
        // 定义一个初始top = 0，一开始的位置默认为0，添加到tops数组
        let top = 0
        tops.push(top)
        // 拿到右侧所有列表
        const lis = this.$refs.rightUl.children
        // 将伪数组转成真数组，遍历得到每一个li的高度
        Array.prototype.slice.call(lis).forEach(li => {
          // 将高度累加得到每一个li顶部距离ul顶部的距离top
          top += li.clientHeight
          // 将top添加到数组
          tops.push(top)
        })
        // 更新tops
        this.tops = tops
      },
      clickItem(index){
        // 得到索引对应的右侧列表的top值
        const y = -this.tops[index]
        // 先将top的值给scrollY(取正值)
        this.scrollY = Math.abs(y)
        // 再让右侧列表滑动到对应的位置
        this.rightScroll.scrollTo(0, y, 200)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../common/stylus/mixins.styl"

  .goods
    display: flex
    position: absolute
    top: 225px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>

