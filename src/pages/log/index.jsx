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
  message,
  Avatar
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { queryModelList, queryDeviceList, queryLogByModelId, queryLogBydeviceId, queryLogList } from './service';

const { Option } = Select;

const Log = () => {
  const [currentType, setCurrentType] = useState(3);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [currentModelLog, setCurrentModelLog] = useState([]);
  const [currentDeviceLog, setCurrentDeviceLog] = useState([]);
  const [currentAllLog, setCurrentAllLog] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [currentModelId, setCurrentModelId] = useState(null);
  const [currentAll, setCurrentAll] = useState(null);

  const deviceColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'type',
      key: 'type',
      render: v => {
        let result = null
        switch (v) {
          case "1":
            result = <Avatar style={{ backgroundColor: "#10239e", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "2":
            result = <Avatar style={{ backgroundColor: "#f5222d", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "3":
            result = <Avatar style={{ backgroundColor: "#52c41a", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-1":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-2":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-3":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-4":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-5":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-6":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-7":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-8":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-9":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          default:
            result = <Avatar style={{ backgroundColor: "#9e1068", verticalAlign: 'middle' }} size="large">U</Avatar>
            break;
        }
        return result
      }
    },
    {
      title: '描述',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: '当前模型',
      dataIndex: 'emodelOutputVO',
      key: 'currentModel',
      render: v => get(v, "modelName", null)
    },
    {
      title: 'rtsp',
      dataIndex: 'edeviceOutputVO',
      key: 'rtsp',
      render: v => get(v, "videoRtsp", null)
    }
  ];
  const modelColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'type',
      key: 'type',
      render: v => {
        let result = null
        switch (v) {
          case "1":
            result = <Avatar style={{ backgroundColor: "#10239e", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "2":
            result = <Avatar style={{ backgroundColor: "#f5222d", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "3":
            result = <Avatar style={{ backgroundColor: "#52c41a", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-1":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-2":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-3":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-4":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-5":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-6":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-7":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-8":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-9":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          default:
            result = <Avatar style={{ backgroundColor: "#9e1068", verticalAlign: 'middle' }} size="large">U</Avatar>
            break;
        }
        return result
      }
    },
    {
      title: '描述',
      dataIndex: 'message',
      key: 'message'
    },
    {
      title: '模型位置',
      dataIndex: 'emodelOutputVO',
      key: 'modelLocation',
      render: v => get(v, "modelLocation", "")
    }
  ];
  const allColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'type',
      key: 'type',
      render: v => {
        let result = null
        switch (v) {
          case "1":
            result = <Avatar style={{ backgroundColor: "#10239e", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "2":
            result = <Avatar style={{ backgroundColor: "#f5222d", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "3":
            result = <Avatar style={{ backgroundColor: "#52c41a", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-1":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-2":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-3":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-4":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-5":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-6":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          case "-7":
            result = <Avatar style={{ backgroundColor: "#520339", verticalAlign: 'middle' }} size="large">C</Avatar>
            break;
          case "-8":
            result = <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">D</Avatar>
            break;
          case "-9":
            result = <Avatar style={{ backgroundColor: "#237804", verticalAlign: 'middle' }} size="large">M</Avatar>
            break;
          default:
            result = <Avatar style={{ backgroundColor: "#9e1068", verticalAlign: 'middle' }} size="large">U</Avatar>
            break;
        }
        return result
      }
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


  // 选择类型
  const onChange = e => {
    setCurrentType(e.target.value)
  }

  // 设备选择 && 模型选择
  const onFinish = value => {
    switch (currentType) {
      case 1: setCurrentDeviceId(get(value, "deviceId", "")); break;
      case 2: setCurrentModelId(get(value, "modelId", "")); break;
      case 3: setCurrentAll(null); break;
      default: setCurrentAll(null); break;
    }
  }
  // 请求全部日志
  useEffect(() => {
    const fetchData = async () => {
      await queryLogList().then(v => setCurrentAllLog(v.data))
    }

    fetchData()
  }, [currentAll])
  // 请求设备日志
  useEffect(() => {
    const fetchData = async () => {
      const currentDeviceLogTmp = await queryLogBydeviceId({
        deviceId: currentDeviceId
      }).then(v => v.data)

      setCurrentDeviceLog(currentDeviceLogTmp)
    }

    if (currentDeviceId !== null) {
      fetchData()
    }
  }, [currentDeviceId])
  // 请求模型日志
  useEffect(() => {
    const fetchData = async () => {
      await queryLogByModelId({
        modelId: currentModelId
      }).then(v => setCurrentModelLog(v.data))
    }

    if (currentModelId !== null) {
      fetchData()
    }
  }, [currentModelId])

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <PageContainer>
      {
        console.log(currentModelLog)
      }
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
        <Card> {/* 选择设备 */}
          <Row>
            <Col span={8}>
              <Form onFinish={onFinish}>
                <Form.Item
                  label="选择设备"
                  name="deviceId"
                >
                  <Select disabled={currentType === 3 || currentType === 2}>
                    {deviceOptions}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="选择模型"
                  name="modelId"
                >
                  <Select disabled={currentType === 3 || currentType === 1}>
                    {modelOptions}
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


        {/* 日志列表 */}
        <Card>
          {
            currentType === 1
              ? <Table columns={deviceColumns} dataSource={currentDeviceLog} />
              : currentType === 2
                ? <Table columns={modelColumns} dataSource={currentModelLog} />
                : currentType === 3
                  ? <Table columns={allColumns} dataSource={currentAllLog} />
                  : null
          }
        </Card>

      </Space>

    </PageContainer>
  );
};

export default Log;
