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

interface IdeaCreateFormProps {
    poolName: string
}

export const IdeaCreateForm: React.FC<IdeaCreateFormProps> = ({poolName}) => {

    const { activeUser, accountName, contractAccount } = useAppState();

    const onFinish =  (values: any) => {
        console.log('creating idea: ', values);
        createIdea(poolName, values.ideaDesctription)
    };

    const  createIdea = async ( poolName: string, description: string): Promise<void>    => {
        const trx = {
            actions: [{
                account: contractAccount,
                name: 'addidea',
                authorization: [{
                    actor: accountName,
                    permission: 'active',
                }],
                data: {
                    "author":accountName,
                    "pool_name": poolName,
                    "description": description
                },
            }],
        };
        try {
            await activeUser.signTransaction(trx, { broadcast: true })
        } catch (error) {
            console.warn(error) //todo: better handdling here
        }
    };

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
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