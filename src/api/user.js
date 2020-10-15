import request from '@/utils/request'


export function login(data) {

  return request({
    url: '/bsm/tlogin',
    method: 'post',
    data:{
      t_id: data.username,
      t_pwd:data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/bsm/prelogin',
    method: 'get',
    params: {token}
  })
}

export function logout() {
  return request({
    url: '/bsm/logout',
    method: 'post'
  })
}
