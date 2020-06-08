import React, { useEffect, useState } from 'react';
import { IdeaRow, IdeaRowForm, PoolRow } from '../../types';
import { Form, Input, Modal } from 'antd';
import { useAppState } from '../../state';
import { addIdeaTrx } from '../../utils/trx';

interface NewIdeaProps {
  pool: PoolRow;
  show: boolean;
  onCreated: (i: IdeaRow) => void;
  onError: (e: string) => void;
  onCancel: () => void;
}

export const NewIdea: React.FC<NewIdeaProps> = ({
  pool,
  show,
  onCreated,
  onCancel,
}: NewIdeaProps) => {
  const [creatingNewIdea, setCreatingNewIdea] = useState(false);
  const { contractAccount, activeUser, accountName } = useAppState();
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [show, form]);

  const createIdea = async (ideaForm: IdeaRowForm): Promise<void> => {
    await activeUser.signTransaction(
      addIdeaTrx(contractAccount, accountName, pool.pool_name, ideaForm),
      { broadcast: true }
    );
  };
  const handleNewIdea = (values) => {
    setCreatingNewIdea(true);
    const idea = {
      title: values.title,
      description: values.description,
    } as IdeaRowForm;
    createIdea(idea)
      .then(() => {
        setCreatingNewIdea(false);
        onCreated({
          title: idea.title,
          description: idea.description,
        } as IdeaRow);
      })
      .catch((e) => {
        console.error(e);
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
          .then((values) => {
            handleNewIdea(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
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
