<template>
  <dropdown ref="dropdown" :class="dropdownClass">
    <div :class="'input-group input-group-up input-group-'+size">
      <input class="form-control" type="text" v-model="inputData" readonly="readonly" :validate="validate" :placeholder="placeholder">
      <div class="input-group-btn">
        <btn class="dropdown-toggle" ref="btn"><i class="glyphicon glyphicon-calendar"></i></btn>
      </div>
    </div>
    <ul class="dropdown-menu">
      <li style="padding: 10px;" class="text-center" v-show="timeShow==1">
        <date-picker v-model="date" format="yyyy-MM-dd"/>
      </li>
      <li style="padding: 10px;" class="text-center" v-show="timeShow==2">
        <time-picker v-model="time" :show-meridian="false"/>
        <div><br>
          <div class="text-center">
            <button data-action="select" type="button" class="btn btn-info btn-sm" @click="ok">确定</button>
            <button data-action="select" type="button" class="btn btn-default btn-sm" @click="back">返回</button>
          </div>
        </div>
      </li>
    </ul>
    <!--<template slot="dropdown">-->
    <!--<li>-->
    <!--<date-picker v-model="dataTime" format="yyyy-MM-dd"/>-->
    <!--</li>-->
    <!--</template>-->
    <!--<li class="text-center">-->
    <!--<time-picker v-model="time" :show-meridian="false"/>-->
    <!--</li>-->
    <!--</template>-->
  </dropdown>
</template>
<script>
  /**
   * 全局时间输入框
   * */
  export default {
    data () {
      return {
        dropdownClass: 'dropdown-datetime',
        inputData: '',        // 显示的数据
        dateDate: '',         // 暂存日期
        timeShow: 1,          // 显示
        date: '',             // 日期
        time: new Date()      // 时间
      }
    },
    components: {},
    mounted () {
      this.update()
    },
    props: {
      validate: String,
      value: [String, Number],
      size: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      }
    },
    watch: {
      value: function (newData, oldData) {
        this.update()
      },
      date: function (newData, oldData) {
        if (!newData) {
          this.inputData = ''
          this.$emit('input', '')
          this.clear()
          return
        }
        this.dateDate = newData
        // this.$emit('input', new Date(newData).getTime())
        this.timeShow = 2
      }
    },
    methods: {
      ok () {
        this.inputData = this.dateDate + ' ' + this.time.Format('hh:mm:ss')
        this.$emit('input', new Date(this.inputData).getTime())
        this.clear()
      },
      back () {
        this.timeShow = 1
      },
      clear () {
        this.back()
        this.$refs.btn.click()
      },
      update () {
        if (this.value) {
          let data = new Date(this.value).Format('yyyy-MM-dd')
          let timeStr = new Date(this.value).Format('yyyy-MM-dd hh:mm:ss')
          let timeArr = timeStr.split(':')
          timeStr = `${timeArr[0]}:${timeArr[1]}:00`
          this.inputData = timeStr
          this.date = data
          this.time = new Date(this.value)
        }
      }
    }
  }
</script>
<style lang="less">
  .dropdown-menu {
    .text-center table {
      margin: 0 auto;
    }
  }

  .dropdown-datetime .dropdown-menu:last-child {
    display: none !important;
  }
</style>
