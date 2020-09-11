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
      <Option value="nano">nano</Option>,
      <Option value="firefly">firefly</Option>,
      <Option value="nvidia">nvidia</Option>
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

        {/* 项目信息 */}
        <Card>
          <Descriptions title="设备详情" bordered>
            <Descriptions.Item label="名称">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="类型">1810000000</Descriptions.Item>
            <Descriptions.Item label="ip">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="状态">empty</Descriptions.Item>
            <Descriptions.Item label="自动收集数据">Zhou Maomao</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 地图展示 */}
        {/* 地图中显示 设备所在点 在线？ 运行？ 位置（经纬度） */}
        <Card>
          <Descriptions title="监控信息" bordered />  
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
