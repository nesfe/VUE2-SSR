<template>
  <div class="">
    <div class="featurebar">
      <ul class="ul">
        <li id="undoneTab" class="active">
          <a href="javascript:;">用户列表</a>
        </li>
        <li class="pull-right" v-for="item in menuPower">
          <!-- 权限标识是否显示添加用户 sys.user.add -->
          <a href="javascript:;" v-show="item.permission === 'sys.user.add'"
          @click="inviteModal=true">
            <i class="fa fa-plus"></i> 添加用户
          </a>
        </li>
      </ul>
    </div>
    <div class="search-main">
      <form class="row">
        <div class="col-sm-3">
          <selectData v-model="param.departmentId" :data="departmentList.data" k="id" v="name" placeholder="请选择部门" :searchShow="true" :maxH="true" @change="doMember(param)">
          </selectData>
        </div>
        <div class="col-sm-3">
          <selectData v-model="param.positionId" :data="jobList.data" k="id" v="name" placeholder="请选择职位":searchShow="true" :maxH="true" @change="doMember(param)">
          </selectData>
        </div>
        <div class="col-sm-3">
          <input type="text" class="form-control" v-model="param.key" placeholder="请输入搜索关键字">
        </div>
        <div class="col-sm-3">
          <button type="button" class="btn btn-primary" @click="doMember(param)">搜索</button>
        </div>
      </form>
    </div>
    <div class="main-no-padding">
      <div class="col-lg-12">
        <dataTable ref="table" :tool="tool" :data="memberList.data" :page="page" @pageChange="tableChange" :columns="columns"></dataTable>
      </div>
    </div>
    <invite v-model="inviteModal" @art-code="doCodeModal" @success="doMember"></invite>
    <!-- <modal v-model="editModal" v-if="editModal" title="编辑用户" @hide="editModal=false" ref="modal" id="medit_modal" size="lg" :footer="false">
      <edit-user :userDatas="userDatas"></edit-user>
    </modal> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import api from 'src/api'
import cookies from 'js-cookie'
import dataTable from 'components/table/table.vue'
import selectData from 'components/form/select.vue'
import panel from '../components/panel.vue'
import invite from '../components/invite.vue'
import editUser from './edit.vue'
import { getUserPowerMenu } from 'util/util'
export default {
  name: 'User',
  title() {
    return '用户'
  },
  data() {
    const vm = this
    return {
      menuPower: [],
      param: {
        departmentId: '',
        positionId: '',
        key: '',
        pageSize: 20,
        pageIndex: 1
      },
      page: {
        total: 232,
        totalPage: 23,
        pageIndex: 1,
        pageSize: 20
      },
      icon: 'sitemap',
      // title: '部门结构',
      inviteModal: false,
      editModal: false,
      userDatas: '',
      // user_prop: true,
      tool: [],
      columns: [{
        text: '',
        type: 'selection',
        align: 'center'
      }, {
        text: '真实姓名',
        key: 'name',
        align: 'center'
      }, {
        text: '用户名',
        key: 'member',
        align: 'center',
        render: (h, params) => {
          return params.member.name
        }
      }, {
        text: '部门',
        key: 'department',
        align: 'center',
        render: (h, params) => {
          if (params.department) return params.department.name
        }
      }, {
        text: '职位',
        key: 'position',
        align: 'center',
        render: (h, params) => {
          if (params.position) return params.position.name
        }
      }, {
        text: '邮箱',
        key: 'email',
        align: 'center'
      }, {
        text: 'QQ',
        key: 'qq',
        align: 'center'
      }, {
        text: '性别',
        key: 'sex',
        align: 'center',
        render: (h, params) => {
          if (params.sex === 1) {
            return '男'
          } else {
            return '女'
          }
        }
      }, {
        text: '入职日期',
        key: 'member',
        align: 'center',
        render: (h, params) => {
          return new Date(params.joinTime).Format('yyyy-MM-dd')
        }
      }, {
        text: '操作',
        align: 'center',
        render: (h, params) => {
          const arr = vm.renderHtml(h, params)
          return h('div', arr)
        }
      }]
    }
  },
  computed: {
    ...mapGetters({
      departmentList: 'departmentList',
      jobList: 'jobList',
      memberList: 'getMember',
      userStatus: 'getUserStatus'
    })
  },
  components: {
    dataTable,
    selectData,
    panel,
    editUser,
    invite
  },
  created() {
    this.getPage()
    console.log('客户端获取用户列表数据', this.memberList)
    console.log('客户端获取部门列表数据', this.departmentList)
    console.log('客户端获取职位列表数据', this.jobList)
    console.log('客户端获取登录用户信息', this.userStatus)
    const status = this.userStatus
    const menus = getUserPowerMenu(status, this.$route.path, '/organization/index')
    this.menuPower = menus
  },
  asyncData({ store }) {
    // 服务端
    // 获取所有用户列表
    return Promise.all([store.dispatch('doMember'), store.dispatch('isDepartment'), store.dispatch('isJob')])
  },
  methods: {
    ...mapActions([
      'doMember',
      'doQrCode'
    ]),
    cookieUser(params) {
      cookies.set('select_user', params)
      this.$router.push('/organization/editUser/' + params.id)
    },
    renderHtml(h, params) {
      let arr = []
      for (let item of this.menuPower) {
        const permission = item.permission
        console.log(permission)
        switch (permission) {
          case 'sys.user.edit':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:;',
                title: '编辑'
              },
              on: {
                click: () => {
                  this.cookieUser(params)
                }
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-pencil'
              })
            ]))
            break
          case 'sys.user.del':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:;',
                title: '删除'
              },
              on: {
                click: () => {
                  if (this.userStatus.data.user.userId === params.userId) return
                  this.del(params)
                }
              }
            }, [
              h('i', {
                class: this.userStatus.data.user.userId === params.userId ? 'disabled glyphicon glyphicon-remove' : 'glyphicon glyphicon-remove'
              })
            ]))
            break
        }
      }
      return arr
    },
    getPage() {
      /**
       * 获取分页数据
       **/
      this.page.total = this.memberList.total
      this.page.totalPage = this.memberList.current
    },
    del(data) {
      /**
       * 删除用户
       */
      let vm = this
      this.$confirm({
        title: '提示',
        okText: '确定',
        cancelText: '取消',
        content: '您确定删除该用户吗？'
      }).then(() => {
        vm.doDel(data)
      }).catch(() => {})
    },
    doDel(data) {
      /**
       * 执行删除用户
       */
      console.log(data)
      let vm = this
      let param = {}
      param.id = data.id
      api.get('/companyUser/delete', param).then((response) => {
        if (response.code === 200) {
          vm.doMember()
          this.$notify({
            type: 'success',
            content: '删除成功'
          })
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
    doCodeModal() {
      /**
       * 生成二维码
       */
      let vm = this
      vm.doQrCode({ projectId: parseInt(vm.$route.params.id), content: '/user/acceptInvite' })
      vm.codeModal = true
    },
    tableChange(data) {
      /**
       * 分页
       **/
      this.$refs.table.loading = true
      if (data) this.param.pageIndex = data
      this.doMember(this.param)
    }
  }
}

</script>
<style lang="less">
.main-no-padding {
  padding: 20px 5px;
  overflow: hidden;
}

.checkbox-all {
  padding-left: 25px;
  line-height: 34px;
}

.art-pagination {
  margin: 0;
  padding: 0;
}

</style>
