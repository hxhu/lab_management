import request from '@/utils/request';

// 获取模型列表
export async function queryModelList() {
  return request('/api/EModel/getList', {
    method: 'GET'
  })
}
// 获取模型详细信息
export async function queryModelById(param) {
  return request('/api/EModel/getById', {
    method: 'GET',
    param
  })
}

// 获取设备列表
export async function queryDeviceList() {
  return request('/api/EDevice/getList', {
    method: 'GET'
  })
}

// 获取设备列表 modelId
export async function queryLogByModelId(params) {
  return request('/api/ELog/getByModelId', {
    method: 'GET',
    params
  })
}

// 获取设备列表 deviceId
export async function queryLogBydeviceId(params) {
  return request('/api/ELog/getByDeviceId', {
    method: 'GET',
    params
  })
}

// 获取设备列表 全部
export async function queryLogList() {
  return request('/api/ELog/getList', {
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
