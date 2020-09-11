import React, { useState, useRef } from 'react';
import {
    Modal,
    Form,
    Input
} from 'antd';

const CreateCom = props => {
    const [visible, setvisible] = useState(props.visible);
    const [form] = Form.useForm();

    const onCancel = () => {
        props.onClose()
        setvisible(false)
    }

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    return (
        <Modal
            destroyOnClose
            title="注册设备"
            visible={visible}
            onCancel={() => onCancel()}
            footer={null}
        >
            <Form
                form={form}
                name="form_in_modal"
                labelAlign="right"
                {...formItemLayout}
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="name"
                    label="名称"
                    rules={[{ required: true, message: 'Please input the title of collection!' }]}
                >
                    <Input style={{ width: "85%" }} />
                </Form.Item>
                <Form.Item
                    name="desc"
                    label="描述"
                >
                    <Input type="textarea" style={{ width: "85%" }} />
                </Form.Item>
                <Form.Item
                    name="type"
                    label="类型"
                >
                    <Input style={{ width: "85%" }} />
                </Form.Item>
                <Form.Item
                    name="ip"
                    label="IP"
                >
                    <Input style={{ width: "85%" }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateCom;