<template>
  <div class="">
    <div class="outer">
      <div class="company-inner">
        <div class="featurebar">
          <ul class="ul">
            <li><strong>公司信息</strong></li>
            <li class="pull-right"><button class="btn btn-primary" @click="openModal" @hide="editModalClose">编辑</button></li>
          </ul>
        </div>
        <div class="company-info">
          <div class="info-item">
            <b>公司名称</b>
            <span>{{companyData.name}}</span>
          </div>
          <div class="info-item">
            <b>联系电话</b>
            <span>{{companyData.telephone}}</span>
          </div>
          <div class="info-item">
            <b>传真</b>
            <span>{{companyData.fax}}</span>
          </div>
          <div class="info-item">
            <b>通讯地址</b>
            <span>{{companyData.address}}</span>
          </div>
          <div class="info-item">
            <b>邮政编码</b>
            <span>{{companyData.postCode}}</span>
          </div>
          <div class="info-item">
            <b>官网</b>
            <span>{{companyData.officialWebsite}}</span>
          </div>
          <div class="info-item">
            <b>内网</b>
            <span>{{companyData.intranet}}</span>
          </div>
          <div class="info-item">
            <b>匿名登录</b>
            <span>{{companyData.anonymousLogin === 1?'不允许':'允许'}}</span>
          </div>
        </div>
      </div>
    </div>
    <modal v-model="editModal" :title="companyData.name" @hide="editModalClose" ref="modal" id="edit_modal" :footer="false">
      <form class="form-horizontal">
        <div class="form-group">
          <label for="name" class="col-sm-3 control-label"><span class="text-danger">* </span> 公司名称</label>
          <div class="col-sm-8">
            <input type="text" v-model="ruleForm.name" class="form-control" id="name" placeholder="公司名称">
          </div>
        </div>
        <div class="form-group">
          <label for="telephone" class="col-sm-3 control-label">联系电话</label>
          <div class="col-sm-8">
            <input type="tel" v-model="ruleForm.telephone" class="form-control" id="telephone" placeholder="联系电话">
          </div>
        </div>
        <div class="form-group">
          <label for="fax" class="col-sm-3 control-label">传真</label>
          <div class="col-sm-8">
            <input type="tel" v-model="ruleForm.fax" class="form-control" id="fax" placeholder="传真">
          </div>
        </div>
        <div class="form-group">
          <label for="address" class="col-sm-3 control-label">通讯地址</label>
          <div class="col-sm-8">
            <input type="text" v-model="ruleForm.address" class="form-control" id="address" placeholder="通讯地址">
          </div>
        </div>
        <div class="form-group">
          <label for="postCode" class="col-sm-3 control-label">邮政编码</label>
          <div class="col-sm-8">
            <input type="tel" v-model="ruleForm.postCode" class="form-control" id="postCode" placeholder="邮政编码">
          </div>
        </div>
        <div class="form-group">
          <label for="officialWebsite" class="col-sm-3 control-label">官网</label>
          <div class="col-sm-8">
            <input type="text" v-model="ruleForm.officialWebsite" class="form-control" id="officialWebsite" placeholder="官网">
          </div>
        </div>
        <div class="form-group">
          <label for="intranet" class="col-sm-3 control-label">内网</label>
          <div class="col-sm-8">
            <input type="text" v-model="ruleForm.intranet" class="form-control" id="intranet" placeholder="内网">
          </div>
        </div>
        <div class="form-group">
          <label for="intranet" class="col-sm-3 control-label">匿名登录</label>
          <div class="col-sm-8">
            <label class="radio-inline">
              <input type="radio" name="inlineRadioOptions" v-model="ruleForm.anonymousLogin" value="1" checked> 不允许
            </label>
            <label class="radio-inline">
              <input type="radio" name="inlineRadioOptions" v-model="ruleForm.anonymousLogin" value="2"> 允许
            </label>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3"></label>
          <div class="col-sm-8">
            <btn type="primary" @click="doSubmit">保存</btn>
          </div>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import api from 'src/api'
  import panel from '../components/panel.vue'
  import panelChild from '../components/panelChild.vue'
  export default {
    name: 'department',
    title () {
      return '公司'
    },
    data () {
      return {
        editModal: false,
        ruleForm: {
          name: '',
          telephone: '',
          fax: '',
          address: '',
          postCode: '',
          officialWebsite: '',
          intranet: ''
        }
      }
    },
    components: {
      panel,
      panelChild
    },
    computed: {
      ...mapGetters({
        companyData: 'companyData'
      })
    },
    mounted () {
      // 客户端请求axios
      console.log('客户端~~~~~~公司', this.companyData)
    },
    asyncData ({store}) {
      return store.dispatch('isCompany')
    },
    methods: {
      ...mapActions([
        'isCompany'
      ]),
      doSubmit () {
        /**
         * 提交
         **/
        let vm = this
        api.post('/company/update', vm.ruleForm).then((response) => {
          vm.editModalClose()
          vm.isCompany()
          if (response.code === 200) {
            this.$notify({
              type: 'success',
              content: '修改成功'
            })
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
      openModal () {
        /**
         * 弹窗打开
         */
        let vm = this
        vm.editModal = true
        for (var i in vm.companyData) {
          vm.ruleForm[i] = vm.companyData[i]
        }
      },
      editModalClose () {
        /**
         * 弹窗关闭
         */
        let vm = this
        vm.editModal = false
        // vm.addForm.name = ''
        // vm.addForm.describe = ''
      }
    }
  }
</script>

<style lang="less">
.outer {
  padding:20px;
}
.company-inner {
  max-width: 600px;
  margin: 0 auto;
  padding: 0;
  border: 1px solid #ddd;
  .company-info {
    padding:20px;
    .info-item {
      line-height: 28px;
      b {
        display: inline-block;
        width:100px;
      }
    }
  }
}
</style>
