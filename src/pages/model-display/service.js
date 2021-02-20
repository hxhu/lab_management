import request from '@/utils/request';

// 模型列表
export async function queryModelList() {
  return request('/api/EModel/getList', {
    method: 'GET'
  })
}

// 模型修改
export async function updateModel(params) {
  return request('/api/EModel/update', {
    method: 'POST',
    data: params
  })
}

// 模型删除
export async function deleteModel(params) {
  return request('/api/EModel/delete', {
    method: 'DELETE',
    params
  })
}