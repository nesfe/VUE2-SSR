<template>
  <div class="">
    <div class="main row">
      <div class="col-lg-12">
        <div class="col-lg-3">
          <panel :title="title" @art-click="changeDepart"></panel>
        </div>
        <div class="col-lg-9">
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td width="150"><input type="checkbox" v-model="allCheckedIn"> 组内用户</td>
                <td>
                  <label class="checkbox-inline" v-for="(item, index) in datas" v-if="item.check==='true'">
                    <input type="checkbox" :id="item.id" :value="item.id" :checked="item.check==='true'?true:false" @change="getChecked(index)"> {{item.name}}
                  </label>
                </td>
              </tr>
              <tr>
                <td><input type="checkbox" v-model="allCheckedOut"> 组外用户</td>
                <td>
                  <label class="checkbox-inline" v-for="(item, index) in datas" v-if="item.check!=='true'">
                    <input type="checkbox" :id="item.id" :value="item.id" :checked="item.check==='true'?true:false" @change="getChecked(index)"> {{item.name}}
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="view-btn-group art-btn-group">
            <btn class="" type="primary" @click="doSubmit">保存</btn>
            <a href="javascript:void(0)" class="btn btn-default" @click="goBack">返回</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import api from 'src/api'
import panel from '../components/panel.vue'

export default {
  name: 'User',
  title () {
    return '成员'
  },
  data () {
    return {
      title: '部门结构',
      powerId: '',
      datas: [],
      allCheckedOut: false,
      allCheckedIn: true,
      checkedList: []
    }
  },
  computed: {
    ...mapGetters({
      groupMenberList: 'groupMenberList'  // 用户列表
    })
  },
  components: {
    panel
  },
  mounted () {
    // 客户端请求
    // 获取地址栏参数
    this.powerId = this.$route.params.id
    this.datas = this.groupMenberList.memberList
  },
  asyncData ({ store, route }) {
    let param = {
      id: route.params.id,
      type: 1
    }
    return store.dispatch('isGroupMemberList', param)
  },
  methods: {
    ...mapActions([
      'isGroupMemberList'
    ]),
    changeDepart (data) {
      /**
        * 根据部门获取用户列表
       **/
      console.log('改变部门', data)
      let param = {
        departmentId: data
      }
      this.isGroupMemberList(param)
    },
    getChecked (index) {
      /**
       * checkbox change事件
       **/
      let vm = this
      vm.datas[index].check = vm.datas[index].check === 'true' ? 'false' : 'true'
      console.log(vm.datas[index].check)
      // vm.datas.forEach(function (item) {
      //   if (item.check === 'false') {
      //     vm.allChecked = false
      //   }
      // })
    },
    // getAllChecked () {
    //   /**
    //    * 全选
    //    **/
    //   let vm = this
    //   vm.datas.forEach(function (item) {
    //     if (vm.allChecked) {
    //       item.check = 'true'
    //     } else {
    //       item.check = 'false'
    //     }
    //   })
    // },
    doSubmit () {
      /**
       * 提交
       **/
      let vm = this
      let params = {}
      params.id = vm.powerId
      vm.datas.forEach(function (item) {
        if (item.check === 'true') {
          vm.checkedList.push(item.id)
        }
      })
      params.memberId = vm.checkedList.join(',')
      api.post('/permissiongroup/update', params).then((response) => {
        if (response.code === 200) {
          this.$notify({
            type: 'success',
            content: '修改成功'
          })
          vm.goBack()
        } else {
          this.$notify({
            type: 'danger',
            content: response.message
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    goBack () {
      /**
       * 返回上一页
       **/
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less">
.checkbox-all {
  padding-left: 25px;
  line-height: 34px;
}
.art-pagination {
  margin: 0;
  padding: 0;
}
</style>
