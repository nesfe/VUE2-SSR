<template>
  <div class="login-container">
    <router-view></router-view>
  </div>
</template>
<script>
import { isHistory } from 'util/util'
export default {
  name: 'Login',
  title () {
    return '登录'
  },
  mounted() {
    if (isHistory('/user')) {
      this.$router.push('/user/login')
    }
  }
}

</script>
<style lang="less">

html,
body {
  height: 100%;
}

.login-container {
  width: 100%;
  min-height: 100%;
  padding: 100px 0 100px 0;
  background-color: #1e232f;
}

.login-form {
  position: relative;
  z-index: 2;
  overflow: hidden;
  border: none;
  width: 380px;
  margin: 0 auto;
  border-radius: 3px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.75);
  .mod-label {
    width: 80px;
    text-align: right;
    padding: 7px 12px;
    margin: 0;
  }

  .mod-input {
    width: 260px;
    label{
      line-height: 34px;
    }
  }
}
</style>
