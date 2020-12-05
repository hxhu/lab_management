/* eslint-disable jsx-a11y/iframe-has-title */
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Descriptions,
    Card,
    Space,
    Row,
    Col,
    Form,
    Select,
    Result,
    message
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { queryModelList, queryDeviceList, pushModel } from './service';

const { Option } = Select;

const VideoDisplay = () => {
    const [deviceOptions, setDeviceOptions] = useState([]);
    const [currentDevice, setCurrentDevice] = useState({});
    const [deviceInfo, setDeviceInfo] = useState([]);

    // 请求设备列表
    const getDeviceList = async () => {
        try {
            return await queryDeviceList()
                .then(rst => rst.data)
        } catch (error) {
            message.error('请求设备列表出错');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            const deviceInfoTmp = await getDeviceList()
            setDeviceInfo(deviceInfoTmp)

            const deviceOptionsTmp = []
            deviceInfoTmp.forEach(v => {
                deviceOptionsTmp.push(<Option value={v.id}>{v.deviceName} —— {v.id}</Option>)
            })
            setDeviceOptions(deviceOptionsTmp)
        }

        fetchData()
    }, []);

    // 选择设备
    const onDevicesFinish = (values) => {
        let currentDeviceTmp = null

        deviceInfo.forEach(v => {
            if (values.id === v.id) {
                currentDeviceTmp = v
            }
        })

        setCurrentDevice(currentDeviceTmp)
    }


    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };

    return (
        <PageContainer>
            <Space direction="vertical" style={{ width: "100%" }}>
                {/* 设备选择 */}
                <Card>
                    <Row>
                        <Col span={8}>
                            <Form onFinish={onDevicesFinish}>
                                <Form.Item
                                    label="选择设备"
                                    name="id"
                                    rules={[{ required: true, message: '请选择设备!' }]}
                                >
                                    <Select>
                                        {deviceOptions}
                                    </Select>
                                </Form.Item>

                                <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">添加</Button>
                                    <Button htmlType="button">还原</Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={16} />
                    </Row>
                </Card>

                {/* 设备信息 */}
                <Card>
                    <Descriptions title="设备详情" bordered>
                        <Descriptions.Item label="ID">{get(currentDevice, 'currentModelId', null)}</Descriptions.Item>
                        <Descriptions.Item label="名称">{get(currentDevice, 'deviceName', null)}</Descriptions.Item>
                        <Descriptions.Item label="描述">{get(currentDevice, 'deviceDesc', null)}</Descriptions.Item>
                        <Descriptions.Item label="视频地址">{get(currentDevice, 'videoRtsp', null)}</Descriptions.Item>
                        <Descriptions.Item label="视频信息">{get(currentDevice, 'videoMessage', null)}</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 视频结果 */}
                <Card>
                    {
                        has(currentDevice, 'videoRtsp')
                            ? <iframe
                                style={{ width: "100%", border: 0, height: "1000px" }}
                                src="http://www.baidu.com"
                                scrolling="auto"
                            />
                            : <Result
                                status="warning"
                                title="未选择设备"
                            />
                    }

                </Card>

                {/* 模型信息 */}
                <Card>
                    <Descriptions title="模型详情" bordered>
                        <Descriptions.Item label="ID">{get(currentDevice, 'emodelOutputVO.id', null)}</Descriptions.Item>
                        <Descriptions.Item label="名称">{get(currentDevice, 'emodelOutputVO.modelName', null)}</Descriptions.Item>
                        <Descriptions.Item label="描述">{get(currentDevice, 'emodelOutputVO.modelDesc', null)}</Descriptions.Item>
                        <Descriptions.Item label="模型地址">{get(currentDevice, 'emodelOutputVO.modelLocation', null)}</Descriptions.Item>
                        <Descriptions.Item label="生成时间">{moment(get(currentDevice, 'emodelOutputVO.modelLocation', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                    </Descriptions>
                </Card>

            </Space>

        </PageContainer>
    );
};

export default VideoDisplay;
