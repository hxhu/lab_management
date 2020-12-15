/* eslint-disable no-nested-ternary */
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Card,
  Space,
  Row,
  Col,
  Form,
  Select,
  Table,
  Modal,
  Radio,
  message
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { queryModelList, queryDeviceList, queryLogByModelId, queryLogBydeviceId, queryLogList } from './service';

const { Option } = Select;
const { confirm } = Modal;

const Log = () => {
  const [currentType, setCurrentType] = useState(3);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [currentModelLog, setCurrentModelLog] = useState([]);
  const [currentDeviceLog, setCurrentDeviceLog] = useState([]);
  const [currentAllLog, setCurrentAllLog] = useState([]);

  const deviceColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '操作',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '描述',
      dataIndex: 'message',
      key: 'message'
    }
  ];
  const modelColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '操作',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '描述',
      dataIndex: 'message',
      key: 'message'
    }
  ];
  const allColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp'
    },
    {
      title: '操作',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '描述',
      dataIndex: 'message',
      key: 'message'
    }
  ];

  // 请求模型列表
  const getModelList = async () => {
    try {
      return await queryModelList()
        .then(rst => rst.data)
    } catch (error) {
      message.error('请求模型列表出错');
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const modelInfoTmp = await getModelList()

      const modelOptionsTmp = []
      modelInfoTmp.forEach(v => {
        modelOptionsTmp.push(<Option value={v.id}>{v.modelName}</Option>)
      })
      setModelOptions(modelOptionsTmp)
    }

    fetchData()
  }, []);


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

      const deviceOptionsTmp = []
      deviceInfoTmp.forEach(v => {
        deviceOptionsTmp.push(<Option value={v.id}>{v.deviceName} —— {v.id}</Option>)
      })
      setDeviceOptions(deviceOptionsTmp)
    }

    fetchData()
  }, []);


  // 请求全部日志
  useEffect(() => {
    const fetchData = async () => {
      const currentAllLogTmp = await queryLogList()
      setCurrentAllLog(currentAllLogTmp)
    }

    fetchData()
  }, [])

  // 选择类型
  const onChange = e => {
    setCurrentType(e.target.value)
  }
  // 设备选择
  const onDeviceChange = async value => {
    await queryLogBydeviceId({
      deviceId: get(value, "id", "")
    }).then(v => setCurrentDeviceLog(v.data))
  }
  // 模型选择
  const onModelChange = async value => {
    await queryLogByModelId({
      modelId: get(value, "id", "")
    }).then(v => setCurrentModelLog(v.data))
  }
  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 日志类型选择 */}
        <Card>
          <Radio.Group onChange={onChange} value={currentType}>
            <Radio value={1}>设备</Radio>
            <Radio value={2}>模型</Radio>
            <Radio value={3}>全部</Radio>
          </Radio.Group>
        </Card>

        {/* 详细选择 */}
        {
          currentType === 3
            ? null
            : currentType === 1
              ? <Card> {/* 选择设备 */}
                <Row>
                  <Col span={8}>
                    <Form onValuesChange={onDeviceChange}>
                      <Form.Item
                        label="选择设备"
                        name="id"
                        rules={[{ required: true, message: '请选择设备!' }]}
                      >
                        <Select>
                          {deviceOptions}
                        </Select>
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={16} />
                </Row>
              </Card>
              : <Card> {/* 选择模型 */}
                <Row>
                  <Col span={8}>
                    <Form onValuesChange={onModelChange}>
                      <Form.Item
                        label="选择模型"
                        name="id"
                        rules={[{ required: true, message: '请选择模型!' }]}
                      >
                        <Select>
                          {modelOptions}
                        </Select>
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={16} />
                </Row>
              </Card>
        }


        {/* 日志列表 */}
        <Card>
          {
            console.log(currentModelLog)
          }
          {
            currentType === 1
              ? <Table columns={deviceColumns} dataSource={currentModelLog}/>
              : currentType === 2
                ? <Table columns={modelColumns} dataSource={currentDeviceLog}/>
                : currentType === 3
                  ? <Table columns={allColumns} dataSource={currentAllLog}/>
                  : null
          }
        </Card>

      </Space>

    </PageContainer>
  );
};

export default Log;
