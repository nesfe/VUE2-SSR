<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li><b>建任务</b></li>
      </ul>
    </div>
    <div class="main al-taskAdd">
      <formData ref="form" class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">任务名称</label>
          <div class="col-sm-5">
            <input type="text" class="form-control" v-model="item.name" validate="required">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">任务类型</label>
          <div class="col-sm-5">
            <selectData k="id" v="name" v-model="item.typeId" :data="typeList" :searchShow="true" @change="selectChange">
            </selectData>
          </div>
        </div>
        <div class="form-group" v-for="(x, t) in attributes" v-show="false">
          <label class="col-sm-2 control-label">{{x.name}}</label>
          <div class="col-sm-5 al-setNew" v-if="x.type == 1">
            <input type="text" class="form-control" v-model="x.value" validate="required">
          </div>
          <div class="col-sm-5 al-setNew" v-if="x.type == 2">
            <textarea rows="3" cols="44" v-model="x.value" validate="required"></textarea>
          </div>
          <div class="col-sm-5 al-setNew al-radio" v-if="x.type == 3">
            <label v-for="(some, index) in x.showValues" :for="some.value">
              <input type="radio" :name="x.name"
                :id="some.value"
                :value="some.value"
                v-model="x.value"/>
              <span>{{some.text}}</span>
            </label>
          </div>
          <div class="col-sm-5 al-setNew al-radio" v-if="x.type == 4">
            <label v-for="(some, index) in x.showValues" :for="some.value">
              <input type="checkbox"
                :id="some.value"
                :value="some.value"
                v-model="x.value"/>
              <span>{{some.text}}</span>
            </label>
          </div>
          <div class="col-sm-5 al-setNew" v-if="x.type == 5">
            <selectData :searchShow="false" k="value" v="text" v-model="x.value"
              :data="x.showValues"
              @change="show">
            </selectData>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">指派给</label>
          <div class="col-sm-5">
            <selectData :data="taskMan" k="memberId" v="memberName" v-model="item.memberId" :searchShow="true"></selectData>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">预计</label>
          <div class="col-sm-5">
            <div class="input-group ">
              <input type="text" class="form-control" v-model="item.planTime" validate="required|number" fh="taskAdd_planTime">
              <label class="input-group-addon">小时</label>
            </div>
          </div>
          <span class="falseHints" id="taskAdd_planTime"></span>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">开始时间</label>
          <div class="col-sm-5">
            <dateTime v-model="item.startTime" validate="required"></dateTime>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">结束时间</label>
          <div class="col-sm-5">
            <dateTime v-model="item.endTime" validate="required"></dateTime>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">优先级</label>
          <div class="col-sm-5">
            <selectData :data="priority" v="id" v-model="item.priority"></selectData>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">任务描述</label>
          <!--<textarea type="text" class="form-control" v-model="item.content" validate="required"></textarea>-->
          <div class="col-sm-10">
            <editor v-model="item.content"></editor>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label"></label>
          <div class="col-sm-10">
            <button type="button" @click="submit" class="btn btn-primary btn-sm">
              <template v-if="!loading">保存</template>
              <i v-if="loading" class="fa fa-refresh fa-spin"></i>
            </button>
            <button type="button" @click="back" class="btn btn-default btn-sm">返回</button>
          </div>
        </div>
      </formData>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import api from 'src/api'
import formData from 'components/form/form.vue'
import dateTime from 'components/form/dateTime.vue'
import editor from 'components/editor/editor.vue'
import selectData from 'components/form/select.vue'
import iCheck from 'components/form/checkbox.vue'

export default {
  name: 'Project',
  data() {
    return {
      loading: false,
      currentPage: 2,
      attributes: [],
      priority: [{ id: 1 }, { id: 2 }, { id: 3 }],
      item: {
        name: '',
        typeId: '',
        content: '',
        priority: 0,
        projectId: this.$route.params.id,
        values: []
      }
    }
  },
  computed: {
    ...mapGetters({
      typeList: 'projectTaskTypeList',
      taskMan: 'projectTaskMan'
    })
  },
  mounted() {
    console.log('typeList', this.typeList, this.taskMan)
  },
  components: { formData, editor, selectData, iCheck, dateTime },
  asyncData({ store, route }) {
    return Promise.all([store.dispatch('isProjectTaskType'), store.dispatch('isProjectTaskMan', { projectId: route.params.id })])
  },
  methods: {
    show() {
      console.log(this.attributes)
    },
    selectChange(opt) {
      let vm = this
      vm.attributes = []
      vm.typeList.forEach(function(item) {
        if (opt === item.id) {
          vm.attributes = item.attributes.map(function (obj) {
            let some = {attributeId: obj.id, value: ''}
            Object.assign(some, obj)
            if (obj.type === 4) {
              some.value = []
            }
            if (some.defaultValues.length > 0) {
              some.showValues = some.defaultValues.split(',').map(function (val) {
                return {text: val, value: val}
              })
            }
            return some
          })
        }
      })
    },
    back() {
      this.$router.push('/project/task/' + this.item.projectId)
    },
    submit() {
      let vm = this
      let fo = vm.$refs.form.validate()
      if (!fo && vm.item.memberId) return false
      // let num = 0
      // vm.attributes.forEach(function(org) {
      //   if (org.value.length) num++
      // })
      // if (num < vm.attributes.length) {
      //   vm.notify('warning', '任务内容请添加完全')
      //   return
      // }
      if (!vm.item.typeId || !vm.item.typeId.length) {
        vm.notify('warning', '请选择任务类型')
        return
      }
      if (!vm.item.memberId || !vm.item.memberId.length) {
        vm.notify('warning', '请选择指派给谁')
        return
      }
      if (!vm.item.planTime || !vm.item.planTime.length) {
        vm.notify('warning', '请添加预计时间')
        return
      }
      if (!vm.item.priority) {
        vm.notify('warning', '请选择优先级')
        return
      }
      if (!vm.item.content || !vm.item.content.length) {
        vm.notify('warning', '请选择添加任务描述')
        return
      }
      vm.item.id = vm.$uuid()
      vm.item.values = vm.attributes.map(function(obj) {
        if (typeof obj.value === 'object') {
          let str = ''
          obj.value.forEach(function (som) {
            str = `${str}${som},`
          })
          obj.value = str.substring(0, str.length - 1)
        }
        return obj
      })
      vm.loading = true
      api.post('/task/insert', JSON.stringify(this.item)).then((response) => {
        vm.loading = false
        if (response.code === 200) {
          vm.$alert({
            title: '提示',
            okText: '确定',
            content: '添加成功'
          }).then(() => {
            vm.$router.push('/project/task/' + this.item.projectId)
          })
        } else {
          vm.$notify(response.message)
        }
      })
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
<style lang="less">
.al-taskAdd {
  .al-setNew.al-radio {
    label {
      height: 34px;
      line-height: 34px;
      margin: 0 15px 0 0;
      cursor: pointer;
      input {
        cursor: pointer;
      }
      span {
        display: inline-block;
        height: 34px;
        line-height: 34px;
        position: relative;
        top: -3px;
      }
    }
  }
  .al-setNew {
    .main-checkbox {
      display: inline-block;
      margin-right: 10px;
      padding: 7px 0;
    }
  }
}
.form-task {
  .row {
    margin: 0;
  }
  .form-group {
    padding: 5px 0;
    display: table;
    .form-group {
      padding: 0;
    }
    label {
      display: table-cell;
      width: 100px;
      text-align: right;
      font-size: 12px;
      font-weight: bold;
      line-height: 30px;
      padding: 0 10px;
      vertical-align: top;
    }
    .input-group-addon {
      line-height: 28px;
    }
    input.form-control,
    select.form-control {
      min-width: 295px;
      display: table-cell;
    }
    .form-control.w-150 {
      min-width: 150px;
      width: 150px;
    }
    textarea.form-control {
      width: 100%;
      display: table-cell;
      min-height: 150px;
    }
    .input-group-addon {
      font-size: 12px;
      font-weight: bold;
    }
    .fix-border {
      border-left: 0;
      border-right: 0;
    }
  }
}
</style>
