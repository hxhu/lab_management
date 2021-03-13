/* eslint-disable no-alert */
/* eslint-disable default-case */
/* eslint-disable prefer-template */
import { MinusCircleOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
    queryDeviceList,
    createConfig,
    deleteConfigById,
    pushConfig
} from './service';

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const { Option } = Select;
const { confirm } = Modal;

const sights = {
    Beijing: ['Tiananmen', 'Great Wall'],
    Shanghai: ['Oriental Pearl', 'The Bund'],
};

const ConfigUpdate = () => {
    const [configInfo, setConfigInfo] = useState([]);
    const [curConfig, setCurConfig] = useState({});
    const [deviceOptions, setDeviceOptions] = useState([]);

    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);

    const [configListFlag, setConfigListFlag] = useState(false);

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
            key: 'updateTime',
            render: v => moment(v, 0).format('YYYY-MM-DD HH:mm:ss')
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

                {/* 删除按钮 */}
                <Button
                    type="dashed"
                    onClick={() => {
                        confirm({
                            title: '确认删除该设备？',
                            icon: <ExclamationCircleOutlined />,
                            content: `设备ID: ${id}`,
                            async onOk() {
                                // 删除设备
                                await deleteConfigById({
                                    "configId": id
                                }).then(v => {
                                    if (v.code === 2000) {
                                        message.success("设备删除成功")
                                    } else {
                                        message.error("设备删除失败")
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
    }, [configListFlag]);


    // 表单相关
    const onFinish = async values => {
        const result = {}
        set(result, 'configId', get(curConfig, "id", ""))
        set(result, 'deviceIds', get(values, 'target', []))

        await pushConfig(result).then(v => {
            if (v.code === 2000) {
                message.success("推送参数成功")
            } else {
                message.error("推送参数失败")
            }
        })
    }
    const onReset = () => {
        form.resetFields();
    }
    const onCreateFinish = async values => {
        const configsTmp = get(values, 'configs', {})
        const configs = {}
        configsTmp.forEach(v => {
            switch (v.type) {
                case "int": set(configs, v.name, parseInt(v.value, 10)); break;
                case "float": set(configs, v.name, parseFloat(v.value)); break;
                case "string": set(configs, v.name, v.value); break;
                case "boolean": set(configs, v.name, v.value === "True"); break;
                default: break;
            }
        })
        set(values, 'configs', configs)

        await createConfig(values).then(v => {
            if (v.code === 2000) {
                message.success("新增参数组成功")
            } else {
                message.error("新增参数组失败")
            }
        })

        setCreateVisible(false)
        setConfigListFlag(!configListFlag)
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

                        {/* 参数组 configs */}
                        <Form.List name="configs">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(field => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            {/* 参数名 */}
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'name']}
                                                fieldKey={[field.fieldKey, 'name']}
                                                rules={[{ required: true, message: '请输入参数名' }]}
                                            >
                                                <Input placeholder="参数名" />
                                            </Form.Item>

                                            {/* 参数类型 */}
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'type']}
                                                fieldKey={[field.fieldKey, 'type']}
                                                rules={[{ required: true, message: '请选择类型' }]}
                                            >
                                                <Select placeholder="类型" >
                                                    <Option value="int">整型</Option>
                                                    <Option value="float">浮点型</Option>
                                                    <Option value="string">字符串型</Option>
                                                    <Option value="boolean">布尔型</Option>
                                                </Select>
                                            </Form.Item>

                                            {/* 参数值 */}
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'value']}
                                                fieldKey={[field.fieldKey, 'value']}
                                                rules={[{ required: true, message: '请输入参数值' }]}
                                            >
                                                <Input placeholder="参数值" />
                                            </Form.Item>

                                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            增加参数
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">提交</Button>
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
