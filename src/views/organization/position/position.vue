<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li id="undoneTab" class="active">
          <a>职位列表</a>
        </li>
      <!--   <li class="pull-right"><a href="javascript:void(0);" @click="addModal=true" @hide="addModalClose"> <span class="fa fa-plus"></span> 新增职位</a></li>
 -->
        <li class="pull-right" v-for="item in menuPower">
          <!-- 权限标识是否显示新增职位sys.posi.add -->
          <a href="javascript:;" v-show="item.permission === 'sys.posi.add'"
          @click="addModal=true">
            <span class="fa fa-plus"></span> 新增职位
          </a>
        </li>
      </ul>
    </div>
    <div class="main">
      <dataTable ref="table" :tool="tool" :data="jobList.data" :page="jobList.page" @pageChange="tableChange" :columns="columns"></dataTable>
    </div>
    <modal v-model="addModal" :title="editModal ? '编辑职位' : '新增职位'" @hide="addModalClose" ref="modal" id="add_modal">
      <form class="form-horizontal">
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"><span class="text-danger">* </span>职位名称</label>
          <div class="col-sm-10">
            <input v-model="addForm.name" type="text" class="form-control">
          </div>
        </div>
      </form>
      <div slot="footer">
        <btn type="primary" @click="addSubmit">{{submit.text}}</btn>
        <btn @click="addModal=false">取消</btn>
      </div>
    </modal>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import api from 'src/api'
import dataTable from 'components/table/table.vue'
import { getUserPowerMenu } from 'util/util'
export default {
  name: 'position',
  title() {
    return '职位'
  },
  data() {
    const vm = this
    return {
      menuPower: [],
      param: {
        pager: true,
        pageSize: 20,
        pageIndex: 1
      },
      editModal: false,
      addModal: false,
      addForm: {
        name: '',
        parentId: 0
      },
      submit: {
        text: '添加'
      },
      tool: [],
      columns: [{
        text: '编号',
        key: 'id',
        width: '100px',
        align: 'center'
      }, {
        text: '职位名称',
        key: 'name',
        align: 'center'
      }, {
        text: '操作',
        align: 'center',
        width: '160px',
        render: (h, params) => {
          const arr = vm.renderHtml(h, params)
          return h('div', arr)
        }
      }]
    }
  },
  components: {
    dataTable
  },
  mounted() {
    console.log('客户端~~~~~职位', this.jobList)
  },
  computed: {
    ...mapGetters({
      jobList: 'jobList',
      userStatus: 'getUserStatus'
    })
  },
  created() {
    // 获取用户权限菜单、按钮
    const status = this.userStatus
    const menus = getUserPowerMenu(status, this.$route.path, '/organization/position')
    this.menuPower = menus
  },
  asyncData({ store, route }) {
    let param = {
      pager: true,
      pageIndex: 1,
      pageSize: 20
    }
    return store.dispatch('isJob', param)
  },
  methods: {
    ...mapActions([
      'isJob'
    ]),
    renderHtml(h, params) {
      let arr = []
      for (let item of this.menuPower) {
        const permission = item.permission
        console.log(permission)
        switch (permission) {
          case 'sys.posi.edit':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0);',
                title: '编辑职位'
              },
              on: {
                click: () => {
                  this.editModal = true
                  this.submit.text = '编辑'
                  this.addModal = true
                  this.addForm.id = params.id
                  this.addForm.name = params.name
                }
              }
            }, [
              h('i', {
                class: 'glyphicon glyphicon-pencil'
              })
            ]))
            break
          case 'sys.posi.del':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0);',
                title: '删除职位'
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
       * 添加部门  编辑部门
       */
      let vm = this
      let url = ''
      if (vm.editModal) {
        // 编辑
        url = '/position/update'
      } else {
        // 添加
        url = '/position/add'
      }
      api.post(url, vm.addForm).then((response) => {
        if (response.code === 200) {
          vm.editModal = false
          vm.addModal = false
          this.$notify({
            type: 'success',
            content: vm.submit.text + '成功'
          })
          vm.submit.text = '添加'
          this.isJob(this.param)
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
       * 删除职位
       */
      let vm = this
      this.$confirm({
        title: '提示',
        okText: '确定',
        cancelText: '取消',
        content: '您确定删除职位吗？'
      }).then(() => {
        vm.doDel(data)
      }).catch(() => {})
    },
    doDel(data) {
      /**
       * 执行删除部门
       */
      let param = {
        id: data.id
      }
      api.post('/position/delete', param).then((response) => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            content: '删除成功'
          })
          this.isJob(this.param)
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
    tableChange(data) {
      /**
       * 改变分页
       */
      this.$refs.table.loading = true
      if (data) this.param.pageIndex = data
      this.isJob(this.param)
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
