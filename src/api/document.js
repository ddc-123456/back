import request from '@/utils/request'

export function fetchList(data) {
  let {page, query} = data

  return request({
    url: '/courseplan/pagelist',
    method: 'post',
    data
  })
}

export function fetchSelectionList() {
  return request({
    url: '/courseplan/fetchlist',
    method: 'get',
  })
}
