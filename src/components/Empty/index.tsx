import React from 'react'
import { Empty, Row } from 'antd'
import { EmptyProps } from 'antd/lib/empty'

type EmptyResultType = EmptyProps & {
  outerHeight?: number
}

const EmptyResult = (props?: EmptyResultType) => {
  const params: EmptyResultType = { ...props }
  delete params.outerHeight

  return (
    <Row
      className="empty-wrap"
      style={{
        minHeight: props && props.outerHeight ? props.outerHeight : 500,
      }}
      align="middle"
      justify="center"
    >
      <Empty {...params} />
    </Row>
  )
}

export default React.memo(EmptyResult)
