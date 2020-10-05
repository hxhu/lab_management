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
import React, { useState, useRef, useEffect } from 'react';
import { set, get } from 'lodash';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CreateCom from './components/CreateCom';
import { queryDeviceListByUserId, queryRule, updateRule, addRule, removeRule } from './service';

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
  const [deviceList, setDeviceList] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});

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
      render: type => {
        let result = null
        switch (type) {
          case "sensor": result = '传感器'; break;
          case "embedded": result = '嵌入式'; break;
          case "server": result = '服务器'; break;
          default: result = '未知'; break;
        }
        return result
      }
    },
    {
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => {
        let result = null
        switch (status) {
          case 0: result = '离线'; break;
          case 1: result = '在线'; break;
          case 2: result = '运行'; break;
          default: result = '未知'; break;
        }
        return result
      }
    },
    {
      title: '自动收集数据',
      dataIndex: 'status',
      render: collectFlag => {
        let result = null
        switch (collectFlag) {
          case true:  result = '是'; break;
          case false: result = '否'; break;
          default:    result = '否'; break;
        }
        return result
      }
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

  // 跟据userId获取设备列表
  const getDeviceListByUserId = async userId => {
    try {
      return await queryDeviceListByUserId({
        'userId': userId
      }).then(rst => rst.data)
    } catch (error) {
      message.error('设备请求出错');
    }
  }

  const closeCreateCom = () => {
    setCreateComVisible(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDeviceListByUserId('hu')
      const detail = {}
      // 总设备数
      set(detail, 'length', data.length)
      // 在线数
      let online = 0
      data.forEach(v => {
        if (v.status === 1 || v.status === 2) {
          online += 1
        }
      })
      set(detail, 'online', online)
      // 活跃数
      let active = 0
      data.forEach(v => {
        if (v.status === 2) {
          active += 1
        }
      })
      set(detail, 'active', active)

      setDeviceList(data)
      setDeviceDetail(detail)
    }

    fetchData()
  }, []);

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="总设备数" value={get(deviceDetail, 'length', 0)} />
            </Col>
            <Col span={8}>
              <Statistic title="在线数" value={get(deviceDetail, 'online', 0)} /> {/* 设备正常 */}
            </Col>
            <Col span={8}>
              <Statistic title="活跃数" value={get(deviceDetail, 'active', 0)} /> {/* 业务正常 */}
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
          dataSource={deviceList}
          // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter }).then(rst => {
          //   console.log(rst) // 请求数据格式
          //   return rst
          // })}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />

      </Space>

      {/* 新建节点 */}
      {
        createComVisible
          ? <CreateCom visible={createComVisible} onClose={() => closeCreateCom()} />
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
