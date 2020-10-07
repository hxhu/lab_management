import request from '@/utils/request';

export async function queryDeviceListByUserId(params) {
  return request('/api/device/getListByUserId', {
    method: 'GET',
    params
  })
}

export async function queryDisplayByDeviceIdAndDisplayType(params) {
  return request('/api/device/getDisplayByDeviceIdAndDisplayType', {
    method: 'GET',
    params
  })
}

export async function queryDeviceByDeviceId(params) {
  return request('/api/device/getById', {
    method: 'GET',
    params
  })
}

export async function queryMonitorByMonitorId(params) {
  return request('/api/monitor/getById', {
    method: 'GET',
    params
  })
}

export async function queryDisplayByDisplayId(params) {
  return request('/api/dataDisplay/getById', {
    method: 'GET',
    params
  })
}

export async function queryDataByDataId(params) {
  return request('/api/dataSource/getById', {
    method: 'GET',
    params
  })
}

export async function queryRule(params) {
  return request('/api/rule', {
    params,
  });
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
