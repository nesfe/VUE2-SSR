<template>
  <div class="">
    <div class="featurebar">
      <ul class="ul">
        <li id="undoneTab" class="active">
          <a href="javascript:;">编辑用户 {{datas.name}}</a>
        </li>
      </ul>
    </div>
    <div class="main-no-padding">
      <div class="form-content">
        <formData ref="editUserform" class="form-horizontal">
          <div class="form-group">
            <label for="name" class="col-sm-3 control-label"> 真实姓名</label>
            <div class="col-sm-9">
              <input type="text" v-model="datas.name" class="form-control" id="name">
            </div>
          </div>
          <div class="form-group">
            <label for="sex" class="col-sm-3 control-label"> 性别</label>
            <div class="col-sm-9">
              <selectData v-model="datas.sex" :data="[{id: 1, name: '男'}, {id: 2, name: '女'}]" k="id" v="name" placeholder="请选择性别">
              </selectData>
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-3 control-label"> 所属部门</label>
            <div class="col-sm-9">
              <selectData v-model="datas.departmentId" :data="departmentList.data" k="id" v="name" placeholder="请选择部门" :searchShow="true" :maxH="true">
              </selectData>
            </div>
          </div>
          <div class="form-group">
            <label for="" class="col-sm-3 control-label">职位</label>
            <div class="col-sm-9">
              <selectData v-model="datas.positionId" :data="jobList.data" k="id" v="name" placeholder="请选择职位" :searchShow="true" :maxH="true">
              </selectData>
            </div>
          </div>
          <div class="form-group">
            <label for="sex" class="col-sm-3 control-label"> 入职日期</label>
            <div class="col-sm-9">
              <dropdown>
                <div class="input-group">
                  <input class="form-control" type="text" readonly v-model="datas._joinTime">
                  <div class="input-group-btn">
                    <btn class="dropdown-toggle"><i class="glyphicon glyphicon-calendar"></i></btn>
                  </div>
                </div>
                <template slot="dropdown">
                  <li>
                    <date-picker v-model="datas._joinTime" />
                  </li>
                </template>
              </dropdown>
            </div>
          </div>
          <div class="form-group">
            <label for="email" class="col-sm-3 control-label"> 邮箱</label>
            <div class="col-sm-9">
              <input type="email" v-model="datas.email" class="form-control" id="email" validate="email">
            </div>
          </div>
          <div class="form-group">
            <label for="qq" class="col-sm-3 control-label"> QQ</label>
            <div class="col-sm-9">
              <input type="text" v-model="datas.qq" class="form-control" id="qq">
            </div>
          </div>
          <div class="form-group">
            <label for="passwd" class="col-sm-3 control-label"> 密码</label>
            <div class="col-sm-9">
              <input type="password" v-model="datas.passwd" class="form-control" id="passwd" autocomplete="new-password" validate="required">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-3"></label>
            <div class="col-sm-9">
              <btn type="primary" @click="submits">保存</btn>
              <btn @click="doBack">返回</btn>
            </div>
          </div>
        </formData>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import formData from 'components/form/form.vue'
import selectData from 'components/form/select.vue'
import api from 'src/api'
import cookies from 'js-cookie'

export default {
  name: 'User',
  title() {
    return '用户编辑'
  },
  data() {
    return {
      datas: {
        id: '',
        name: '',
        sex: 1,
        joinTime: '',
        _joinTime: '',
        email: '',
        qq: '',
        passwd: '',
        departmentId: '',
        positionId: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      departmentList: 'departmentList', // 部门
      jobList: 'jobList' // 职位
    })
  },
  components: { formData, selectData },
  created() {},
  asyncData({ store, route }) {
    return Promise.all([store.dispatch('isJob'), store.dispatch('isDepartment')])
  },
  mounted() {
    // 客户端
    this.cookieUser()
    console.log(this.departmentList)
  },
  methods: {
    cookieUser(params) {
      let users = JSON.parse(cookies.get('select_user'))
      this.datas.id = users.id
      this.datas.name = users.name
      this.datas.sex = users.sex
      this.datas._joinTime = new Date(users.joinTime).Format('yyyy-MM-dd')
      this.datas.email = users.email
      this.datas.qq = users.qq
      this.datas.passwd = users.member.passwd
      this.datas.departmentId = users.departmentId
      this.datas.positionId = users.positionId
      console.log('用户信息all', users)
    },
    sexChange(v) {
      console.log(v)
    },
    submits() {
      /**
       * 验证
       **/
      let validate = this.$refs.editUserform.validate()
      if (validate) {
        this.datas.joinTime = new Date(this.datas._joinTime).getTime()
        this.doSubmit()
      } else {
        return false
      }
    },
    doSubmit() {
      /**
       * 保存提交
       **/
      api.post('/companyUser/update', this.datas).then((response) => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            content: '编辑成功'
          })
          this.doBack()
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
    doBack() {
      /**
       * 返回
       **/
      this.$router.replace({ path: '/organization/index' })
    }
  }
}

</script>
<style lang="less">
.form-content {
  width: 40%;
  margin: 0 auto;
}

</style>
