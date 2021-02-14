/* eslint-disable prefer-template */
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
    Descriptions
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { cloneDeep, get, set, has, unset, includes } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import {
    queryConfigList,
    queryDeviceList
} from './service';

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const { Option } = Select;

const ConfigUpdate = () => {
    const [configInfo, setConfigInfo] = useState([]);
    const [curConfig, setCurConfig] = useState({});
    const [deviceOptions, setDeviceOptions] = useState([]);

    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);

    const [form] = Form.useForm();
    const [createForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    // 当前选中参数修改
    const chooseCurConfig = (id) => {
        let configInfoTmp = {}
        configInfo.forEach(v => {
            if (v.id === id) {
                configInfoTmp = cloneDeep(v)
            }
        })
        setCurConfig(configInfoTmp)
    }

    // 获取设备列表
    useEffect(() => {
        const fetchData = async () => {
            const deviceListTmp = await queryDeviceList().then(v => v.data)
            const deviceOptionsTmp = []
            deviceListTmp.forEach(v => {
                deviceOptionsTmp.push(<Option key={v.id} >
                    {get(v, "deviceName", " ") + "-" + v.id}
                </Option>)
            })
            setDeviceOptions(deviceOptionsTmp)
        }

        fetchData()
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '参数组名',
            dataIndex: 'configName',
            key: 'configName'
        },
        {
            title: '描述',
            dataIndex: 'configDesc',
            key: 'configDesc'
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        },
        {
            title: '值',
            dataIndex: 'configs',
            key: 'configs',
            render: values => <ReactJson name="configs" src={values} />
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'options',
            render: id => <Space>
                <Button type="primary" onClick={() => chooseCurConfig(id)}>
                    选择
                </Button>
                <Button>
                    修改
                </Button>
            </Space>
        },
    ];

    // 请求参数组列表
    const getConfigList = async () => {
        try {
            return await queryConfigList()
                .then(rst => rst.data)
        } catch (error) {
            message.error('请求参数组列表出错');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            const configInfoTmp = await getConfigList()
            setConfigInfo(configInfoTmp)
        }

        fetchData()
    }, []);


    // 表单相关
    const onFinish = values => {
        console.log(values)
    }
    const onReset = () => {
        form.resetFields();
    }
    const onCreateFinish = values => {
        console.log(values)
    }
    const onCreateReset = () => {
        createForm.resetFields();
    }
    const onUpdateFinish = values => {
        console.log(values)
    }
    const onUpdateReset = () => {
        updateForm.resetFields();
    }

    // 弹窗相关
    const onCreateDeviceCancel = () => {
        setCreateVisible(false)
    }
    const onUpdateDeviceCancel = () => {
        setUpdateVisible(false)
    }


    return (
        <PageContainer>
            <Space direction="vertical" style={{ width: "100%" }}>

                {/* 新增参数组 */}
                <Card>
                    <Button type="primary" onClick={() => { setCreateVisible(true) }}>
                        新增参数组
                    </Button>
                </Card>
                <Modal
                    title="新增参数组"
                    visible={createVisible}
                    onCancel={onCreateDeviceCancel}
                    footer={null}
                >
                    <Form
                        {...layout}
                        form={createForm}
                        onFinish={onCreateFinish}
                        labelAlign="right"
                        colon={false}
                    >
                        {/* configName */}
                        <Form.Item
                            label="名字"
                            name="configName"
                            rules={[{ required: true, message: '请输入名字!' }]}
                        >
                            <Input />
                        </Form.Item>

                        {/* configDesc */}
                        <Form.Item
                            label="描述"
                            name="configDesc"
                            rules={[{ required: true, message: '请输入描述!' }]}
                        >
                            <Input />
                        </Form.Item>

                        {/* configs */}
                        <Form.Item
                            label="参数"
                            name="configs"
                            rules={[{ required: true, message: '需要修改!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">修改</Button>
                            <Button htmlType="button" onClick={onCreateReset}>清空</Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 参数列表 */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={configInfo}
                    />
                </Card>

                {/* 参数推送 */}
                <Card>
                    <Descriptions title="参数详情" bordered>
                        <Descriptions.Item label="名称">{get(curConfig, 'configName', null)}</Descriptions.Item>
                        <Descriptions.Item label="描述">{get(curConfig, 'configDesc', null)}</Descriptions.Item>
                        <Descriptions.Item label="修改时间">{moment(get(curConfig, 'updateTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="参数">
                            <ReactJson name="configs" src={get(curConfig, 'configs', {})} />
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
                <Card>
                    <Form
                        // {...layout}
                        form={form}
                        onFinish={onFinish}
                        labelAlign="left"
                        colon={false}
                    >
                        {/* 选择设备 */}
                        <Form.Item
                            label="目标"
                            name="target"
                            rules={[{ required: true, message: '选择设备' }]}
                        >
                            <Select mode="multiple" style={{ width: '100%' }}>
                                {deviceOptions}
                            </Select>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">推送</Button>
                            <Button htmlType="button" onClick={onReset}>清空</Button>
                        </Form.Item>
                    </Form>

                </Card>

            </Space>

        </PageContainer>
    );
};

export default ConfigUpdate;
