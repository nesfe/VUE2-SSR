<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li :class="active === 'all' ? 'active' : ''" @click="powerFilter('all')">
          <a href="javascript:;">所有权限</a>
        </li>
        <li :class="active === item.id ? 'active' : ''" @click="powerFilter(item.id, key)" v-for="(item, key) in powerData">
          <a href="javascript:;">{{item.name}}</a>
        </li>
      </ul>
    </div>
    <div class="main">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>模块</th>
            <th>方法</th>
          </tr>
        </thead>
        <tbody v-for="(item, key) in powerData" v-if="active === item.id || active === 'all'">
          <tr v-for="(levelTwo, KeyTwo) in item.child">
            <td align="right" width="150">
              <label class="control-label">
                <input type="checkbox" v-model="levelTwo.check" :checked="levelTwo.check" @change="moduleChange(key, KeyTwo)"> {{levelTwo.name}}
              </label>
            </td>
            <td>
              <label v-for="(levelThree, keyThree) in levelTwo.child" class="control-label col-xs-3">
                <input type="checkbox" v-model="levelThree.check" :checked="levelThree.check" @change="childChange(key, KeyTwo, keyThree)"> {{levelThree.name}} 
              </label>
            </td>
          </tr>
        </tbody>
        <tbody v-if="powerData.length">
          <tr>
            <td align="right" width="150">
              <label class="control-label">
                <input type="checkbox" v-model="allChecked" :checked="allChecked" @change="allChange"> 全选
              </label>
            </td>
            <td>
              <div class="view-btn-group">
                <btn class="" type="primary" @click="doSubmit">保存</btn>
                <a href="javascript:void(0)" class="btn btn-default" @click="goBack">返回</a>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="!powerData.length">
          <tr>
            <td colspan="2" align="center">
              暂无数据
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import api from 'src/api'
  import { deepCopy } from 'util/util'
  export default {
    name: 'editPower',
    title () {
      return '权限维护'
    },
    data () {
      return {
        active: 'all',
        powerId: '',
        allChecked: false,
        powerData: []
      }
    },
    computed: {
      ...mapGetters({
        powerList: 'powerList'
      })
    },
    created () {
      this.powerData = deepCopy(this.powerList)
    },
    mounted () {
      console.log('客户端接收到的~~~所有权限~~~数据：', this.powerList)
      this.powerId = this.$route.params.id
      this.powerAllCheck()
    },
    asyncData ({store, route}) {
      let param = {
        groupId: route.params.id
      }
      return store.dispatch('isPowerList', param)
    },
    methods: {
      powerFilter (id, key) {
        /**
         * 筛选
         **/
        this.active = id
        this.powerAllCheck()
      },
      powerAllCheck () {
        /**
         * 判断所有权限是否全选
         **/
        let powerCheckAll = []
        this.powerData.forEach((item, key) => {
          if (this.active === item.id || this.active === 'all') {
            powerCheckAll[key] = []
            item.child.forEach((children, index) => {
              powerCheckAll[key][index] = {}
              powerCheckAll[key][index].check = children.check
              powerCheckAll[key][index].power = []
              children.child.forEach((power, i) => {
                powerCheckAll[key][index].power[i] = power.check
              })
            })
          }
        })
        let flag = true
        powerCheckAll.forEach((one) => {
          one.forEach((two) => {
            if (!two.check) {
              flag = false
              return
            }
            two.power.forEach((three, keyThree) => {
              if (!three) {
                flag = false
                return
              }
            })
          })
        })
        if (flag) this.allChecked = true
        else this.allChecked = false
      },
      moduleChange (key, keyTwo) {
        /**
         * 分类change事件
         **/
        this.powerData[key].child[keyTwo].child.forEach((children) => {
          children.check = this.powerData[key].child[keyTwo].check
        })
        this.powerAllCheck()
      },
      childChange (key, KeyTwo, keyThree) {
        /**
         * 权限change事件
         **/
        // let moduleCheckAll = true
        // this.powerData[key].child[KeyTwo].child.forEach((children, i) => {
        //   if (!children.check) {
        //     moduleCheckAll = false
        //   }
        //   this.powerData[key].child[KeyTwo].check = false
        //   if (i === (this.powerData[key].child[KeyTwo].child.length - 1) && moduleCheckAll) {
        //     this.powerData[key].child[KeyTwo].check = true
        //   }
        // })
        if (this.powerData[key].child[KeyTwo].child[keyThree].check) this.powerData[key].child[KeyTwo].check = true
        this.powerAllCheck()
      },
      allChange () {
        /**
         * 全选change事件
         **/
        let allChangeFun = (data, flag) => {
          data.forEach((item) => {
            if (this.active === item.id || !flag || this.active === 'all') {
              item.check = this.allChecked
              if (item.child.length) allChangeFun(item.child, 0)
            }
          })
        }
        allChangeFun(this.powerData, 1)
      },
      doSubmit () {
        /**
         * 提交
         **/
        let params = {}
        params.id = this.powerId
        params.menuId = ''
        this.powerData.forEach((one) => {
          one.child.forEach((two) => {
            if (two.check) {
              params.menuId += two.id + ','
            }
            two.child.forEach((three) => {
              if (three.check) {
                params.menuId += three.id + ','
              }
            })
          })
        })
        api.post('/group/update', params).then((response) => {
          if (response.code === 200) {
            this.$notify({
              type: 'success',
              content: '修改成功'
            })
            // 修改成功重新获取用户状态
            // this.$store.dispatch(`doUsers`)
            this.goBack()
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
        // this.$router.go(-1)
        setTimeout(() => {
          window.location.href = '/organization/power'
        }, 1000)
      }
    }
  }
</script>

<style lang="less">
  .main {
    padding: 20px;
  }

  #add_modal {
    .control-label {
      text-align: left;
    }
  }
</style>
