<template>
  <div class="">
    <form class="">
      <table class="table table-form table-borderless">
        <tbody>
          <tr class="text-center">
            <td class="strong">模块</td>
            <td class="strong">方法</td>
            <td class="strong">权限分组</td>
          </tr>
          <tr valign="top">
            <td>
              <select v-model="module" name="module" id="module" size="10" @click="setModuleActions()" class="form-control power-select">
                <option value="index">首页</option>
                <option value="task">任务</option>
                <option value="dept">部门结构</option>
                <option value="group">权限分组</option>
                <option value="user">用户</option>
                <option value="admin">后台管理</option>
                <option value="extension">插件管理</option>
                <option value="custom">自定义</option>
                <option value="action">系统日志</option>
              </select>
            </td>
            <td id="actionBox">
              <select v-model="children" name="actions[]" id="" multiple="multiple" class="form-control index power-select">
                <option value="111">首页111</option>
              </select>
              <select name="actions[]" id="" multiple="multiple" class="form-control hidden task power-select">
                <option value="222">任务111</option>
              </select>
              <select name="actions[]" id="" multiple="multiple" class="form-control hidden dept power-select">
                <option value="333">部门结构111</option>
              </select>
            </td>
            <td>
              <select name="groups[]" id="groups" multiple="multiple" class="form-control power-select">
                <option value="1">管理员</option>
                <option value="2">研发</option>
                <option value="3">测试</option>
                <option value="4">项目经理</option>
                <option value="5">产品经理</option>
                <option value="6">研发主管</option>
                <option value="7">产品主管</option>
                <option value="8">测试主管</option>
                <option value="9">高层管理</option>
                <option value="10">其他</option>
                <option value="11">guest</option>
                </select>
            </td>
          </tr>
          <tr>
            <td class="text-center" colspan="3">
               <button type="submit" id="submit" class="btn btn-primary">保存</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import panel from '../components/panel.vue'

export default {
  name: 'User',
  data () {
    return {
      module: '',
      children: []
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  },
  components: {
    panel
  },
  asyncData ({ store }) {
    // return store.dispatch('getUser', { loginName: 'jiel', passwd: '123456' })
  },
  methods: {
    setModuleActions () {
      let vm = this
      console.log('选中:', vm.module)
    }
  }
}
</script>
<style lang="less">
.table-borderless{
  tbody > tr > th,tbody > tr > td {
    border:none!important;
  }
  .power-select {
    height: 250px;
  }
}
</style>
