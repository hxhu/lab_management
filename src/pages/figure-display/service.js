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

export async function queryDataByDataId(params) {
  return request('/api/dataSource/getById', {
    method: 'GET',
    params
  })
}

export async function queryFigureByDeviceId(params) {
  return request('/api/device/getFiguresById', {
    method: 'GET',
    params
  })
}

export async function queryDataByDisplayIds(params) {
  return request('/api/dataSource/getDatasByIds', {
    method: 'POST',
    data: params
  })
}

