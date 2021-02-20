import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Badge,
  Card,
  Space,
  Row,
  Col,
  Form,
  Select,
  Table,
  Modal,
  message,
  Input,
  Divider,
  Upload,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has, unset, includes } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import {
  queryModelList,
  deleteModel,
  updateModel
} from './service';

const { confirm } = Modal;

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const DeviceManager = () => {
  const [modelInfo, setModelInfo] = useState([]);
  const [visible, setVisible] = useState(false);
  const [curModel, setCurModel] = useState({});

  const [flag, setFlag] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const modelInfoTmp = await queryModelList().then(v => v.data)
      setModelInfo(modelInfoTmp)
    }

    fetchData()
  }, [flag]);

  const onCancel = () => {
    setVisible(false)
  }

  const onFinish = async values => {
    await updateModel(values).then( v => {
      if( v.code === 2000 ){
        message.success("修改成功")
      }else{
        message.error("修改失败")
      }
    })
    setFlag(!flag)
    setVisible(false)
  }

  const onReset = () => {
    form.resetFields()
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '模型名',
      dataIndex: 'modelName',
      key: 'modelName'
    },
    {
      title: '模型描述',
      dataIndex: 'modelDesc',
      key: 'modelDesc'
    },
    {
      title: '训练时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: v => moment(v).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      dataIndex: 'id',
      key: 'action',
      render: id => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              modelInfo.forEach( v => {
                if( v.id === id ){
                  form.setFieldsValue({
                    'id': v.id,
                    'modelName': v.modelName,
                    'modelDesc': v.modelDesc
                  })
                }
              })
              setVisible(true)
            }}
          >
            修改
          </Button>
          <Modal
            title="修改模型"
            visible={visible}
            onCancel={onCancel}
            footer={null}
          >
            <Form
              {...layout}
              form={form}
              onFinish={onFinish}
              labelAlign="right"
              colon={false}
            >
              {/* ID */}
              <Form.Item
                label="ID"
                name="id"
                rules={[{ required: true, message: '请输入ID!' }]}
              >
                <Input disabled />
              </Form.Item>

              {/* modelName */}
              <Form.Item
                label="模型名"
                name="modelName"
                rules={[{ required: true, message: '请输入模型名!' }]}
              >
                <Input />
              </Form.Item>

              {/* modelDesc */}
              <Form.Item
                label="模型信息"
                name="modelDesc"
                initialValue={null}
              >
                <Input />
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">修改</Button>
                <Button htmlType="button" onClick={onReset}>清空</Button>
              </Form.Item>
            </Form>
          </Modal>

          <Button
            type="dashed"
            onClick={() => {
              confirm({
                title: '确认从列表中删除该模型？',
                icon: <ExclamationCircleOutlined />,
                content: `模型ID: ${id}`,
                async onOk() {
                  await deleteModel({
                    modelId: id
                  }).then( v => {
                    if( v.code === 2000 ){
                      setFlag(!flag)
                      message.success("删除成功")
                    }else{
                      message.error("删除失败")
                    }
                  })
                  
                },
                onCancel() {
                  message.warning("取消删除")
                },
              })
            }}
            danger
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 模型列表 */}
        <Card>
          <Table
            columns={columns}
            dataSource={modelInfo}
            rowKey={(record) => {
              return (record.id + Date.now()) // 在这里加上一个时间戳就可以了，刷新问题
            }}
          />
        </Card>

      </Space>

    </PageContainer>
  );
};

export default DeviceManager;
