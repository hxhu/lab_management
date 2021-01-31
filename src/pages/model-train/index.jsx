/* eslint-disable no-case-declarations */
/* eslint-disable jsx-a11y/iframe-has-title */
import { InboxOutlined } from '@ant-design/icons';
import {
    Button,
    Descriptions,
    Card,
    Space,
    Badge,
    Upload,
    Select,
    Image,
    message
} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Line } from '@ant-design/charts';
import { cloneDeep, get, set, has } from 'lodash'
import moment from 'moment'
import ReactJson from 'react-json-view'
import { chooseDataSet, prepareEnvironment, getTrainingLoss, getTestResult, getTrainingCondition } from './service';

const { Dragger } = Upload;
const { Option } = Select;

const ModelTrain = () => {
    const [lossData, setLossData] = useState([]);
    const [curTrainCondition, setCurTrainCondition] = useState({});
    const [caseId, setCaseId] = useState("N1343496694641201152");
    const [dataSetInfo, setDataSetInfo] = useState([]);
    const [dataSetOptions, setDataSetOptions] = useState([]);
    const [flagList, setFlagList] = useState([false, false, false, false, false, false, false]);
    const [testUrl, setTestUrl] = useState("https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png");

    const [envLoading, setEnvLoading] = useState(false);
    const [trainingFlag, setTrainFlag] = useState(false);

    const testProps = {
        name: 'avatar',
        action: `/api/ECase/testModel/${caseId}/1`,
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

    // 训练情况
    const trainCondition = async () => {
        await getTrainingCondition({
            caseId,
            status: 9
        }).then(v => {
            setCurTrainCondition(v.data)
        })
    }

    // 训练损失
    const config = {
        data: lossData,
        padding: 'auto',
        xField: 'iterator',
        yField: 'loss',
    };
    const trainLoss = async () => {
        await getTrainingLoss({
            caseId,
            status: 9
        }).then(v => {
            setLossData(v.data)
        })
    }

    // 测试结果
    const testResult = async () => {
        await getTestResult({
            caseId,
            status: 9
        }).then(v => {
            setTestUrl(v.data)
        })
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
                <Card title="4. 训练情况" extra={<Button type="primary" onClick={() => trainCondition()}>刷新</Button>}>
                    <Descriptions bordered>
                        <Descriptions.Item label="当前迭代次数">{get(curTrainCondition, 'currentIteratorTimes', 0)}</Descriptions.Item>
                        <Descriptions.Item label="最大迭代次数">{get(curTrainCondition, 'maxIteratorTimes', 0)}</Descriptions.Item>
                        <Descriptions.Item label="当前准确率">{get(curTrainCondition, 'currentAccuracy', 0.0)}</Descriptions.Item>
                        <Descriptions.Item label="运行状态">
                            {
                                get(curTrainCondition, 'status', "null") === "success"
                                    ? <Badge status="success" text="完成"/>
                                    : get(curTrainCondition, 'status', "null") === "running"
                                        ? <Badge status="processing" text="运行"/>
                                        : get(curTrainCondition, 'status', "null") === "error"
                                            ? <Badge status="error" text="错误"/>
                                            : <Badge status="default" text="未开始"/>
                            }
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 5. 训练损失 */}
                <Card title="5. 训练损失" extra={<Button type="primary" onClick={() => trainLoss()}>刷新</Button>} >
                    <Line {...config} />
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
                <Card title="7. 测试结果" extra={<Button type="primary" onClick={() => testResult()}>刷新</Button>}>
                    <Image
                        width={500}
                        src={testUrl + "?=" + Math.random()}
                    />
                </Card>

            </Space>

        </PageContainer>
    );
};

export default ModelTrain;
