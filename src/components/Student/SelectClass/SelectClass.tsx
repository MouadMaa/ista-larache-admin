import React, { FC, useEffect, useState } from 'react'
import { Cascader, Col, Row, Spin, Typography } from 'antd'
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader'

import { Formation } from '../../../generated/graphql'

interface SelectClassProps {
  fetchFormationsWithClasses: () => void
  formationsWithClasses: Formation[]
  loading: boolean
  onSelect: (formationId: string | undefined, classId: string | undefined) => void
}

const SelectClass: FC<SelectClassProps> = props => {
  const { fetchFormationsWithClasses, formationsWithClasses, loading, onSelect } = props

  const [options, setOptions] = useState<CascaderOptionType[]>([])

  useEffect(() => {
    fetchFormationsWithClasses()
  }, [fetchFormationsWithClasses])

  useEffect(() => {
    setOptions(getOptions(formationsWithClasses))
  }, [formationsWithClasses])

  const onChange = (value: CascaderValueType) => {
    onSelect(value[0]?.toString(), value[1]?.toString())
  }

  const filter = (inputValue: string, path: CascaderOptionType[]) => {
    return path.some(option => ((option?.label) as string)
      .toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
  }

  return (
    <Row align='middle'>
      <Col flex={1}>
        <Typography.Text>
          Please select the class:
        </Typography.Text>
      </Col>
      <Col flex={30}>
        <Cascader
          style={{ width: '100%' }}
          options={options}
          onChange={onChange}
          placeholder="Please select the class"
          showSearch={{ filter }}
        />
      </Col>
      <Col flex={1}>
        {loading && <Spin style={{ marginLeft: 30 }} />}
      </Col>
    </Row>
  )
}

export default SelectClass

const getOptions = (formations: Formation[]): CascaderOptionType[] => {
  const options: CascaderOptionType[] = []
  formations.forEach(formation => {
    const option: CascaderOptionType = {
      value: formation.id,
      label: formation.name,
      children: formation.classes.map(c => ({
        value: c.id,
        label: `${c.year} Year, Group: ${c.group}`
      }))
    }
    options.push(option)
  })
  return options
}
