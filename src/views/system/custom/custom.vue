<template>
  <div>
    <div class="featurebar">
      <ul class="ul">
        <li class="active"><a>任务配置</a>
        </li>
      </ul>
    </div>
    <div class="custon-main">
      <div class="col-lg-2">
        <left-side :active="priority"></left-side>
      </div>
      <div class="col-lg-10">
        <custom-main :title="title"></custom-main>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import leftSide from '../components/leftSide.vue'
  import customMain from '../components/customMain.vue'
  export default {
    name: 'system',
    data () {
      return {
        priority: 'priority',
        title: '优先级'
      }
    },
    computed: {
      ...mapGetters({
        state: 'projectState'
      })
    },
    components: {leftSide, customMain},
    asyncData ({store}) {
      store.dispatch('isProjectState')
    },
    methods: {
    }
  }
</script>

<style lang="less">
  .custon-main {
    padding: 20px 5px;
    overflow: hidden;
  }
</style>
