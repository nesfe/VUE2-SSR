<template>
  <div class="">
    <div class="featurebar">
      <ul class="ul">
        <li :class="i.value === param.status ? 'active' : ''" v-for="i in statusList" @click="param.status=i.value,tableChange()"><a href="javascript:;">{{i.text}}</a></li>
        <li><a href="javascript:;" @click="search=!search"><i class="glyphicon glyphicon-search"></i> 搜索</a></li>
        <li class="fr" v-for="item in menuPower">
          <!-- 权限标识是否显示新建任务 sys.task.add -->
          <a href="javascript:;" v-show="item.permission === 'sys.task.add'" @click="add">
            <i class="fa fa-plus"></i> 建任务
          </a>
        </li>
      </ul>
    </div>
    <div class="search-main" v-show="search">
      <form class="form-inline" action="javascript:;" @submit="submitEvent">
        <div class="form-group input-group-sm">
          <input type="text" class="form-control" v-model="param.name" placeholder="请输入任务名称">
        </div>
        <button type="button" class="btn btn-primary btn-sm" @click="tableChange">搜索</button>
        <div class="fr">
          <a href="javascript:;" class="close" @click="search=!search"><i class="glyphicon glyphicon-remove"></i></a>
        </div>
      </form>
    </div>
    <div class="main">
      <dataTable ref="table" :tool="tool" :data="state.data" :page="state.page" @pageChange="tableChange" :columns="columns"></dataTable>
    </div>
    <taskAssign v-model="taskAssignShow" :typeList="taskMan" :data="taskData" @success="tableChange"></taskAssign>
    <taskFinish v-if="taskFinishShow"
      v-model="taskFinishShow"
      :typeList="taskMan"
      :data="taskData"
      @success="tableChange"
      @close="taskFinishShow=false">
    </taskFinish>
    <taskAction v-model="taskActionShow" :data="taskData" @success="tableChange"></taskAction>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import dataTable from 'components/table/table.vue'
  import taskAssign from './taskAssign.vue'
  import taskAction from './taskAction.vue'
  import taskFinish from './taskFinish.vue'
  import api from 'src/api'
  import { getUserPowerMenu, getPermission } from 'util/util'

  export default {
    components: {dataTable, taskAssign, taskAction, taskFinish},
    data () {
      const vm = this
      return {
        taskData: {},
        statusList: this.$taskStatus,
        taskAssignShow: false,
        taskActionShow: false,
        taskFinishShow: false,
        taskAssignTitle: '指派',
        search: false,
        menuPower: [],
        tool: [],
        columns: [{
          type: 'selection'
        }, {
          text: '任务名称',
          width: 300,
          render: (h, row) => {
            return h('a', {
              attrs: {
                href: 'javascript:;'
              },
              on: {
                click: () => {
                  this.$router.push('/project/taskDetails/' + this.$route.params.id + '-' + row.id)
                }
              }
            }, row.name)
          }
        }, {
          text: '状态',
          key: 'status',
          render: (h, row) => {
            let cla = {}
            cla['status-color' + row.status] = true
            let status = ''
            for (let i of this.statusList) {
              if (i.value === row.status) status = i.text
            }
            return h('span', {
              'class': cla
            }, status)
          }
        }, {
          text: '截止',
          render: (h, row) => {
            return h('span', {}, new Date(row.endTime).Format('yyyy-MM-dd'))
          }
        }, {
          text: '指派给',
          key: 'memberName'
        }, {
          text: '完成者',
          key: 'finishName'
        }, {
          text: '预',
          align: 'center',
          key: 'planTime',
          width: 35
        }, {
          text: '耗',
          align: 'center',
          key: 'useTime',
          width: 35
        }, {
          text: '剩',
          align: 'center',
          key: 'leftTime',
          width: 35
        }, {
          text: '操作',
          width: 144,
          align: 'center',
          render: (h, row) => {
            const arr = vm.renderHtml(h, row)
            return h('div', arr)
          }
        }],
        param: {
          pageSize: 20,
          pageIndex: 1,
          name: '',
          projectId: this.$route.params.id,
          status: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        state: 'projectTaskList',
        taskMan: 'projectTaskMan',
        userStatus: 'getUserStatus'
      })
    },
    created () {
      // 获取用户权限菜单、按钮
      const status = this.userStatus
      const menus = getUserPowerMenu(status, this.$route.path, '/project/task')
      this.menuPower = menus
      this.toolEvent()
    },
    mounted () {
      console.log('服务端接收到的数据：', this.taskMan)
    },
    asyncData ({store, route}) {
      return Promise.all([store.dispatch('isProjectTaskMan', {projectId: route.params.id}), store.dispatch('isProjectTask', {projectId: route.params.id, pageSize: 20})])
    },
    methods: {
      ...mapActions([
        'isProjectTask'
      ]),
      toolEvent () {
        let permission = getPermission(this.menuPower)
        if (permission.includes('sys.task.del')) {
          this.tool.push({
            text: '删除',
            click: (data) => {
              console.log('要批量删除的数据', data)
              this.deleAll(data)
            }
          })
        }
      },
      deleAll (data) {
        let ids = []
        let name = []
        for (let i of data) {
          if (i.id) {
            ids.push(i.id)
            name.push(i.name)
          }
        }
        if (!ids.length) return
        this.deleteItem(ids.join(','), name.join(','))
      },
      deleteItem (ids, name) {
        this.$confirm({
          title: '系统提示',
          content: '确定删除吗？'
        }).then(() => {
          api.post('/task/delete', {ids, name}).then((response) => {
            this.$notify(response.message)
            this.tableChange()
          })
        }).catch(() => {
        })
      },
      renderHtml (h, row) {
        // 根据权限标识显示操作按钮
        let arr = []
        console.log(' this.menuPower', this.menuPower)
        for (let item of this.menuPower) {
          const permission = item.permission
          console.log(permission)
          switch (permission) {
            case 'sys.task.send':
              arr.push(h('a', {
                attrs: {
                  href: 'javascript:void(0);',
                  title: '指派'
                },
                on: {
                  click: () => {
                    this.taskData = row
                    this.taskAssignShow = true
                  }
                }
              }, [
                h('i', {
                  'class': {
                    glyphicon: true,
                    'glyphicon-hand-right': true
                  }
                })
              ]))
              break
            case 'sys.task.start':
              arr.push(h('a', {
                attrs: {
                  href: 'javascript:void(0);',
                  title: '开始'
                },
                on: {
                  click: () => {
                    if (row.status !== 1) return
                    this.taskData = row
                    this.taskActionShow = true
                  }
                }
              }, [
                h('i', {
                  'class': {
                    glyphicon: true,
                    'glyphicon-play': true,
                    disabled: row.status !== 1
                  }
                })
              ]))
              break
            case 'sys.task.time':
              // 暂时不要工时
              // arr.push(h('i', {
              //   attrs: {
              //     title: '工时'
              //   },
              //   'class': {
              //     fa: true,
              //     'fa-clock-o': true
              //   }
              // }))
              break
            case 'sys.task.done':
              arr.push(h('a', {
                attrs: {
                  href: 'javascript:void(0);',
                  title: '完成'
                },
                on: {
                  click: () => {
                    if (row.status !== 2) return
                    this.taskData = row
                    this.taskFinishShow = true
                  }
                }
              }, [
                h('i', {
                  'class': {
                    glyphicon: true,
                    'glyphicon-ok-circle': true,
                    disabled: row.status !== 2
                  }
                })
              ]))
              break
            case 'sys.task.clone':
              arr.push(h('a', {
                attrs: {
                  href: 'javascript:void(0);',
                  title: '关闭'
                },
                on: {
                  click: () => {
                    if (row.status === 6) return
                    this.$confirm({
                      title: '系统提示',
                      content: '确定关闭吗？'
                    }).then(() => {
                      api.post('/task/close', {taskId: row.id, name: row.name}).then((response) => {
                        this.$notify(response.message)
                        this.tableChange()
                      })
                    }).catch(() => {
                    })
                  }
                }
              }, [
                h('i', {
                  'class': {
                    glyphicon: true,
                    'glyphicon-off': true,
                    disabled: row.status === 6
                  }
                })
              ]))
              break
            case 'sys.task.restart':
              arr.push(h('a', {
                attrs: {
                  href: 'javascript:void(0);',
                  title: '激活'
                },
                on: {
                  click: () => {
                    if (row.status !== 3) return
                    this.$confirm({
                      title: '系统提示',
                      content: '确定激活吗？'
                    }).then(() => {
                      api.post('/task/restart', {taskId: row.id, name: row.name}).then((response) => {
                        this.$notify(response.message)
                        this.tableChange()
                      })
                    }).catch(() => {
                    })
                  }
                }
              }, [
                h('i', {
                  'class': {
                    glyphicon: true,
                    'glyphicon glyphicon-flash': true,
                    disabled: row.status !== 3
                  }
                })
              ]))
              break
            case 'sys.task.edit':
              arr.push(h('router-link', {
                attrs: {
                  to: '/project/taskEdit/' + this.$route.params.id + '-' + row.id,
                  title: '编辑'
                }
              }, [
                h('i', {
                  'class': {
                    glyphicon: true,
                    'glyphicon-pencil': true
                  }
                })
              ]))
              break
            case 'sys.task.del':
              arr.push(h('a', {
                attrs: {
                  href: 'javascript:void(0);',
                  title: '删除'
                },
                on: {
                  click: () => {
                    this.deleteItem(row.id, row.name)
                  }
                }
              }, [
                h('i', {
                  'class': {
                    glyphicon: true,
                    'glyphicon-remove': true
                  }
                })
              ]))
              break
          }
        }
        return arr
      },
      submitEvent () {
        this.tableChange()
        return false
      },
      add () {
        this.$router.push(this.$route.path + '/add')
      },
      tableChange (data) {
        this.$refs.table.loading = true
        if (data) this.param.pageIndex = data
        this.isProjectTask(this.param)
      }
    }
  }
</script>
<style lang="less">
  .close {
    line-height: 30px;
    font-size: 20px;
  }

  .search-main {
    border-bottom: 1px solid #ddd;
    padding: 10px 20px;
  }

  .row-table {
    display: table;
    width: 100%;
  }

  .col-main,
  .col-side {
    display: table-cell;
  }

  .col-side {
    width: 350px;
    padding-left: 10px;
  }

  .col-main {
    padding-right: 10px;
  }

  .fieldset {
    margin-bottom: 15px;
    border: 1px solid #e5e5e5;
    padding: 10px 15px 15px;
    legend {
      width: auto;
      margin: 0 0 0 -5px;
      font-size: 13px;
      font-weight: bold;
      border-bottom: 0;
      padding: 0 5px;
    }
    .content {
    }
  }

  .table .pagination {
    margin: 0 !important;
    float: right;
  }

  .totalPage {
    padding-right: 20px;
    font-size: 12px;
    line-height: 30px;
  }

  .check {
    vertical-align: middle;
    margin: -2px 0 0 !important;
  }

  .col-main .tool-a a {
    padding: 0 5px;
  }

  .table i.icon {
    font-size: 13px;
    margin: 0 3px;
    cursor: pointer;
    color: #337ab7;
  }

  .table i.disabled {
    color: #ccc;
    cursor: not-allowed !important;
  }

  .status-color1 {
    color: #ccc;
  }

  .status-color2 {
    color: #cc2b21;
  }

  .status-color3 {
    color: #229f24;
  }
</style>
