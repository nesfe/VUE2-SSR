<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li id="undoneTab" class="active">
          <a>浏览分组</a>
        </li>
        <!-- <li class="pull-right"><a href="javascript:void(0);" @click="addModal=true" @hide="addModalClose"> <span class="fa fa-plus"></span> 新增分组</a></li> -->
        <li class="pull-right" v-for="item in menuPower">
          <!-- 权限标识是否显示新增分组sys.power.add -->
          <a href="javascript:;" v-show="item.permission === 'sys.power.add'" @click="addModal=true">
            <span class="fa fa-plus"></span> 新增分组
          </a>
        </li>
      </ul>
    </div>
    <div class="main">
      <dataTable ref="table" :tool="tool" :data="list.data" :currentPage="currentPage" @pageChange="tableChange" :columns="columns"></dataTable>
    </div>
    <modal v-model="addModal" :title="editModal ? '编辑分组' : '新增分组'" @hide="addModalClose" ref="modal" id="add_modal">
      <formData ref="addForm" class="form-horizontal">
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"><span class="text-danger">* </span>分组名称</label>
          <div class="col-sm-10">
            <input v-model="addForm.name" type="text" class="form-control" validate="required" fh="fh_name">
            <span class="falseHints" id="fh_name"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">分组描述</label>
          <div class="col-sm-10">
            <textarea v-model="addForm.description" class="form-control" rows="3"></textarea>
          </div>
        </div>
      </formData>
      <div slot="footer">
        <btn type="primary" @click="addSubmit">{{submit.text}}</btn>
        <btn @click="addModal=false">取消</btn>
      </div>
    </modal>
    <!-- <modal v-model="moduleModal" title="权限维护" @hide="moduleModal=false" ref="modal" id="module_modal" size="lg" :footer="false">
      <module-power></module-power>
    </modal> -->
    <modal v-model="copyModal" title="复制分组" @hide="copyModal=false" ref="modal" size="lg" :footer="false">
      <formData ref="copyForm" class="form-horizontal">
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"><span class="text-danger">* </span>分组名称</label>
          <div class="col-sm-10">
            <input v-model="copyForm.name" type="text" class="form-control" validate="required" fh="fh_name_copy">
            <span class="falseHints" id="fh_name_copy"></span>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">分组描述</label>
          <div class="col-sm-10">
            <textarea v-model="copyForm.description" class="form-control" rows="3"></textarea>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">选项</label>
          <div class="col-sm-10">
            <label class="control-label">
              <input type="checkbox" :checked="copyForm.copyMenu" @change="copyForm.copyMenu = !copyForm.copyMenu"> 复制权限
            </label>
            <label class="control-label">
              <input type="checkbox" :checked="copyForm.copyUser" @change="copyForm.copyUser = !copyForm.copyUser"> 复制用户
            </label>
          </div>
        </div>
      </formData>
      <div slots="footer">
        <label class="col-sm-2"></label>
        <btn @click="doCopy" type="primary">保存</btn>
      </div>
    </modal>
    <modal v-model="memberModal" title="成员维护" ref="modal" size="lg" :footer="false">
      <memberData :groupId="groupId" :groupMenberList="groupMenberList" @save="memberSave" v-if="memberModal"></memberData>
    </modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import api from 'src/api'
// import modulePower from '../components/modulePower.vue'
import dataTable from 'components/table/table.vue'
import formData from 'components/form/form.vue'
import memberData from '../components/number.vue'
import { getUserPowerMenu } from 'util/util'
export default {
  name: 'power',
  data() {
    const vm = this
    return {
      menuPower: [],
      USER: '',
      currentPage: 1,
      totalPage: 99,
      editModal: false,
      addModal: false,
      numberModal: false,
      moduleModal: false,
      copyModal: false,
      memberModal: false,
      groupId: '',
      addForm: {
        name: '',
        description: ''
      },
      copyForm: {
        name: '',
        description: '',
        groupId: '',
        copyMenu: false,
        copyUser: false
      },
      submit: {
        text: '添加'
      },
      tool: [],
      columns: [{
        text: '编号',
        key: 'id',
        align: 'center'
      }, {
        text: '分组名称',
        key: 'name',
        align: 'center',
        width: '200px'
      }, {
        text: '分组描述',
        key: 'description',
        align: 'center',
        width: '300px'
      }, {
        text: '用户列表',
        key: 'memberList',
        width: '380px',
        render: (h, params) => {
          let list = ''
          if (params.memberList) {
            params.memberList.forEach(function(item) {
              list += item.truename + ' '
            })
          }
          return list
        }
      }, {
        text: '操作',
        align: 'center',
        width: 144,
        render: (h, params) => {
          const arr = vm.renderHtml(h, params)
          return h('div', arr)
        }
      }]
    }
  },
  components: {
    // modulePower,
    dataTable,
    formData,
    memberData
  },
  mounted() {
    // 客户端请求axios
    console.log('客户端获取权限组列表结果~~', this.list)
  },
  computed: {
    ...mapGetters({
      list: 'powerGroupList',
      groupMenberList: 'groupMenberList',
      userStatus: 'getUserStatus'
    })
  },
  asyncData({ store, route }) {
    return store.dispatch('isPowerGroupList')
  },
  created() {
    // 获取用户权限菜单、按钮
    const status = this.userStatus
    const menus = getUserPowerMenu(status, this.$route.path, '/organization/power')
    this.menuPower = menus
  },
  methods: {
    ...mapActions([
      'isPowerGroupList',
      'isGroupMemberList'
    ]),
    renderHtml(h, params) {
      let arr = []
      for (let item of this.menuPower) {
        const permission = item.permission
        console.log(permission)
        switch (permission) {
          case 'sys.power.views':
            arr.push(h('router-link', {
              attrs: {
                to: '/organization/power/view/' + params.id,
                title: '视图维护'
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-eye-open'
              })
            ]))
            break
          case 'sys.power.power':
            arr.push(h('router-link', {
              attrs: {
                to: '/organization/power/editPower/' + params.id,
                title: '权限维护'
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-lock'
              })
            ]))
            break
          case 'sys.power.members':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0);',
                title: '成员维护'
              },
              on: {
                click: () => {
                  this.openMemberModal(params)
                }
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-user'
              })
            ]))
            break
          case 'sys.power.edit':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0);',
                title: '编辑分组'
              },
              on: {
                click: () => {
                  this.editModal = true
                  this.submit.text = '编辑'
                  this.addModal = true
                  this.addForm.id = params.id
                  this.addForm.name = params.name
                  this.addForm.description = params.description
                }
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-pencil'
              })
            ]))
            break
          case 'sys.power.copy':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0);',
                title: '复制分组'
              },
              on: {
                click: () => {
                  this.openCopyModal(params)
                }
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-book'
              })
            ]))
            break
          case 'sys.power.del':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0);',
                title: '删除'
              },
              on: {
                click: () => {
                  this.delGroup(params)
                }
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-remove'
              })
            ]))
            break
        }
      }
      return arr
    },
    addSubmit() {
      /**
       * 添加分组  编辑分组
       */
      let fo = this.$refs.addForm.validate()
      if (!fo) return false
      let url = ''
      if (this.editModal) {
        // 编辑
        url = '/group/update'
      } else {
        // 添加
        this.addForm.type = 1
        url = '/group/add'
      }
      api.post(url, this.addForm).then((response) => {
        if (response.code === 200) {
          this.submit.text = '添加'
          this.editModal = false
          this.addModal = false
          this.isPowerGroupList()
          this.$notify({
            type: 'success',
            content: '操作成功'
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
    openMemberModal(data) {
      this.groupId = data.id
      this.isGroupMemberList({ groupId: data.id }).then(() => {
        this.memberModal = true
      })
    },
    memberSave() {
      this.memberModal = false
      this.isPowerGroupList()
    },
    openCopyModal(data) {
      this.copyForm.name = data.name
      this.copyForm.description = data.description
      this.copyForm.groupId = data.id
      this.copyModal = true
    },
    doCopy() {
      /**
       * 执行复制分组
       */
      let fo = this.$refs.copyForm.validate()
      if (!fo) return false
      api.post('/group/copy', this.copyForm).then((response) => {
        if (response.code === 200) {
          this.copyModal = false
          this.isPowerGroupList()
          this.$notify({
            type: 'success',
            content: '复制成功'
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
    delGroup(data) {
      /**
       * 删除分组
       */
      let vm = this
      this.$confirm({
        title: '提示',
        okText: '确定',
        cancelText: '取消',
        content: '您确定删除该分组吗？'
      }).then(() => {
        vm.doDel(data)
      }).catch(() => {})
    },
    doDel(data) {
      /**
       * 执行删除分组
       */
      let param = {}
      param.id = data.id
      api.post('/group/delete', param).then((response) => {
        if (response.code === 200) {
          this.isPowerGroupList()
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
    tableChange() {
      /**
       * 改变分页
       */
    },
    addModalClose() {
      /**
       * 弹窗关闭
       */
      let vm = this
      vm.editModal = false
      vm.submit.text = '添加'
      vm.addForm = {}
      vm.addForm.name = ''
      vm.addForm.description = ''
    }
  }
}

</script>
<style lang="less">
.main {
  padding: 20px;
}

#add_modal {
  .control-label {
    text-align: left;
  }
}

.table-icon {
  margin-left: 5px;
}

</style>
