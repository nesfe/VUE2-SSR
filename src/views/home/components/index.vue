<template>
  <div>
    <div class="main homeIndex">
      <div class="row">
        <div class="col-sm-7">
          <div class="panel panel-default">
            <div class="panel-heading">
              <span class="panel-heading-txt">流程图</span>
            </div>
            <div class="panel-body panel-body-range h155">
              <div class="row flow" v-for="role of flow">
                <div :class="'flow-item flow-item-' + index" v-for="(item, index) of role">
                  <div>{{item.name}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="panel panel-default">
            <div class="panel-heading">
              <span class="panel-heading-txt">最新动态</span>
              <a href="javascript:;" class="pull-right" @click="$router.push('/organization/log')">更多<span class="glyphicon glyphicon-menu-right"></span></a>
            </div>
            <div class="panel-body-range h155">
            <dataTable :data="logData.data" :columns="myLog" :show-header="false" :border="false"></dataTable>
            </div>
          </div>
        </div>
        <div class="col-sm-7">
          <div class="panel panel-default panel-range">
            <div class="panel-heading">
              <span class="panel-heading-txt">进行中的项目</span>
              <a href="javascript:;" class="pull-right" @click="$router.push('/project/index')">更多<span class="glyphicon glyphicon-menu-right"></span></a>
            </div>
            <div class="panel-body-range">
            <dataTable :data="projectData.data" :columns="goingPro" :border="false"></dataTable>
            </div>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="panel panel-default panel-range">
            <div class="panel-heading">
              <span class="panel-heading-txt">指派给我的任务</span>
              <a href="javascript:;" class="pull-right" @click="$router.push('/home/myTask')">更多<span class="glyphicon glyphicon-menu-right"></span></a>
            </div>
            <div class="panel-body-range">
            <dataTable :data="taskData.data" :columns="myTask" :border="false"></dataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import dataTable from 'components/table/table.vue'
  export default {
    name: 'index',
    title () {
      return '首页'
    },
    data () {
      const taskStatus = this.$taskStatus
      const projectStatus = this.$projectStatus
      return {
        flow: [[{
          id: 0,
          name: '管理员'
        }, {
          id: 1,
          name: '维护公司'
        }, {
          id: 2,
          name: '邀请用户'
        }, {
          id: 3,
          name: '维护权限'
        }, {
          id: 4,
          name: '维护任务类型'
        }], [{
          id: 0,
          name: '项目经理'
        }, {
          id: 1,
          name: '创建项目'
        }, {
          id: 2,
          name: '维护团队'
        }, {
          id: 3,
          name: '创建任务'
        }], [{
          id: 0,
          name: '工作人员'
        }, {
          id: 1,
          name: '领取任务'
        }, {
          id: 2,
          name: '更新状态'
        }, {
          id: 3,
          name: '完成任务'
        }]],
        myLog: [{
          text: '对象名称',
          key: 'content',
          width: '40%',
          render: (h, row) => {
            // 1 项目
            let createTime = new Date(row.createTime).Format('yyyy-MM-dd hh:mm:ss')
            if (row.type === 1 && row.targetId) {
              return h('span', {}, [createTime + ' ' + row.memberName + ' ' + row.action + '项目' + ' ', h('router-link', {
                attrs: {
                  to: '/project/survey/' + row.targetId
                }
              }, row.targetName)])
            } else if (row.type === 2 && row.targetId) {
              return h('span', {}, [createTime + ' ' + row.memberName + ' ' + row.action + '任务' + ' ', h('router-link', {
                attrs: {
                  to: '/project/taskDetails/' + row.taskProjectId + '-' + row.targetId
                }
              }, row.targetName)])
            } else {
              return row.content
            }
          }
        }],
        goingPro: [{
          text: '项目名称',
          key: 'name',
          align: 'center',
          width: '25%',
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
                }
              }
            }, row.name)
          }
        },
        // {
        //   text: '项目代号',
        //   key: 'code',
        //   width: '12%'
        // }
        {
          text: '项目负责人',
          key: 'chargeName',
          width: '15%'
        }, {
          text: '结束日期',
          key: 'endTime',
          width: '15%',
          render: function (h, row) {
            return h('span', {}, new Date(row.endTime).Format('yyyy-MM-dd'))
          }
        }, {
          text: '状态',
          key: 'status',
          width: '10%',
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
            for (let i of projectStatus) {
              if (i.value === row.status) {
                return h('span', {
                  'class': cla
                }, i.text)
              }
            }
          }
        }, {
          text: '总预计',
          key: 'totalPlan',
          width: '9%'
        }, {
          text: '总耗时',
          key: 'totalUse',
          width: '9%'
        }, {
          text: '总剩余',
          key: 'totalLeft',
          width: '9%'
        }, {
          text: '进度',
          width: '8%',
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
        }],
        myTask: [{
          text: '编码',
          key: 'code',
          align: 'center',
          width: '20%'
        }, {
          text: '任务名称',
          key: 'name',
          width: '30%',
          render: function (h, row) {
            return h('router-link', {
              attrs: {
                to: '/project/taskDetails/' + row.projectId + '-' + row.id
              }
            }, row.name)
          }
        }, {
          text: '预',
          key: 'planTime',
          width: '10%'
        }, {
          text: '截止日期',
          key: 'endTime',
          width: '20%',
          render: function (h, row) {
            return h('span', {}, new Date(row.endTime).Format('yyyy-MM-dd'))
          }
        }, {
          text: '状态',
          key: 'status',
          width: '12%',
          render: function (h, row) {
            let cla = {}
            cla['status-color' + row.status] = true
            let status = ''
            for (let i of taskStatus) {
              if (i.value === row.status) status = i.text
            }
            return h('span', {
              'class': cla
            }, status)
          }
        }]
      }
    },
    computed: {
      ...mapGetters({
        projectData: 'projectState',
        logData: 'logList',
        taskData: 'projectTaskList'
      })
    },
    mounted () {
      console.log('服务端接收到的~~进行中的项目~~数据：', this.projectData)
      console.log('服务端接收到的~~动态~~数据：', this.logData)
      console.log('服务端接收到的~~任务~~数据：', this.taskData)
    },
    components: {dataTable},
    asyncData ({store}) {
      return Promise.all([store.dispatch('isProjectState', {starting: 1}), store.dispatch('isLog', {pageSize: 20}), store.dispatch('isProjectTask', {flag: 1})])
    },
    methods: {
      ...mapActions([
        'isProjectState',
        'isProjectTask',
        'isLog'
      ])
    }
  }
</script>
<style lang="less">
  .homeIndex {
    .panel-body-range {
      height: 300px;
      overflow-y: auto;
    }
    .panel-body-range.h155{
      height: 155px;
      td{
        padding: 8px 15px
      }
    }
  }
  
  .flow {
    .before {
      content: ' ';
      display: block;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 15px 0 15px 15px;
      border-color: transparent transparent transparent #90A4AE;
      position: absolute;
      left: 0;
      top: 0;
      border-left-color: #fff;
      z-index: 1;
    }
    &.row {
      margin: 0 auto;
    }
    .flow-item {
      float: left;
      width: 19.666%;
      min-width: 90px;
      max-width: 180px;
      text-align: center;
      margin-bottom: 9px;
      padding-right: 5px;
      > div {
        position: relative;
        padding: 5px 0 5px 20px;
        line-height: 20px;
        white-space: nowrap;
        overflow: visible;
        color: #fff;
        &:after {
          content: ' ';
          display: block;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 15px 0 15px 15px;
          position: absolute;
          top: 0;
          left: auto;
          right: -15px;
          z-index: 2;
        }
      }
      &.flow-item-0 > div {
        background-color: #90A4AE;
        &:after {
          border-color: transparent transparent transparent #90A4AE;
        }
      }
      &.flow-item-1 > div {
        background-color: #1976D2;
        &:before{
          .before
        }
        &:after {
          border-color: transparent transparent transparent #1976D2;
        }
      }
      &.flow-item-2 > div {
        background-color: #4CAF50;
        &:before{
          .before
        }
        &:after {
          border-color: transparent transparent transparent #4CAF50;
        }
      }
      &.flow-item-3 > div {
        background-color: #F57C00;
        &:before{
          .before
        }
        &:after {
          border-color: transparent transparent transparent #F57C00;
        }
      }
      &.flow-item-4 > div {
        background-color: #EF5350;
        &:before{
          .before
        }
        &:after {
          border-color: transparent transparent transparent #EF5350;
        }
      }
      &.flow-item-5 > div {
        background-color: #AB47BC;
        &:before{
          .before
        }
        &:after {
          border-color: transparent transparent transparent #AB47BC;
        }
      }
    }
  }
</style>