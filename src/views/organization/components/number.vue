<template>
  <div class="row">
    <div class="col-xs-12">
      <!-- <div class="col-xs-3">
        <panel></panel>
      </div> -->
      <div class="member-form col-xs-12">
        <form class="form-horizontal">
          <div class="form-group col-xs-12">
            <label class="col-xs-3">组内用户 <input type="checkbox" :checked="innerGroupAll" @change="innerGroupAllChange"></label>
            <div class="col-xs-9">
              <label class="col-xs-4" v-for="(item, key) in innerGroup">
                <input type="checkbox" :checked="item.check" @change="innerGroupChange(key)"> {{item.name}}
              </label>
            </div>
          </div>
          <div class="form-group col-xs-12">
            <label class="col-xs-3">组外用户 <input type="checkbox" :checked="outerGroupAll" @change="outerGroupAllChange"></label>
            <div class="col-xs-9">
              <label class="col-xs-4" v-for="(item, key) in outerGroup">
                <input type="checkbox" :checked="item.check" @change="outerGroupChange(key)"> {{item.name}}
              </label>
            </div>
          </div>
          <div align="center">
            <btn type="primary" @click="save">保存</btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import panel from '../components/panel.vue'
import api from 'src/api'
import { deepCopy } from 'util/util'
export default {
  name: 'UserGroup',
  data () {
    return {
      innerGroupAll: false,
      innerGroup: [],
      outerGroupAll: false,
      outerGroup: [],
      groupIdArr: [],
      groupMenberData: []
    }
  },
  props: {
    groupMenberList: {
      type: Array,
      default: []
    },
    groupId: {
      type: String,
      default: ''
    }
  },
  created () {
    this.groupMenberData = deepCopy(this.groupMenberList)
  },
  mounted () {
    this.setData()
  },
  components: {
    panel
  },
  methods: {
    setData () {
      // 处理数据格式
      this.groupMenberData.forEach(item => {
        if (item.check) {
          this.innerGroup.push(item)
        } else {
          this.outerGroup.push(item)
        }
      })
      // 组内用户checked
      this.innerGroupCheck()
    },
    innerGroupAllChange () {
      this.innerGroupAll = !this.innerGroupAll
      this.innerGroup.forEach(item => {
        item.check = this.innerGroupAll
      })
    },
    innerGroupChange (key) {
      this.innerGroup[key].check = !this.innerGroup[key].check
      this.innerGroupCheck()
    },
    innerGroupCheck () {
      let checkAll = true
      this.innerGroup.forEach((item, key) => {
        if (!item.check) {
          checkAll = false
        }
        this.innerGroupAll = false
        if (key === (this.innerGroup.length - 1) && checkAll) {
          this.innerGroupAll = true
        }
      })
    },
    outerGroupAllChange () {
      this.outerGroupAll = !this.outerGroupAll
      this.outerGroup.forEach(item => {
        item.check = this.outerGroupAll
      })
    },
    outerGroupChange (key) {
      this.outerGroup[key].check = !this.outerGroup[key].check
      this.outerGroupCheck()
    },
    outerGroupCheck () {
      let checkAll = true
      this.outerGroup.forEach((item, key) => {
        if (!item.check) {
          checkAll = false
        }
        this.outerGroupAll = false
        if (key === (this.outerGroup.length - 1) && checkAll) {
          this.outerGroupAll = true
        }
      })
    },
    save () {
      this.innerGroup.forEach((item) => {
        if (item.check) {
          this.groupIdArr.push(item.userId)
        }
      })
      this.outerGroup.forEach((item) => {
        if (item.check) {
          this.groupIdArr.push(item.userId)
        }
      })
      let param = {
        groupId: this.groupId,
        userIds: this.groupIdArr.join(',')
      }
      api.post('/groupUser/addByGroup', param).then((response) => {
        if (response.code === 200) {
          this.$emit('save')
          this.$notify({
            type: 'success',
            content: '操作成功'
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
    }
  }
}
</script>
<style lang="less">
.member-form {
  border: 1px solid #dddddd;
  padding: 15px 0;
}
</style>
