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
  message
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { queryDeviceList, deleteDeviceById } from './service';

const { confirm } = Modal;

const DeviceManager = () => {
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [newVisible, setNewVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  // 新建设备相关
  const onNewDeviceCancel = () => {
    setNewVisible(false)
  }
  const onNewDeviceOK = () => {

  }

  // 修改设备相关
  const onUpdateDeviceCancel = () => {
    setUpdateVisible(false)
  }
  const onUpdateDeviceOK = () => {
    
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
      dataIndex: 'id',
      key: 'action',
      render: id => (
        <Space>
          {/* 修改按钮 */}
          <Button
            type="primary"
            onClick={() => setUpdateVisible(true)}
          >
            修改
          </Button>
          <Modal
            title="修改设备"
            visible={updateVisible}
            onOk={onUpdateDeviceOK}
            onCancel={onUpdateDeviceCancel}
          >
            <p>修改设备</p>
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
                      message.success("删除成功")
                    } else {
                      message.error("删除失败")
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
  }, []);

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 推送模型 */}
        <Card>
          <Button type="primary" onClick={() => setNewVisible(true)}>新建设备</Button>
          <Modal
            title="新建设备"
            visible={newVisible}
            onOk={onNewDeviceOK}
            onCancel={onNewDeviceCancel}
          >
            <p>新建设备</p>
          </Modal>
        </Card>

        {/* 设备列表 */}
        <Card>
          <Table columns={columns} dataSource={deviceInfo} />
        </Card>

      </Space>

    </PageContainer>
  );
};

export default DeviceManager;
