import React, { FC, useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import './Class.css'
import ClassForm from '../../components/Class/ClassForm/ClassForm'
import ClassTable from '../../components/Class/ClassTable/ClassTable'
import ClassDrawer from '../../components/Class/ClassDrawer/ClassDrawer'
import { Class as ClassType } from '../../generated/graphql'
import { useCLass } from '../../hooks/useClassHook'
import { useFormation } from '../../hooks/useFormationHook'
import { useUser } from '../../hooks/useUserHook'

const Class: FC = () => {
  const [currentClass, setCurrentClass] = useState<ClassType>()
  const [visibleDrawer, setVisibleDrawer] = useState(false)

  const {
    classes, classesLoading, formVisible, setFormVisible, formLoading,
    createClass, updateClass, deleteClass
  } = useCLass()
  const { formations, loadingFormations } = useFormation()
  const { teachers, usersLoading } = useUser()

  const onShowForm = () => {
    setFormVisible(true)
    setCurrentClass(undefined)
  }

  const onShowDrawer = (viewClass: ClassType) => {
    setVisibleDrawer(true)
    setCurrentClass(viewClass)
  }

  const onEdit = (updatedClass: ClassType) => {
    setFormVisible(true)
    setCurrentClass({ ...updatedClass })
  }

  const onDelete = (deletedClass: ClassType) => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: `All the Students related to this class "${deletedClass.formation.name}"
        they will also be permanently deleted`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => {
        deleteClass({ variables: { id: deletedClass.id } })
        setCurrentClass(undefined)
      }
    })
  }

  const onHideForm = () => setFormVisible(false)
  const onCloseDrawer = () => setVisibleDrawer(false)

  return (
    <div className='class-container'>
      <ClassForm
        currentClass={currentClass}
        formations={formations}
        teachers={teachers}
        loading={formLoading || loadingFormations || usersLoading}
        visible={formVisible}
        onCreate={createClass}
        onUpdate={updateClass}
        onShowForm={onShowForm}
        onHideForm={onHideForm}
      />
      <ClassTable
        classes={classes}
        formations={formations}
        loading={classesLoading}
        onShowDrawer={onShowDrawer}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ClassDrawer
        currentClass={currentClass}
        visibleDrawer={visibleDrawer}
        onCloseDrawer={onCloseDrawer}
      />
    </div>
  )
}

export default Class
