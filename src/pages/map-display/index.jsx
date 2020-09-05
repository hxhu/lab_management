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
import { PageContainer } from '@ant-design/pro-layout';

const { Option } = Select;

const MapDisplay = () => {
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

        {/* 地图展示 */}
        <Card>
          <Descriptions title="结果视频" bordered>
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
