<template>
  <div class="main-checkbox" @click="click">
    <div :class="checked ? 'form-'+type+' active':'form-'+type">
      <input :type="type" ref="check" @change="setStates" :name="name" :value="value">
      <i v-if="checked" :class="type==='checkbox'?'glyphicon glyphicon-ok':''"></i>
    </div>
    <slot></slot>
  </div>
</template>
<script>
  /**
   * 全局checkbox
   * */
  export default {
    data () {
      return {
        checked: false,
        cr: false
      }
    },
    watch: {
      checked: function (newData, oldData) {
//        if (newData) this.editor.html(newData)
        if (this.$refs.check.checked !== newData) this.$refs.check.checked = newData
      },
      value: function (newData, oldData) {
        console.log('value', newData)
      }
    },
    components: {},
    mounted () {
      if (this.iChecked) {
        this.checked = true
//        this.$refs.check.checked = true
      }
    },
    props: {
      iChecked: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'checkbox'
      },
      name: String,
      value: String
    },
    methods: {
      click () {
        this.$refs.check.click()
      },
      setStates () {
        if (this.$refs.check.checked !== this.checked) this.checked = this.$refs.check.checked
        this.$emit('change', this.checked)
      },
      updateStates () {
        console.log(this.$refs.check.checked)
      }
    }
  }
</script>

<style lang="less">
  .main-checkbox {
    line-height: 18px;
    cursor: pointer;
  }

  .form-radio {
    border-radius: 100%;
  }

  .form-checkbox, .form-radio {
    float: left;
    width: 18px;
    height: 18px;
    border: 1px solid #d3cfc8;
    background-color: #fff;
    input {
      display: none;
    }
    .glyphicon {
      display: none;
    }
    &:hover {
      border: 1px solid #2489c5;
    }
    &.active {
      /*border: 2px solid #2489c5;*/
      /*background-color: #2489c5;*/
      border: 1px solid #2489c5;
      color: #2489c5;
      text-align: center;
      .glyphicon {
        display: block;
        font-size: 1px;
        // margin-top: 2px;
      }
    }
  }
</style>
