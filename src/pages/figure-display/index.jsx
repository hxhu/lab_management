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
import { get } from 'lodash'
import { Line, Column, Pie, Gauge, Liquid, Scatter } from '@ant-design/charts';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

const { Option } = Select;

const FigureDisplay = () => {
  const [projectOptions, setProjectOptionse] = useState([]);
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    const tmp = [
      <Option value="nano">nano</Option>,
      <Option value="firefly">firefly</Option>,
      <Option value="nvidia">nvidia</Option>
    ]
    setProjectOptionse(tmp)
  }, []);

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

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 项目选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form>
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
            <Descriptions.Item label="名称">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="类型">1810000000</Descriptions.Item>
            <Descriptions.Item label="ip">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="状态">empty</Descriptions.Item>
            <Descriptions.Item label="自动收集数据">Zhou Maomao</Descriptions.Item>
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
