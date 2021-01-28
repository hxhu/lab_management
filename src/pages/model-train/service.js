import request from '@/utils/request';

// 数据集选择
export async function chooseDataSet(params) {
    return request('/api/ECase/chooseDataSet', {
        method: 'POST',
        data: params
    })
}

// 环境准备
export async function prepareEnvironment(params) {
    return request('/api/ECase/prepareEnvironment', {
        method: 'GET',
        params
    });
}