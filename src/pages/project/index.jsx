import { PlusOutlined } from '@ant-design/icons';
import {
  Descriptions,
  Row,
  Col,
  Form,
  Space,
  Card,
  Select,
  Input
} from 'antd';
import React, { useState, useEffect } from 'react';
import { get } from 'lodash'
import { PageContainer } from '@ant-design/pro-layout';

const { Option } = Select;

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

              <Form>
                {/* 选择图表类型 */}
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label="选择项目"
                      name="name"
                      rules={[{ required: true, message: '请选择项目!' }]}
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
                  </Col>
                  <Col span={16} />
                </Row>

                {/* 表单相关配置 */}
                <Row>
                  {/* 图表信息 */}
                  <Col span={12}>
                    <Form.Item
                      label="标题"
                      name="title"
                      rules={[{ required: true, message: '请输入标题!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="描述"
                      name="desc"
                      rules={[{ required: true, message: '请输入描述!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="参数1"
                      name="args1"
                      rules={[{ required: true, message: '请输入参数1!' }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="参数2"
                      name="args2"
                      rules={[{ required: true, message: '请输入参数2!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  {/* 图标信息 */}
                  <Col span={12}>
                    示例
                  </Col>
                </Row>

              </Form>
            </Card>

          </Space>
        </Card>

        {/* 数据存储格式 */}
      </Space>
    </PageContainer>
  );
};

export default ProjectCom;
