import { PlusOutlined } from '@ant-design/icons';
import {
  Descriptions,
  Row,
  Col,
  Form,
  Space,
  Card,
  Select
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Map, Marker } from 'react-amap';
import { get, cloneDeep, set } from 'lodash'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import moment from 'moment';
import { queryDeviceListByUserId } from './service';


const { Option } = Select;

const MapDisplay = () => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [data, setData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});

  const onValuesChange = (changedValues) => {
    let tmp = null;
    deviceList.forEach(v => {
      if (v.id === changedValues.name) {
        tmp = cloneDeep(v)
      }
    })
    // 类型
    switch (tmp.type) {
      case "sensor": set(tmp, 'type', '传感器'); break;
      case "embedded": set(tmp, 'type', '嵌入式'); break;
      case "server": set(tmp, 'type', '服务器'); break;
      default: set(tmp, 'type', '未知'); break;
    }

    // 运行状态
    switch (tmp.status) {
      case 0: set(tmp, 'status', '离线'); set(tmp, 'statusFlag', 'error'); break;
      case 1: set(tmp, 'status', '在线'); set(tmp, 'statusFlag', 'processing'); break;
      case 2: set(tmp, 'status', '运行'); set(tmp, 'statusFlag', 'success'); break;
      default: set(tmp, 'status', '未知'); set(tmp, 'statusFlag', 'error'); break;
    }

    // 自动收集数据
    switch (tmp.collectFlag) {
      case true: set(tmp, 'collect', '是'); set(tmp, 'collectFlag', 'success'); break;
      case false: set(tmp, 'collect', '否'); set(tmp, 'collectFlag', 'error'); break;
      default: set(tmp, 'collect', '否'); set(tmp, 'collectFlag', 'error'); break;
    }

    setDeviceDetail(tmp)

  }

  // 跟据userId获取设备列表
  const getDeviceListByUserId = async userId => {
    try {
      return await queryDeviceListByUserId({
        'userId': userId
      }).then(rst => rst.data)
    } catch (error) {
      message.error('设备请求出错');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const dataTmp = await getDeviceListByUserId('hu')
      setDeviceList(dataTmp)

      const tmp = []
      dataTmp.forEach(v => tmp.push(<Option value={v.id}>{v.name}</Option>))
      setProjectOptions(tmp)
    }

    fetchData()
  }, []);

  useEffect(() => {
    setData({
    })
  }, []);

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 项目选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form onValuesChange={onValuesChange}>
                <Form.Item
                  label="选择设备"
                  name="name"
                  rules={[{ required: true, message: '请选择设备!' }]}
                >
                  <Select>
                    {projectOptions}
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col span={16} />
          </Row>
        </Card>

        {/* 设备信息 */}
        <Card>
          <Descriptions title="设备详情" bordered>
            <Descriptions.Item label="名称">{get(deviceDetail, 'name', null)}</Descriptions.Item>
            <Descriptions.Item label="类型">{get(deviceDetail, 'type', null)}</Descriptions.Item>
            <Descriptions.Item label="描述">{get(deviceDetail, 'desc', null)}</Descriptions.Item>
            <Descriptions.Item label="展示配置数">{get(deviceDetail, 'displayIds', []).length}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{moment(get(deviceDetail, 'registerTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 地图展示 */}
        <Card>
          <Descriptions title="结果地图" bordered>
            <Descriptions.Item label="描述">结果描述</Descriptions.Item>
          </Descriptions>
          <Card hoverable bordered>
            <Row>
              <Col span={2} />
              <Col span={20} >
                <div style={{ width: 1200, height: 900 }}>
                  <Map
                    amapkey='fc08ec888feba2e1738cbefb97817974'
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </Col>
              <Col span={2} />
            </Row>
          </Card>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default MapDisplay;
