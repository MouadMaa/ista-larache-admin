import { useContext, useState } from 'react'
import { message } from 'antd'

import {
  Formation, useCreateFormationMutation, useFormationsQuery, useDeleteFormationMutation,
  useUpdateFormationMutation, useFormationWithModulesLazyQuery, Module, useFormationsWithClassesLazyQuery,
  useTeacherFormationsWithCLassesLazyQuery
} from '../generated/graphql'
import { AuthContext } from '../context/authContext'

export const useFormation = () => {
  const [formVisible, setFormVisible] = useState(false)

  const { user } = useContext(AuthContext)

  const { data: formationsData, loading: formationsLoading } = useFormationsQuery()

  const [
    fetchFormationWithModules, { data: formationWithModulesData, loading: formationWithModulesLoading }
  ] = useFormationWithModulesLazyQuery()

  const [
    fetchFormationsWithClasses, { data: formationsWithClassesData, loading: formationsWithClassesLoading }
  ] = useFormationsWithClassesLazyQuery()
  const [
    fetchTeacherFormationsWithCLasses, { data: teacherFormationsWithClassesData, loading: teacherFormationsWithClassesLoading }
  ] = useTeacherFormationsWithCLassesLazyQuery()

  const [createFormation, { loading: loadingCreate }] = useCreateFormationMutation({
    onCompleted: () => {
      message.success({ key: 'createFormation', content: 'A new formation has been added successfully.' })
      setFormVisible(false)
    },
    onError: () => {
      message.warning({ key: 'createFormation', content: 'Maybe the name of formation already exists.', duration: 10 })
    },
    update: (cache) => {
      cache.evict({ fieldName: 'formations' })
    },
  })

  const [updateFormation, { loading: loadingUpdate }] = useUpdateFormationMutation({
    onCompleted: () => {
      message.success({ key: 'updateFormation', content: 'The formation has been edited successfully.' })
      setFormVisible(false)
    },
    onError: () => {
      message.warning({ key: 'updateFormation', content: 'Maybe the name of formation already exists.', duration: 10 })
    },
  })

  const [deleteFormation, { loading: loadingDelete }] = useDeleteFormationMutation({
    onCompleted: () => {
      message.success({ key: 'deleteFormation', content: 'The formation has been removed successfully.' })
    },
    update: (cache, { data }) => {
      if (data?.deleteFormation) cache.evict({ id: cache.identify(data.deleteFormation) })
    },
  })

  return {
    formations: formationsData?.formations as Formation[] || [],
    formationsLoading: formationsLoading || loadingDelete,
    formLoading: loadingCreate || loadingUpdate,
    createFormation,
    updateFormation,
    deleteFormation,
    formVisible,
    setFormVisible,
    fetchFormationWithModules,
    modules: formationWithModulesData?.formation?.modules as Module[] || [],
    loadingModules: formationWithModulesLoading,
    fetchFormationsWithClasses: user?.role === 'ADMIN' ? fetchFormationsWithClasses : fetchTeacherFormationsWithCLasses,
    formationsWithClassesLoading: formationsWithClassesLoading || teacherFormationsWithClassesLoading,
    formationsWithClasses: user?.role === 'ADMIN' ? formationsWithClassesData?.formations as Formation[] || []
      : teacherFormationsWithClassesData?.teacherFormations as Formation[] || [],
  }
}
