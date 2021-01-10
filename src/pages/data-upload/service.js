import request from '@/utils/request';

// 获取相应数据集信息
export async function queryDataSet(params) {
  return request('/api/EDataSet/getById', {
    method: 'GET',
    params
  })
}

// 上传文件名列表
export async function uploadImageSet(params) {
  return request('/api/EDataSet/uploadImageSet', {
    method: 'POST',
    data: params,
  })
}

// 获得数据集列表
export async function queryDataSetList(params) {
  return request('/api/EDataSet/getList', {
    method: 'GET',
    params
  })
}


// 获得数据集
export async function deleteDataSetById(params) {
  return request('/api/EDataSet/delete', {
    method: 'DELETE',
    params
  })
}

// 新建数据集
export async function createDataSet(params) {
  return request('/api/EDataSet/create', {
    method: 'POST',
    data: params,
  })
}

// 修改数据集
export async function modifyDataSet(params) {
  return request('/api/EDataSet/update', {
    method: 'POST',
    data: params,
  })
}

