<template>
  <div class="">
    <div class="featurebar">
      <ul class="ul">
        <li>
          <!--<span class="badge">{{data.projectName}}</span>-->
          <b>{{data.name}}</b>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="row">
        <div class="col-sm-9">
          <fieldset class="fieldset">
            <legend>任务描述</legend>
            <div class="content" v-html="data.content"></div>
          </fieldset>
          <taskType :giveItem="giveItem" :hasPower="false"></taskType>
          <fieldset class="fieldset">
            <legend>历史记录</legend>
            <logData :data="data.logList"></logData>
          </fieldset>
          <div class="text-center tool-a">
            <!-- <a href="javascript:;" @click="taskAssignShow=true"><i class="fa fa-hand-o-right"></i> 指派</a> -->
            <!-- <a v-if="data.status === 1" href="javascript:;" @click="taskActionShow=true"><i class="fa fa-play"></i> 开始</a> -->
            <!--<a href="javascript:;"><i class="fa fa-clock-o"></i> 工时</a>-->
            <!-- <a v-if="data.status === 2" href="javascript:;" @click="taskFinishShow=true"><i class="fa fa-check-circle"></i> 完成</a> -->
            <!-- <a v-if="data.status !== 6" href="javascript:;" @click="close"><i class="fa fa-close"></i> 关闭</a> -->
            <!-- <router-link :to=""><i class="fa fa-edit"></i> 编辑</router-link> -->
            <!-- <router-link :to="'/project/task/' + data.projectId"><i class="fa fa-reply"></i> 返回</router-link> -->
            <!-- v-for -->
            <a v-for="item in btnPower" v-show="item.permission === 'sys.task.send'" @click="openModel(true, 'taskAssignShow')">
              <i class="glyphicon glyphicon-hand-right"></i> 指派
            </a>
            <a :class="data.status !== 1 ? 'disabled' : ''" v-for="item in btnPower" v-show="item.permission === 'sys.task.start'" @click="openModel(!(data.status !== 1), 'taskActionShow')">
              <i class="glyphicon glyphicon-play"></i> 开始
            </a>
            <a :class="data.status !== 2 ? 'disabled' : ''" v-for="item in btnPower" v-show="item.permission === 'sys.task.done'" @click="openModel(!(data.status !== 2), 'taskFinishShow')">
              <i class="glyphicon glyphicon-ok-circle"></i> 完成
            </a>
            <a :class="data.status === 6 ? 'disabled' : ''" v-for="item in btnPower" v-show="item.permission === 'sys.task.clone'" @click="close">
              <i class="glyphicon glyphicon-off"></i> 关闭
            </a>
            <a :class="data.status !== 3 ? 'disabled' : ''" v-for="item in btnPower" v-show="item.permission === 'sys.task.restart'" @click="restartEvent(!(data.status !== 3))">
              <i class="glyphicon glyphicon-flash"></i> 激活
            </a>
            <a v-for="item in btnPower" v-show="item.permission === 'sys.task.edit'" @click="toPath('/project/taskEdit/'+$route.params.id)">
              <i class="glyphicon glyphicon-pencil"></i> 编辑
            </a>
            <a v-for="item in btnPower" v-show="item.permission === 'sys.task.del'" @click="remove">
              <i class="glyphicon glyphicon-remove"></i> 删除
            </a>
            <a @click="$router.go(-1)">
              <i class="glyphicon glyphicon-arrow-left"></i> 返回
            </a>
          </div>
        </div>
        <div class="col-sm-3">
          <fieldset class="fieldset">
            <legend>基本信息</legend>
            <div class="content">
              <table class="table-content">
                <tbody>
                <tr>
                  <th>所属项目</th>
                  <td>{{data.projectName}}</td>
                </tr>
                <tr>
                  <th>任务名称</th>
                  <td>{{data.name}}</td>
                </tr>
                <tr>
                  <th>指派给</th>
                  <td>{{data.memberName}}</td>
                </tr>
                <tr>
                  <th>任务类型</th>
                  <td>{{data.typeName}}</td>
                </tr>
                <tr>
                  <th>任务状态</th>
                  <td>{{statusName}}</td>
                </tr>
                <tr>
                  <th>优先级</th>
                  <td>{{data.priority}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </fieldset>
          <fieldset class="fieldset">
            <legend>工时信息</legend>
            <div class="content">
              <table class="table-content">
                <tbody>
                <tr>
                  <th>预计开始</th>
                  <td>{{new Date(data.createTime).Format('yyyy-MM-dd hh:mm:ss')}}</td>
                </tr>
                <tr>
                  <th>实际开始</th>
                  <td>{{new Date(data.startTime).Format('yyyy-MM-dd hh:mm:ss')}}</td>
                </tr>
                <tr>
                  <th>截止日期</th>
                  <td>{{new Date(data.endTime).Format('yyyy-MM-dd hh:mm:ss')}}</td>
                </tr>
                <tr>
                  <th>最初预计</th>
                  <td>{{data.planTime || 0}}小时</td>
                </tr>
                <tr>
                  <th>总消耗</th>
                  <td>{{data.useTime || 0}}小时</td>
                </tr>
                <tr>
                  <th>预计剩余</th>
                  <td>{{data.leftTime || 0}}小时</td>
                </tr>
                </tbody>
              </table>
            </div>
          </fieldset>
          <fieldset class="fieldset">
            <legend>任务的一生</legend>
            <div class="content">
              <table class="table-content">
                <tbody>
                <tr>
                  <th>由谁创建</th>
                  <td>{{data.createMemberName}}</td>
                </tr>
                <tr>
                  <th>由谁完成</th>
                  <td>{{data.finishName}}</td>
                </tr>
                <tr>
                  <th>最后编辑</th>
                  <td>{{new Date(data.updateTime).Format('yyyy-MM-dd')}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
    <taskAssign v-model="taskAssignShow" :typeList="typeList" :data="data" @success="refresh"></taskAssign>
    <taskFinish
      v-if="taskFinishShow"
      v-model="taskFinishShow"
      :typeList="typeList"
      :data="data"
      @success="refresh"
      @close="taskFinishShow=false"></taskFinish>
    <taskAction v-model="taskActionShow" :data="data" @success="refresh"></taskAction>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import logData from 'components/history/logs.vue'
  import taskAssign from './taskAssign.vue'
  import taskAction from './taskAction.vue'
  import taskFinish from './taskFinish.vue'
  import taskType from './taskType.vue'
  import api from 'src/api'
  import { getUserPowerMenu } from 'util/util'

  export default {
    components: {logData, taskAssign, taskAction, taskFinish, taskType},
    data () {
      return {
        statusName: '',
        btnPower: [],
        giveItem: {},
        taskAssignShow: false,
        taskFinishShow: false,
        taskActionShow: false
      }
    },
    computed: {
      ...mapGetters({
        data: 'projectTaskDetail',
        typeList: 'projectTaskMan',
        userStatus: 'getUserStatus'
      })
    },
    methods: {
      toPath (url) {
        this.$router.push(url)
      },
      openModel (ifs, show) {
        if (ifs) {
          this[show] = true
        }
      },
      restartEvent (ifs) {
        if (ifs) {
          this.$confirm({
            title: '系统提示',
            content: '确定激活吗？'
          }).then(() => {
            api.post('/task/restart', {taskId: this.data.id, name: this.data.name}).then((response) => {
              this.$notify(response.message)
              this.refresh()
            })
          }).catch(() => {
          })
        }
      },
      remove () {
        this.$confirm({
          title: '系统提示',
          content: '确定删除吗？'
        }).then(() => {
          api.post('/task/delete', {ids: this.data.id, name: this.data.name}).then((response) => {
            this.$notify(response.message)
            this.$router.push('/project/task/' + this.data.projectId)
          })
        }).catch(() => {
        })
      },
      close () {
        if (this.data.status === 6) return
        this.$confirm({
          title: '系统提示',
          content: '确定关闭吗？'
        }).then(() => {
          api.post('/task/close', {taskId: this.data.id, name: this.data.name}).then((response) => {
            this.$notify(response.message)
            this.$router.push('/project/task/' + this.data.projectId)
          })
        }).catch(() => {
        })
      },
      refresh () {
        window.history.go(0)
      }
    },
    created () {
      const status = this.userStatus
      const menus = getUserPowerMenu(status, this.$route.path, '/project/task')
      this.btnPower = menus
      let giveItem = JSON.stringify(this.data)
      this.giveItem = JSON.parse(giveItem)
    },
    mounted () {
      console.log(this.btnPower)
      for (let i of this.$taskStatus) {
        if (i.value === this.data.status) {
          this.statusName = i.text
        }
      }
    },
    asyncData ({store, route}) {
      let arr = route.params.id.split('-')
      return Promise.all([store.dispatch('isProjectTaskDetails', arr[1]), store.dispatch('isProjectTaskMan', {projectId: arr[0]})])
    }
  }

</script>
