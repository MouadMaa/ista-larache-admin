import React, { FC, useEffect, useState } from 'react'
import { Button, Popconfirm, Space, Table, Typography } from 'antd'
import { PlusCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'

import { Module, Note, Student } from '../../../generated/graphql'

interface ModuleTableProps {
  notes: Note[]
  loading: boolean
  student?: Student
  modules: Module[]
  viewNote: boolean
  onShowForm: () => void
  onDelete: (note: Note) => void
  onEdit: (note: Note) => void
}

interface DataSourceNotes extends Note {
  moduleName: string
}

const ModuleTable: FC<ModuleTableProps> = props => {
  const { notes, student, modules, loading, viewNote, onShowForm, onDelete, onEdit } = props

  const [data, setData] = useState<DataSourceNotes[]>([])

  useEffect(() => {
    if (!modules.length || !notes.length || !viewNote) {
      setData([])
      return
    }
    setData(notes.map(
      note => ({ ...note, moduleName: note.module.name })
    ))
  }, [notes, modules, viewNote])

  const columns: ColumnsType<Note> = [
    {
      title: "Module",
      dataIndex: "moduleName",
    },
    {
      title: "First Note",
      dataIndex: "note1",
      sorter: (a, b) => a.note1! - b.note1!,
    },
    {
      title: "Second Note",
      dataIndex: "note2",
      sorter: (a, b) => a.note2! - b.note2!,
    },
    {
      title: "Third Note",
      dataIndex: "note3",
      sorter: (a, b) => a.note3! - b.note3!,
    },
    {
      title: "Note of EFM",
      dataIndex: "efm",
      sorter: (a, b) => a.efm! - b.efm!,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: '10%',
      render: (_, note) => (
        <Space size="small">
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => onEdit(note)}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => onDelete(note)}
          >
            <Button
              type='link'
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table<Note>
      title={() => (
        <div className='table-note-header'>
          <Typography.Text>
            {getTitle(notes, loading, student)}
          </Typography.Text>
          {student && viewNote && (
            <Button
              type='link'
              icon={<PlusCircleOutlined />}
              onClick={onShowForm}
            >
              Add Note
            </Button>
          )}
        </div>
      )}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 8 }}
      size='small'
      bordered
    />
  )
}

export default ModuleTable

const getTitle = (notes: Note[], loading: boolean, student?: Student) => {
  return loading ? 'Notes is Loading...' : student && notes.length
    ? `Notes Related to Student: ${student.fullName}`
    : student ? 'This Student does not have any notes'
      : 'Notes (Choose a student)'
}
