import React from "react";
import {useAppState} from "../../state"
import { JsonRpc } from 'eosjs'
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const PoolCreateForm: React.FC = () => {

    const onFinish = (values: any) => {
        console.log('Success:', values);

        const demoTransaction = {
            actions: [{
                account: 'dfuseioice',
                name: 'addpool',
                authorization: [{
                    actor: '', // todo: use account that was logged in
                    permission: 'active',
                }],
                data: {"author":"todo: use account that was logged in", "pool_name":values.poolName, "description":values.poolDescription},
            }],
        }

        const { accountName, activeUser } = useAppState;
        demoTransaction.actions[0].authorization[0].actor = accountName;
        try {
            await activeUser.signTransaction(demoTransaction, { broadcast: true })
            this.updateAccountBalance()
        } catch (error) {
            console.warn(error)
        }
    };

    return (
        <Form
            {...layout}
            name="basic"
            onFinish={onFinish}
        //     onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Pool name"
                name="poolName"
                rules={[{ required: true, message: 'Please input a pool name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Pool Description"
                name="poolDescription"
                rules={[{ required: true, message: 'Please input your pool description!' }]}
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