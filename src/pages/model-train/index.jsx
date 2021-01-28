/* eslint-disable no-case-declarations */
/* eslint-disable jsx-a11y/iframe-has-title */
import { InboxOutlined } from '@ant-design/icons';
import {
    Button,
    Descriptions,
    Card,
    Space,
    Row,
    Col,
    Upload,
    Select,
    Image,
    message
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { chooseDataSet, prepareEnvironment, pushModel } from './service';

const { Dragger } = Upload;
const { Option } = Select;

const testProps = {
    name: 'testPic',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const ModelTrain = () => {
    const [caseId, setCaseId] = useState("N1343496694641201152");
    const [dataSetInfo, setDataSetInfo] = useState([]);
    const [dataSetOptions, setDataSetOptions] = useState([]);
    const [flagList, setFlagList] = useState([false, false, false, false, false, false, false]);

    const [envLoading, setEnvLoading] = useState(false);
    const [trainingFlag, setTrainFlag] = useState(false);

    // 数据集选择
    useEffect(() => {
        const fetchData = async () => {
            // eslint-disable-next-line default-case
            const dataSetInfoTmp = await chooseDataSet({
                caseId,
                status: 1
            }).then(v => {
                return v.data
            })
            setDataSetInfo(dataSetInfoTmp)

            const dataSetOptionsTmp = []
            dataSetInfoTmp.forEach(v => {
                dataSetOptionsTmp.push(<Option value={v.id}>{v.dataSetName}</Option>)
            })
            setDataSetOptions(dataSetOptionsTmp)

        }

        fetchData()
    }, []);
    const onDataSetSelect = async (value) => {
        await chooseDataSet({
            caseId,
            status: 2,
            dataSetId: value
        })

        const setFlagListTmp = cloneDeep(flagList)
        setFlagListTmp[0] = true
        setFlagList(setFlagListTmp)
    }

    // 环境准备
    const onPrepareEnv = async () => {
        if (flagList[0]) {
            await prepareEnvironment({
                caseId,
                status: 1
            })
        }
    }

    return (
        <PageContainer>
            <Space direction="vertical" style={{ width: "100%" }}>
                {/* 1. 数据集选择 */}
                <Card title="1. 数据集选择">
                    <Select style={{ width: 240 }} onSelect={onDataSetSelect}>
                        {dataSetOptions}
                    </Select>
                </Card>

                {/* 2. 环境准备 */}
                <Card title="2. 环境准备" >
                    <Button
                        type="primary"
                        loading={envLoading}
                        onClick={onPrepareEnv}
                    // onClick={() => { setEnvLoading(true) }}
                    >
                        开始执行
                    </Button>
                </Card>

                {/* 3. 开始训练 */}
                <Card title="3. 开始训练">
                    <Button
                        type="primary"
                        onClick={() => { setTrainFlag(!trainingFlag) }}
                        danger={trainingFlag}
                    >
                        {trainingFlag ? "放弃训练" : "开始训练"}
                    </Button>
                </Card>

                {/* 4. 训练情况 */}
                <Card title="4. 训练情况">
                    <Descriptions bordered>
                        <Descriptions.Item label="当前迭代次数">Cloud Database</Descriptions.Item>
                        <Descriptions.Item label="最大迭代次数">Prepaid</Descriptions.Item>
                        <Descriptions.Item label="当前准确率">YES</Descriptions.Item>
                        <Descriptions.Item label="运行状态">2018-04-24 18:00:00</Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 5. 训练结果 */}
                <Card title="5. 训练结果">
                    <Image
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                </Card>

                {/* 6. 模型测试 */}
                <Card title="6. 模型测试">
                    <Dragger {...testProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">单击上传测试图片</p>
                        <p className="ant-upload-hint">仅支持单张图片上传测试</p>
                    </Dragger>
                </Card>

                {/* 7. 测试结果 */}
                <Card title="7. 测试结果">
                    <Image
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    />
                </Card>

            </Space>

        </PageContainer>
    );
};

export default ModelTrain;
