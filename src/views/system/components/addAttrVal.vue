<template>
  <modal title="属性编辑" v-model="show" @hide="$emit('close-model')" :footer="false">
    <formData ref="formAddAttr" class="form-horizontal paddingRight al-addAttr">
      <div class="form-group">
        <label class="col-xs-2" align="right">属 性</label>
        <div class="col-xs-10">
          <input type="text" v-model="form.name" class="form-control" validate="required" fh="addAttr_name">
        </div>
        <span class="falseHints" id="addAttr_name"></span>
      </div>
      <div class="form-group">
        <label class="col-xs-2" align="right">验 证</label>
        <div class="col-xs-5">
          <label v-for="(some, index) in isMust" :for="some.value">
            <input type="radio" name="emptyStatus"
              :id="some.value"
              :value="some.value"
              v-model="form.emptyStatus"/>
            <span>{{some.text}}</span>
          </label>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2" align="right">类 型</label>
        <div class="col-xs-5">
          <select class="form-control" placeholder="请选择任务类型"
            v-model="form.type">
            <option v-for="obj in form.typeList" :value="obj.value">{{obj.text}}</option>
          </select>
        </div>
      </div>
      <div class="form-group" v-show="form.type > 2 && form.type !== 6">
        <label class="col-xs-2" align="right">添 值</label>
        <div class="col-xs-9">
          <input type="text" class="form-control" placeholder="请输入可选属性值"
            v-model="valueNow"
            @keyup.enter="addOne">
        </div>
        <div class="col-xs-1 al-addbox">
          <btn type="primary" @click="addOne">+</btn>
        </div>
      </div>
      <div class="form-group" v-show="form.type > 2 && form.type !== 6" v-for="(item, index) in valueArr">
        <label class="col-xs-2" align="right"></label>
        <div class="col-xs-9">
          <input type="text" v-model="item.name" class="form-control" disabled>
        </div>
        <div class="col-xs-1 al-addbox">
          <btn type="primary" @click="delOne(index)">-</btn>
        </div>
      </div>
      <div class="form-group">
        <label class="col-xs-2"></label>
        <div class="col-xs-10">
          <btn @click="$emit('close-model')">取 消</btn>
          <btn type="primary" @click="validate">确 定</btn>
        </div>
      </div>
    </formData>
  </modal>
</template>
<script>
  import formData from 'components/form/form.vue'
  export default {
    name: 'addAttrVal',
    props: {
      giveAttr: {
        type: Object
      }
    },
    data () {
      return {
        show: true,
        form: {
          name: '',              // -- 属性名称
          type: '',              // -- 属性类型
          defaultValues: ''      // -- 属性值
        },
        isMust: [{
          value: 2,
          text: '是'
        }, {
          value: 1,
          text: '否'
        }],
        valueNow: '',            // -- 当前属性值
        valueArr: []             // -- 属性值列表
      }
    },
    components: {formData},
    created() {
      let vm = this
      Object.assign(vm.form, vm.giveAttr)
      if (vm.giveAttr.defaultValues.length) {
        vm.valueArr = vm.giveAttr.defaultValues.split(',')
        vm.valueArr = vm.valueArr.map(function (item) {
          return {name: item}
        })
      }
    },
    methods: {
      addOne () {
        /**
         * 属性值添加
         */
        let vm = this
        let name = vm.valueNow
        if (!name.length) {
          vm.notify('danger', '请填写属性值')
          return
        }
        let num = 0
        vm.valueArr.forEach(function (item) {
          if (item.name === name) num++
        })
        if (num) {
          vm.notify('danger', '此属性值已存在')
          return
        }
        vm.valueArr.unshift({name})
        vm.valueNow = ''
      },
      delOne (index) {
        /**
         * 属性值删除
         */
        this.valueArr.splice(index, 1)
      },
      validate () {
        /**
         * 表单验证
         */
        let vm = this
        let fo = this.$refs.formAddAttr.validate()
        if (!fo) return false
        let defaultValues = ''
        if (vm.form.type > 2 && vm.form.type !== 6) {
          if (!vm.valueArr.length) {
            vm.notify('warning', '请添加至少一个属性值')
            return false
          }
          vm.valueArr.forEach(function (item) {
            defaultValues = `${defaultValues}${item.name},`
          })
          vm.form.defaultValues = defaultValues.substring(0, defaultValues.length - 1)
        } else {
          vm.form.defaultValues = ''
        }
        vm.$emit('close-model', vm.form)
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
.al-addAttr {
  label {
    line-height: 34px
  }
  .form-group {
    .al-addbox {
      padding: 0;
      a {
        display: inline-block;
        height: 34px;
        line-height: 34px;
        margin-left: 2px;
      }
    }
  }
  .col-xs-2 {
    padding-left: 0
  }
  .col-xs-5 {
    padding-left: 0;
    label {
      margin-right: 10px;
      cursor: pointer;
      input {
        cursor: pointer;
      }
    }
  }
  .col-xs-7 {
    padding-left: 0
  }
  .col-xs-9 {
    padding-left: 0
  }
  .col-xs-10 {
    padding-left: 0
  }
}
</style>
