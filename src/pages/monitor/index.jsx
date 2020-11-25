/* eslint-disable no-nested-ternary */
import { PlusOutlined } from '@ant-design/icons';
import {
  Descriptions,
  Row,
  Col,
  Form,
  Space,
  Card,
  Select,
  message,
  Popover,
  Badge,
  Avatar
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Map, Marker } from 'react-amap';
import { get, cloneDeep, set, has } from 'lodash'
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import {
  queryDeviceListByUserId,
  queryDataByDataId,
  queryMonitorByMonitorId,
  queryDisplayByDisplayId
} from './service';

const { Option } = Select;

const MapDisplay = () => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [currentDisplay, setCurrentDisplay] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [currentMonitor, setCurrentMonitor] = useState({});

  const onValuesChange = (changedValues) => {
    let tmp = null;
    deviceList.forEach(v => {
      if (v.id === changedValues.devceId) {
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
    setCurrentDeviceId(changedValues.devceId)
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

  // 跟据dataId获取数据
  const getDataByDataId = async dataId => {
    try {
      return await queryDataByDataId({
        'id': dataId
      }).then(rst => rst.data)
    } catch (error) {
      message.error('数据请求出错');
    }
  }

  // 跟据deivceId获取数据
  const getDisplayByDisplayId = async displayId => {
    try {
      return await queryDisplayByDisplayId({
        'id': displayId
      }).then(rst => rst.data)
    } catch (error) {
      message.error('配置请求出错');
    }
  }

  // 跟据deivceId获取数据
  const getMonitorByMonitorId = async monitorId => {
    try {
      return await queryMonitorByMonitorId({
        'id': monitorId
      }).then(rst => rst.data)
    } catch (error) {
      message.error('监控请求出错');
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
    const fetchData = async () => {
      let monitor = null
      let display = null
      let data = null
      // 拿到当前监控数据
      if (get(deviceDetail, 'monitorId', null) !== null) {
        monitor = await getMonitorByMonitorId(get(deviceDetail, 'monitorId'))
      }
      if (get(monitor, 'mapId', null) !== null) {
        display = await getDisplayByDisplayId(get(monitor, 'mapId'))
      }
      if (get(display, 'dataId', null) !== null) {
        data = await getDataByDataId(get(display, 'dataId'))
      }
      setCurrentMonitor(monitor)
      setCurrentDisplay(display)
      setCurrentData(data)
    }

    if (has(deviceDetail, 'id')) {
      fetchData()
    }
  }, [deviceDetail]);

  useEffect(() => {
    // const fetchData = async () => {
    //   // 拿到当前监控数据
    //   const device = await getMonitorByMonitorId(currentDeviceId)
    //   // 拿到当前数据
    //   if (get(monitor, 'dataId', null) !== null) {
    //     const data = await getDataByDataId(get(display, 'dataId'))
    //     setCurrentDisplay(display)
    //     setCurrentData(data)
    //   }
    // }

    // if (currentDeviceId !== null) {
    //   fetchData()
    // }
  }, [currentDeviceId]);

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
                  name="devceId"
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
        {/* 地图中显示 设备所在点 在线？ 运行？ 位置（经纬度） */}
        <Card>
          <Descriptions title="监控地图" bordered>
            <Descriptions.Item label="监控名">{get(currentMonitor, 'name', null)}</Descriptions.Item>
            <Descriptions.Item label="配置名">{get(currentDisplay, 'name', null)}</Descriptions.Item>
            <Descriptions.Item label="描述">{get(currentMonitor, 'desc', null)}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{moment(get(currentData, 'lastTimestamp', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          </Descriptions>
          <Card hoverable bordered>
            <Row>
              <Col span={2} />
              <Col span={20} >
                <div style={{ width: 1200, height: 900 }}>
                  <Map
                    amapkey='fc08ec888feba2e1738cbefb97817974'
                    style={{ width: "100%", height: "100%" }}
                  >
                    {
                      has(currentData, 'value') ?
                        <Marker position={{ longitude: get(currentData, 'value[0].longitude', null), latitude: get(currentData, 'value[0].latitude', null) }} >

                          <Popover
                            style={{ width: 200, height: 100 }}
                            content={<Descriptions
                              size="small"
                              column={1}
                              bordered
                            >
                              <Descriptions.Item label="经度">{get(currentData, 'value[0].longitude', null)}</Descriptions.Item>
                              <Descriptions.Item label="维度">{get(currentData, 'value[0].latitude', null)}</Descriptions.Item>
                              <Descriptions.Item label="设备状态">
                                {/* success | processing | default | error | warning */} {/* offline online running */}
                                <Badge
                                  status={get(currentData, 'value[0].status', null) === "running" ?
                                    "success"
                                    : get(currentData, 'value[0].status', null) === "online" ?
                                      "processing"
                                      : get(currentData, 'value[0].status', null) === "offline" ?
                                        "error"
                                        : null
                                  }
                                  text={get(currentData, 'value[0].status', null) === "running" ?
                                    "运行"
                                    : get(currentData, 'value[0].status', null) === "online" ?
                                      "在线"
                                      : get(currentData, 'value[0].status', null) === "offline" ?
                                        "离线"
                                        : null
                                  } />
                              </Descriptions.Item>
                            </Descriptions>}
                            title="节点信息"
                          >
                            <Avatar style={{ backgroundColor: '#22075e', verticalAlign: 'middle' }} size="small">P</Avatar>
                          </Popover>

                        </Marker>
                        : null}
                  </Map>
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
