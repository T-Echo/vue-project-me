<template>
  <div class="star" :class="`star-${size}`">
    <span class="star-item" v-for="(c,index) in starClasses" :key="index" :class="c"></span>
  </div>
</template>

<script>
  export default {
    props: {
      score: Number,
      size: Number
    },
    computed:{
      starClasses(){
        // 拿到score
        const {score} = this
        // 定义一个空数组
        const scs = []
        // 得到全心的星星数量
        const scoreInteger = Math.floor(score)
        // 根据全心星星的数量添加类名‘on’到scs数组
        for (let i = 0; i < scoreInteger; i++){
          scs.push('on')
        }
        // 添加0个或者1个半心星星到scs数组
        if (Math.round(score - scoreInteger) === 1){
          scs.push('half')
        }

        // 添加‘off’到scs数组
        while (scs.length < 5){
          scs.push('off')
        }

        return scs
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .star //2x图 3x图
    float left
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/stars/star48_on')
        &.half
          bg-image('./images/stars/star48_half')
        &.off
          bg-image('./images/stars/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star36_on')
        &.half
          bg-image('./images/stars/star36_half')
        &.off
          bg-image('./images/stars/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/stars/star24_on')
        &.half
          bg-image('./images/stars/star24_half')
        &.off
          bg-image('./images/stars/star24_off')
</style>
