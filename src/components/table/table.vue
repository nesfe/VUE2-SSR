<template>
  <table ref="table" :class="border ? 'table table-bordered table-striped table-hover table-condensed' : 'table table-striped table-hover table-condensed'">
    <div class="loading" v-if="loading">
      <i class="fa fa-refresh fa-spin"></i>
    </div>
    <thead>
    <tr>
      <th v-if="showHeader" v-for="i in columns" :width="i.type === 'selection' ? '25' : i.width" :style="`vertical-align: ${i.vertical?i.vertical:'middle'}; text-align: ${i.align?i.align:'left'};`">
        <template v-if="!i.type">{{i.text}}</template>
        <template v-if="i.type === 'selection'">
          <!--<input type="checkbox" ref="call" @change="checkboxAll"/>-->
          <iCheck ref="call" @change="checkboxAll"></iCheck>
        </template>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(d, x) in data">
      <td v-for="i in columns" :style="`vertical-align: ${i.vertical?i.vertical:'middle'}; text-align: ${i.align?i.align:'left'};`">
        <template v-if="i.type === 'indexes'">{{x + 1}}</template>
        <template v-if="i.type === 'selection'">
          <!--<input ref="call" type="checkbox" @change="checkboxOne(x)"/>-->
          <iCheck ref="call" @change="checkboxOne(x)"></iCheck>
        </template>
        <template v-if="!i.type && !i.render">{{d[i.key] || ''}}</template>
        <Expand v-if="i.render" :render="i.render" :row="d"></Expand>
      </td>
    </tr>
    <tr v-show="data && !data.length">
      <td colspan="99" style="text-align: center">暂无相关数据</td>
    </tr>
    <tr v-show="page.total && data && data.length">
      <td colspan="99" class="o-inherit">
        <pagination @change="pageChange" size="sm" v-model="current" :total-page="pages.totalPage || 1" align="right"/>
        <div class="fr totalPage">共{{pages.total}}条记录，每页{{pages.pageSize}}条</div>
        <div class="fl" v-if="tool.length">
          <dropdown dropup>
            <btn class="dropdown-toggle btn-sm">操作 <span class="caret"></span></btn>
            <template slot="dropdown">
              <li v-for="i in tool" :class="i==='divider'?i:''">
                <a v-if="i!=='divider'" role="button" @click="i.click(checkboxData)">{{i.text}}</a>
              </li>
            </template>
          </dropdown>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
  import Expand from './render.js'
  import iCheck from '../form/checkbox.vue'

  export default {
    data () {
      return {
        checkboxData: [],
        current: 1,
        pages: {},
        loading: false
      }
    },
    components: {Expand, iCheck},
    mounted () {
      this.updatePage()
    },
    watch: {
      data: {
        handler: function (newData) {
          console.log('表格发送了变化', newData)
          this.loading = false
        },
        deep: true
      },
      page: function (newData, oldData) {
        this.updatePage()
      }
    },
    props: {
      tool: {
        type: Array,
        default () {
          return []
        }
      },
      data: {
        type: [Array, Object],
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      page: {
        type: Object,
        default () {
          return {
            totalPage: 0,
            pageIndex: 0,
            pageSize: 20,
            total: 0
          }
        }
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      border: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      updatePage () {
        if (this.page.pageIndex && this.page.pageIndex > 0) this.current = parseInt(this.page.pageIndex)
        this.page.totalPage = Math.ceil(this.page.total / this.page.pageSize)
        this.pages = this.page
      },
      selectAll (checked) {
        for (let i in this.$refs.call) {
          this.$refs.call[i].checked = checked
          if (checked) {
            this.checkboxData = this.data
          } else {
            this.checkboxData = []
          }
        }
        this.$emit('change', this.checkboxData)
      },
      trClick (t) {
        this.checkboxOne(t, 'tr')
      },
      pageChange (p) {
        this.$emit('pageChange', p)
      },
      checkboxAll () {
        let checked = this.$refs.call[0].checked
        this.selectAll(checked)
      },
      checkboxOne (t, tr) {
        if (this.$refs.call[t + 1].checked === false) {
          this.$refs.call[0].checked = false
          this.checkboxData[t] = null
          this.$emit('change', this.checkboxData)
        } else {
          let all = 1
          for (let i in this.$refs.call) {
            t = parseInt(i) - 1
            if (parseInt(i) !== 0 && this.$refs.call[i].checked === false) {
              this.$refs.call[0].checked = false
              this.checkboxData[t] = null
              all = 0
            } else if (parseInt(i) !== 0) {
              this.checkboxData[t] = this.data[t]
            }
          }
          if (all) this.$refs.call[0].checked = true
          this.$emit('change', this.checkboxData)
        }
      }
    }
  }
</script>

<style lang="less">
  .table {
    position: relative;
    td, th {
      overflow: hidden;
      white-space: nowrap;
    }
    .o-inherit {
      overflow: inherit !important;
    }
    .loading {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background-color: rgba(255, 255, 255, 0.6);
      top: 0;
      left: 0;
      /*text-align: center;*/
      border: 1px solid #ddd;
      border-bottom: 0;
      font-size: 30px;
      color: #1b6d85;
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
      }
    }
  }
</style>
