<template>
  <div class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form>
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!isRightPhone || computeTime > 0" class="get_verification"
                      :class="{right_phone_number:isRightPhone}" @click.prevent="sendCode">
                {{computeTime > 0 ? `已发送(${computeTime}s)`:'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="isShowPwd ? 'text':'password'" maxlength="8" placeholder="密码" v-model="pwd">
                <div class="switch_button" :class="isShowPwd ? 'on' : 'off'" @click="isShowPwd=!isShowPwd">
                  <div class="switch_circle" :class="{right:isShowPwd}"></div>
                  <span class="switch_text">{{isShowPwd ? 'abc':''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img ref="captcha" class="get_verification"
                     src="http://localhost:5000/captcha" alt="captcha" @click="updateCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit" @click.prevent="login">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <span href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </span>
    </div>
  </div>
</template>

<script>
  import {Toast, MessageBox} from 'mint-ui'
  import {reqPwdLogin,reqSendCode,reqSmsLogin} from '../../api'
  export default {
    data(){
      return {
        loginWay: true, // true短信  false密码
        phone: '', // 用户输入的手机号
        computeTime: 0, // 倒计时时间
        isShowPwd: false, //是否显示密码，默认不显示
        code: '',
        name: '',
        pwd: '',
        captcha: ''
      }
    },
    computed: {

      // 正则判断用户输入的手机号是否合法，合法返回ture 不合法返回false，
      // 根据这个布尔值和倒计时时间来确定发送验证码的按钮是否禁用
      isRightPhone(){
        return /^1\d{10}$/.test(this.phone)
      }
    },
    methods: {
      async sendCode(){
        this.computeTime = 30
        const intervalId = setInterval(() => {
          this.computeTime--
          if (this.computeTime <= 0){
            this.computeTime = 0
            clearInterval(intervalId)
          }
        },1000)

        // 用户点击获取验证码后发送ajax请求：请求获取验证码
        const result = await reqSendCode(this.phone)
        if (result.code===0){
          // 请求成功：轻提示成功
          Toast('已发送验证码')
        }else {
          this.computeTime = 0
          // 请求失败：轻提示警告
          MessageBox.alert(result.msg)
        }

      },
      updateCaptcha(){
        // 点击图片验证码时，更新img的src重新发请求获取图片
        this.$refs.captcha.src = 'http://localhost:5000/captcha?time=' + Date.now()
      },
      async login(){
        const {phone,code,name,pwd,captcha,isRightPhone,loginWay} = this
        let result
        if (loginWay){
          // 短信登陆：判断手机号和验证码
          if (!isRightPhone){
            return MessageBox.alert('请输入正确的手机号')
          }else if (!/^\d{6}$/.test(code)){
            return MessageBox.alert('请输入验证码')
          }
          // 表单验证成功，发送短信登陆的ajax请求
          result = await reqSmsLogin(phone,code)
        }else {
          // 密码登陆：判断用户名、密码、验证码
          if (!name.trim()){
            return MessageBox.alert('请输入用户名')
          }else if (!pwd.trim()){
            return MessageBox.alert('请输入密码')
          }else if (!captcha.length === 4){
            return MessageBox.alert('请输入图片验证码')
          }
          // 表单验证成功，发送密码登陆的ajax请求
          result = await reqPwdLogin(name,pwd,captcha)
        }

        // 根据响应结果做出不同响应
        if (result.code === 0){
          // 登陆成功：将请求回来的用户信息保存到state中
          this.$store.dispatch('saveUser',result.data)
          // 跳转到个人中心页面
          this.$router.replace('/profile')
        }else {
          // 登陆失败
          MessageBox.alert(result.msg)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone_number
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
