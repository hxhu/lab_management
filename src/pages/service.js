import request from '@/utils/request';

export async function queryLogs() {
  return request('/api/log/getLogs', {
    method: 'GET'
  })
}