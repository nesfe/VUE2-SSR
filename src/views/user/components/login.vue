<template>
  <div class="panel panel-default login-form" @keyup.13="submits()">
    <div class="panel-heading">阿拉丁管控平台</div>
    <div class="panel-body">
      <formData ref="formLogin" class="form-horizontal">
        <div class="form-group">
          <label class="mod-label pull-left control-label">用户名</label>
          <div class="mod-input pull-left">
            <input type="text" v-model="ruleForm.username" class="form-control" placeholder="用户名（手机号）" auto-complete="off" validate="required" fh="fh_username">
            <span class="falseHints" id="fh_username"></span>
          </div>
        </div>
        <div class="form-group">
          <label class="mod-label pull-left control-label">密  码</label>
          <div class="mod-input pull-left">
            <input type="password" v-model="ruleForm.password" class="form-control" autocomplete="new-password" placeholder="密码" auto-complete="off" validate="required" fh="fh_password">
            <span class="falseHints" id="fh_password"></span>
          </div>
        </div>
        <div class="form-group">
          <label class="mod-label pull-left control-label"></label>
          <div class="mod-input pull-left">
            <label>
              <input type="checkbox" v-model="checkbox" value="remember-me"> 记住密码
            </label>
            <btn class="pull-right" type="link" to="/user/register">注册</btn>
          </div>
        </div>
        <div class="form-group art-btn-group">
          <label class="mod-label pull-left control-label"></label>
          <div class="mod-input pull-left">
            <btn block type="primary" @click="submits">
              <template v-if="!loading">{{submit}}</template>
              <i v-if="loading" class="fa fa-refresh fa-spin"></i>
            </btn>
          </div>
        </div>
      </formData>
    </div>
  </div>
</template>
<script>
  import api from 'src/api'
  import cookies from 'js-cookie'
  import formData from 'components/form/form.vue'

  export default {
    name: 'Login',
    title () {
      return '登录'
    },
    data () {
      return {
        checkbox: false,
        loading: false,
        submit: '登 录',
        ruleForm: {
          username: '',
          password: ''
        }
      }
    },
    created () {
      // 客户端 服务端同时请求axios
    },
    mounted () {
      // 客户端请求axios
      const userDb = cookies.getJSON('user_db')
      if (userDb) {
        this.checkbox = true
        this.ruleForm = userDb || {username: '', password: ''}
      }
    },
    components: {formData},
    asyncData ({store}) {
      // return store.dispatch(`doLogins`)
    },
    methods: {
      isLogin (response) {
        /**
         * 用户状态清空
         * */
        let userId = window.sessionStorage.getItem('userId')
        if (response.data.userId !== userId) {
          window.sessionStorage.removeItem('pid')
          window.sessionStorage.removeItem('pname')
        }
        window.sessionStorage.setItem('userId', response.data.userId)
      },
      submits () {
        /**
         * 登录
         */
        let fo = this.$refs.formLogin.validate()
        if (!fo) return false
        const param = this.ruleForm
        this.loading = true
        this.submit = '登录中...'
        api.post('/login', param).then((response) => {
          console.log('login', response)
          this.loading = false
          if (response.code === 200) {
            this.isLogin(response)
            this.submit = '登录成功，跳转中...'
            console.log(this.checkbox)
            // 保存用户名密码7天
            if (this.checkbox) {
              cookies.set('user_db', this.ruleForm, {expires: 7})
            } else {
              cookies.remove('user_db')
            }
            // 提示 and 跳转
            this.notify('success', '登录成功')
            this.$router.replace({path: cookies.get('TO_URL') || '/home/index'})
          } else if (response.code === 20006) {
            this.$confirm({
              title: '提示',
              okText: '确定',
              cancelText: '取消',
              content: '您还未绑定企业，是否立即创建企业？'
            }).then(() => {
              this.$router.replace({path: '/user/addCompany'})
            }).catch(() => {
              this.submit = '登 录'
            })
          } else if (response.code === 303) {
            this.notify('danger', '密码错误')
            this.submit = '登 录'
          } else {
            this.submit = '登 录'
            this.notify('danger', response.message)
          }
        }).catch((error) => {
          this.loading = false
          this.submit = '登 录'
          this.notify('danger', error.message)
        })
      },
      notify (type, content) {
        /**
         * 封装一个弹出消息
         * param {String} type 类型
         * param {String} content 内容
         */
        this.$notify({type, content, dismissible: false, duration: 1000})
      }
    }
  }

</script>
