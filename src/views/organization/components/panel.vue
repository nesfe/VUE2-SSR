<template>
  <div class="">
    <div class="panel panel-default">
      <div class="panel-heading">
        <span class="glyphicon glyphicon-list-alt"></span><span class="panel-heading-txt">{{title?title:'部门结构'}}</span>
      </div>
      <div class="panel-body">
        <div class="panel-item" v-for="item in departmentList.data">
          <a href="javascript:void(0);" @click="getchildren(item.id)">·{{item.name}}</a>
          <a class="panel-btn" href="javascript:void(0);" v-if="department" @click="doEdit(item)" title="编辑部门">编辑</a>
          <a class="panel-btn" href="javascript:void(0);" v-if="department" @click="doDelete(item)" title="删除部门">删除</a>
        </div>
        <div class="panel-item pull-right" v-if="user">
          <router-link to="/organization/department">维护部门结构</router-link>
        </div>
      </div>
    </div>
    <modal v-model="editModal" title="编辑部门" @hide="" ref="modal" id="add_modal">
      <form class="form-horizontal">
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label"><span class="text-danger">* </span>上级部门</label>
          <div class="col-sm-10">
            <select class="form-control">
              <option>/</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">部门名称</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="departmentForm.name">
          </div>
        </div>
        <div class="form-group">
          <label for="name" class="col-sm-2 control-label">负责人</label>
          <div class="col-sm-10">
            <select class="form-control">
              <option>/</option>
            </select>
          </div>
        </div>
      </form>
      <div slot="footer">
        <btn type="primary" @click="editSubmit">保存</btn>
        <btn @click="editModal=false">取消</btn>
      </div>
    </modal>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import api from 'src/api'
  export default {
    data () {
      return {
        editModal: false,
        departmentForm: {
          id: '',
          name: '',
          parentId: '',
          chargePerson: '',
          companyId: ''
        }
      }
    },
    props: {
      user: {
        type: Boolean
      },
      department: {
        type: Boolean
      },
      title: {
        type: String
      }
    },
    computed: {
      ...mapGetters({
        departmentList: 'departmentList',
        state: 'projectState'
      })
    },
    mounted () {
      // 客户端请求axios
      console.log('客户端获取部门列表结果~~', this.departmentList)
    },
    asyncData ({store}) {
      // 服务端请求axios
      return store.dispatch('isDepartment')
    },
    methods: {
      doEdit (datas) {
        /**
          * 部门编辑
         **/
        let vm = this
        vm.editModal = true
        console.log(datas)
        vm.departmentForm.id = datas.id
        vm.departmentForm.parentId = datas.parentId
        vm.departmentForm.name = datas.name
        vm.departmentForm.companyId = datas.companyId
      },
      editSubmit () {
        /**
          * 部门编辑提交
         **/
        let vm = this
        api.post('/department/update', vm.departmentForm).then((response) => {
          if (response.code === 200) {
            vm.editModal = false
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
      doDelete () {
        /**
          * 部门删除
         **/
        this.$confirm({
          title: '提示',
          okText: '确定',
          cancelText: '取消',
          content: '确定要删除此部门吗？'
        }).then(() => {
        }).catch(() => {
          // this.$notify('Delete canceled.')
        })
      },
      getchildren (id) {
        this.$emit('art-click', id)
      }
    }
  }
</script>
<style lang="less">
@gray-a: grey;
.panel-heading-txt {
  padding-left:5px;
}
.panel-item {
  padding:5px 0;
  a {
    text-decoration: none;
  }
  .panel-btn {
    color: @gray-a;
    padding-left:10px;
  }
}
</style>
