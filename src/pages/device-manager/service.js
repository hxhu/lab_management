import request from '@/utils/request';

// 增加设备
export async function createDevice(params) {
  return request('/api/EDevice/create', {
    method: 'POST',
    data: params,
  })
}

// 修改设备
export async function modifyDevice(params) {
  return request('/api/EDevice/update', {
    method: 'POST',
    data: params,
  })
}

// 获取设备列表
export async function queryDeviceList() {
  return request('/api/EDevice/getList', {
    method: 'GET'
  })
}

// 删除设备
export async function deleteDeviceById(params) {
  return request('/api/EDevice/delete', {
    method: 'DELETE',
    params
  })
}

// 获取模型列表
export async function queryModelList() {
  return request('/api/EModel/getList', {
    method: 'GET'
  })
}




export async function queryDeviceListByUserId(params) {
  return request('/api/device/getListByUserId', {
    method: 'GET',
    params
  })
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
