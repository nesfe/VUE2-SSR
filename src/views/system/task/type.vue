<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li><a href="javascript:;" @click="search=!search"><i class="fa fa-search"></i> 搜索</a></li>
        <li class="fr" v-for="item in menuPower">
          <a href="javascript:;" v-show="item.permission === 'sys.tasktype.add'" @click="addType">
            <i class="fa fa-plus"></i> 创建类型
          </a>
        </li>
      </ul>
    </div>
    <div class="search-main" v-show="search">
      <form class="form-inline" action="javascript:;" @submit="submitEvent">
        <div class="form-group input-group-sm">
          <input type="text" class="form-control" v-model="param.name" placeholder="请输入类型名称">
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="isSystemTaskTypeList(param)">搜索</button>
        <div class="fr">
          <a href="javascript:;" class="close" @click="search=!search"><i class="fa fa-remove"></i></a>
        </div>
      </form>
    </div>
    <div class="main">
      <dataTable ref="table" :tool="tool" :data="state.data" :page="state.page" @pageChange="tableChange" :columns="columns"></dataTable>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import dataTable from 'components/table/table.vue'
import api from 'src/api'
import { getUserPowerMenu, getPermission } from 'util/util'
export default {
  name: 'taskType',
  asyncData({ store }) {
    return store.dispatch('isSystemTaskTypeList')
  },
  data() {
    const vm = this
    return {
      menuPower: [],
      search: false,
      tool: [],
      addModal: false,           // -- 是否显示增加任务
      columns: [{
        type: 'selection'
      }, {
        text: '任务类型名称',
        key: 'name'
      }, {
        text: '操作',
        width: 120,
        align: 'center',
        render: (h, row) => {
          const arr = vm.renderHtml(h, row)
          return h('div', arr)
        }
      }],
      param: {
        pageSize: 20,
        pageIndex: 1,
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      state: 'systemTaskTypeList',
      userStatus: 'getUserStatus'
    })
  },
  components: { dataTable },
  created() {
    // 获取用户权限菜单、按钮
    const status = this.userStatus
    const menus = getUserPowerMenu(status, this.$route.path, '/system/taskType')
    this.menuPower = menus
    this.toolEvent()
  },
  mounted() {
    console.log('服务端接收到的数据：', this.state)
  },
  methods: {
    ...mapActions([
      'isSystemTaskTypeList'
    ]),
    toolEvent () {
      let permission = getPermission(this.menuPower)
      if (permission.includes('sys.tasktype.del')) {
        this.tool.push({
          text: '删除',
          click: (data) => {
            console.log('要批量删除的数据', data)
            this.deleAll(data)
          }
        })
      }
    },
    renderHtml(h, params) {
      let arr = []
      for (let item of this.menuPower) {
        const permission = item.permission
        switch (permission) {
          case 'sys.tasktype.edit':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0)',
                title: '编辑'
              },
              on: { click: () => { this.edit(params) } }
            }, [
              h('span', { class: 'glyphicon glyphicon-pencil' })
            ]))
            break
          case 'sys.tasktype.del':
            arr.push(h('a', {
              attrs: {
                href: 'javascript:void(0);',
                title: '删除'
              },
              style: { marginLeft: '10px' },
              on: { click: () => { this.dele(params) } }
            }, [
              h('span', { class: 'glyphicon glyphicon-remove' })
            ]))
            break
        }
      }
      return arr
    },
    operRender(h, params) {
      /**
       * 操作数据绑定
       * 涉及到权限操作这边改为renderHtml方法 - zwq
       */
      let editB = h('a', {
        attrs: {
          href: 'javascript:void(0)',
          title: '编辑'
        },
        on: { click: () => { this.edit(params) } }
      }, [
        h('span', { class: 'glyphicon glyphicon-pencil' })
      ])
      let deleB = h('a', {
        attrs: {
          href: 'javascript:void(0);',
          title: '删除'
        },
        style: { marginLeft: '10px' },
        on: { click: () => { this.dele(params) } }
      }, [
        h('span', { class: 'glyphicon glyphicon-remove' })
      ])
      return h('div', [editB, deleB])
    },
    addType () {
      /**
       * 任务添加
       */
      let vm = this
      vm.$router.push('/system/typeAdd')
    },
    edit(params) {
      /**
       * 任务编辑
       */
      let vm = this
      vm.$router.push({
        path: '/system/typeAdd',
        query: params
      })
    },
    dele(params) {
      /**
       * 任务删除
       */
      let vm = this
      vm.$confirm({
        title: '提示',
        okText: '确定',
        cancelText: '取消',
        content: '您确定删除该任务类型吗？'
      }).then(() => {
        api.post('/taskType/delete', { ids: params.id }).then((res) => {
          if (res.code !== 200) {
            vm.notify('danger', res.message)
            return
          }
          console.log('👹任务删除返回数据：', res)
          vm.closeModel(1)
        }).catch((error) => {
          console.log(error)
        })
      }).catch(() => {})
    },
    deleAll(data) {
      /**
       * 任务删除多个
       */
      if (!data.length) return
      let vm = this
      let ids = ''
      data.forEach(function(item) {
        ids = `${ids}${item.id},`
      })
      ids = ids.substring(0, ids.length - 1)
      vm.dele({ id: ids })
    },
    submitEvent() {
      this.tableChange()
      return false
    },
    tableChange: function(data) {
      if (data) this.param.pageIndex = data
      this.$refs.table.loading = true
      this.isSystemTaskTypeList(this.param)
    },
    closeModel(num) {
      /**
       * 关闭添加任务
       */
      this.addModal = false
      if (num) this.isSystemTaskTypeList(this.param)
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
