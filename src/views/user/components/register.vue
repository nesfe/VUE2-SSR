<template>
  <div class="panel panel-default register-form" @keyup.13="submits()">
    <div class="panel-heading">用户注册</div>
    <div class="panel-body">
      <formData ref="formReg" class="form-horizontal">
        <div class="form-group">
          <div class="col-xs-12">
            <input type="text" v-model="ruleForm.mobile" class="form-control" placeholder="请输入手机号" validate="mobile" fh="fh_mobile">
          </div>
          <span class="col-xs-12 falseHints" id="fh_mobile"></span>
        </div>
        <div class="form-group">
          <div class="col-xs-7">
            <input type="text" v-model="ruleForm.code" class="form-control" placeholder="请输入验证码" validate="required" fh="fh_code">
          </div>
          <div class="col-xs-5">
            <btn block type="primary" @click="submitMobile" :class="submit.getCode == '获取验证码' ? '' : 'disabled'">{{submit.getCode}}</btn>
          </div>
          <span class="col-xs-12 falseHints" id="fh_code"></span>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <input type="password" v-model="ruleForm.password" class="form-control" placeholder="请输入密码" validate="pwd" id="pwd" fh="fh_password">
          </div>
          <span class="col-xs-12 falseHints" id="fh_password"></span>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <input type="password" v-model="ruleForm.passwordNext" class="form-control" placeholder="确认密码" validate="equalTo" equalTo="pwd" fh="fh_passwordNext">
          </div>
          <span class="col-xs-12 falseHints" id="fh_passwordNext"></span>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <btn to="/user/login" type="link" class="pull-right">去登录？</btn>
          </div>
        </div>
        <div class="form-group">
          <div class="col-xs-12">
            <btn block type="primary" :disabled="submit.disabled" @click="submits">{{submit.text}}</btn>
          </div>
        </div>
      </formData>
    </div>
  </div>
</template>
<script>
import api from 'src/api'
import formData from 'components/form/form.vue'

export default {
  name: 'register',
  title() {
    return '注册'
  },
  data() {
    return {
      submit: {
        text: '注 册',
        disabled: false,
        getCode: '获取验证码'
      },
      ruleForm: {
        mobile: '',
        code: '',
        password: '',
        passwordNext: ''
      }
    }
  },
  created() {
    // 客户端 服务端同时请求axios
  },
  mounted() {
    // 客户端请求axios
  },
  components: { formData },
  asyncData({ store }) {
    // return store.dispatch(`doLogins`)
  },
  methods: {
    submitMobile() {
      /**
       * 发送验证码
       */
      if (this.submit.getCode !== '获取验证码') return false
      var checkMobile = this.ruleForm.mobile.trim()
      if (checkMobile === '') {
        this.notify('danger', '请填写手机号')
        return false
      } else if (!(/^1[34578]\d{9}$/.test(checkMobile))) {
        this.notify('danger', '请输入正确的手机号')
        return false
      }

      const param = {
        mobile: this.ruleForm.mobile
      }
      api.post('/sms/send', param).then((response) => {
        if (response.code !== 200) {
          this.notify('danger', response.message)
          return false
        }
        this.notify('success', '验证码发送成功')

        // 读秒倒计时
        this.submit.getCode = '60s'
        let numTime = 60
        let deleteTime = () => {
          if (this.submit.getCode !== '1s' && numTime > 0) {
            numTime--
            this.submit.getCode = numTime + 's'
          } else {
            window.clearInterval(setCode)
            this.submit.getCode = '获取验证码'
            numTime = 60
          }
        }
        var setCode = window.setInterval(deleteTime, 1000)
      }).catch((error) => {
        console.log(error)
        this.notify('danger', '获取验证码失败，请检查网络连接！')
        this.submit.getCode = '获取验证码'
      })
    },
    submits() {
      /**
       * 注册
       */
      let fo = this.$refs.formReg.validate()
      if (fo) {
        this.submit.disabled = true
        this.verifyCode()
      } else {
        return false
      }
    },
    verifyCode() {
      const param = {
        mobile: this.ruleForm.mobile,
        verifyCode: this.ruleForm.code
      }
      api.post('/sms/checkCode', param).then((response) => {
        if (response.code === 200) {
          this.save()
        } else {
          this.submit.disabled = false
          this.notify('danger', response.message)
        }
      }).catch((error) => {
        this.submit.disabled = false
        console.log(error)
      })
    },
    save() {
      const param = this.ruleForm
      api.post('/register', param).then((response) => {
        if (response.code === 200) {
          this.notify('success', '注册成功')
          this.$router.replace({
            path: '/user/login'
          })
        } else {
          this.submit.disabled = false
          this.notify('danger', response.message)
        }
      }).catch((error) => {
        console.log(error)
        this.submit.disabled = false
      })
    },
    notify(type, content) {
      /**
       * 封装一个弹出消息
       * param {String} type 类型
       * param {String} content 内容
       */
      this.$notify({ type, content, dismissible: false, duration: 1000 })
    }
  }
}

</script>
<style lang="less">
.register-form {
  width: 320px;
  margin: 0 auto;
  border-radius: 3px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.75);
}

</style>
