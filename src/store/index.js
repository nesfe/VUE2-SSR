import Vue from 'vue'
import Vuex from 'vuex'
// import logger from 'vuex/dist/logger'
import modules from './loader'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// if (debug) console.log(modules)
// 不要在 mutations 处理数据
export default new Vuex.Store({
  modules,
  strict: debug
})
