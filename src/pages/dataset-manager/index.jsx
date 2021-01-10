import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'umi';
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
    Input
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { cloneDeep, get, set, has, unset, includes } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import {
    queryDataSetList,
    deleteDataSetById,
    createDataSet,
    modifyDataSet
} from './service';

const { Option } = Select;
const { confirm } = Modal;

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const DeviceManager = () => {
    const [dataSet, setDataSet] = useState([]);
    const [dataSetFlag, setDataSetFlag] = useState(false);
    const [newVisible, setNewVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [updateDataSet, setUpdateDataSet] = useState({});

    const [newForm] = Form.useForm();
    const [updateForm] = Form.useForm();

    // 修改数据集相关
    const onUpdateDataSetCancel = () => {
        updateForm.resetFields();
        setUpdateVisible(false)
    }
    const onUpdateFinish = async (values) => {
        await modifyDataSet(values)
            .then(v => {
                if (v.code === 2000) {
                    message.success("修改数据集成功")
                    setDataSetFlag(!dataSetFlag)
                } else {
                    message.error("修改数据集失败")
                }
                setUpdateVisible(false)
            })
    }
    const onUpdateReset = () => {
        updateForm.resetFields();
    }
    useEffect(() => {
        if (has(updateDataSet, 'id')) {
            updateForm.setFieldsValue(updateDataSet)
            setUpdateVisible(true)
        }
    }, [updateDataSet]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: '数据集名',
            dataIndex: 'dataSetName',
            key: 'dataSetName'
        },
        {
            title: '数据集描述',
            dataIndex: 'dataSetDesc',
            key: 'dataSetDesc'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: v => moment(v === null ? 0 : v).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: v => moment(v === null ? 0 : v).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type'
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'action',
            render: id => (
                <Space>
                    {/* 修改按钮 */}
                    <Button
                        type="primary"
                        onClick={() => {
                            let updateDataSetTmp = {}
                            const dataSetTmp = cloneDeep(dataSet)
                            dataSetTmp.forEach(v => {
                                if (v.id === id) {
                                    updateDataSetTmp = v
                                }
                            })

                            setUpdateVisible(true)
                            setUpdateDataSet(updateDataSetTmp)
                        }}
                    >
                        修改
                    </Button>
                    <Modal
                        title="修改设备"
                        visible={updateVisible}
                        onCancel={onUpdateDataSetCancel}
                        footer={null}
                    >
                        <Form
                            {...layout}
                            form={updateForm}
                            onFinish={onUpdateFinish}
                            labelAlign="right"
                            // initialValues={updateDevice}
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

                            {/* dataSetName */}
                            <Form.Item
                                label="数据集名"
                                name="dataSetName"
                                rules={[{ required: true, message: '请输入数据集名!' }]}
                            >
                                <Input />
                            </Form.Item>

                            {/* dataSetDesc */}
                            <Form.Item
                                label="数据集信息"
                                name="dataSetDesc"
                                initialValue={null}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">修改</Button>
                                <Button htmlType="button" onClick={onUpdateReset}>清空</Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    {/* 删除按钮 */}
                    <Button
                        type="dashed"
                        onClick={() => {
                            confirm({
                                title: '确认删除该数据集？',
                                icon: <ExclamationCircleOutlined />,
                                content: `数据集ID: ${id}`,
                                async onOk() {
                                    // 删除设备
                                    await deleteDataSetById({
                                        "dataSetId": id
                                    }).then(v => {
                                        if (v.code === 2000) {
                                            message.success("数据集删除成功")
                                            setDataSetFlag(!dataSetFlag)
                                        } else {
                                            message.error("数据集删除失败")
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

                    {/* 上传数据 */}
                    <Link to={`/data-upload/${id}`} >上传数据</Link>
                </Space>
            ),
        },
    ];

    // 请求数据集
    const getDataSetList = async () => {
        try {
            return await queryDataSetList()
                .then(rst => rst.data)
        } catch (error) {
            message.error('请求数据集列表出错');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            const dataSetTmp = await getDataSetList()
            setDataSet(dataSetTmp)
        }

        fetchData()
    }, [dataSetFlag]);


    // 新建数据集相关
    const onNewDataSetCancel = () => {
        newForm.resetFields();
        setNewVisible(false)
    }
    const onNewReset = () => {
        newForm.resetFields();
    }
    const onNewFinish = async (values) => {
        const dataSetTmp = {}

        set(dataSetTmp, 'dataSetName', values.dataSetName)
        if (values.dataSetDesc !== null) {
            set(dataSetTmp, 'dataSetDesc', values.dataSetDesc)
        }
        set(dataSetTmp, 'type', values.type)


        await createDataSet(dataSetTmp)
            .then(v => {
                if (v.code === 2000) {
                    message.success("新建数据集成功")
                    setDataSetFlag(!dataSetFlag)
                } else {
                    message.error("新建数据集失败")
                }
                setNewVisible(false)
            })
    }


    return (
        <PageContainer>
            <Space direction="vertical" style={{ width: "100%" }}>
                {/* 数据集新建 */}
                <Card>
                    <Button type="primary" onClick={() => setNewVisible(true)}>新建数据集</Button>
                    <Modal
                        title="新建数据集"
                        visible={newVisible}
                        onCancel={onNewDataSetCancel}
                        footer={null}
                    >
                        <Form
                            {...layout}
                            form={newForm}
                            initialValues={{ remember: true }}
                            onFinish={onNewFinish}
                            labelAlign="right"
                            colon={false}
                        >
                            {/* dataSetName */}
                            <Form.Item
                                label="数据集名"
                                name="dataSetName"
                                rules={[{ required: true, message: '请输入数据集名!' }]}
                            >
                                <Input />
                            </Form.Item>

                            {/* dataSetDesc */}
                            <Form.Item
                                label="设数据集描述"
                                name="dataSetDesc"
                                initialValue={null}
                            >
                                <Input />
                            </Form.Item>

                            {/* type */}
                            <Form.Item
                                label="类型"
                                name="type"
                                initialValue="ssd"
                                rules={[{ required: true, message: '请选择数据集类型!' }]}
                            >
                                <Select>
                                    <Option value="ssd">ssd</Option>
                                    <Option value="yolo">yolo</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">注册</Button>
                                <Button htmlType="button" onClick={onNewReset}>清空</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Card>

                {/* 数据集列表 */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={dataSet}
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
