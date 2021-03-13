/* eslint-disable react/jsx-curly-brace-presence */
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
  message,
  Radio,
  DatePicker
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { queryModelList, queryDeviceList, pushModel } from './service';

const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

const ModelPush = () => {
  const [modelOptions, setModelOptions] = useState([]);
  const [currentModel, setCurrentModel] = useState({});
  const [modelInfo, setModelInfo] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [currentDevices, setCurrentDevices] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [pushModelData, setPushModelData] = useState({});
  const [updateTime, setUpdateTime] = useState("I"); // I F S
  const [time, setTime] = useState("");

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '设备名',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备描述',
      dataIndex: 'deviceDesc',
      key: 'deviceDesc',
    },
    {
      title: '模型ID',
      dataIndex: 'currentModelId',
      key: 'currentModelId',
    },
    {
      title: '模型详情',
      dataIndex: 'emodelOutputVO',
      key: 'emodelOutputVO',
      render: json => <ReactJson src={json} />
    },
    {
      dataIndex: 'id',
      key: 'action',
      render: id => (
        <Button
          type="dashed"
          onClick={() => {
            confirm({
              title: '确认从列表中删除该设备？',
              icon: <ExclamationCircleOutlined />,
              content: `设备ID: ${id}`,
              onOk() {
                const currentDevicesTmp = []
                currentDevices.forEach(v => {
                  if (v.id !== id) {
                    currentDevicesTmp.push(v)
                  }
                })
                setCurrentDevices(currentDevicesTmp)
                message.success("删除成功")
              },
              onCancel() {
                message.warning("取消删除")
              },
            })
          }}
          danger
        >
          删除
        </Button>
      ),
    },
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
      setModelInfo(modelInfoTmp)

      const modelOptionsTmp = []
      modelInfoTmp.forEach(v => {
        modelOptionsTmp.push(<Option value={v.id}>{v.modelName}</Option>)
      })
      setModelOptions(modelOptionsTmp)
    }

    fetchData()
  }, []);

  // 选择模型
  const onValuesModelChange = (changedValues) => {
    let modelInfoTmp = null
    modelInfo.forEach(v => {
      if (changedValues.id === v.id) {
        modelInfoTmp = v
      }
    })
    setCurrentModel(modelInfoTmp)
  }

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
    const currentDevicesTmp = cloneDeep(currentDevices)
    let flag = true
    currentDevices.forEach(v => {
      if (values.id === v.id) {
        flag = false
      }
    })

    if (flag) {
      deviceInfo.forEach(v => {
        if (values.id === v.id) {
          currentDevicesTmp.push(v)
        }
      })
    }

    setCurrentDevices(currentDevicesTmp)
  }

  // 推送模型 points
  const onPushModelPoints = () => {
    const devicePushIds = []
    currentDevices.forEach(v => {
      devicePushIds.push(v.id)
    })

    const updateTimeTmp = updateTime === "S" ? updateTime + ";" + time : updateTime

    const result = {
      "deviceIds": devicePushIds,
      "modelId": currentModel.id,
      "parttern": updateTimeTmp,
      "type": "points"
    }
    setPushModelData(result)
  }
  // 推送模型 boardcast
  const onPushModelBoardcast = () => {
    const devicePushIds = []
    deviceInfo.forEach(v => {
      devicePushIds.push(v.id)
    })

    const updateTimeTmp = updateTime === "S" ? updateTime + ";" + time : updateTime

    const result = {
      "deviceIds": devicePushIds,
      "modelId": currentModel.id,
      "parttern": updateTimeTmp,
      "type": "boardcast"
    }
    setPushModelData(result)
  }
  useEffect(() => {
    const fetchData = async () => {
      console.log(pushModelData)
      if (has(pushModelData, 'deviceIds')) {
        await pushModel(pushModelData).then(v => {
          if (v.code === 2000) {
            message.success("推送模型成功")
          } else {
            message.error("推送模型失败")
          }
        })
      }
    }

    fetchData()
  }, [pushModelData]);

  // 更新模式设定
  const onRadioChange = e => {
    setUpdateTime(e.target.value)
  }
  const onTimeChange = (value, dateString) => {
    setTime(dateString)
  }
  const onOk = (value) => {
    console.log('OK is NO useful');
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 模型选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form onValuesChange={onValuesModelChange}>
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

        {/* 模型信息 */}
        <Card>
          <Descriptions title="模型详情" bordered>
            <Descriptions.Item label="名称">{get(currentModel, 'modelName', null)}</Descriptions.Item>
            <Descriptions.Item label="模型位置">{get(currentModel, 'modelLocation', null)}</Descriptions.Item>
            <Descriptions.Item label="描述">{get(currentModel, 'modelDesc', null)}</Descriptions.Item>
            <Descriptions.Item label="生成时间">{moment(get(currentModel, 'createTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 更新方式设定 */}
        <Card title="更新方式设定">
          <Radio.Group onChange={onRadioChange}>
            <Radio value="I">立即更新</Radio>
            <Radio value="F">闲时更新</Radio>
            <Radio value="S">固定时间更新</Radio>
          </Radio.Group>
        </Card>
        {
          <Card>
            {
              updateTime === "S"
              ? <DatePicker showTime onChange={onTimeChange} onOk={onOk} />
              : null
            }
          </Card>
        }

        {/* 推送模型 boardcast*/}
        <Card>
          <Button type="primary" onClick={onPushModelBoardcast}>广播模型</Button>
        </Card>

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

        {/* 设备列表 */}
        <Card>
          <Table columns={columns} dataSource={currentDevices} />
        </Card>

        {/* 推送模型 points*/}
        <Card>
          <Button type="primary" onClick={onPushModelPoints}>推送模型</Button>
        </Card>
      </Space>

    </PageContainer>
  );
};

export default ModelPush;
