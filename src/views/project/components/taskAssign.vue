<template>
  <modal v-model="open" :title="title" @hide="callback" ref="modal" id="modal-demo" size="lg" :backdrop="false">
    <formData ref="form" class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-2 control-label">指派给</label>
        <!--<select class="form-control" v-model="item.assignedId" validate="required">-->
        <!--<option v-for="i in typeList" :value="i.memberId">{{i.memberName}}</option>-->
        <!--</select>-->
        <div class="col-sm-10">
          <selectData :data="typeList" k="memberId" v="memberName" v-model="item.memberId" :searchShow="true"></selectData>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">备注</label>
        <!--<textarea type="text" class="form-control" v-model="item.remark" validate="required"></textarea>-->
        <div class="col-sm-10">
          <editor v-model="item.remark"></editor>
        </div>
      </div>
    </formData>
    <div slot="footer">
      <btn size="sm" @click="open=false">取消</btn>
      <btn size="sm" type="primary" @click="submit">
        <template v-if="!loading">确定指派</template>
        <i v-if="loading" class="fa fa-refresh fa-spin"></i>
      </btn>
    </div>
  </modal>
</template>
<script>
import formData from 'components/form/form.vue'
import editor from 'components/editor/editor.vue'
import api from 'src/api'
import selectData from 'components/form/select.vue'

export default {
  data() {
    return {
      loading: false,
      open: false,
      item: {},
      title: ''
    }
  },
  components: { formData, editor, selectData },
  mounted() {
    this.open = !!this.value
  },
  watch: {
    'value' (val, oldValue) {
      this.setNewValue(val)
    }
  },
  props: {
    value: Boolean,
    typeList: Array,
    data: Object
  },
  methods: {
    setNewValue(val) {
      this.item = {}
      this.title = this.data.name + ' > 指派'
      this.open = val
    },
    callback(hsg) {
      this.$emit('input', false)
    },
    submit() {
      console.log(this.item)
      let fo = this.$refs.form.validate()
      if (!fo) return false
      this.item.taskId = this.data.id
      this.loading = true
      this.item.name = this.data.name
      api.post('/task/change', this.item).then((response) => {
        this.loading = false
        if (response.code === 200) {
          // this.$alert('添加成功, 3秒后跳转到项目列表')
          this.$alert({
            title: '提示',
            okText: '确定',
            content: '指派成功'
          }).then(() => {
            // this.$router.push('/project/task/' + this.item.projectId)
            this.$emit('input', false)
            this.$emit('success')
            this.open = false
          })
        } else {
          this.$notify(response.message)
        }
      }).catch((error) => {
        this.$notify(error.message)
        this.loading = false
      })
    }
  }
}

</script>
