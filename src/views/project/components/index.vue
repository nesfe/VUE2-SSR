<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li v-if="i.value!==5" :class="i.value === param.status ? 'active' : ''" v-for="i in statusList" @click="param.status=i.value,tableChange()"><a href="javascript:;">{{i.text}}</a></li>
      </ul>
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
    name: 'Project',
    data () {
      return {
        data: '222',
        pages: {
          pageSize: 10,
          total: 500,
          current: 1
        },
        statusList: this.$projectStatus,
        tool: [],
        columns: [{
          type: 'selection'
        }, {
          text: '项目名称',
          // key: 'name',
          width: 300,
          render: function (h, row) {
            return h('a', {
              attrs: {
                href: 'javascript:;'
              },
              on: {
                click: () => {
                  window.sessionStorage.setItem('pid', row.id)
                  window.sessionStorage.setItem('pname', row.name)
                  window.location.href = '/project/task/' + row.id
                  // cookies.set('p_db', { id: row.id, name: row.name })
                  // vm.$router.push(`/project/survey/${row.id}`)
                }
              }
            }, row.name)
          }
        }, {
          text: '项目代号',
          key: 'code'
        }, {
          text: '项目负责人',
          key: 'chargeName'
        }, {
          text: '结束日期',
          key: 'endTime',
          render: function (h, row) {
            return h('span', {}, row.endTime ? new Date(row.endTime).Format('yyyy-MM-dd') : '')
          }
        }, {
          text: '项目状态',
          key: 'status',
          render: (h, row) => {
            if (row.delayStatus === 1) {
              return h('span', {
                'class': {
                  'status-color2': true
                }
              }, '已延期')
            }
            let cla = {}
            cla['status-color' + row.status] = true
            for (let i of this.statusList) {
              if (i.value === row.status) {
                return h('span', {
                  'class': cla
                }, i.text)
              }
            }
          }
        }, {
          text: '总预计',
          key: 'totalPlan'
        }, {
          text: '总耗时',
          key: 'totalUse'
        }, {
          text: '总剩余',
          key: 'totalLeft'
        }, {
          text: '进度',
          render: function (h, row) {
            return h('progress-bar', {
              props: {
                value: parseInt(row.percent)
              },
              style: {
                marginBottom: '0px'
              },
              attrs: {
                label: true
              }
            })
          }
        }, {
          text: '操作',
          width: 144,
          align: 'center',
          render: (h, row) => {
            const arr = this.renderHtml(h, row)
            return h('div', arr)
          }
        }],
        menuPower: [],
        param: {
          pageSize: 20,
          pageIndex: 1,
          status: ''
        }
      }
    },
    created () {
      // 获取用户权限菜单、按钮
      const status = this.userStatus
      console.log('status', status)
      const menus = getUserPowerMenu(status, this.$route.path, '/project/survey')
      this.menuPower = menus
      this.toolEvent()
    },
    computed: {
      ...mapGetters({
        state: 'projectState',
        userStatus: 'getUserStatus'
      })
    },
    mounted () {
      console.log('服务端接收到的数据：', this.$store.state)
    },
    components: {dataTable},
    asyncData ({store}) {
      return store.dispatch('isProjectState', {pageSize: 20})
    },
    methods: {
      ...mapActions(['isProjectState']),
      toolEvent () {
        let permission = getPermission(this.menuPower)
        if (permission.includes('sys.project.del')) {
          this.tool.push({
            text: '删除',
            click: (data) => {
              console.log('要批量删除的数据', data)
              this.deleAll(data)
            }
          })
        }
      },
      deleteItem (ids, name) {
        this.$confirm({
          title: '系统提示',
          content: '确定删除吗？'
        }).then(() => {
          api.post('/project/delete', {ids, name}).then((response) => {
            this.$notify(response.message)
            let id = window.sessionStorage.getItem('pid')
            if (ids.indexOf(id) !== -1) {
              window.sessionStorage.removeItem('pid')
              window.sessionStorage.removeItem('pname')
              window.history.go(0)
              return
            }
            this.tableChange()
          })
        }).catch(() => {
        })
      },
      renderHtml (h, row) {
        // 根据权限标识显示操作按钮
        let arr = []
        let permission = getPermission(this.menuPower)
        if (permission.includes('sys.project.start')) {
          arr.push(h('a', {
            attrs: {
              href: 'javascript:void(0);',
              title: '开始'
            },
            on: {
              click: () => {
                if (row.status === 2 || row.status === 4) return
                this.$confirm({
                  title: '系统提示',
                  content: '确定开始吗？'
                }).then(() => {
                  api.post('/project/start', {id: row.id, name: row.name}).then((response) => {
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
                'glyphicon-play': true,
                disabled: row.status === 2 || row.status === 4
              }
            })
          ]))
        }
        if (permission.includes('sys.project.finish')) {
          arr.push(h('a', {
            attrs: {
              href: 'javascript:void(0);',
              title: '完成'
            },
            on: {
              click: () => {
                if (row.status === 4) return
                this.$confirm({
                  title: '系统提示',
                  content: '确定完成吗？'
                }).then(() => {
                  api.post('/project/finish', {id: row.id, name: row.name}).then((response) => {
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
                'glyphicon-ok-circle': true,
                disabled: row.status === 4
              }
            })
          ]))
        }
        if (permission.includes('sys.project.stop')) {
          arr.push(h('a', {
            attrs: {
              href: 'javascript:void(0);',
              title: '挂起'
            },
            on: {
              click: () => {
                if (row.status === 6 || row.status === 4) return
                this.$confirm({
                  title: '系统提示',
                  content: '确定挂起吗？'
                }).then(() => {
                  api.post('/project/stop', {id: row.id, name: row.name}).then((response) => {
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
                fa: true,
                'fa-anchor': true,
                disabled: row.status === 6 || row.status === 4
              }
            })
          ]))
        }
        if (permission.includes('sys.project.edit')) {
          arr.push(h('router-link', {
            attrs: {
              to: '/project/edit/' + row.id,
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
        }
        if (permission.includes('sys.project.del')) {
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
        }
        return arr
      },
      tableChange (data) {
        this.$refs.table.loading = true
        if (data) this.param.pageIndex = data
        this.isProjectState(this.param)
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
//
//        if (!data.length) return
//        let vm = this
//        let ids = ''
//        let name = ''
//        data.forEach(function (item) {
//          ids = `${ids}${item.id},`
//          name = `${name}${item.name},`
//        })
//        ids = ids.substring(0, ids.length - 1)
//        name = name.substring(0, name.length - 1)
//        api.post('/project/delete', {ids, name}).then((res) => {
//          if (res.code !== 200) {
//            vm.notify('danger', res.message)
//            return
//          }
//          console.log('👹项目删除返回数据：', res)
//          vm.isProjectState(this.param)
//        }).catch((error) => {
//          console.log(error)
//        })
      },
      notify (type, content) {
        /**
         * 封装一个弹出消息
         * param {String} type 类型
         * param {String} content 内容
         */
        this.$notify({type, content, dismissible: false, duration: 1000})
      }
    }
  }
</script>

<style lang="less">
  .main {
    padding: 20px;
  }

  .featurebar {
    display: block;
    width: 100%;
    font-size: 14px;
    background: #ebf1f9;
    border-bottom: 1px solid #ddd;
    line-height: 30px;
    min-height: 46px;
    .ul {
      margin: 0;
      padding: 8px 13px;
      li {
        float: left;
        line-height: 30px;
        a {
          color: #141414;
          display: block;
          padding: 0 7px;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.3s;
          &:hover {
            background-color: rgb(221, 221, 221);
          }
        }
        &.active {
          font-weight: bold;
        }
      }
    }
  }
</style>
