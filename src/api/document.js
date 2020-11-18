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

export function uploadFile(formData) {
  return request({
    url: '/courseplan/fileupload',
    method: 'post',
    data:formData,
  })
}

export function deleteArticle(data) {
  return request({
    url: '/courseplan/delete1',
    method: 'post',
    data
  })
}

export function deleteArticleMore(data) {
  return request({
    url: '/courseplan/deletes',
    method: 'post',
    data: {courseList: data}
  })
}
