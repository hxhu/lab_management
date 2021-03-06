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
  Switch
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has, includes } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { queryFilelList, queryDeviceList, pushFile } from './service';

const { Option } = Select;
const { confirm } = Modal;

const ModelPush = () => {
  const [fileOptions, setFileOptions] = useState([]);
  const [currentFile, setCurrentFile] = useState({});
  const [fileInfo, setFileInfo] = useState([]);

  const [typeOptions, setTypeOptions] = useState([]);

  const [deviceOptions, setDeviceOptions] = useState([]);
  const [currentDevices, setCurrentDevices] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [pushFileData, setPushFileData] = useState({});

  const [pageType, setPageType] = useState(true);

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

  // 请求文件列表
  const getFileList = async () => {
    try {
      return await queryFilelList()
        .then(rst => rst.data)
    } catch (error) {
      message.error('请求文件列表出错');
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const fileInfoTmp = await getFileList()
      setFileInfo(fileInfoTmp)

      const fileOptionsTmp = []
      const types = []
      fileInfoTmp.forEach(v => {
        fileOptionsTmp.push(<Option value={v.id}>{v.id}-{v.fileName}</Option>)
        if (!includes(types, get(v, "type", ""))) {
          types.push(get(v, "type", ""))
        }
      })

      const typeOptionsTmp = []
      types.forEach(v => {
        typeOptionsTmp.push(<Option value={v}>{v}</Option>)
      })
      typeOptionsTmp.push(<Option value="">全部类型</Option>)

      setTypeOptions(typeOptionsTmp)
      setFileOptions(fileOptionsTmp)
    }

    fetchData()
  }, []);

  // 选择文件类型
  const onValuesTypeChange = (changedValues) => {
    const curType = get(changedValues, "type", "")
    const fileOptionsTmp = []

    if( curType === "" ){
      fileInfo.forEach(v => {
        fileOptionsTmp.push(<Option value={v.id}>{v.id}-{v.fileName}</Option>)
      })
    }else{
      fileInfo.forEach(v => {
        if (get(v, "type", "") === curType) {
          fileOptionsTmp.push(<Option value={v.id}>{v.id}-{v.fileName}</Option>)
        }
      })
    }

    setFileOptions(fileOptionsTmp)
  }
  // 选择文件
  const onValuesFileChange = (changedValues) => {
    const fileId = get(changedValues, "fileId", "")

    let currentFileTmp = null
    fileInfo.forEach(v => {
      if (v.id === fileId) {
        currentFileTmp = cloneDeep(v)
      }
    })

    setCurrentFile(currentFileTmp)
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
  const onPushFilePoints = () => {
      const devicePushIds = []
      currentDevices.forEach(v => {
        devicePushIds.push(v.id)
      })

      const result = {
        "deviceIds": devicePushIds,
        "fileId": currentFile.id,
        "type": "points"
      }

      setPushFileData(result)
  }
  // 推送模型 boardcast
  const onPushFileBoardcast = () => {
      const devicePushIds = []
      deviceInfo.forEach(v => {
        devicePushIds.push(v.id)
      }) 

      const result = {
        "deviceIds": devicePushIds,
        "fileId": currentFile.id,
        "type": "boardcast"
      }

      setPushFileData(result)
  }
  useEffect(() => {
    const fetchData = async () => {
      if (has(pushFileData, 'deviceIds')) {
        await pushFile(pushFileData).then(v => {
          if (v.code === 2000) {
            message.success("推送模型成功")
          } else {
            message.error("推送模型失败")
          }
        })
      }
    }

    fetchData()
  }, [pushFileData]);

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 选择文件还是参数 */}
        <Card>
          <Switch checkedChildren="文件" unCheckedChildren="参数" defaultChecked onClick={(checked) => setPageType(checked)}/>
        </Card>

        {
          pageType
            ? <>
              <Card> {/* 类型选择 */}
                <Row>
                  <Col span={8}>
                    <Form onValuesChange={onValuesTypeChange}>
                      <Form.Item
                        label="选择配置文件类型"
                        name="type"
                      >
                        <Select>
                          {typeOptions}
                        </Select>
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={16} />
                </Row>
              </Card>

              <Card> {/* 文件选择 */}
                <Row>
                  <Col span={16}>
                    <Form onValuesChange={onValuesFileChange}>
                      <Form.Item
                        label="选择文件"
                        name="fileId"
                        rules={[{ required: true, message: '请选择文件!' }]}
                      >
                        <Select>
                          {fileOptions}
                        </Select>
                      </Form.Item>
                    </Form>
                  </Col>
                  <Col span={8} />
                </Row>
              </Card>


              <Card> {/* 模型信息 */}
                <Descriptions title="文件详情" bordered>
                  <Descriptions.Item label="名称">{get(currentFile, 'fileName', null)}</Descriptions.Item>
                  <Descriptions.Item label="模型位置">{get(currentFile, 'fileLocation', null)}</Descriptions.Item>
                  <Descriptions.Item label="描述">{get(currentFile, 'fileDesc', null)}</Descriptions.Item>
                  <Descriptions.Item label="标签">{get(currentFile, 'type', null)}</Descriptions.Item>
                  <Descriptions.Item label="生成时间">{moment(get(currentFile, 'createTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                </Descriptions>
              </Card>


              <Card> {/* 推送文件 boardcast */}
                <Button type="primary" onClick={onPushFileBoardcast}>广播文件</Button>
              </Card>


              <Card> {/* 设备选择 */}
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


              <Card> {/* 设备列表 */}
                <Table columns={columns} dataSource={currentDevices} />
              </Card>



              <Card> {/* 推送文件 points */}
                <Button type="primary" onClick={onPushFilePoints}>推送文件</Button>
              </Card>
            </>
            : null
        }
      </Space>

    </PageContainer >
  );
};

export default ModelPush;
