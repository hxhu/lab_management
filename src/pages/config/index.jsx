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
  Input,
  Divider,
  message,
  InputNumber,
  Switch,
  Button
} from 'antd';
import React, { useState, useEffect, useRef, useForm } from 'react';
import { get, cloneDeep, set, has } from 'lodash'
import moment from 'moment';
import ProTable from '@ant-design/pro-table';
import { Line, Column, Pie, Gauge, Liquid, Scatter } from '@ant-design/charts';
import ReactJson from 'react-json-view'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { queryDeviceListByUserId, queryDisplayByDeviceIdAndDisplayType, queryDataByDataId } from './service';

const { Option } = Select;

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
      value: 38,
    },
    {
      type: '粮油副食',
      value: 52,
    },
    {
      type: '生鲜水果',
      value: 61,
    },
    {
      type: '美容洗护',
      value: 145,
    },
    {
      type: '母婴用品',
      value: 48,
    },
    {
      type: '进口食品',
      value: 38,
    },
    {
      type: '食品饮料',
      value: 38,
    },
    {
      type: '家庭清洁',
      value: 38,
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

const configs = [
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
    // label: {
    //   visible: true,
    //   type: 'point',
    // },
    point: {
      visible: true,
      size: 5,
      // shape: 'diamond',
      shape: 'round',
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
    yField: 'value',
    meta: {
      type: { alias: '类别' },
      value: { alias: '销售额(万)' },
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
    range: [0, 100],
    color: ['l(0) 0:#5d7cef 1:#e35767'],
    // axis: {
    //   offset: -15,
    //   tickLine: {
    //     visible: true,
    //     length: 10,
    //   },
    //   label: { visible: false },
    // },
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
      text: '坐标名',
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

const dataModel = {
  project: "project",
  topic: "topic",
  chart: "chart",
  x: {
    name: "name",
    type: "type",
    value: []
  },
  y: {
    name: "name",
    type: "type",
    value: []
  },
  timestamp: 1599369836,
  cover: false // 是否覆盖原数据
}

const columns = [
  {
    title: '图表名称',
    dataIndex: 'name',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    valueType: 'textarea',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '发送格式',
    dataIndex: 'config',
  },
  {
    title: '操作',
    dataIndex: 'option',
    valueType: 'option',
    render: (_, record) => (
      <>
        <a href="">修改</a>
        <Divider type="vertical" />
        <a href="">删除</a>
        <Divider type="vertical" />
        <a href="">图表配置</a>
      </>
    ),
  },
];

const ProjectCom = () => {
  const [projectOptions, setProjectOptions] = useState([]);
  const actionRef = useRef();
  const [deviceList, setDeviceList] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [currentDisplay, setCurrentDisplay] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [editConfig, setEditConfig] = useState([]);
  const [curConfig, setCurConfig] = useState([]);
  const [CurChartTag, setCurChartTag] = useState(null);

  const [configForm] = Form.useForm();

  // 设备选择
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
  // 图表选择
  const onChartChange = (changedValues) => { // Line, Column, Pie, Gauge, Liquid, Scatter
    const tmp = []
    switch (changedValues.chart) {
      // 折线图
      case "Line":
        // 图表类型
        tmp.push(<Form.Item
          label="图表类型"
          name="chartType"
          initialValue="Line"
        >
          <Input style={{ width: "90%" }} disabled />
        </Form.Item>)
        // 图表名
        tmp.push(<Form.Item
          label="图表名"
          name="title"
          rules={[{ required: true, message: '请输入图表名!' }]}
          initialValue="折线图"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 描述
        tmp.push(<Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述!' }]}
          initialValue="描述"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 图表大小
        tmp.push(<Form.Item
          label="图表大小"
          name="padding"
          rules={[{ required: true, message: '请输入图表大小!' }]}
          initialValue="auto"
        >
          <Input style={{ width: "90%" }} disabled />
        </Form.Item>)
        // x轴坐标名
        tmp.push(<Form.Item
          label="x轴坐标名"
          name="xField"
          rules={[{ required: true, message: '请输入x轴坐标名!' }]}
          initialValue="x轴坐标名"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // y轴坐标名
        tmp.push(<Form.Item
          label="y轴坐标名"
          name="yField"
          rules={[{ required: true, message: '请输入y轴坐标名!' }]}
          initialValue="y轴坐标名"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 数据点形状
        tmp.push(<Form.Item
          label="数据点形状"
          name="point"
          rules={[{ required: true, message: '请输入数据点形状!' }]}
          initialValue="数据点形状"
        >
          <Select style={{ width: "90%" }}>
            <Option value="diamond">钻石</Option>
            <Option value="round">原形</Option>
          </Select>
        </Form.Item>)
        break;

      // 柱状图
      case "Column":
        // 图表类型
        tmp.push(<Form.Item
          label="图表类型"
          name="chartType"
          initialValue="Column"
        >
          <Input style={{ width: "90%" }} disabled />
        </Form.Item>)
        // 图表名
        tmp.push(<Form.Item
          label="图表名"
          name="title"
          rules={[{ required: true, message: '请输入图表名!' }]}
          initialValue="柱状图"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 描述
        tmp.push(<Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述!' }]}
          initialValue="描述"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 图表大小
        tmp.push(<Form.Item
          label="图表大小"
          name="padding"
          rules={[{ required: true, message: '请输入图表大小!' }]}
          initialValue="auto"
        >
          <InputNumber style={{ width: "90%" }} disabled />
        </Form.Item>)
        // x轴坐标名
        tmp.push(<Form.Item
          label="x轴坐标名"
          name="xField"
          rules={[{ required: true, message: '请输入x轴坐标名!' }]}
          initialValue="x轴坐标名"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // y轴坐标名
        tmp.push(<Form.Item
          label="y轴坐标名"
          name="yField"
          rules={[{ required: true, message: '请输入y轴坐标名!' }]}
          initialValue="y轴坐标名"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        break;

      // 饼图
      case "Pie":
        // 图表类型
        tmp.push(<Form.Item
          label="图表类型"
          name="chartType"
          initialValue="Pie"
        >
          <Input style={{ width: "90%" }} disabled />
        </Form.Item>)
        // 图表名
        tmp.push(<Form.Item
          label="图表名"
          name="title"
          rules={[{ required: true, message: '请输入图表名!' }]}
          initialValue="饼图"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 描述
        tmp.push(<Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述!' }]}
          initialValue="描述"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 饼图半径
        tmp.push(<Form.Item
          label="饼图半径"
          name="radius"
          rules={[{ required: true, message: '请输入饼图半径!' }]}
          initialValue={0.8}
        >
          <InputNumber style={{ width: "90%" }} />
        </Form.Item>)
        break;

      // 仪表盘
      case "Gauge":
        // 图表类型
        tmp.push(<Form.Item
          label="图表类型"
          name="chartType"
          initialValue="Gauge"
        >
          <Input style={{ width: "90%" }} disabled />
        </Form.Item>)
        // 图表名
        tmp.push(<Form.Item
          label="图表名"
          name="title"
          rules={[{ required: true, message: '请输入图表名!' }]}
          initialValue="仪表盘"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 描述
        tmp.push(<Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述!' }]}
          initialValue="描述"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 最小值
        tmp.push(<Form.Item
          label="最小值"
          name="min"
          rules={[{ required: true, message: '请输入最小值!' }]}
          initialValue={0}
        >
          <InputNumber style={{ width: "90%" }} />
        </Form.Item>)
        // 最大值
        tmp.push(<Form.Item
          label="最大值"
          name="max"
          rules={[{ required: true, message: '请输入最大值!' }]}
          initialValue={100}
        >
          <InputNumber style={{ width: "90%" }} />
        </Form.Item>)
        // 坐标名
        tmp.push(<Form.Item
          label="坐标名"
          name="statistic"
          rules={[{ required: true, message: '请输入坐标名!' }]}
          initialValue="坐标名"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        break;

      // 水波图
      case "Liquid":
        // 图表类型
        tmp.push(<Form.Item
          label="图表类型"
          name="chartType"
          initialValue="Liquid"
        >
          <Input style={{ width: "90%" }} disabled />
        </Form.Item>)
        // 图表名
        tmp.push(<Form.Item
          label="图表名"
          name="title"
          rules={[{ required: true, message: '请输入图表名!' }]}
          initialValue="水波图"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 描述
        tmp.push(<Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述!' }]}
          initialValue="描述"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 最小值
        tmp.push(<Form.Item
          label="最小值"
          name="min"
          rules={[{ required: true, message: '请输入最小值!' }]}
          initialValue={0}
        >
          <InputNumber style={{ width: "90%" }} />
        </Form.Item>)
        // 最大值
        tmp.push(<Form.Item
          label="最大值"
          name="max"
          rules={[{ required: true, message: '请输入最大值!' }]}
          initialValue={10000}
        >
          <InputNumber style={{ width: "90%" }} />
        </Form.Item>)
        break;

      // 散点图
      case "Scatter":
        // 图表类型
        tmp.push(<Form.Item
          label="图表类型"
          name="chartType"
          initialValue="Scatter"
        >
          <Input style={{ width: "90%" }} disabled />
        </Form.Item>)
        // 图表名
        tmp.push(<Form.Item
          label="图表名"
          name="title"
          rules={[{ required: true, message: '请输入图表名!' }]}
          initialValue="散点图"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 描述
        tmp.push(<Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述!' }]}
          initialValue="描述"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // x轴坐标名
        tmp.push(<Form.Item
          label="x轴坐标名"
          name="xField"
          rules={[{ required: true, message: '请输入x轴坐标名!' }]}
          initialValue="x轴坐标名"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // y轴坐标名
        tmp.push(<Form.Item
          label="y轴坐标名"
          name="yField"
          rules={[{ required: true, message: '请输入y轴坐标名!' }]}
          initialValue="y轴坐标名"
        >
          <Input style={{ width: "90%" }} />
        </Form.Item>)
        // 拟合线
        tmp.push(<Form.Item
          label="拟合线"
          name="trendline"
          rules={[{ required: true, message: '请输入拟合线!' }]}
          initialValue
        >
          <Switch />
        </Form.Item>)
        break;

      default:
        tmp = []
        break;
    }

    setEditConfig(tmp)

  }
  useEffect(() => {
    configForm.resetFields()
  }, [editConfig])
  // 图表配置表单设置
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const onConfigFinish = values => {
    let tmp = {}

    switch (values.chartType) {
      // 折线图
      case "Line":
        tmp = {
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
          // label: {
          //   visible: true,
          //   type: 'point',
          // },
          point: {
            visible: true,
            size: 5,
            // shape: 'diamond',
            shape: 'round',
            style: {
              fill: 'white',
              stroke: '#2593fc',
              lineWidth: 2,
            },
          },
          data: data[0]
        }
        break;

      // 柱状图
      case "Column":
        tmp = {
          chartType: "Column",
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
          yField: 'value',
          meta: {
            type: { alias: '类别' },
            value: { alias: '销售额(万)' },
          },
          label: {
            visible: true,
            position: 'middle',
          },
          data: data[1]
        }
        break;

      // 饼图
      case "Pie":
        tmp = {
          chartType: "Pie",
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
          angleField: 'value',
          colorField: 'type',
          label: {
            visible: true,
            type: 'inner',
          },
          data: data[2]
        }
        break;

      // 仪表盘
      case "Gauge":
        tmp = {
          chartType: "Gauge",
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
          range: [0, 100],
          color: ['l(0) 0:#5d7cef 1:#e35767'],
          // axis: {
          //   offset: -15,
          //   tickLine: {
          //     visible: true,
          //     length: 10,
          //   },
          //   label: { visible: false },
          // },
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
            text: '坐标名',
            color: '#2e3033',
            size: 40,
          },
          value: data[3]
        }
        break;

      // 水波图
      case "Liquid":
        tmp = {
          chartType: "Liquid",
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
          value: data[4]
        }
        break;

      // 散点图
      case "Scatter":
        tmp = {
          chartType: "Scatter",
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
        break;

      default:
        tmp = {}
        break;
    }
    set(tmp, 'chartType', values.chartType)
    setCurConfig(tmp)
  };
  const onConfigReset = () => {
    configForm.resetFields();
  };

  // // 跟据userId获取设备列表
  // const getDeviceListByUserId = async userId => {
  //   try {
  //     return await queryDeviceListByUserId({
  //       'userId': userId
  //     }).then(rst => rst.data)
  //   } catch (error) {
  //     message.error('设备请求出错');
  //   }
  // }

  // // 跟据deviceId和type=pic获取配置
  // const getDisplayByDeviceIdAndDisplayType = async deviceId => {
  //   try {
  //     return await queryDisplayByDeviceIdAndDisplayType({
  //       'deviceId': deviceId,
  //       'type': "picture"
  //     }).then(rst => rst.data)
  //   } catch (error) {
  //     message.error('设备请求出错');
  //   }
  // }

  // // 跟据dataId获取数据
  // const getDataByDataId = async dataId => {
  //   try {
  //     return await queryDataByDataId({
  //       'id': dataId
  //     }).then(rst => rst.data)
  //   } catch (error) {
  //     message.error('设备请求出错');
  //   }
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const dataTmp = await getDeviceListByUserId('hu')
  //     setDeviceList(dataTmp)

  //     const tmp = []
  //     dataTmp.forEach(v => tmp.push(<Option value={v.id}>{v.name}</Option>))
  //     setProjectOptions(tmp)
  //   }

  //   fetchData()
  // }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // 拿到当前配置data
  //     const display = await getDisplayByDeviceIdAndDisplayType(currentDeviceId)
  //     // 拿到当前数据
  //     if (get(display, 'dataId', null) !== null) {
  //       const data = await getDataByDataId(get(display, 'dataId'))

  //       setCurrentDisplay(display)
  //       setCurrentData(data)
  //     }
  //   }

  //   if (currentDeviceId !== null) {
  //     fetchData()
  //   }
  // }, [currentDeviceId]);

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 项目选择 */}
        {/* <Card>
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
        </Card> */}

        {/* 设备信息 */}
        {/* <Card>
          <Descriptions title="设备详情" bordered>
            <Descriptions.Item label="名称">{get(deviceDetail, 'name', null)}</Descriptions.Item>
            <Descriptions.Item label="类型">{get(deviceDetail, 'type', null)}</Descriptions.Item>
            <Descriptions.Item label="描述">{get(deviceDetail, 'desc', null)}</Descriptions.Item>
            <Descriptions.Item label="展示配置数">{get(deviceDetail, 'displayIds', []).length}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{moment(get(deviceDetail, 'registerTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          </Descriptions>
        </Card> */}


        {/* 设备列表 */}
        <ProTable
          headerTitle={<strong>设备管理</strong>}
          actionRef={actionRef}
          rowKey="key"
          // toolBarRender={() => [
          //   <Button type="primary" onClick={() => setCreateComVisible(true)}>
          //     <PlusOutlined /> 新建
          //   </Button>,
          // ]}
          // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter }).then(rst => {
          //   console.log(rst) // 请求数据格式
          //   return rst
          // })}
          columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
        />

        {/* 选择图表类型 */}
        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions title="新增图表" bordered>
              <Descriptions.Item label="描述">配置图表显示</Descriptions.Item>
            </Descriptions>

            <Card hoverable bordered>
              {/* 选择图表类型 */}
              <Row>
                <Col span={8}>
                  <Form onValuesChange={onChartChange}>
                    <Form.Item
                      label="选择图表"
                      name="chart"
                      rules={[{ required: true, message: '请选择图表!' }]}
                    >
                      <Select>
                        <Option value="Line">折线图</Option>
                        <Option value="Column">柱状图</Option>
                        <Option value="Pie">饼图</Option>
                        <Option value="Gauge">仪表图</Option>
                        <Option value="Liquid">水波图</Option>
                        <Option value="Scatter">散点图</Option>
                      </Select>
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={16} />
              </Row>

              {/* 表单相关配置 */}
              <Row>
                <Col span={12}>
                  <Card hoverable bordered>
                    <Form
                      labelAlign="right"
                      form={configForm}
                      onFinish={onConfigFinish}
                      {...formItemLayout}
                    >
                      {/* 图表配置信息 */}
                      {editConfig}

                      <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">确认</Button>
                        <Button htmlType="button" onClick={onConfigReset}>还原</Button>
                      </Form.Item>
                    </Form>
                  </Card>
                </Col>

                {/* 图表示例 */}
                <Col span={12}>
                  <Card hoverable bordered>
                    {
                      get(curConfig, 'chartType', null) === 'Line'
                        ? <Line {...curConfig} />
                        : get(curConfig, 'chartType', null) === 'Column'
                          ? <Column {...curConfig} />
                          : get(curConfig, 'chartType', null) === 'Pie'
                            ? <Pie {...curConfig} />
                            : get(curConfig, 'chartType', null) === 'Gauge'
                              ? <Gauge {...curConfig} />
                              : get(curConfig, 'chartType', null) === 'Liquid'
                                ? <Liquid {...curConfig} />
                                : get(curConfig, 'chartType', null) === 'Scatter'
                                  ? <Scatter {...curConfig} />
                                  : null
                    }
                  </Card>
                </Col>
              </Row>

            </Card>

          </Space>
        </Card>

        {/* 数据存储格式 */}
        {/* <Card hoverable bordered>
          <Descriptions title="数据格式" bordered>
            <Descriptions.Item label="数据格式">
              <ReactJson src={dataModel} name="model" />
            </Descriptions.Item>
          </Descriptions>
        </Card> */}
      </Space>
    </PageContainer>
  );
};

export default ProjectCom;



// {/* <Divider /> */}

//                      {/* 图表数据信息 */}
//                       {/* 坐标一配置 */}
//                       <Form.Item label="x轴数据" required>
//                         <Input.Group compact>
//                           {/* 坐标名称 */}
//                           <Form.Item
//                             name="x-name"
//                             noStyle
//                             rules={[{ required: true, message: '请输入坐标名称' }]}
//                           >
//                             <Input style={{ width: '30%' }} placeholder="坐标名称" />
//                           </Form.Item>

//                           {/* 坐标类型 */}
//                           <Form.Item
//                             name="x-type"
//                             noStyle
//                             rules={[{ required: true, message: '请选择坐标类型' }]}
//                           >
//                             <Select style={{ width: '30%' }} placeholder="坐标类型" >
//                               <Option value="整型">整型</Option>
//                               <Option value="浮点型">浮点型</Option>
//                               <Option value="时间">时间</Option>
//                               <Option value="文字">文字</Option>
//                             </Select>
//                           </Form.Item>

//                           {/* 坐标单位 */}
//                           <Form.Item
//                             name="x-unit"
//                             noStyle
//                             rules={[{ required: true, message: '请输入坐标单位' }]}
//                           >
//                             <Input style={{ width: '30%' }} placeholder="坐标单位" />
//                           </Form.Item>
//                         </Input.Group>
//                       </Form.Item>

//                       {/* 坐标二配置 */}
//                       <Form.Item label="y轴数据" required>
//                         <Input.Group compact>
//                           {/* 坐标名称 */}
//                           <Form.Item
//                             name="y-name"
//                             noStyle
//                             rules={[{ required: true, message: '请输入坐标名称' }]}
//                           >
//                             <Input style={{ width: '30%' }} placeholder="坐标名称" />
//                           </Form.Item>

//                           {/* 坐标类型 */}
//                           <Form.Item
//                             name="y-type"
//                             noStyle
//                             rules={[{ required: true, message: '请选择坐标类型' }]}
//                           >
//                             <Select style={{ width: '30%' }} placeholder="坐标类型" >
//                               <Option value="整型">整型</Option>
//                               <Option value="浮点型">浮点型</Option>
//                               <Option value="时间">时间</Option>
//                               <Option value="文字">文字</Option>
//                             </Select>
//                           </Form.Item>

//                           {/* 坐标单位 */}
//                           <Form.Item
//                             name="y-unit"
//                             noStyle
//                             rules={[{ required: true, message: '请输入坐标单位' }]}
//                           >
//                             <Input style={{ width: '30%' }} placeholder="坐标单位" />
//                           </Form.Item>
//                         </Input.Group>
//                       </Form.Item>
