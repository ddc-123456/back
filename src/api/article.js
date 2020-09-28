import request from '@/utils/request'


export function fetchList(data) {
  let {page, query} = data

  return request({
    url: '/bsm/pagelist',
    method: 'post',
    data
  })
}

export function fetchStu(data) {
  let {page, query} = data

  return request({
    url: '/bsmstu/pagelist',
    method: 'post',
    data
  })
}

export function fetchSelectionList() {
  return request({
    url: '/bsm/fetchlist',
    method: 'get',
  })
}
export function fetchStuSelectionList() {
  return request({
    url: '/bsmstu/fetchlist',
    method: 'get',
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: {id}
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: {pv}
  })
}

export function createArticle(data) {
  return request({
    url: '/bsm/insert',
    method: 'post',
    data
  })

}export function createStuArticle(data) {
  return request({
    url: '/bsmstu/insert',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/bsm/update',
    method: 'post',
    data
  })
}
export function updateStuArticle(data) {
  return request({
    url: '/bsmstu/update',
    method: 'post',
    data
  })
}

export function deleteArticle(data) {
  return request({
    url: '/bsm/deleteOne',
    method: 'post',
    data
  })
}

export function deleteStuArticle(data) {
  return request({
    url: '/bsmstu/deleteOne',
    method: 'post',
    data
  })
}

export function deleteArticleMore(data) {
  return request({
    url: '/bsm/delete',
    method: 'post',
    data: {teacher: data}
  })
}

export function deleteStuArticleMore(data) {
  return request({
    url: '/bsmstu/delete',
    method: 'post',
    data: {student: data}
  })
}

export function exportExcel() {
  return request({
    url: '/bsm/writeExcel',
    method: 'get',
  })
}

export function exportStuExcel() {
  return request({
    url: '/bsmstu/writeExcel',
    method: 'get',
  })
}

export function batchExport(formData) {
  return request({
    url: 'bsm/readExcel',
    headers: {
      "Content-Type": "multipart/form-data;charset=UTF-8"
    },
    method: 'post',
    data: formData
  })
}

export function batchStuExport(formData) {
  return request({
    url: 'bsmstu/readExcel',
    headers: {
      "Content-Type": "multipart/form-data;charset=UTF-8"
    },
    method: 'post',
    data: formData
  })
}

export function fetchStuList() {
  return request({
    url: '/bsmstu/stulist',
    method: 'get'
  })
}
