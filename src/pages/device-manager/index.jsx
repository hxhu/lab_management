import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Badge,
  Card,
  Space,
  Row,
  Col,
  Form,
  Select,
  Table,
  Modal,
  message,
  Input,
  Divider
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has, unset, includes } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import {
  queryDeviceList,
  deleteDeviceById,
  queryModelList,
  createDevice,
  modifyDevice,
  createERHeartbeat,
  deleteERHeartbeat,
  queryStatusMap,
  deleteFile
} from './service';

const { Option } = Select;
const { confirm } = Modal;
let timer = null;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const DeviceManager = () => {
  const [modelOptions, setModelOptions] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [deviceInfoFlag, setDeviceInfoFlag] = useState(false);

  const [newVisible, setNewVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [newDevice, setNewDevice] = useState({});
  const [updateDevice, setUpdateDevice] = useState({});

  const [deviceStatus, setDeviceStatus] = useState({});
  const [updateFlag, setUpdateFlag] = useState(false);
  const [deleteFileParams, setDeleteFileParams] = useState({});

  const [newForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  // 新建设备相关
  const onNewDeviceCancel = () => {
    newForm.resetFields();
    setNewVisible(false)
  }
  // 修改设备相关
  const onUpdateDeviceCancel = () => {
    updateForm.resetFields();
    setUpdateVisible(false)
  }

  // 修改设备Modal
  const onUpdateReset = () => {
    updateForm.resetFields();
  }
  const onUpdateFinish = values => {
    let updateDeviceTmp = {}

    set(updateDeviceTmp, 'id', values.id)
    set(updateDeviceTmp, 'deviceName', values.deviceName)
    if (values.currentModelId !== null) {
      set(updateDeviceTmp, 'currentModelId', values.currentModelId)
    }
    if (values.deviceDesc !== null) {
      set(updateDeviceTmp, 'deviceDesc', values.deviceDesc)
    }
    if (values.videoMessage !== null) {
      set(updateDeviceTmp, 'videoMessage', values.videoMessage)
    }
    if (values.videoRtsp !== null) {
      set(updateDeviceTmp, 'videoRtsp', values.videoRtsp)
    }

    setUpdateFlag(true)
    setUpdateDevice(updateDeviceTmp)
    setUpdateVisible(false)
  }
  useEffect(() => {
    const fetchData = async () => {
      await modifyDevice(updateDevice)
        .then(v => {
          if (v.code === 2000) {
            message.success("修改设备成功")
          } else {
            message.error("修改设备失败")
          }
        })

      if (get(deleteFileParams, "deviceId", "") === updateDevice.id) {
        await deleteFile(deleteFileParams)
          .then(v => {
            if (v.code === 2000) {
              message.success("删除文件成功")
            } else {
              message.error("删除文件失败")
            }
          })
      } else {
        setDeleteFileParams({})
      }

      setUpdateFlag(false)
      setDeviceInfoFlag(!deviceInfoFlag)
    }

    if (has(updateDevice, 'id') && updateFlag) {
      fetchData()
    }

    if (has(updateDevice, 'id') && !updateFlag) {
      const currentConfigsTmp = []
      get(updateDevice, "currentFileSet", []).forEach(v => {
        currentConfigsTmp.push(`${v.fileName}-${v.id}`)
      })

      // setCurrentConfigs(currentConfigsTmp)
      updateForm.setFieldsValue({
        ...updateDevice,
        fileIds: currentConfigsTmp
      })
      setUpdateVisible(true)
    }
  }, [updateDevice]);


  // 修改文件相关
  const onFileChange = value => {
    const nowFileIds = []
    value.forEach(v => {
      const tmp = v.split("-")
      if (has(tmp, "1")) {
        nowFileIds.push(get(tmp, "1"))
      }

    })

    const allFileIds = []
    get(updateDevice, "currentFileSet", []).forEach(v => {
      allFileIds.push(v.id)
    })

    const deleteFileIds = []
    allFileIds.forEach(v => {
      if (!includes(nowFileIds, v)) {
        deleteFileIds.push(v)
      }
    })

    const params = {
      deviceId: updateDevice.id,
      fileIds: deleteFileIds
    }

    setDeleteFileParams(params)

  }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '设备名',
      dataIndex: 'deviceName',
      key: 'deviceName'
    },
    {
      title: '设备描述',
      dataIndex: 'deviceDesc',
      key: 'deviceDesc'
    },
    {
      title: '模型名',
      dataIndex: 'emodelOutputVO',
      key: 'emodelId',
      render: emodel => get(emodel, "modelName", "")
    },
    {
      title: 'rtsp',
      dataIndex: 'videoRtsp',
      key: 'videoRtsp'
    },
    {
      title: '视频信息',
      dataIndex: 'videoMessage',
      key: 'videoMessage'
    },
    {
      title: '状态',
      dataIndex: 'id',
      key: 'status',
      render: id => {
        let status = null
        let text = null

        switch (get(deviceStatus, id, null)) {
          case "0": status = "error"; text = "离线"; break;
          case "1": status = "processing"; text = "在线"; break;
          case "2": status = "success"; text = "运行"; break;
          default: status = "error"; text = "离线"; break;
        }
        return (<Badge status={status} text={text} />)
      }
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'action',
      render: id => (
        <Space>
          {/* 修改按钮 */}
          <Button
            type="primary"
            onClick={() => {
              let updateDeviceTmp = {}
              const deviceInfoTmp = cloneDeep(deviceInfo)
              deviceInfoTmp.forEach(v => {
                if (v.id === id) {
                  updateDeviceTmp = v
                }
              })

              unset(updateDeviceTmp, 'emodelOutputVO')
              setUpdateDevice(updateDeviceTmp)
            }}
          >
            修改
          </Button>
          <Modal
            title="修改设备"
            visible={updateVisible}
            onCancel={onUpdateDeviceCancel}
            footer={null}
          >
            <Form
              {...layout}
              form={updateForm}
              onFinish={onUpdateFinish}
              labelAlign="right"
              // initialValues={updateDevice}
              colon={false}
            >
              {/* ID */}
              <Form.Item
                label="ID"
                name="id"
                rules={[{ required: true, message: '请输入ID!' }]}
              >
                <Input disabled />
              </Form.Item>

              {/* deviceName */}
              <Form.Item
                label="设备名"
                name="deviceName"
                rules={[{ required: true, message: '请输入设备名!' }]}
              >
                <Input />
              </Form.Item>

              {/* deviceDesc */}
              <Form.Item
                label="设备信息"
                name="deviceDesc"
                initialValue={null}
              >
                <Input />
              </Form.Item>

              {/* videoRtsp */}
              <Form.Item
                label="RTSP地址"
                name="videoRtsp"
                initialValue={null}
              >
                <Input />
              </Form.Item>

              {/* videoMessage */}
              <Form.Item
                label="视频信息"
                name="videoMessage"
                initialValue={null}
              >
                <Input />
              </Form.Item>

              {/* currentModelId */}
              <Form.Item
                label="模型ID"
                name="currentModelId"
                initialValue={null}
              >
                <Select>
                  {modelOptions}
                </Select>
              </Form.Item>

              <Divider />

              <Form.Item
                label="配置文件"
                name="fileIds"
                initialValue={null}
              >
                <Select
                  mode="multiple"
                  onChange={onFileChange}
                  allowClear
                >
                  {null}
                </Select>
              </Form.Item>


              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">修改</Button>
                <Button htmlType="button" onClick={onUpdateReset}>清空</Button>
              </Form.Item>
            </Form>
          </Modal>

          {/* 删除按钮 */}
          <Button
            type="dashed"
            onClick={() => {
              confirm({
                title: '确认删除该设备？',
                icon: <ExclamationCircleOutlined />,
                content: `设备ID: ${id}`,
                async onOk() {
                  // 删除设备
                  await deleteDeviceById({
                    "deviceId": id
                  }).then(v => {
                    if (v.code === 2000) {
                      message.success("设备删除成功")
                    } else {
                      message.error("设备删除失败")
                    }
                  })

                  // 删除设备相应心跳
                  await deleteERHeartbeat({
                    "deviceId": id
                  }).then(v => {
                    if (v.code === 2000) {
                      message.success("心跳删除成功")
                    } else {
                      message.error("心跳删除失败")
                    }
                  })
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
        </Space>
      ),
    },
  ];

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
    }

    fetchData()
  }, [deviceInfoFlag]);
  useEffect(() => {
    const getDeviceStatus = async (deviceInfoSource) => {
      const deviceIds = []
      deviceInfoSource.forEach(v => {
        deviceIds.push(v.id)
      })

      await queryStatusMap({
        "deviceIds": deviceIds
      }).then(v => {
        setDeviceStatus(v.data)
      })
    }

    timer = window.setInterval(() => {
      getDeviceStatus(deviceInfo)
    }, 30000)

    return () => { window.clearInterval(timer) }
  }, [deviceInfo])

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
        modelOptionsTmp.push(<Option value={v.id}>{v.modelName} - {v.id}</Option>)
      })
      setModelOptions(modelOptionsTmp)
    }

    fetchData()
  }, []);

  // 注册设备Modal
  const onNewFinish = values => {
    let newDeviceTmp = {}

    set(newDeviceTmp, 'id', values.id)
    set(newDeviceTmp, 'deviceName', values.deviceName)
    if (values.currentModelId !== null) {
      set(newDeviceTmp, 'currentModelId', values.currentModelId)
    }
    if (values.deviceDesc !== null) {
      set(newDeviceTmp, 'deviceDesc', values.deviceDesc)
    }
    if (values.videoMessage !== null) {
      set(newDeviceTmp, 'videoMessage', values.videoMessage)
    }
    if (values.videoRtsp !== null) {
      set(newDeviceTmp, 'videoRtsp', values.videoRtsp)
    }

    setNewDevice(newDeviceTmp)
    setNewVisible(false)
  }
  const onNewReset = () => {
    newForm.resetFields();
  }
  useEffect(() => {
    const fetchData = async () => {
      await createDevice(newDevice)
        .then(v => {
          if (v.code === 2000) {
            message.success("注册设备成功")
          } else {
            message.error("注册设备失败")
          }
        })


      const heartbeatTmp = {}
      set(heartbeatTmp, 'deviceId', newDevice.id)
      set(heartbeatTmp, 'type', "heartbeat")
      set(heartbeatTmp, 'status', "0")
      set(heartbeatTmp, 'timestamp', Date.parse(new Date()))
      await createERHeartbeat(heartbeatTmp)
        .then(v => {
          if (v.code === 2000) {
            message.success("注册心跳成功")
          } else {
            message.error("注册心跳失败")
          }
        })
      setDeviceInfoFlag(!deviceInfoFlag)
    }

    if (has(newDevice, 'id')) {
      fetchData()
    }
  }, [newDevice]);


  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 设备新建 */}
        <Card>
          <Button type="primary" onClick={() => setNewVisible(true)}>注册设备</Button>
          <Modal
            title="注册设备"
            visible={newVisible}
            onCancel={onNewDeviceCancel}
            footer={null}
          >
            <Form
              {...layout}
              form={newForm}
              initialValues={{ remember: true }}
              onFinish={onNewFinish}
              labelAlign="right"
              colon={false}
            >
              {/* ID */}
              <Form.Item
                label="ID"
                name="id"
                rules={[{ required: true, message: '请输入ID!' }]}
              >
                <Input />
              </Form.Item>

              {/* deviceName */}
              <Form.Item
                label="设备名"
                name="deviceName"
                rules={[{ required: true, message: '请输入设备名!' }]}
              >
                <Input />
              </Form.Item>

              {/* deviceDesc */}
              <Form.Item
                label="设备信息"
                name="deviceDesc"
                initialValue={null}
              >
                <Input />
              </Form.Item>

              {/* videoRtsp */}
              <Form.Item
                label="RTSP地址"
                name="videoRtsp"
                initialValue={null}
              >
                <Input />
              </Form.Item>

              {/* videoMessage */}
              <Form.Item
                label="视频信息"
                name="videoMessage"
                initialValue={null}
              >
                <Input />
              </Form.Item>

              {/* currentModelId */}
              <Form.Item
                label="模型ID"
                name="currentModelId"
                initialValue={null}
              >
                <Select>
                  {modelOptions}
                </Select>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">注册</Button>
                <Button htmlType="button" onClick={onNewReset}>清空</Button>
              </Form.Item>
            </Form>
          </Modal>
        </Card>

        {/* 设备列表 */}
        <Card>
          <Table
            columns={columns}
            dataSource={deviceInfo}
            rowKey={(record) => {
              return (record.id + Date.now()) // 在这里加上一个时间戳就可以了，刷新问题
            }}
          />
        </Card>

      </Space>

    </PageContainer>
  );
};

export default DeviceManager;
