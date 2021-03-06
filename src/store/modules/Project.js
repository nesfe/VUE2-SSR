import api from 'src/api'

const state = {
  list: {},
  detail: {},
  taskList: {},
  teamList: {},
  projectTypeList: {},
  projectTaskTypeList: {},
  taskDetail: {},
  taskMan: {},
  member: {}
}

const getters = {
  projectState: state => state.list,                        // 项目列表数据
  projectSurvey: state => state.detail,                     // 项目详情
  projectTaskDetail: state => state.taskDetail,             // 任务详情
  projectTaskList: state => state.taskList,                 // 任务列表
  projectTeamList: state => state.teamList,                 // 团队列表
  projectTypeList: state => state.projectTypeList,          // 项目类型列表
  projectTaskMan: state => state.taskMan,                   // 项目任务成员
  projectMember: state => state.member,                     // 项目任务成员
  projectTaskTypeList: state => state.projectTaskTypeList   // 项目任务类型列表
}

const mutations = {
  SET: (state, data) => {
    /**
     * 通用设置传输数据
     * */
    state[data.key] = data.data
  }
}

const actions = {
  isProjectTaskMan ({state, commit}, parameter = {}) {
    return api.post('/task/member', parameter).then((response) => {
      response.data.id = response.data.userId
      commit('SET', {key: 'taskMan', data: response.data})
    })
  },
  isProjectTaskType ({state, commit}, parameter = {}) {
    return api.post('/taskType/list', parameter).then((response) => {
      commit('SET', {key: 'projectTaskTypeList', data: response.data})
    })
  },
  isProjectType ({state, commit}, parameter = {}) {
    return api.post('/project/type', parameter).then((response) => {
      commit('SET', {key: 'projectTypeList', data: response.data})
    })
  },
  isProjectTask ({state, commit}, parameter = {}) {
    return api.post('/task/pager', parameter).then((res) => {
      let data = res
      // data.data = data.data
      data.page = {
        total: res.total,
        pageIndex: res.current,
        pageSize: parameter.pageSize || 20
      }
      commit('SET', {key: 'taskList', data: data})
      // commit('SET_TASK', res)
    }).catch((error) => {
      console.log(error)
    })
  },
  isProjectMember ({state, commit}, parameter) {
    return api.post('/projectTeam/member', parameter).then((response) => {
      commit('SET', {key: 'member', data: response.data})
    }).catch((error) => {
      console.log(error)
    })
  },
  isProjectTaskDetails ({state, commit}, taskId) {
    return api.post('/task/select', {taskId}).then((response) => {
      commit('SET', {key: 'taskDetail', data: response.data})
    }).catch((error) => {
      console.log(error)
    })
  },
  isProjectSurvey ({state, commit}, id) {
    if (!id) {
      return
    }
    return api.post('/project/select', {id}).then((response) => {
      commit('SET', {key: 'detail', data: response.data})
    }).catch((error) => {
      console.log(error)
    })
  },
  isProjectState ({state, commit}, parameter = {}) {
    return api.post('/project/pager', parameter).then((res) => {
      let data = res
      data.page = {
        total: res.total,
        pageIndex: res.current,
        pageSize: parameter.pageSize || 20
      }
      commit('SET', {key: 'list', data: data})
    }).catch((error) => {
      console.log(error)
    })
  },
  isProjectTeam ({state, commit}, parameter = {}) {
    return api.post('/projectTeam/pager', parameter).then((res) => {
      let data = res
      data.page = {
        total: res.total,
        pageIndex: res.current,
        pageSize: parameter.pageSize || 20
      }
      commit('SET', {key: 'teamList', data: data})
    }).catch((error) => {
      console.log(error)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
