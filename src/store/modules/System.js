import api from 'src/api'

const state = {
  send: [],
  taskTypeList: {},
  taskTypeEdit: {}
}

const getters = {
  sendData: state => state.send,                    // 发信设置
  systemTaskTypeList: state => state.taskTypeList,  // 发信设置
  systemTaskTypeEdit: state => state.taskTypeEdit   // 任务添加 - 编辑页面
}

const mutations = {
  SET: (state, data) => {
    /**
     * 通用设置传输数据
     * */
    state[data.key] = data.data
  },
  SEND_DATA: (state, data) => {
    console.log('服务端发信设置结果', data)
    state.send = data
  },
  SET_TASK_TYPE_EDIT: (state, form) => {
    console.log('进入任务编辑/添加页面数据taskTypeEdit：', form)
    state.taskTypeEdit = form
  }
}

const actions = {
  isSend ({state, commit}, parameter) {
    console.log('开始获取---发信设置')
    return api.get('/mail/setting', parameter).then((res) => {
      commit('SEND_DATA', res.data)
    }).catch((error) => {
      console.log(error)
    })
  },
  isSystemTaskTypeList ({state, commit}, parameter = {pageSize: 20}) {
    return api.post('/taskType/pager', parameter).then((res) => {
      res.page = {
        total: res.total,
        pageIndex: res.current,
        pageSize: 20
      }
      commit('SET', {key: 'taskTypeList', data: res})
    })
  },
  isSystemTaskTypeEdit ({state, commit}, route) {
    let query = route.query
    if (query.id) {
      return api.post('/taskType/select', {id: query.id}).then((res) => {
        let data = res.data
        let form = {
          id: data.id,
          name: data.name,
          attributes: data.attributes
        }
        commit('SET_TASK_TYPE_EDIT', form)
      })
    } else {
      return commit('SET_TASK_TYPE_EDIT', {})
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
