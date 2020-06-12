import React, { useEffect, useState } from 'react';
import { IdeaRow, IdeaRowForm, PoolRow } from '../../types/types';
import { Form, Input, Modal, message } from 'antd';
import { useAppState } from '../../state/state';
import { createIdea } from '../../services/idea';

interface IdeaModalProps {
  pool: PoolRow;
  show: boolean;
  onCreated: (i: IdeaRow) => void;
  onError: (e: string) => void;
  onCancel: () => void;
}

export const IdeaModal: React.FC<IdeaModalProps> = ({
  pool,
  show,
  onCreated,
  onCancel,
}: IdeaModalProps) => {
  const [creatingNewIdea, setCreatingNewIdea] = useState(false);
  const [form] = Form.useForm();

  const { activeUser, contractAccount, accountName } = useAppState();
  useEffect(() => {
    form.resetFields();
  }, [show, form]);

  const handleNewIdea = (values) => {
    setCreatingNewIdea(true);
    const idea = {
      title: values.title,
      description: values.description,
    } as IdeaRowForm;
    createIdea(activeUser, contractAccount, accountName, pool.pool_name, idea)
      .then(() => {
        setCreatingNewIdea(false);
        onCreated({
          title: idea.title,
          description: idea.description,
        } as IdeaRow);
      })
      .catch((e) => {
        message.error(`unable to create new idea ${e}`);
        setCreatingNewIdea(false);
      });
  };

  return (
    <Modal
      title='New Idea'
      visible={show}
      onCancel={onCancel}
      confirmLoading={creatingNewIdea}
      onOk={() => {
        form
          .validateFields()
          .then(handleNewIdea)
          .catch((info) => {
            message.error('Invalid Input:', info);
          });
      }}
    >
      <Form>
        <Form form={form} name='basic' initialValues={{}}>
          <Form.Item
            name='title'
            rules={[{ required: true, message: 'Your idea needs a title!' }]}
          >
            <Input placeholder={'Enter a title'} />
          </Form.Item>

          <Form.Item
            name='description'
            rules={[
              { required: true, message: 'Your idea needs a description!' },
            ]}
          >
            <Input.TextArea placeholder={'Enter a description'} />
          </Form.Item>
        </Form>
      </Form>
    </Modal>
  );
};
