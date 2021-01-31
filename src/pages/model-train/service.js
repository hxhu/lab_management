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

// 训练情况
export async function getTrainingCondition(params) {
    return request('/api/ECase/getTrainingCondition', {
        method: 'GET',
        params
    });
}

// 训练损失
export async function getTrainingLoss(params) {
    return request('/api/ECase/getTrainingLoss', {
        method: 'GET',
        params
    });
}

// 测试结果
export async function getTestResult(params) {
    return request('/api/ECase/getTestResult', {
        method: 'GET',
        params
    });
}
