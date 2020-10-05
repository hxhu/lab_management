import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Descriptions,
  message,
  Card,
  Space,
  Statistic,
  Row,
  Col,
  Form,
  Select,
  Badge,
  Tag
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryDeviceListByUserId, queryDataListByDeviceId, updateRule, addRule, removeRule } from './service';

const { Option } = Select;

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

const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [projectOptions, setProjectOptions] = useState([]);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceDetail, setDeviceDetail] = useState({});
  const [dataList, setDataList] = useState([]);
  const [lastTime, setLastTime] = useState(0);
  const columns = [
    {
      title: '数据名称',
      dataIndex: 'name',
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      render: type => {
        let result = null
        switch(type){
          case 'list':      result="列表"; break;
          case 'figure':    result="表格"; break;
          case 'picture':   result="图片"; break;
          case 'video':     result="视频"; break;
          case 'map':       result="地图"; break;
          case 'heartbeat': result="心跳"; break;
          default:          result="未知"; break;
        }
        return result
      }
    },
    {
      title: '最新结果时间',
      dataIndex: 'lastTimestamp',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '结果',
      dataIndex: 'value',
      render: value => {
        return ( value.length > 0 ) ?  value[value.length-1] : "空"
      }
    },
  ];

  const onValuesChange = (changedValues) => {
    let tmp = null;
    deviceList.forEach(v => {
      if (v.id === changedValues.name) {
        tmp = cloneDeep(v)
      }
    })
    // 类型
    switch (tmp.type) {
      case "sensor": set(tmp, 'type', '传感器'); break;
      case "embedded": set(tmp, 'type', '嵌入式'); break;
      case "server": set(tmp, 'type', '服务器'); break;
      default: set(tmp, 'type', '未知'); break;
    }

    // 运行状态
    switch (tmp.status) {
      case 0: set(tmp, 'status', '离线'); set(tmp, 'statusFlag', 'error'); break;
      case 1: set(tmp, 'status', '在线'); set(tmp, 'statusFlag', 'processing'); break;
      case 2: set(tmp, 'status', '运行'); set(tmp, 'statusFlag', 'success'); break;
      default: set(tmp, 'status', '未知'); set(tmp, 'statusFlag', 'error'); break;
    }

    // 自动收集数据
    switch (tmp.collectFlag) {
      case true: set(tmp, 'collect', '是'); set(tmp, 'collectFlag', 'success'); break;
      case false: set(tmp, 'collect', '否'); set(tmp, 'collectFlag', 'error'); break;
      default: set(tmp, 'collect', '否'); set(tmp, 'collectFlag', 'error'); break;
    }

    setDeviceDetail(tmp)

  }

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

  // 跟据deviceId获取数据列表
  const getDataListByDeviceId = async deviceId => {
    try {
      return await queryDataListByDeviceId({
        'deviceId': deviceId
      }).then(rst => rst.data)
    } catch (error) {
      message.error('数据请求出错');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDeviceListByUserId('hu')
      setDeviceList(data)

      const tmp = []
      data.forEach(v => tmp.push(<Option value={v.id}>{v.name}</Option>))
      setProjectOptions(tmp)
    }

    fetchData()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let last = 0;
      if (has(deviceDetail, 'id')) {
        const tmp = await getDataListByDeviceId(get(deviceDetail, 'id'))
        tmp.forEach( v => {
          last = (last < v.lastTimestamp) ? v.lastTimestamp : last;
        })
        setLastTime(last)
        setDataList(tmp)
      }
    }

    fetchData()
  }, [deviceDetail]);

  return (
    <PageContainer>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* 项目选择 */}
        <Card>
          <Row>
            <Col span={8}>
              <Form onValuesChange={onValuesChange}>
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
            <Descriptions.Item label="名称">{get(deviceDetail, 'name', null)}</Descriptions.Item>
            <Descriptions.Item label="类型">{get(deviceDetail, 'type', null)}</Descriptions.Item>
            <Descriptions.Item label="描述">{get(deviceDetail, 'desc', null)}</Descriptions.Item>
            <Descriptions.Item label="展示配置数">{get(deviceDetail, 'displayIds', []).length}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{moment(get(deviceDetail, 'registerTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 结果概述 */}
        <Card>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="运行状态" formatter={() => <Badge status={get(deviceDetail, 'statusFlag', 'error')} text={get(deviceDetail, 'status', '离线')} />} />
            </Col>
            <Col span={8}>
              <Statistic title="自动收集数据" formatter={() => <Badge status={get(deviceDetail, 'collectFlag', 'error')} text={get(deviceDetail, 'collect', '否')} />} />
            </Col>
            <Col span={8}>
              <Statistic title="最近结果时间" value={moment(lastTime).format('YYYY-MM-DD HH:mm:ss')} />
            </Col>
          </Row>
        </Card>

        {/* 结果列表 */}
        <ProTable
          headerTitle={<strong>结果列表</strong>}
          actionRef={actionRef}
          rowKey="key"
          toolBarRender={() => [
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> 新建
          </Button>,
          ]}
          dataSource={dataList}
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

export default TableList;
