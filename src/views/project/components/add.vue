<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li class="active">
          <a>添加项目</a>
        </li>
      </ul>
    </div>
    <div class="main">
      <formData ref="form" class="col-lg-12 col-md-12 col-sm-12 form-horizontal">
        <div class="form-group ">
          <label class="col-sm-2 control-label">项目名称</label>
          <div class="col-sm-5">
            <input type="text" class="form-control" v-model="item.name" validate="required" fh="fh_name">
          </div>
          <span class="col-sm-5 col-sm-offset-2 falseHints" id="fh_name"></span>
        </div>
        <div class="form-group ">
          <label class="col-sm-2 control-label">项目代号</label>
          <div class="col-sm-5">
            <input type="text" class="form-control" v-model="item.code" validate="required" fh="fh_code">
          </div>
          <span class="col-sm-5 col-sm-offset-2 falseHints" id="fh_code"></span>
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
          <label class="col-sm-2 control-label">可用工作日</label>
          <div class="col-sm-5">
            <div class="input-group input-group-up">
              <input type="text" class="form-control" v-model="item.workDay" validate="required|number" fh="workDay">
              <label class="input-group-addon">天</label>
            </div>
          </div>
          <span class="col-sm-5 col-sm-offset-2 falseHints" id="workDay"></span>
        </div>
        <!--<div class="form-group">-->
        <!--<label class="col-sm-2 control-label">团队名称</label>-->
        <!--<div class="col-sm-5">-->
        <!--<input type="text" class="form-control" v-model="item.teamName" validate="required" fh="teamName">-->
        <!--</div>-->
        <!--<span class="col-sm-5 col-sm-offset-2 falseHints" id="teamName"></span>-->
        <!--</div>-->
        <div class="form-group">
          <label class="col-sm-2 control-label">项目类型</label>
          <div class="col-sm-5">
            <selectData v-model="item.type" :data="typeList" validate="required" fh="selectFh" k="remark" v="remark" :searchShow="true"></selectData>
          </div>
          <span class="col-sm-5 col-sm-offset-2 falseHints" id="selectFh"></span>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">项目描述</label>
          <!--<textarea type="text" class="form-control" v-model="item.content" validate="required"></textarea>-->
          <div class="col-sm-10">
            <editor v-model="item.content"></editor>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">访问控制</label>
          <!--<div class="col-sm-10">-->
          <!--<iCheck ref="call" @change="radioChange" type="radio" v-model="item.radio" name="radio">&nbsp;默认设置（有项目视图权限，即可访问）</iCheck>-->
          <!--<iCheck ref="call" @change="radioChange" type="radio" v-model="item.radio" name="radio">&nbsp;私有项目（只有项目团队成员才能访问）</iCheck>-->
          <!--<iCheck ref="call" @change="radioChange" type="radio" v-model="item.radio" name="radio">&nbsp;自定义白名单（团队成员和白名单的成员可以访问）</iCheck>-->
          <!--</div>-->
          <div class="col-sm-10">
            <div class="projectAdd">
              <iCheck @change="checkChange" ref="check" v-for="i in groupList.data">&nbsp;{{i.name}}</iCheck>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label"></label>
          <div class="col-sm-5">
            <button type="button" class="btn btn-primary btn-sm" @click="submit">
              <template v-if="!loading">保存</template>
              <i v-if="loading" class="fa fa-refresh fa-spin"></i>
            </button>
            <button type="button" class="btn btn-default btn-sm" @click="back">返回</button>
          </div>
        </div>
      </formData>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import formData from 'components/form/form.vue'
  import editor from 'components/editor/editor.vue'
  import selectData from 'components/form/select.vue'
  import dateTime from 'components/form/dateTime.vue'
  import iCheck from 'components/form/checkbox.vue'
  import api from 'src/api'

  export default {
    name: 'Project',
    data () {
      return {
        loading: false,
        currentPage: 2,
        item: {
          name: '',
          visitStatus: '1',
          groupIds: []
        }
      }
    },
    computed: {
      ...mapGetters({
        typeList: 'projectTypeList',
        groupList: 'powerGroupList'
      })
    },
    components: {formData, editor, selectData, iCheck, dateTime},
    asyncData ({store}) {
      return Promise.all([store.dispatch('isProjectType'), store.dispatch('isPowerGroupList')])
    },
    mounted () {
      console.log(this.groupList)
    },
    methods: {
      checkChange () {
        let arr = []
        for (let i in this.$refs.check) {
          if (this.$refs.check[i].checked) {
            arr.push(this.groupList.data[i].id)
          }
        }
        this.item.groupIds = arr
      },
      radioChange () {
        console.log(this.$refs)
//        for (let i in this.$refs.radios) {
//          console.log(this.$refs.radios[i])
//          i.updateStates()
//        }
      },
      error (content) {
        this.loading = false
        this.$notify({type: 'danger', content, dismissible: false, duration: 2000})
      },
      back () {
        this.$router.push('/project/index')
      },
      submit () {
        console.log(this.item)
        let fo = this.$refs.form.validate()
        if (!fo || !this.item.groupIds.length) {
          this.error('请全部填写选择数据')
          return false
        }
        this.loading = true
        this.item.id = this.$uuid()
        api.post('/project/insert', JSON.stringify(this.item)).then((response) => {
          if (response.code === 200) {
            this.$alert({
              title: '提示',
              okText: '确定',
              content: '添加成功'
            }).then(() => {
              console.log(response)
              this.$router.push('/project/index')
            })
          } else {
            this.error(response.message)
          }
        }).catch((error) => {
          this.error(error.message)
        })
      }
    }
  }
</script>
<style lang="less">
  .form-project {
    /*width: 100%;*/
    /*max-width: 640px;*/
    /*margin: 0 auto;*/
  }

  .form-control[readonly] {
    background-color: #fff;
  }

  .main .form-horizontal {
    float: inherit !important;
  }

  .falseHints {
    color: #a94442;
    font-size: 13px;
    padding-top: 5px;
    display: none;
  }

  .projectAdd {
    .main-checkbox {
      float: left;
      margin-right: 30px;
      margin-top: 7px;
    }
  }

  .control-label {
    .fa-asterisk {
      margin-top: -2px;
      font-size: 11px;
      color: #a94442;
    }
  }
</style>
