import request from '@/utils/request';

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
