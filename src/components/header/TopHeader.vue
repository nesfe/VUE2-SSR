<template>
  <div id="topbar" class="topbar">
    <div id="topnav" class="topnav pull-right">
      <dropdown tag="div" class="tags">
        <a class="dropdown-toggle" role="button">{{users.name}}<span class="caret"></span></a>
        <template slot="dropdown">
          <li><a role="button" @click="mineSureModel = true">个人档案</a></li>
          <li><a role="button" @click="editPassModel = true">修改密码</a></li>
        </template>
      </dropdown>
      <a class="tags" href="javascript:void(0);" @click="signOut">退出</a>
    </div>
    <h5 class="companyname">{{company.name}}管控平台</h5>
    <modal v-model="mineSureModel" :footer="false">
      <span slot="title">我的档案</span>
      <formData class="form-horizontal sure-form" ref="editMineSureForm">
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"> 用户</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" v-model="sureFrom.name" :disabled="isDisabled" validate="required" fh="fh_name">
            <span class="falseHints" id="fh_name"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"> 手机</label>
          <div class="col-sm-9">
            <input type="tel" class="form-control" maxlength="11" v-model="sureFrom.mobile" :disabled="isDisabled" validate="mobile" fh="fh_mobile">
            <span class="falseHints" id="fh_mobile"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"> 性别</label>
          <div class="col-sm-9" v-if="isDisabled">
            <input type="text" class="form-control" v-model="sureFrom.sex === 1 ? '男' : '女'" :disabled="isDisabled">
          </div>
          <div class="col-sm-9" v-else>
            <selectData v-model="sureFrom.sex" :data="[{id: 1, name: '男'}, {id: 2, name: '女'}]" k="id" v="name" placeholder="请选择性别">
            </selectData>
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-2 control-label"> 所属部门</label>
          <div class="col-sm-9" v-if="isDisabled">
            <input type="text" class="form-control" v-model="sureFrom.departmentId.name" :disabled="isDisabled">
          </div>
          <div class="col-sm-9" v-else>
            <selectData v-model="sureFrom.departmentId.id" :data="departmentList.data" k="id" v="name" placeholder="请选择部门" :searchShow="true" :maxH="true">
            </selectData>
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-2 control-label">职位</label>
          <div class="col-sm-9" v-if="isDisabled">
            <input type="text" class="form-control" v-model="sureFrom.positionId.name" :disabled="isDisabled">
          </div>
          <div class="col-sm-9" v-else>
            <selectData v-model="sureFrom.positionId.id" :data="jobList.data" k="id" v="name" placeholder="请选择职位" :searchShow="true" :maxH="true">
            </selectData>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"> 邮箱</label>
          <div class="col-sm-9">
            <input type="email" class="form-control" v-model="sureFrom.email" :disabled="isDisabled">
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"> QQ</label>
          <div class="col-sm-9">
            <input type="tel" class="form-control" maxlength="10" v-model="sureFrom.qq" :disabled="isDisabled">
          </div>
        </div>
        <div class="form-group">
          <label for="sex" class="col-sm-2 control-label"> 入职日期</label>
          <div class="col-sm-9" v-if="isDisabled">
            <input type="text" class="form-control" v-model="sureFrom.joinTime" :disabled="isDisabled">
          </div>
          <div class="col-sm-9" v-else>
            <dropdown>
              <div class="input-group">
                <input class="form-control" type="text" readonly v-model="sureFrom._joinTime">
                <div class="input-group-btn">
                  <btn class="dropdown-toggle"><i class="glyphicon glyphicon-calendar"></i></btn>
                </div>
              </div>
              <template slot="dropdown">
                <li>
                  <date-picker v-model="sureFrom._joinTime" />
                </li>
              </template>
            </dropdown>
          </div>
        </div>
        
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">&nbsp;</label>
          <div class="col-sm-9">
            <btn type="primary" v-if="isDisabled" @click="isDisabled = false">编辑</btn>
            <btn type="primary" v-else @click="editMineSure">完成</btn>
            <btn @click="mineSureModel = false; isDisabled = true">取消</btn>
          </div>
        </div>
      </formData>
    </modal>
    <!-- 修改密码 -->
    <modal v-model="editPassModel" :footer="false">
      <span slot="title">修改密码</span>
      <formData class="form-horizontal send-form" ref="editPasswordForm">
        <div class="form-group">
          <label for="name" class="col-sm-3 control-label"> 用户</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" :value="users.username || users.name" disabled>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-3 control-label"> 原密码</label>
          <div class="col-sm-8">
            <input type="password" class="form-control" v-model="ruleForm.oldPass" fn="fn_oldPass" validate="required" fh="fn_oldPass">
            <span class="falseHints" id="fn_oldPass"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-3 control-label"> 新密码</label>
          <div class="col-sm-8">
            <input type="password" class="form-control" v-model="ruleForm.newPass" fn="fn_newPass" validate="required" fh="fn_newPass">
            <span class="falseHints" id="fn_newPass"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-3 control-label"> 请重复密码</label>
          <div class="col-sm-8">
            <input type="password" class="form-control" v-model="ruleForm.newPassOk" fn="fn_newPassOk" validate="required" fh="fn_newPassOk">
            <span class="falseHints" id="fn_newPassOk"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-3 control-label">&nbsp;</label>
          <div class="col-sm-8">
            <btn type="primary" @click="callback">确认</btn>
          </div>
        </div>
      </formData>
    </modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import api from 'src/api'
import cookies from 'js-cookie'
import formData from 'components/form/form.vue'
import selectData from 'components/form/select.vue'
export default {
  name: 'TopHeader',
  data() {
    return {
      mineSureModel: false,
      editPassModel: false,
      isDisabled: true,
      userD: {},
      ruleForm: {
        oldPass: '',
        newPass: '',
        newPassOk: ''
      },
      sureFrom: {
        departmentId: { id: '', name: '' },
        positionId: { id: '', name: '' }
      }
    }
  },
  props: {
    company: {
      type: Object
    },
    users: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      userDetail: 'getUserDetail', // 获取用户详情
      departmentList: 'departmentList', // 部门
      jobList: 'jobList' // 职位
    })
  },
  watch: {
    mineSureModel(val) {
      // 打开编辑个人档案请求下拉数据
      if (typeof val === 'boolean' && val) {
        Promise.all([
          this.$store.dispatch('doUserDetail'),
          this.$store.dispatch('isJob'),
          this.$store.dispatch('isDepartment')
        ])
      }
    },
    userDetail(val) {
      this.sureFrom = {
        name: val.name,
        email: val.email,
        sex: val.sex,
        qq: val.qq,
        mobile: val.mobile,
        joinTime: new Date(val.joinTime).Format('yyyy-MM-dd'),
        _joinTime: new Date(val.joinTime).Format('yyyy-MM-dd'),
        departmentId: {
          id: val.department ? val.department.id : '',
          name: val.department ? val.department.name : ''
        },
        positionId: {
          id: val.position ? val.position.id : '',
          name: val.position ? val.position.name : ''
        }
      }
      console.log(this.sureFrom)
    }
  },
  created() {},
  mounted() {},
  components: { formData, selectData },
  methods: {
    notify(type, content) {
      /**
       * 封装一个弹出消息
       * param {String} type 类型
       * param {String} content 内容
       */
      this.$notify({ type, content, dismissible: false, duration: 1000 })
    },
    signOut() {
      this.$confirm({
        title: '提示',
        okText: '确定',
        cancelText: '取消',
        content: '确定要退出登录吗？'
      }).then(() => {
        this.doSignout()
      }).catch(() => {})
    },
    doSignout() {
      api.post('/signout').then((response) => {
        if (response.code === 200) {
          cookies.remove('select_user')
          // cookies.remove('TO_URL')
          this.$router.replace({ path: '/user/login' })
        } else {
          this.$notify({
            type: 'danger',
            content: response.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    callback(item) {
      const data = this.ruleForm
      let formNull = this.$refs.editPasswordForm.validate()
      if (!formNull) return false
      if (data.newPass === data.newPassOk) {
        this.editPassword(data)
      } else {
        this.editPassModel = true
        this.$notify({
          type: 'danger',
          content: '密码不一致'
        })
      }
    },
    editMineSure() {
      /**
       * 保存提交
       **/

      let validate = this.$refs.editMineSureForm.validate()
      // if (!this.sureFrom.departmentId.id || !this.sureFrom.departmentId.name) {
      //   this.notify('danger', '请选择部门')
      // } else if (!this.sureFrom.positionId.id || !this.sureFrom.positionId.name) {
      //   this.notify('danger', '请选择职位')
      // }
      if (!validate) return

      this.sureFrom.joinTime = new Date(this.sureFrom._joinTime).getTime()
      this.sureFrom.departmentId = this.sureFrom.departmentId.id
      this.sureFrom.positionId = this.sureFrom.positionId.id
      // if (this.sureFrom) return
      api.post('/member/update', this.sureFrom).then((response) => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            content: '编辑成功'
          })
          if (this.$route.path === '/organization/index') {
            this.$store.dispatch(`doMember`)
          }
          // 修改成功重新获取用户状态
          this.$store.dispatch(`doUsers`)
          this.mineSureModel = false
          this.isDisabled = true
          console.log(response)
        } else {
          this.$notify({
            type: 'danger',
            content: response.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    editPassword(params) {
      // console.log(this.$refs.editPasswordForm)
      const param = {
        oldPassword: params.oldPass,
        newPassword: params.newPass
      }
      console.log(param)
      api.post('member/resetPassword', param).then((response) => {
        // console.log(response)
        if (response.code === 200) {
          this.editPassModel = false
          this.$notify({
            type: 'success',
            content: '密码修改成功，即将退出登录，请重新登录！'
          })
          setTimeout(() => {
            this.doSignout()
          }, 3000)
        } else {
          this.$notify({
            type: 'danger',
            content: response.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

</script>
<style lang="less">
.topbar {
  h5 {
    color: #fc0;
    font-weight: normal;
    margin: 0;
  }
}

.topnav {
  margin-top: -6px;
  .tags {
    float: left;
    .dropdown-menu {
      min-width: auto;
      padding: 5px 0;
      li a {
        padding: 6px 20px;
        font-size: 12px;
        transition: all .3s;
        &:hover {
          background-color: #1e232f;
          color: #fff
        }
      }
    }
  }
  a {
    display: block;
    padding: 3px 6px;
    position: relative;
    color: #d1e4f2;
    text-decoration: none;
    &:hover {
      background-color: #3b465e;
    }
  }
}

.sure-form .form-control[disabled] {
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;
}

</style>
