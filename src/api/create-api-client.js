/**
 * @desc    创建客户端axios请求
 * @file    create-api-client.js
 * @author  zhangWuQiang
 */
import qs from 'qs'
import axios from 'axios'

axios.interceptors.response.use((res) => {
  if (res.data.code === 401) {
    /* eslint-disable no-return-assign */
    return window.location.href = '/user/login'
  }
  if (res.status >= 200 && res.status < 300) {
    return res
  }
  return Promise.reject(res)
}, (error) => {
  // 网络异常
  return Promise.reject({ message: '网络异常，请刷新重试', error })
})

axios.interceptors.request.use(config => {
  return config
})

export function createAPI({ client }) {
  let api

  axios.defaults.timeout = client.timeout
  axios.defaults.baseURL = client.baseurl
  axios.defaults.withCredentials = true

  if (process.__API__) {
    api = process.__API__
  } else {
    api = {
      get(url, params = {}) {
        return new Promise((resolve, reject) => {
          axios({
            url,
            params,
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'get'
          }).then(res => {
            resolve(res.data)
          }).catch(error => {
            reject(error)
          })
        })
      },
      post(url, params = {}) {
        return new Promise((resolve, reject) => {
          axios({
            url,
            data: typeof params === 'string' ? params : qs.stringify(params),
            method: 'post',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': typeof params === 'string' ? 'application/json' : 'application/x-www-form-urlencoded'
            }
          }).then(res => {
            resolve(res.data)
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  }
  return api
}
