import React, {useState} from "react";
import {IdeaRow, IdeaRowForm, PoolRow} from "../../types";
import {Form, Input, message, Modal} from "antd";

interface NewIdeaProps {
    pool: PoolRow
    show: boolean
    onCreated: (i: IdeaRow) => void
    onError: (e: string) => void
}

export const NewIdea: React.FC<NewIdeaProps> = ({pool, show, onCreated, onError}) => {
    const [creatingNewIdea, setCreatingNewIdea] = useState(false);
    const [close, setClose] = useState(false);

    const createIdea = async (ideaForm: IdeaRowForm): Promise<void>  => {
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
                    "name": pool.pool_name,
                    "description": pool.description
                },
            }],
        }
        try {
            await activeUser.signTransaction(demoTransaction, { broadcast: true })
        } catch (error) {
            throw error
        }
    }



    const handleNewIdea = values => {
        setCreatingNewIdea(true)
        const idea = {title: values.title, description: values.description} as IdeaRowForm
        createIdea(idea).then(() => {
            setCreatingNewIdea(false)
        }).catch( e => {
            setCreatingNewIdea(false)
        })
    };


    const [form] = Form.useForm();

    return (
        <Modal
            title="New Idea"
            visible={show}
            onCancel={onError}
            onOk={() => {
                form
                    .validateFields()
                    .then(values => {
                        form.resetFields();
                        handleNewIdea(values);
                    })
                    .catch(info => {
                        console.log('Validate Failed:', info);
                    });
            }}

        >
            <Form
            >
                <Form
                    form={form}
                    name="basic"
                    initialValues={{}}
                >
                    <Form.Item
                        name="title"
                        rules={[{ required: true, message: 'Your idea needs a title!' }]}
                    >
                        <Input placeholder={"Enter a title"}/>
                    </Form.Item>

                    <Form.Item
                        name="description"
                        rules={[{ required: true, message: 'Your idea needs a description!' }]}
                    >
                        <Input.TextArea placeholder={"Enter a description"}/>
                    </Form.Item>
                </Form>
            </Form>
        </Modal>
    )

}