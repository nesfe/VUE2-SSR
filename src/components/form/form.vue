<template>
  <form ref="form" autocomplete="off">
    <slot></slot>
  </form>
</template>
<script>
  /**
   * 全局form验证
   * */
  export default {
    data () {
      return {
        listData: [],
        success: 'form-control',
        error: 'form-control form-control-error'
      }
    },
    components: {},
    mounted () {
      let all = this.$refs.form.getElementsByTagName('*')
      for (let i of all) {
        if (i.getAttribute('validate')) {
          this.listData.push(i)
        }
      }
//      console.log(this.listData)
      for (let i of this.listData) {
        let validate = i.getAttribute('validate').split('|')
        i.oninput = () => {
        }
        i.onblur = () => {
          for (let v of validate) {
            if (!this[v](i.value, i)) return false
          }
          return true
        }
      }
    },
    props: {},
    methods: {
      validate () {
        let t = 0
        for (let i of this.listData) {
          let validate = i.getAttribute('validate').split('|')
          for (let v of validate) {
//            if (!this[v](i.value, i)) return false
            if (!this[v](i.value, i)) t++
          }
        }
        if (t) return false
        return true
      },
      errorEvent (i, html) {
        i.className = this.error
        let fh = i.getAttribute('fh')
        fh = document.getElementById(fh)
        if (!fh) return
        fh.innerHTML = html
        fh.style.display = 'block'
      },
      successEvent (i) {
        i.className = this.success
        let fh = i.getAttribute('fh')
        fh = document.getElementById(fh)
        if (!fh) return
        fh.style.display = 'none'
      },
      /**
       * 以下可自定义验证规格
       * */
      required (value, i) {
        if (value) {
          this.successEvent(i)
          return true
        }
        this.errorEvent(i, '此为必填项')
        return false
      },
      number (value, i) {
        if (value && !isNaN(value)) {
          this.successEvent(i)
          return true
        }
        this.errorEvent(i, '请输入数字')
        return false
      },
      email (value, i) {
        let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (reg.test(value)) {
          this.successEvent(i)
          return true
        }
        this.errorEvent(i, '请输入正确的邮箱格式')
        return false
      },
      mobile (value, i) {
        let reg = /^1[34578]\d{9}$/
        if (reg.test(value)) {
          this.successEvent(i)
          return true
        }
        this.errorEvent(i, '请输入正确的手机格式')
        return false
      },
      pwd (value, i) {
        if (value.trim().length > 6) {
          this.successEvent(i)
          return true
        }
        this.errorEvent(i, '请输入6位以上的密码')
        return false
      },
      equalTo (value, i) {
        var id = i.getAttribute('equalTo')
        if (!id) {
          this.errorEvent(i, '不一致')
          return false
        }
        if (value !== document.getElementById(id).value) {
          this.errorEvent(i, '不一致')
          return false
        }
        this.successEvent(i)
        return true
      }
    }
  }
</script>

<style>
  .form-control-error {
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    border: 1px solid #a94442;
  }
</style>
