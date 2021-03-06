import api from 'src/api'
import menuJson from 'assets/js/menu.json'
const state = {
  userStatus: {},
  department: [],
  member: [],
  userList: [],
  userDetail: {},
  qrCode: []
}

const getters = {
  getUserStatus: state => state.userStatus,
  getDepartment: state => state.department,
  getMember: state => state.member,
  getUserList: state => state.userList, // 根据用户手机号查询用户
  getUserDetail: state => state.userDetail, //
  getQrCode: state => state.qrCode // 邀请链接二维码
}

const mutations = {
  USER_STATUS: (state, userStatus) => {
    state.userStatus = userStatus
  },
  DEPARTMENT_DATA: (state, department) => {
    state.department = department
  },
  MEMBER_DATA: (state, member) => {
    state.member = member
  },
  USERLIST_DATA: (state, userList) => {
    state.userList = userList
  },
  USERDERTAIL_DATA: (state, userDetail) => {
    state.userDetail = userDetail.data
  },
  QRCODE_DATA: (state, qrCode) => {
    state.qrCode = qrCode
  }
}

const actions = {
  doUsers({ state, commit }) {
    return api.post('/selectUserDetails').then((response) => {
      console.log('getUserStatusCode - ', response.code)
      console.log('menuJson', menuJson)
      // response.data.menu = menuJson
      commit('USER_STATUS', response)
    }).catch((error) => {
      console.log(error)
    })
  },
  doDepartment({ state, commit }, param) {
    let url = ''
    if (param.pager) {
      url = '/department/pager'
    } else {
      url = '/department/list'
    }
    return api.post(url, param).then((response) => {
      commit('DEPARTMENT_DATA', response.data)
      console.log('服务端部门列表', response.code)
    }).catch((error) => {
      console.log(error)
    })
  },
  doMember({ state, commit }, param) {
    return api.post('/companyUser/pager', param).then((response) => {
      commit('MEMBER_DATA', response)
      console.log('服务端~~~用户列表', response)
    }).catch((error) => {
      console.log(error)
    })
  },
  doUserList({ state, commit }, param) {
    return api.post('/member/selectBymobile', param).then((response) => {
      commit('USERLIST_DATA', response)
      console.log('服务端~~~搜索用户', response)
    }).catch((error) => {
      console.log(error)
    })
  },
  doUserDetail({ state, commit }, param) {
    return api.post('/member/select', param).then((response) => {
      commit('USERDERTAIL_DATA', response)
      console.log('服务端~~~用户详情', response)
    }).catch((error) => {
      console.log(error)
    })
  },
  doQrCode({ state, commit }, param) {
    return api.post('/project/invitedQrcode', param).then((response) => {
      commit('QRCODE_DATA', response)
      console.log('服务端~~~二维码', response)
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
