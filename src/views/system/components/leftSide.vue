<template>
  <div class="panel panel-default custom-panel">
    <div v-for="item in list" :class="styleClass(item)" @click="push(item)">
      <a href="javascript:;">{{item.name}}</a>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: '',
  data() {
    return {
      list: [
        {
          id: 1,
          type: 'priority',
          name: '优先级管理',
          path: '/system/custom',
          href: '/system/custom/index'
        },
        {
          id: 2,
          type: 'type',
          name: '类型管理',
          path: '/system/custom',
          href: '/system/custom/type'
        },
        {
          id: 3,
          type: 'closeReason',
          name: '关闭原因管理',
          path: '/system/custom',
          href: '/system/custom/closeReason'
        },
        {
          id: 4,
          type: 'status',
          name: '状态管理',
          path: '/system/custom',
          href: '/system/custom/status'
        }
      ]
    }
  },
  props: {
    active: {
      type: String
    }
  },
  computed: {
    ...mapGetters({
      state: 'projectState'
    })
  },
  asyncData({ store }) {
    // store.dispatch('isProjectState')
  },
  methods: {
    styleClass(param) {
      const path = this.$route.path
      return {
        'panel-heading': true,
        active: path.includes(param.href)
      }
    },
    push(item) {
      this.$router.push(item.href)
    }
  }
}

</script>
<style lang="less">
@gray-bg: #f1f1f1;
.custom-panel {
  .panel-heading {
    background: #fff;
    cursor: pointer;
  }
  .panel-heading.active {
    background: @gray-bg;
  }
  a,
  a:hover {
    color: #333;
    text-decoration: none;
    width: 100%;
    height: 100%;
    display: inline-block;
  }
}

</style>
