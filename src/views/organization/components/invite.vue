<template>
  <modal v-model="open" title="添加用户" @hide="closeModal" :footer="false">
    <formData ref="form" class="form-horizontal paddingRight">
      <div class="form-group">
        <label class="col-xs-2" align="right">手机号</label>
        <div class="col-xs-10">
          <input type="text" v-model="searchData" class="form-control" placeholder="请输入手机号" validate="mobile" fh="fh_mobile">
          <span class="falseHints" id="fh_mobile"></span>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2" align="right">验证码</label>
        <div class="col-xs-7">
          <input type="text" v-model="verifyCode" class="form-control" placeholder="请输入验证码" validate="required" fh="fh_verifyCode">
          <span class="falseHints" id="fh_verifyCode"></span>
        </div>
        <div class="col-xs-3">
          <btn block type="primary" @click="getCode" :disabled="isDisabled">{{btnText}}</btn>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2"></label>
        <div class="col-xs-10">
          <btn type="primary" @click="validateCode" :disabled="inviteDisabled">邀请</btn>
        </div>
      </div>
    </formData>
  </modal>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import api from 'src/api'
  import formData from 'components/form/form.vue'
  export default {
    data () {
      return {
        searchUser: {},
        searchData: '',
        verifyCode: '',
        btnText: '获取验证码',
        isDisabled: false,
        open: false,
        inviteDisabled: true
      }
    },
    props: {
      value: Boolean
    },
    mounted () {
      this.open = !!this.value
    },
    watch: {
      'value' (val, oldValue) {
        this.open = val
      }
    },
    computed: {
      ...mapGetters({
        // userList: 'getUserList' // 用户查询结果
      })
    },
    components: {formData},
    methods: {
      ...mapActions([
        'doUserList'
      ]),
      doSearch () {
        /**
         * 搜索用户
         */
        let vm = this
        api.post('/member/selectBymobile', {mobile: vm.searchData.trim()}).then((response) => {
          vm.searchUser = response.data
          if (vm.searchUser && vm.searchUser.id) {
            vm.sendCode()
          } else {
            vm.notify('danger', '用户不存在')
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      getCode () {
        /**
         * 获取验证码验证
         */
        let vm = this
        if (!vm.searchData.trim()) {
          vm.notify('danger', '请输入手机号')
          return false
        }
        vm.doSearch()
      },
      sendCode () {
        /**
         * 获取验证码
         */
        let vm = this
        api.post('/sms/send', {mobile: vm.searchData.trim()}).then((response) => {
          if (response.code === 200) {
            vm.inviteDisabled = false
            vm.isDisabled = true
            // 读秒倒计时
            vm.btnText = '60s'
            let numTime = 60
            let deleteTime = () => {
              if (vm.btnText !== '获取验证码' && vm.btnText !== '1s' && numTime > 0) {
                numTime--
                vm.btnText = numTime + 's'
              } else {
                window.clearInterval(setCode)
                vm.btnText = '获取验证码'
                vm.isDisabled = false
                vm.inviteDisabled = true
                numTime = 60
              }
            }
            var setCode = window.setInterval(deleteTime, 1000)
          } else {
            vm.notify('danger', response.message)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      validateCode () {
        /**
         * 验证验证码
         */
        let vm = this
        let fo = this.$refs.form.validate()
        if (!fo) return false
        api.post('/sms/checkCode', {mobile: vm.searchData.trim(), verifyCode: vm.verifyCode.trim()}).then((response) => {
          if (response.code === 200) {
            vm.doSubmit()
          } else {
            vm.notify('danger', response.message)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      doSubmit () {
        /**
         * 提交添加
         */
        let vm = this
        let param = {
          userId: vm.searchUser.id
        }
        api.post('/companyUser/add', param).then((response) => {
          vm.searchUser = {}
          console.log(vm.searchUser)
          if (response.code === 200) {
            vm.$emit('success')
            vm.closeModal()
            vm.doUserList()
            vm.notify('success', '邀请成功')
          } else {
            vm.notify('danger', response.message)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      closeModal () {
        /**
         * 关闭弹窗
         */
        this.open = false
        this.searchData = ''
        this.verifyCode = ''
        this.btnText = '获取验证码'
        this.isDisabled = false
        this.inviteDisabled = true
        this.$emit('input', false)
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
<style>
.paddingRight{
  padding-right: 50px !important
}
</style>
