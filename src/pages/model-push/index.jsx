import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  Card,
  Space,
  Row,
  Col,
  Form,
  Select,
  Table,
  Tag
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import { queryDeviceListByUserId, queryDataListByDeviceId, updateRule, addRule, removeRule } from './service';

const { Option } = Select;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const ModelPush = () => {
  const [modelOptions, setModelOptions] = useState([]);
  const [currentModel, setCurrentModel] = useState({});
  const [modelInfo, setModelInfo] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [currentDevices, setCurrentDevices] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState([]);

  const onValuesModelChange = (changedValues) => {

  }

  const onValuesDeviceChange = (changedValues) => {

  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 模型选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form onValuesChange={onValuesModelChange}>
                <Form.Item
                  label="选择模型"
                  name="name"
                  rules={[{ required: true, message: '请选择模型!' }]}
                >
                  <Select>
                    {modelOptions}
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col span={16} />
          </Row>
        </Card>

        {/* 模型信息 */}
        <Card>
          <Descriptions title="模型详情" bordered>
            <Descriptions.Item label="名称">名称</Descriptions.Item>
            <Descriptions.Item label="模型位置">模型位置</Descriptions.Item>
            <Descriptions.Item label="描述">描述</Descriptions.Item>
            <Descriptions.Item label="生成时间">生成时间</Descriptions.Item>
            {/* <Descriptions.Item label="生成时间">{moment(get(deviceDetail, 'registerTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item> */}
          </Descriptions>
        </Card>

        {/* 设备选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form onValuesChange={onValuesDeviceChange}>
                <Form.Item
                  label="选择设备"
                  name="name"
                  rules={[{ required: true, message: '请选择设备!' }]}
                >
                  <Select>
                    {deviceOptions}
                  </Select>
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button type="primary" htmlType="submit">确认</Button>
                  <Button htmlType="button">还原</Button>
                </Form.Item>
              </Form>
            </Col>
            <Col span={16} />
          </Row>
        </Card>

        {/* 设备列表 */}
        <Card>
          <Table columns={columns} dataSource={data} />
        </Card>

        {/* 推送模型 */}
        <Card>
          <Button type="primary">推送模型</Button>
        </Card>

      </Space>

    </PageContainer>
  );
};

export default ModelPush;
