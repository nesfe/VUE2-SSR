<template>
  <div class="">
    <div class="featurebar">
      <ul class="ul">
        <li>
          <span class="badge">{{data.code}}</span>
          <b>{{data.name}}</b>
          <!--<input class="form-control" v-model="item.name"/>-->
        </li>
        <li class="fr">
          <router-link to="/project/index"><i class="glyphicon glyphicon-arrow-left"></i></router-link>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="row">
        <div class="col-sm-9">
          <fieldset class="fieldset">
            <legend>项目描述</legend>
            <!--<div class="content" v-html="data.content"></div>-->
            <editor v-model="item.content" class="content"></editor>
          </fieldset>
          <fieldset class="fieldset">
            <legend>历史记录</legend>
            <logData :data="data.logList"></logData>
          </fieldset>
          <div class="text-center tool-a">
            <btn type="primary" size="sm" @click="submit">
              <template v-if="!loading">保存</template>
              <i v-if="loading" class="fa fa-refresh fa-spin"></i>
            </btn>
            <btn size="sm" @click="cancel">取消</btn>
          </div>
        </div>
        <div class="col-sm-3">
          <formData ref="form">
            <fieldset class="fieldset">
              <legend>基本信息</legend>
              <div class="content">
                <table class="table-content">
                  <tbody>
                    <tr>
                      <th>项目名称</th>
                      <td class="input-group-sm">
                        <input type="text" class="form-control" v-model="item.name">
                      </td>
                    </tr>
                    <tr>
                      <th>项目代号</th>
                      <td class="input-group-sm">
                        <input type="text" class="form-control" v-model="item.code">
                      </td>
                    </tr>
                    <tr>
                      <th>开始时间</th>
                      <td class="input-group-sm">
                        <dateTime v-model="item.startTime"></dateTime>
                      </td>
                    </tr>
                    <tr>
                      <th>结束时间</th>
                      <td class="input-group-sm">
                        <dateTime v-model="item.endTime"></dateTime>
                      </td>
                    </tr>
                    <tr>
                      <th>可用工作日</th>
                      <td class="input-group-sm">
                        <div class="input-group input-group-sm input-group-up">
                          <input type="text" class="form-control" v-model="item.workDay" validate="required|number" fh="workDay">
                          <label class="input-group-addon">天</label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>项目类型</th>
                      <td class="input-group-sm">
                        <!--<input type="text" class="form-control" v-model="item.workDay">-->
                        {{item.type}}
                      </td>
                    </tr>
                    <!--<tr>-->
                    <!--<th>项目状态</th>-->
                    <!--<td class="input-group-sm">-->
                    <!--<input type="text" class="form-control" v-model="item.status">-->
                    <!--</td>-->
                    <!--</tr>-->
                    <tr>
                      <th>项目负责人</th>
                      <td class="input-group-sm">{{data.chargeName}}</td>
                    </tr>
                    <!--<tr>-->
                      <!--<th>访问控制</th>-->
                      <!--<td class="input-group-sm">-->
                        <!--<div class="projectAdd">-->
                          <!--<iCheck :iChecked="data.groupIds.indexOf(i.id) !== -1" @change="checkChange" ref="check" v-for="i in groupList.data">&nbsp;{{i.name}}</iCheck>-->
                        <!--</div>-->
                      <!--</td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                    <!--<th>分组白名单</th>-->
                    <!--<td class="input-group-sm">-->
                    <!--</td>-->
                    <!--</tr>-->
                  </tbody>
                </table>
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend>其他信息</legend>
              <div class="content">
                <table class="table-content">
                  <tbody>
                    <tr>
                      <th>工时统计</th>
                    </tr>
                    <tr>
                      <th>预计</th>
                      <td class="input-group-sm">
                        <div class="input-group input-group-sm input-group-up">
                          <input type="text" class="form-control" v-model="item.totalPlan" validate="required|number" fh="workDay">
                          <label class="input-group-addon">小时</label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>消耗</th>
                      <td class="input-group-sm">
                        <div class="input-group input-group-sm input-group-up">
                          <input type="text" class="form-control" v-model="item.totalUse" validate="required|number" fh="workDay">
                          <label class="input-group-addon">小时</label>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th>剩余</th>
                      <td class="input-group-sm">
                        <div class="input-group input-group-sm input-group-up">
                          <input type="text" class="form-control" v-model="item.totalLeft" validate="required|number" fh="workDay">
                          <label class="input-group-addon">小时</label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </fieldset>
          </formData>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import logData from 'components/history/logs.vue'
import editor from 'components/editor/editor.vue'
import formData from 'components/form/form.vue'
import dateTime from 'components/form/dateTime.vue'
import api from 'src/api'
import iCheck from 'components/form/checkbox.vue'

export default {
  components: { logData, editor, formData, dateTime, iCheck },
  data() {
    return {
      loading: false,
      item: {}
    }
  },
  computed: {
    ...mapGetters({
      data: 'projectSurvey',
      groupList: 'powerGroupList'
    })
  },
  methods: {
    checkChange() {
      let arr = []
      for (let i in this.$refs.check) {
        if (this.$refs.check[i].checked) {
          arr.push(this.groupList.data[i].id)
        }
      }
      this.item.groupIds = arr
    },
    submit() {
      let fo = this.$refs.form.validate()
      if (!fo && !this.item.groupIds.length) {
        // this.error('请全部填写选择数据')
        this.notify('danger', '请全部填写选择数据')
        return false
      }
      delete this.item.logList
      this.loading = true
      api.post('/project/update', JSON.stringify(this.item)).then((response) => {
        this.loading = false
        if (response.code === 200) {
          // this.$alert('添加成功, 3秒后跳转到项目列表')
          this.$alert({
            title: '提示',
            okText: '确定',
            content: '修改成功'
          }).then(() => {
            this.cancel()
          })
        } else {
          this.$notify(response.message)
        }
      })
    },
    cancel() {
      // this.$router.push('/project/survey/' + this.item.id)
      // window.sessionStorage.setItem('pname', this.item.name)
      // window.location.href = '/project/survey/' + this.item.id
      this.$router.go(-1)
    },
    notify(type, content) {
      /**
       * 封装一个弹出消息
       * param {String} type 类型
       * param {String} content 内容
       */
      this.$notify({ type, content, dismissible: false, duration: 1000 })
    }
  },
  mounted() {
    let item = JSON.stringify(this.data)
    this.item = JSON.parse(item)
  },
  asyncData({ store, route }) {
    return Promise.all([store.dispatch('isProjectSurvey', route.params.id), store.dispatch('isPowerGroupList')])
  }
}

</script>
<style lang="less">
.dropdown-menu td {
  padding: 0 !important;
}

.table-content {
  width: 100%;
  .input-group {
    width: 100%;
  }
  .dropdown {
    width: 100%;
  }
}

</style>
