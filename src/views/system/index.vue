<template>
  <div class="view">
    <menuSub :menu="menu"></menuSub>
    <router-view class="wrap"></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import menuSub from 'components/menu/Menusub.vue'
import { isHistory, getUserMenu } from 'util/util'
export default {
  name: 'systemIndex',
  title() {
    return '系统设置'
  },
  data() {
    return {
      menu: []
    }
  },
  computed: {
    ...mapGetters({
      userStatus: 'getUserStatus'
    })
  },
  created() {
    // 获取用户路由
    const menus = getUserMenu(this.userStatus, this.$route.path)
    console.log('currentMenus - ', menus)
    this.menu = menus
  },
  components: { menuSub },
  mounted() {
    if (isHistory('/system')) {
      this.$router.push('/system/send')
    }
  }
}

</script>
