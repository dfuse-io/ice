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
    const { activeUser, accountName, contractAccount } = useAppState();

    const onFinish =  (values: any) => {
        console.log('creating pool: ', values);
        createPool(values.poolName, values.poolDescription)
    };

    const  createPool = async (poolName: string, poolDescription: string): Promise<void>    => {
        const demoTransaction = {
            actions: [{
                account: contractAccount,
                name: 'addpool',
                authorization: [{
                    actor: accountName,
                    permission: 'active',
                }],
                data: {
                    "author":accountName,
                    "name": poolName,
                    "description": poolDescription
                },
            }],
        };
        try {
            await activeUser.signTransaction(demoTransaction, { broadcast: true })
        } catch (error) {
            console.warn(error) //todo: better handdling here
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