<template>
  <div class="art1001" :class="{visible:tooltip}" v-if="visible">
    <win-header></win-header>
    <router-view></router-view>
  </div>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import WinHeader from 'components/header/Header'

  export default {
    data () {
      return {visible: true, tooltip: false}
    },
    computed: {
      ...mapGetters({
        userStatus: 'getUserStatus'
      })
    },
    asyncData ({store, route, cookies}) {
      // 服务端请求axios
      return store.dispatch(`doUsers`)
    },
    created () {
      // 在客户端判断用户登录状态
      const status = this.userStatus
      console.log(process.title, status)
      if (process.title !== 'browser') return
      if (JSON.stringify(status) === '{}' || status.code === 401) {
        this.$router.push('/user')
      } else {
        this.visible = true
      }
    },
    mounted () {
      // 客户端请求axios
      this.getUserStatus(this.userStatus)
      setTimeout(() => {
        this.tooltip = true
      }, 2000)
    },
    components: {
      WinHeader
    },
    methods: {
      ...mapActions(['doUsers']),
      getUserStatus (response) {
        console.log('response.code', response.code)
        // 403无权限访问
        if (response && response.code === 403) {
          this.$confirm({
            title: '访问受限',
            okText: '重新登录',
            cancelText: '返回',
            content: '抱歉，您无权访问『首页』模块的『首页』功能。请联系管理员获取权限。'
          }).then(() => {
            this.$router.replace({path: '/user/login'})
          }).catch(() => {
            this.$router.replace({path: '/user/login'})
          })
        }
      }
    }
  }

</script>

<style>
  .glyphicon-spin {
    -webkit-animation: glyphicon-spin 2s infinite linear;
    animation: glyphicon-spin 2s infinite linear;
  }

  @-webkit-keyframes glyphicon-spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg);
    }
  }

  @keyframes glyphicon-spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg);
    }
  }
</style>
