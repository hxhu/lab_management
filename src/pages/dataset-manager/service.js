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