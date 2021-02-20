import request from '@/utils/request';

// 增加参数组
export async function createConfig(params) {
  return request('/api/EConfig/create', {
    method: 'POST',
    data: params,
  })
}

// 修改参数组
export async function modifyConfig(params) {
  return request('/api/EConfig/update', {
    method: 'POST',
    data: params,
  })
}

// 获取参数组列表
export async function queryConfigList() {
  return request('/api/EConfig/getList', {
    method: 'GET'
  })
}

// 获取参数组
export async function queryConfigById(params) {
  return request('/api/EConfig/getById', {
    method: 'GET',
    params
  })
}

// 删除参数组
export async function deleteConfigById(params) {
  return request('/api/EConfig/delete', {
    method: 'DELETE',
    params
  })
}

// 获取设备列表
export async function queryDeviceList() {
  return request('/api/EDevice/getList', {
    method: 'GET'
  })
}

// 推送配置
export async function pushConfig(params) {
  console.log(params)
  return request('/api/EConfig/pushDownConfigs', {
    method: 'POST',
    data: params
  })
}