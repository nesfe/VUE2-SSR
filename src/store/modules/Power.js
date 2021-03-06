import api from 'src/api'

const state = {
  list: [],
  menu: {},
  power: [],
  groupMenber: {}
}

const getters = {
  powerGroupList: state => state.list,
  menuList: state => state.menu,
  powerList: state => state.power,
  groupMenberList: state => state.groupMenber
}

const mutations = {
  POWERGROUP_DATA: (state, data) => {
    console.log('服务端权限组列表结果', data)
    state.list = data
  },
  MENU_DATA: (state, data) => {
    console.log('服务端允许访问视图列表结果', data)
    state.menu = data.data
  },
  POWERLIST_DATA: (state, data) => {
    console.log('服务端所有权限列表结果', state.power)
    state.power = data.data
  },
  GROUPMEMBER_DATA: (state, data) => {
    state.groupMenber = data.data
    console.log('服务端所有```用户列表```结果', state.groupMenber)
  }
}

const actions = {
  isPowerGroupList ({state, commit}, parameter) {
    console.log('开始获取权限组列表')
    return api.post('/group/list', parameter).then((res) => {
      commit('POWERGROUP_DATA', res)
    }).catch((error) => {
      console.log(error)
    })
  },
  isMenuList ({state, commit}, parameter) {
    console.log('开始获取视图菜单列表')
    return api.post('/menu/view', parameter).then((res) => {
      commit('MENU_DATA', res)
    }).catch((error) => {
      console.log(error)
    })
  },
  isPowerList ({state, commit}, parameter) {
    console.log('开始获取所有权限列表')
    return api.post('/menu/jurisdiction', parameter).then((res) => {
      commit('POWERLIST_DATA', res)
    }).catch((error) => {
      console.log(error)
    })
  },
  isGroupMemberList ({state, commit}, parameter) {
    console.log('服务端开始获取所有用户列表')
    return api.post('/groupUser/companyList', parameter).then((res) => {
      commit('GROUPMEMBER_DATA', res)
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
