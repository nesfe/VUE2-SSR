<template>
  <div ref="chosen" :class="showDrop?'chosen-container show':'chosen-container'" style="width: 100%;">
    <div class="body-select" v-if="showDrop" @click="show"></div>
    <select style="display: none" :name="name" class="select-chosen" v-model="showValue" :fh="fh" :validate="validate">
      <option v-for="(i, x) in listData" :value="i[k]">{{i[v]}}</option>
    </select>
    <a :class="disabled ? 'chosen-single chosen-single-with-deselect al-could-not': 'chosen-single chosen-single-with-deselect'"
      @click="show">
      <span>{{showData || placeholder}}</span>
      <i :class="showClear ? 'fr glyphicon glyphicon-remove-circle' : showDrop?'fr glyphicon glyphicon-triangle-top':'fr glyphicon glyphicon-triangle-bottom'" @mouseover="mouseover" @mouseout="showClear = false" @click="clearItem"></i>
    </a>
    <div class="chosen-drop" ref="drop">
      <div v-if="searchShow" class="chosen-search">
        <input type="text" v-model="search" @input="searchInput" class="form-control" autocomplete="off">
        <i class="glyphicon glyphicon-search"></i>
      </div>
      <ul :class="maxH ? 'chosen-results maxH' : 'chosen-results'" v-if="listData && listData.length">
        <li :class="x==number?'active-result active':'active-result'" v-for="(i, x) in listData" @click="changeData(i, x)">{{i[v]}}</li>
      </ul>
      <ul class="chosen-results" v-if="listData && !listData.length">
        暂无可选择数据
      </ul>
    </div>
  </div>
</template>
<script>
  /**
   * 全局select
   * */
  export default {
    data () {
      return {
        listData: [],
        showDrop: false,
        showClear: false,
        search: '',
        showData: '',
        number: -1,
        showValue: ''
      }
    },
    components: {},
    mounted () {
      if (this.data) {
        let data = JSON.stringify(this.data)
        this.listData = JSON.parse(data)
      }
      this.update(this.value)
    },
    watch: {
      value: function (newData, oldData) {
        if (newData !== this.showValue) this.update(newData)
      }
    },
    props: {
      fh: String,
      validate: String,
      disabled: {
        type: Boolean,
        default: false
      },
      value: [String, Number],
      data: Array,
      placeholder: {
        type: [String, Number],
        default: '请选择'
      },
      name: String,
      searchShow: {
        type: Boolean,
        default: false
      },
      k: {
        type: String,
        default: 'id'
      },
      v: {
        type: String,
        default: 'value'
      },
      maxH: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      mouseover () {
        if (!this.showValue) return
        this.showClear = true
      },
      clearItem () {
        this.number = -1
        this.showData = ''
        this.showValue = ''
        this.$emit('input', '')
        this.$emit('change', '')
      },
      update (value) {
        let y = 0
        if (value) {
          let x = 0
          for (let i of this.data) {
            if (i[this.k] === value) {
              this.showData = i[this.v]
              this.number = x
              y++
              return
            }
            x++
          }
        }
        if (!y) {
          this.number = -1
          this.showData = ''
        }
      },
      changeData (i, n) {
        this.number = n
        this.showData = i[this.v]
        this.showValue = i[this.k]
        this.$emit('input', i[this.k])
        this.$emit('change', i[this.k])
        this.show()
      },
      searchInput () {
        let arr = []
        if (this.search && this.data && this.data.length) {
          for (let i of this.listData) {
            if (i[this.v].indexOf(this.search) !== -1) {
              arr.push(i)
            }
          }
          this.listData = arr
        } else {
          this.listData = this.data
        }
      },
      show () {
        if (this.showClear || this.disabled) return
        this.showDrop = !this.showDrop
      }
    }
  }
</script>

<style lang="less">
  .select-chosen {
    display: none;
  }

  .chosen-container {
    width: 100%;
    font-size: 12px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    .chosen-single {
      width: 100%;
      padding: 5px 10px;
      height: 34px;
      display: inline-block;
      border: 1px solid #ccc;
      color: #555;
      cursor: pointer;
      line-height: 24px;
      i.glyphicon {
        /*font-size: 18px;*/
        line-height: 20px;
      }
    }
    a.chosen-single.chosen-single-with-deselect.al-could-not {
      background-color: #eeeeee;
    }
    .chosen-drop {
      display: none;
      z-index: 9999;
      position: absolute;
      width: 100%;
      top: 100%;
      left: 0;
      background-color: #fff;
      border: 1px solid #ccc;
      color: #555;
    }
    .chosen-search {
      width: 100%;
      text-align: center;
      padding: 5px 10px;
      position: relative;
      .glyphicon {
        position: absolute;
        right: 20px;
        top: 11px;
        font-size: 14px;
        color: #555;
      }
      .form-control {
        min-width: inherit !important;
        width: 100%;
        height: 28px;
        font-size: 11px;
      }
    }
    .chosen-results {
      width: 100%;
      text-align: center;
      padding: 5px 0;
      &.maxH {
        max-height: 160px;
        overflow-y: auto;
      }
    }
    .active-result {
      width: 100%;
      text-align: left;
      padding: 5px 10px;
      cursor: pointer;
      transition-duration: .2s;
      font-size: 11px;
      &:hover, &.active {
        background-color: rgb(48, 66, 105);
        color: #fff;
      }
    }
    &.show {
      box-shadow: 0 0 10px #ccc;
      .chosen-drop {
        display: inline-block;
        border-top: 0;
        box-shadow: 0 10px 10px #ccc;
      }
      .chosen-single {
        border-bottom: 0;
      }
    }
  }

  .body-select {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9998;
    left: 0;
    top: 0;
  }
</style>
