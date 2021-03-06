import Vue from 'vue'
import VueRouter from 'vue-router'
import cookies from 'js-cookie'
// home
import Home from 'views/home/index.vue'
import HomeIndex from 'views/home/components/index.vue'
import HomeMyTask from 'views/home/components/task.vue'
import HomeMyProject from 'views/home/components/project.vue'
import HomeMyLog from 'views/home/components/log.vue'
// user
import User from 'views/user/index.vue'
import UserLogin from 'views/user/components/login.vue'
import UserRegister from 'views/user/components/register.vue'
import UserAddCompany from 'views/user/components/addCompany.vue'
import UserAcceptInvite from 'views/user/components/acceptInvite.vue'
// project
import Project from 'views/project/index.vue'
import ProjectIndex from 'views/project/components/index.vue'
import ProjectSurvey from 'views/project/components/survey.vue'
import ProjectTeam from 'views/project/components/team.vue'
import ProjectTask from 'views/project/components/task.vue'
import ProjectTaskAdd from 'views/project/components/taskAdd.vue'
import ProjectAdd from 'views/project/components/add.vue'
import surveyEdit from 'views/project/components/surveyEdit.vue'
import taskDetails from 'views/project/components/taskDetails.vue'
import taskEdit from 'views/project/components/taskEdit.vue'
// organization
import organization from 'views/organization/index.vue'
import organizationIndex from 'views/organization/user/index.vue'
import organizationEditUser from 'views/organization/user/edit.vue'
import organizationPower from 'views/organization/power/power.vue'
import organizationPowerView from 'views/organization/power/view.vue'
import organizationPowerEdit from 'views/organization/power/editPower.vue'
import organizationDepartment from 'views/organization/department/department.vue'
import organizationPosition from 'views/organization/position/position.vue'
import organizationCompany from 'views/organization/company/company.vue'
import organizationLog from 'views/organization/log/log.vue'
// system
import system from 'views/system/index.vue'
import systemIndex from 'views/system/custom/custom.vue'
import systemType from 'views/system/custom/type.vue'
import systemStatus from 'views/system/custom/status.vue'
import systemProjectType from 'views/system/custom/projectType.vue'
import systemCloseReason from 'views/system/custom/closeReason.vue'
import systemSend from 'views/system/send/send.vue'
import taskType from 'views/system/task/type.vue'
import typeAdd from 'views/system/task/typeAdd.vue'

Vue.use(VueRouter)

const children = [
  {
    path: '/',
    component: Home,
    children: [{
      path: '/home/index',
      component: HomeIndex
    }, {
      path: '/home/myTask',
      component: HomeMyTask
    }, {
      path: '/home/myProject',
      component: HomeMyProject
    }, {
      path: '/home/myLog',
      component: HomeMyLog
    }]
  },
  {
    path: '/organization',
    component: organization,
    children: [
      {
        path: '/organization/index',
        component: organizationIndex
      },
      {
        path: '/organization/editUser/:id',
        component: organizationEditUser
      },
      {
        path: '/organization/power',
        component: organizationPower
      },
      {
        path: '/organization/power/view/:id',
        component: organizationPowerView
      },
      {
        path: '/organization/power/editPower/:id',
        component: organizationPowerEdit
      },
      {
        path: '/organization/department',
        component: organizationDepartment
      },
      {
        path: '/organization/position',
        component: organizationPosition
      },
      {
        path: '/organization/company',
        component: organizationCompany
      },
      {
        path: '/organization/log',
        component: organizationLog
      }
    ]
  },
  {
    path: '/project',
    component: Project,
    children: [
      {
        path: 'index',
        component: ProjectIndex
      },
      {
        path: 'add',
        component: ProjectAdd
      },
      {
        path: 'edit/:id',
        component: surveyEdit
      },
      {
        path: 'survey/:id',
        component: ProjectSurvey
      },
      {
        path: 'taskDetails/:id',
        component: taskDetails
      },
      {
        path: 'taskEdit/:id',
        component: taskEdit
      },
      {
        path: 'team/:id',
        component: ProjectTeam
      },
      {
        path: 'task/:id',
        component: ProjectTask
      },
      {
        path: 'task/:id/add',
        component: ProjectTaskAdd
      }
    ]
  },
  {
    path: '/system',
    component: system,
    children: [
      {
        path: '/system/custom/index',
        component: systemIndex
      },
      {
        path: '/system/custom/closeReason',
        component: systemCloseReason
      },
      {
        path: '/system/custom/type',
        component: systemType
      },
      {
        path: '/system/custom/status',
        component: systemStatus
      },
      {
        path: '/system/custom/proType',
        component: systemProjectType
      },
      {
        path: '/system/custom/closeReason',
        component: systemCloseReason
      },
      {
        path: '/system/send',
        component: systemSend
      },
      {
        path: '/system/taskType',
        component: taskType
      },
      {
        path: '/system/typeAdd',
        component: typeAdd
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: 'active',
  base: __dirname,
  routes: [{
    path: '/',
    component: require('src/Layout.vue'),
    children
  }, {
    path: '/user',
    component: User,
    children: [{
      path: '/user/login',
      component: UserLogin
    }, {
      path: '/user/register',
      component: UserRegister
    }, {
      path: '/user/addCompany',
      component: UserAddCompany
    }, {
      path: '/user/acceptInvite',
      component: UserAcceptInvite
    }]
  }]
})

router.beforeEach((to, from, next) => {
  if (to.path.includes('/user')) {
    return next()
  } else {
    cookies.set('TO_URL', to.path)
    return next()
  }
})

export default router
