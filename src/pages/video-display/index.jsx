import { PlusOutlined } from '@ant-design/icons';
import {
  Descriptions,
  Row,
  Col,
  Form,
  Space,
  Card,
  Select,
  Image
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { get } from 'lodash'
import ReactPlayer from 'react-player'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

const { Option } = Select;

const VideoDisplay = () => {
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
      url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
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
          <Descriptions title="设备详情" bordered>
            <Descriptions.Item label="名称">Zhou Maomao</Descriptions.Item>
            <Descriptions.Item label="类型">1810000000</Descriptions.Item>
            <Descriptions.Item label="描述">Hangzhou, Zhejiang</Descriptions.Item>
            <Descriptions.Item label="运行设备">empty</Descriptions.Item>
            <Descriptions.Item label="最新结果时间">Zhou Maomao</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 视频展示 */}
        <Card>
          <Descriptions title="结果视频" bordered>
            <Descriptions.Item label="描述">结果描述</Descriptions.Item>
          </Descriptions>
          <Row>
            <Col span={2} />
            <Col span={20}>
              <Card hoverable bordered>
                <ReactPlayer
                  playing
                  controls
                  loop
                  width="100%"
                  height="100%"
                  url={data.url}
                />
              </Card>
            </Col>
            <Col span={2} />
          </Row>
        </Card>
      </Space>
    </PageContainer>
  );
};

export default VideoDisplay;
