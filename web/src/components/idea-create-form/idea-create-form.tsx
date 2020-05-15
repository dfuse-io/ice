import React from "react";
import {useAppState} from "../../state"
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const IdeaCreateForm: React.FC = () => {

    // const onFinish = values => {
    //     console.log('Success:', values);
    // };
    //
    // const onFinishFailed = errorInfo => {
    //     console.log('Failed:', errorInfo);
    // };

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
        //     onFinish={onFinish}
        //     onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Description"
                name="ideaDesctription"
                rules={[{ required: true, message: 'Please input a description' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
};