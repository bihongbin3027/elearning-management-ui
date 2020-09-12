import React from 'react'
import { Empty, Row } from 'antd'

const NoData = () => {
  return (
    <>
      <Row style={{ minHeight: '500px' }} align="middle" justify="center">
        <Empty />
      </Row>
    </>
  )
}

export default React.memo(NoData)
