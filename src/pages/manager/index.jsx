import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  message,
  Card,
  Space,
  Statistic,
  Row,
  Col,
} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CreateCom from './components/CreateCom';
import { queryRule, updateRule, addRule, removeRule } from './service';

// 删除
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const Manager = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [createComVisible, setCreateComVisible] = useState(false); 
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '注册时间',
      dataIndex: 'last_time',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '自动收集数据',
      dataIndex: 'status',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a href="">删除</a>
          <Divider type="vertical" />
          <a href="">图表配置</a>
        </>
      ),
    },
  ];

  const closeCreateCom = () => {
    setCreateComVisible(false)
  }

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="总设备数" value={10} />
            </Col>
            <Col span={8}>
              <Statistic title="在线数" value={5} /> {/* 设备正常 */}
            </Col>
            <Col span={8}>
              <Statistic title="活跃数" value={2} /> {/* 业务正常 */}
            </Col>
          </Row>
        </Card>

        {/* 设备列表 */}
        <ProTable
          headerTitle={<strong>设备列表</strong>}
          actionRef={actionRef}
          rowKey="key"
          toolBarRender={() => [
            <Button type="primary" onClick={() => setCreateComVisible(true)}>
              <PlusOutlined /> 新建
            </Button>,
          ]}
          request={(params, sorter, filter) => queryRule({ ...params, sorter, filter }).then(rst => {
            console.log(rst) // 请求数据格式
            return rst
          })}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />

      </Space>

      {/* 新建节点 */}
      {
        createComVisible 
        ? <CreateCom visible={createComVisible} onClose={() => closeCreateCom()}/>
        : null
      }
      


      {/* 批量操作（修改） */}
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      {/* 创建数据（删） */}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async value => {
            const success = await handleAdd(value);

            if (success) {
              handleModalVisible(false);

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>

      {/* 编辑数据（删） */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

    </PageContainer>
  );
};

export default Manager;
