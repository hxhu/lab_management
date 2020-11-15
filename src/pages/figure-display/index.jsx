import { PlusOutlined } from '@ant-design/icons';
import {
  Descriptions,
  Row,
  Col,
  Form,
  Space,
  Card,
  Select,
  Spin,
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Line, Column, Pie, Gauge, Liquid, Scatter } from '@ant-design/charts';
import { get, cloneDeep, set, has } from 'lodash'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import moment from 'moment';
import { 
  queryDeviceListByUserId, 
  queryDisplayByDeviceIdAndDisplayType, 
  queryDataByDataId, 
  queryFigureByDeviceId, 
  queryDataByDisplayIds 
} from './service';

const { Option } = Select;

const FigureDisplay = () => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [currentFigures, setCurrentFigures] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  

  useEffect(() => {
    const data = [
      [
        {
          year: '1991',
          value: 3,
        },
        {
          year: '1992',
          value: 4,
        },
        {
          year: '1993',
          value: 3.5,
        },
        {
          year: '1994',
          value: 5,
        },
        {
          year: '1995',
          value: 4.9,
        },
        {
          year: '1996',
          value: 6,
        },
        {
          year: '1997',
          value: 7,
        },
        {
          year: '1998',
          value: 9,
        },
        {
          year: '1999',
          value: 13,
        },
      ],
      [
        {
          type: '家具家电',
          sales: 38,
        },
        {
          type: '粮油副食',
          sales: 52,
        },
        {
          type: '生鲜水果',
          sales: 61,
        },
        {
          type: '美容洗护',
          sales: 145,
        },
        {
          type: '母婴用品',
          sales: 48,
        },
        {
          type: '进口食品',
          sales: 38,
        },
        {
          type: '食品饮料',
          sales: 38,
        },
        {
          type: '家庭清洁',
          sales: 38,
        },
      ],
      [
        {
          type: '分类一',
          value: 27,
        },
        {
          type: '分类二',
          value: 25,
        },
        {
          type: '分类三',
          value: 18,
        },
        {
          type: '分类四',
          value: 15,
        },
        {
          type: '分类五',
          value: 10,
        },
        {
          type: '其它',
          value: 5,
        },
      ],
      75,
      5639,
      [
        {
          x: 1,
          y: 4.181,
        },
        {
          x: 2,
          y: 4.665,
        },
        {
          x: 3,
          y: 5.296,
        },
        {
          x: 4,
          y: 5.365,
        },
        {
          x: 5,
          y: 5.448,
        },
        {
          x: 6,
          y: 5.744,
        },
        {
          x: 7,
          y: 5.653,
        },
        {
          x: 8,
          y: 5.844,
        },
        {
          x: 9,
          y: 6.362,
        },
        {
          x: 10,
          y: 6.38,
        },
        {
          x: 11,
          y: 6.311,
        },
        {
          x: 12,
          y: 6.457,
        },
        {
          x: 13,
          y: 6.479,
        },
        {
          x: 14,
          y: 6.59,
        },
        {
          x: 15,
          y: 6.74,
        },
        {
          x: 16,
          y: 6.58,
        },
        {
          x: 17,
          y: 6.852,
        },
        {
          x: 18,
          y: 6.531,
        },
        {
          x: 19,
          y: 6.682,
        },
        {
          x: 20,
          y: 7.013,
        },
        {
          x: 21,
          y: 6.82,
        },
        {
          x: 22,
          y: 6.647,
        },
        {
          x: 23,
          y: 6.951,
        },
        {
          x: 24,
          y: 7.121,
        },
        {
          x: 25,
          y: 7.143,
        },
        {
          x: 26,
          y: 6.914,
        },
        {
          x: 27,
          y: 6.941,
        },
        {
          x: 28,
          y: 7.226,
        },
        {
          x: 29,
          y: 6.898,
        },
        {
          x: 30,
          y: 7.392,
        },
        {
          x: 31,
          y: 6.938,
        },
      ]
    ]

    // 这里应该时 map + set
    const configAndData = [
      {
        title: {
          visible: true,
          text: '折线图',
        },
        description: {
          visible: true,
          text: '描述',
        },
        padding: 'auto',
        forceFit: true,
        xField: 'year',
        yField: 'value',
        label: {
          visible: true,
          type: 'point',
        },
        point: {
          visible: true,
          size: 5,
          shape: 'diamond',
          style: {
            fill: 'white',
            stroke: '#2593fc',
            lineWidth: 2,
          },
        },
        data: data[0]
      },
      {
        title: {
          visible: true,
          text: '柱状图',
        },
        description: {
          visible: true,
          text: '描述',
        },
        forceFit: true,
        padding: 'auto',
        xField: 'type',
        yField: 'sales',
        meta: {
          type: { alias: '类别' },
          sales: { alias: '销售额(万)' },
        },
        label: {
          visible: true,
          position: 'middle',
        },
        data: data[1]
      },
      {
        forceFit: true,
        title: {
          visible: true,
          text: '饼图',
        },
        description: {
          visible: true,
          text: '描述',
        },
        radius: 0.8,
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
          visible: true,
          type: 'inner',
        },
        data: data[2]
      },
      {
        title: {
          visible: true,
          text: '仪表盘',
        },
        description: {
          visible: true,
          text: '描述',
        },
        width: 400,
        height: 400,
        min: 0,
        max: 100,
        range: [0, 75],
        color: ['l(0) 0:#5d7cef 1:#e35767'],
        axis: {
          offset: -15,
          tickLine: {
            visible: true,
            length: 10,
          },
          label: { visible: false },
        },
        pivot: {
          visible: true,
          thickness: 10,
          pointer: {
            visible: true,
            style: { fill: '#e25869' },
          },
          pin: {
            visible: true,
            style: { fill: '#e8e6ea' },
          },
        },
        statistic: {
          visible: true,
          position: ['50%', '100%'],
          text: '26/48',
          color: '#2e3033',
          size: 40,
        },
        value: data[3],
      },
      {
        title: {
          visible: true,
          text: '水波图',
        },
        description: {
          visible: true,
          text: '描述',
        },
        min: 0,
        max: 10000,
        value: data[4],
      },
      {
        title: {
          visible: true,
          text: '散点图',
        },
        description: {
          visible: true,
          text: '描述',
        },
        padding: 'auto',
        xField: 'x',
        yField: 'y',
        pointSize: 5,
        pointStyle: {
          stroke: '#777777',
          lineWidth: 1,
        },
        trendline: {
          visible: true,
          type: 'quad',
          showConfidence: true,
        },
        data: data[5]
      }
    ]
    setConfigs(configAndData)
  }, []);

  const onValuesChange = (changedValues) => {
    let tmp = null;
    deviceList.forEach(v => {
      if (v.id === changedValues.deviceId) {
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
    setCurrentDeviceId(changedValues.deviceId)
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

  // 跟据deviceId和type=pic获取配置
  const getDisplayByDeviceIdAndDisplayType = async deviceId => {
    try {
      return await queryDisplayByDeviceIdAndDisplayType({
        'deviceId': deviceId,
        'type': "picture"
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
    const fetchData = async () => {
      // 拿到当前配置data
      // const display = await getDisplayByDeviceIdAndDisplayType(currentDeviceId)

      // // 拿到当前图表显示
      const figures = await queryFigureByDeviceId({ id: currentDeviceId })
      const dataIds = []
      figures.data.forEach( v => {
        dataIds.push( v.dataId )
      })
      const data = await queryDataByDisplayIds({ ids: dataIds })
      // // 拿到当前数据
      // if (get(display, 'dataId', null) !== null) {
      //   const data = await getDataByDataId(get(display, 'dataId'))

      //   setCurrentDisplay(display)
      //   setCurrentData(data)
      // }
      setCurrentFigures(figures.data)
      setCurrentData(data.data)
    }

    if (currentDeviceId !== null) {
      fetchData()
    }
  }, [currentDeviceId]);

  return (
    <PageContainer>
      {
        console.log(currentData)
      }
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 项目选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form onValuesChange={onValuesChange}>
                <Form.Item
                  label="选择设备"
                  name="deviceId"
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

        {/* 图表展示 */}
        <Card>
          <Descriptions title="结果图表" bordered />
          {
            configs.length !== 0
              ? <Row gutter={[16, 8]}>
                {/* 折线图 */}
                <Col span={12}>
                  <Card style={{ width: "100%" }} hoverable bordered>
                    <Line {...configs[0]} />
                  </Card>
                </Col>

                {/* 柱状图 */}
                <Col span={12}>
                  <Card style={{ width: "100%" }} hoverable bordered>
                    <Column {...configs[1]} />
                  </Card>
                </Col>

                {/* 饼图 */}
                <Col span={12}>
                  <Card style={{ width: "100%" }} hoverable bordered>
                    <Pie {...configs[2]} />
                  </Card>
                </Col>

                {/* 仪表图 */}
                <Col span={12}>
                  <Card style={{ width: "100%" }} hoverable bordered>
                    <Gauge {...configs[3]} />
                  </Card>
                </Col>

                {/* 水波图 */}
                <Col span={12}>
                  <Card style={{ width: "100%" }} hoverable bordered>
                    <Liquid {...configs[4]} />
                  </Card>
                </Col>

                {/* 散点图 */}
                <Col span={12}>
                  <Card style={{ width: "100%" }} hoverable bordered>
                    <Scatter {...configs[5]} />
                  </Card>
                </Col>
              </Row>
              : <Spin tip="Loading..." />
          }
        </Card>
      </Space>
    </PageContainer>
  );
};

export default FigureDisplay;
