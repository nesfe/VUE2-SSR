<template>
  <div>
    <div class="main">
      <dataTable ref="table" :data="projectList.data" :page="projectList.page" @pageChange="tableChange" :columns="columns"></dataTable>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import dataTable from 'components/table/table.vue'

  export default {
    name: 'myProject',
    title () {
      return '项目'
    },
    data () {
      return {
        param: {
          pageSize: 20,
          pageIndex: 1
        },
        columns: [{
          text: 'ID',
          key: 'id',
          width: '100px'
        }, {
          text: '项目代号',
          key: 'code'
        }, {
          text: '项目名称',
          key: 'name',
          render: (h, row) => {
            return h('a', {
              attrs: {
                href: 'javascript:;'
              },
              on: {
                click: () => {
                  window.sessionStorage.setItem('pid', row.id)
                  window.sessionStorage.setItem('pname', row.name)
                  window.location.href = '/project/task/' + row.id
                }
              }
            }, row.name)
          }
        }, {
          text: '开始日期',
          key: 'startTime',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('span', {}, new Date(params.startTime).Format('yyyy-MM-dd'))
          }
        }, {
          text: '结束日期',
          key: 'endTime',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('span', {}, new Date(params.endTime).Format('yyyy-MM-dd'))
          }
        }, {
          text: '状态',
          key: 'status',
          render: (h, params) => {
            if (params.delayStatus === 1) {
              return h('span', {
                'class': {
                  'status-color2': true
                }
              }, '已延期')
            }
            let cla = {}
            cla['status-color' + params.status] = true
            for (let i of this.$projectStatus) {
              if (i.value === params.status) {
                return h('span', {
                  'class': cla
                }, i.text)
              }
            }
          }
        }, {
          text: '创建日期',
          render: function (h, params) {
            return h('span', {}, new Date(params.createTime).Format('yyyy-MM-dd'))
          }
        }, {
          text: '可用工时/天',
          key: 'workDay'
        }]
      }
    },
    computed: {
      ...mapGetters({
        projectList: 'projectState'
      })
    },
    mounted () {
      console.log('服务端接收到的~~我的地盘 - 项目~~数据：', this.projectList)
    },
    components: {dataTable},
    asyncData ({store}) {
      return store.dispatch('isProjectState', {pageSize: 20})
    },
    methods: {
      ...mapActions([
        'isProjectState'
      ]),
      tableChange: function (data) {
        this.$refs.table.loading = true
        if (data) this.param.pageIndex = data
        this.isProjectState(this.param)
      }
    }
  }
</script>

<style lang="less">

</style>
