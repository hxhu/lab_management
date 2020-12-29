import { PlusOutlined, ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
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
    List,
    Typography,
    Descriptions
} from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';

import { cloneDeep, get, set, has, unset, includes } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { queryDataSet, uploadImageSet } from './service';

const { Dragger } = Upload;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const DatasetManager = () => {
    const [currentDataSetId, setCurrentDataSetId] = useState("N1343852476926791680");
    const [currentDataSet, setCurrentDataSet] = useState({ "id": "" });
    const [currentImage, setCurrentImage] = useState([]);
    const [currentAnnotation, setCurrentAnnotation] = useState([]);
    const [currentDiff, setCurrentDiff] = useState([]);
    const [currentCommit, setCurrentCommit] = useState([]);
    const [form] = Form.useForm();

    // 数据上传配置
    const draggerPropsJPG = {
        name: 'avatar',
        multiple: true,
        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        action: `/api/EDataSet/uploadImage/${currentDataSet.id}`,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                if (get(info, "file.response.code", 5000) === 2000) {
                    const name = info.file.name.split(".")[0]
                    if (!includes(currentImage, name)) {
                        const tmp = cloneDeep(currentImage)
                        tmp.push(name)
                        setCurrentImage(tmp)
                    }
                }
            }
            if (status === 'done') {
                message.success(`${info.file.name} 图片上传成功.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} 图片上传失败.`);
            }
        },
    };
    const draggerPropsXML = {
        name: 'avatar',
        multiple: true,
        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        action: `/api/EDataSet/uploadAnnotation/${currentDataSet.id}`,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                if (get(info, "file.response.code", 5000) === 2000) {
                    const name = info.file.name.split(".")[0]
                    if (!includes(currentAnnotation, name)) {
                        const tmp = cloneDeep(currentAnnotation)
                        tmp.push(name)
                        setCurrentAnnotation(tmp)
                    }
                }
            }
            if (status === 'done') {
                message.success(`${info.file.name} 标注文件上传成功.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} 标注文件上传失败.`);
            }
        },
    };
    // 得到不匹配数据
    useEffect(() => {
        const currentDiffTmp = []
        const currentCommitTmp = []
        // Image不匹配
        currentImage.forEach(v => {
            if (!includes(currentAnnotation, v)) {
                currentDiffTmp.push({ name: v, type: "图片" })
            } else {
                currentCommitTmp.push(v)
            }
        })

        // Annotation不匹配
        currentAnnotation.forEach(v => {
            if (!includes(currentImage, v)) {
                currentDiffTmp.push({ name: v, type: "标注" })
            }
        })

        setCurrentDiff(currentDiffTmp)
        setCurrentCommit(currentCommitTmp)

    }, [currentImage, currentAnnotation])


    // 获取数据集信息
    const getDataSet = async (params) => {
        try {
            return await queryDataSet(params).then(rst => rst.data)
        } catch (error) {
            message.error('请求数据集信息出错');
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            const currentDataSetTmp = await getDataSet({ dataSetId: currentDataSetId })
            setCurrentDataSet(currentDataSetTmp)
        }

        fetchData()
    }, []);

    const onFinish = async () => {
        await uploadImageSet({ nameList: currentCommit, dataSetId: currentDataSetId })
            .then(v => {
                if (v.code === 2000) {
                    message.success("上传成功")
                } else {
                    message.error("上传失败")
                }
            })
    }
    const onCancel = () => {

    }

    return (
        <PageContainer>
            <Space direction="vertical" style={{ width: "100%" }}>
                {/* 数据集信息 */}
                <Card>
                    <Descriptions title="数据集信息" bordered>
                        <Descriptions.Item label="名称">{get(currentDataSet, 'dataSetName', null)}</Descriptions.Item>
                        <Descriptions.Item label="描述">{get(currentDataSet, 'dataDesc', null)}</Descriptions.Item>
                        <Descriptions.Item label="生成时间">{moment(get(currentDataSet, 'createTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                        <Descriptions.Item label="更新时间">{moment(get(currentDataSet, 'updateTime', 0)).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 源图片上传 */}
                <Card title="源图片上传">
                    <Dragger {...draggerPropsJPG}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击上传源图片</p>
                        <p className="ant-upload-hint">把文件拖入指定区域，完成上传，同样支持点击上传。</p>
                    </Dragger>
                </Card>

                {/* 标注文件上传 */}
                <Card title="标注文件上传">
                    <Dragger {...draggerPropsXML}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击上传标注文件</p>
                        <p className="ant-upload-hint">把文件拖入指定区域，完成上传，同样支持点击上传。</p>
                    </Dragger>
                </Card>

                {/* 数据集验证信息 */}
                <Card title="数据集未匹配信息">
                    <List
                        bordered
                        dataSource={currentDiff}
                        renderItem={item => (
                            <List.Item>
                                {/* 某个文件没有匹配 */}
                                <Typography.Text mark>{item.type}</Typography.Text>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.name}
                            </List.Item>
                        )}
                    />
                </Card>

                {/* 提交信息 */}
                <Card>
                    <Row>
                        <Col span={8} />
                        <Col span={10} >
                            <Form
                                {...layout}
                                form={form}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                labelAlign="right"
                                colon={false}
                            >
                                <Form.Item {...tailLayout}>
                                    <Button type="primary" htmlType="submit">提交</Button>
                                    <Button htmlType="button" onClick={onCancel}>取消</Button>
                                </Form.Item>
                            </Form>
                        </Col>
                        <Col span={6} />
                    </Row>
                </Card>

            </Space>

        </PageContainer>
    );
};

export default DatasetManager;
