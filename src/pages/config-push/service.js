import request from '@/utils/request';

// 获取文件列表
export async function queryFilelList() {
  return request('/api/EFile/getList', {
    method: 'GET'
  })
}

// 获取设备列表
export async function queryDeviceList() {
  return request('/api/EDevice/getList', {
    method: 'GET'
  })
}

// 推送模型
export async function pushFile(params) {
  return request('/api/EFile/pushFile', {
    method: 'POST',
    data: params,
  });
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
