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
  Divider
} from 'antd';
import React, { useState, useEffect } from 'react';
import { get } from 'lodash'
import { Line, Column, Pie, Gauge, Liquid, Scatter } from '@ant-design/charts';
import ReactJson from 'react-json-view'
import { PageContainer } from '@ant-design/pro-layout';

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


const ProjectCom = () => {
  const [projectOptions, setProjectOptionse] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const tmp = [
      <Option value="拥挤度检测">拥挤度检测</Option>,
      <Option value="边坡检测">边坡检测</Option>,
      <Option value="菜品识别">菜品识别</Option>
    ]
    setProjectOptionse(tmp)
  }, []);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 项目选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form>
                <Form.Item
                  label="选择项目"
                  name="name"
                  rules={[{ required: true, message: '请选择项目!' }]}
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

        {/* 项目信息 */}
        <Card>
          <Descriptions title="项目详情" bordered>
            <Descriptions.Item label="名称">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="类型">1810000000</Descriptions.Item>
            <Descriptions.Item label="描述">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="运行设备">empty</Descriptions.Item>
            <Descriptions.Item label="最新结果时间">Zhou Maomao</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 选择图表类型 */}
        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions title="结果视频" bordered>
              <Descriptions.Item label="描述">结果描述</Descriptions.Item>
            </Descriptions>

            <Card hoverable bordered>
              {/* 选择图表类型 */}
              <Row>
                <Col span={8}>
                  <Form>
                    <Form.Item
                      label="选择图表"
                      name="name"
                      rules={[{ required: true, message: '请选择图表!' }]}
                    >
                      <Select>
                        <Option value="折线图">折线图</Option>
                        <Option value="柱状图">柱状图</Option>
                        <Option value="饼图">饼图</Option>
                        <Option value="仪表图">仪表图</Option>
                        <Option value="水波图">水波图</Option>
                        <Option value="散点图">散点图</Option>
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
                      {...formItemLayout}
                    >
                      {/* 图表配置信息 */}
                      <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入标题!' }]}
                      >
                        <Input style={{ width: "90%" }} />
                      </Form.Item>

                      <Form.Item
                        label="描述"
                        name="desc"
                        rules={[{ required: true, message: '请输入描述!' }]}
                      >
                        <Input style={{ width: "90%" }} />
                      </Form.Item>

                      <Form.Item
                        label="参数1"
                        name="args1"
                        rules={[{ required: true, message: '请输入参数1!' }]}
                      >
                        <Input style={{ width: "90%" }} />
                      </Form.Item>

                      <Form.Item
                        label="参数2"
                        name="args2"
                        rules={[{ required: true, message: '请输入参数2!' }]}
                      >
                        <Input style={{ width: "90%" }} />
                      </Form.Item>


                      <Divider />

                      {/* 图表数据信息 */}
                      {/* 坐标一配置 */}
                      <Form.Item label="x轴数据" required>
                        <Input.Group compact>
                          {/* 坐标名称 */}
                          <Form.Item
                            name="x-name"
                            noStyle
                            rules={[{ required: true, message: '请输入坐标名称' }]}
                          >
                            <Input style={{ width: '30%' }} placeholder="坐标名称" />
                          </Form.Item>

                          {/* 坐标类型 */}
                          <Form.Item
                            name="x-type"
                            noStyle
                            rules={[{ required: true, message: '请选择坐标类型' }]}
                          >
                            <Select style={{ width: '30%' }} placeholder="坐标类型" >
                              <Option value="整型">整型</Option>
                              <Option value="浮点型">浮点型</Option>
                              <Option value="时间">时间</Option>
                              <Option value="文字">文字</Option>
                            </Select>
                          </Form.Item>

                          {/* 坐标单位 */}
                          <Form.Item
                            name="x-unit"
                            noStyle
                            rules={[{ required: true, message: '请输入坐标单位' }]}
                          >
                            <Input style={{ width: '30%' }} placeholder="坐标单位" />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>

                      {/* 坐标二配置 */}
                      <Form.Item label="y轴数据" required>
                        <Input.Group compact>
                          {/* 坐标名称 */}
                          <Form.Item
                            name="y-name"
                            noStyle
                            rules={[{ required: true, message: '请输入坐标名称' }]}
                          >
                            <Input style={{ width: '30%' }} placeholder="坐标名称" />
                          </Form.Item>

                          {/* 坐标类型 */}
                          <Form.Item
                            name="y-type"
                            noStyle
                            rules={[{ required: true, message: '请选择坐标类型' }]}
                          >
                            <Select style={{ width: '30%' }} placeholder="坐标类型" >
                              <Option value="整型">整型</Option>
                              <Option value="浮点型">浮点型</Option>
                              <Option value="时间">时间</Option>
                              <Option value="文字">文字</Option>
                            </Select>
                          </Form.Item>

                          {/* 坐标单位 */}
                          <Form.Item
                            name="y-unit"
                            noStyle
                            rules={[{ required: true, message: '请输入坐标单位' }]}
                          >
                            <Input style={{ width: '30%' }} placeholder="坐标单位" />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>

                    </Form>
                  </Card>
                </Col>

                {/* 图表示例 */}
                <Col span={12}>
                  <Card hoverable bordered>
                    <Line {...configs[0]} />
                  </Card>
                </Col>
              </Row>

            </Card>

          </Space>
        </Card>

        {/* 数据存储格式 */}
        <Card hoverable bordered>
          <Descriptions title="数据格式" bordered>
            <Descriptions.Item label="数据格式">
              <ReactJson src={dataModel} name="model"/>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default ProjectCom;
