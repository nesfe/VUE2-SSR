<template>
  <div class="panel panel-default">
    <div class="panel-heading">任务 >> {{title}}</div>
    <div class="panel-body">
      <table class="table table-borderless active-disabled table-condensed table-600">
        <tbody>
          <tr class="table-center">
            <th class="th-key">键</th>
            <th class="th-value">值</th>
            <th class="th-actions"></th>
          </tr>
          <tr v-for="item in datas.length" class="text-center">
            <td>
              <input type="text" name="keys[]" id="keys" value="0" class="form-control">
            </td>
            <td>
              <input type="text" name="values" id="values" value="" class="form-control">
            </td>
            <td>
              <a href="javascript:void(0);" @click="addItem()"><span class="fa fa-plus"></span></a>
              <a href="javascript:void(0);" @click="delItem()"><span class="fa fa-remove"></span></a>
            </td>
          </tr>
          <!-- <tr class="text-center">
            <td>
              <span>0</span><input type="hidden" name="keys[]" id="keys" value="0">
            </td>
            <td>
              <input type="text" name="values" id="values" value="" class="form-control">
            </td>
            <td>
              <a href="javascript:void(0);" @click="addItem()"><span class="fa fa-plus"></span></a>
              <a href="javascript:void(0);" @click="delItem()"><span class="fa fa-remove"></span></a>
            </td>
          </tr> -->
          <tr>
            <td colspan="3" class="text-center">
              <!-- <label class="radio-inline">
                <input type="radio" name="lang" value="zh-cn" checked="checked" id="langzh-cn"> 适用当前语言
              </label>
              <label class="radio-inline">
                <input type="radio" name="lang" value="all" id="langall"> 适用所有语言
              </label> -->
              <button type="submit" id="submit" class="btn btn-primary">保存</button>
              <button type="button" class="btn btn-default" onclick="">恢复默认</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'customMain',
    data () {
      return {
        currentPage: 2,
        datas: [
          {
            id: 1
          },
          {
            id: 2
          }
        ]
      }
    },
    props: {
      title: {
        type: String
      }
    },
    template: '<tr class="text-center"><td><span>0</span><input type="hidden" name="keys[]" id="keys" value="0"></td><td><input type="text" name="values" id="values" value="" class="form-control"></td><td><a href="javascript:void(0);" @click="addItem()"><span class="fa fa-plus"></span></a><a href="javascript:void(0);" @click="delItem()"><span class="fa fa-remove"></span></a></td></tr>',
    asyncData ({store}) {
      store.dispatch('')
    },
    methods: {
      addItem () {
        /**
          * 添加行
         **/
        let vm = this
        vm.datas.push({id: vm.datas.length + 1})
        console.log(vm.datas.length)
      },
      delItem () {
        /**
          * 删除行
         **/
      }
    }
  }
</script>

<style lang="less">
.table-600 {
  width: 600px;
}
.table-borderless {
  .table-center > th, .table-center > td{
    text-align: center;
  }
  .th-key {
    width:120px;
  }
  .th-actions {
    width:50px;
  }
  span {
    line-height: 34px;
  }
}
</style>
