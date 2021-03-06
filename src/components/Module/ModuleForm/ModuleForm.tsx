import React, { FC, useCallback, useEffect } from 'react'
import { Input, Modal, Form, InputNumber, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { Formation, Module, ModuleCreateInput, UpdateModuleMutationVariables } from '../../../generated/graphql'

interface ModuleFormProps {
  module?: Module
  modules: Module[]
  formation: Formation
  visible: boolean
  loading: boolean
  onCreate: ({ variables }: { variables: ModuleCreateInput }) => void
  onUpdate: ({ variables }: { variables: UpdateModuleMutationVariables }) => void
  onHideForm: () => void
}

const ModuleForm: FC<ModuleFormProps> = props => {
  const {
    module, modules, loading, formation, visible,
    onHideForm, onCreate, onUpdate
  } = props

  const [form] = useForm()

  const defaultFormValues = useCallback(() => {
    const number = modules[modules.length - 1]?.number + 1 || 1
    form.setFieldsValue({ number, name: '' })
  }, [form, modules])

  useEffect(() => {
    if (module) {
      form.setFieldsValue(module)
    } else {
      defaultFormValues()
    }
  }, [form, module, defaultFormValues])

  const handleOk = async () => {
    const variables = await form.validateFields()
    variables.formation = { connect: { id: formation.id } }
    let key = ''
    if (module) {
      key = 'updateModule'
      onUpdate({ variables: { ...variables, id: module.id } })
    } else {
      key = 'createModule'
      onCreate({ variables: variables as ModuleCreateInput })
    }
    message.loading({ key, content: 'Loading...' })
  }

  return (
      <Modal
        title={`${module ? 'Edit the' : 'Create a new'} module`}
        okText={`${module ? 'Save' : 'Create'}`}
        cancelText="Cancel"
        onOk={handleOk}
        onCancel={onHideForm}
        visible={visible}
        confirmLoading={loading}
        afterClose={defaultFormValues}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
        >
          <Form.Item
            name="number"
            label="Number of Module"
            rules={[
              {
                required: true,
                message: 'Please input the number of module!',
              }
            ]}
          >
            <InputNumber min={1} max={30} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please input the name of module!',
              },
              {
                min: 3,
                message: 'Enter at least 3 characters!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
    </Modal>
  )
}

export default ModuleForm
