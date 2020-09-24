import React from 'react'
import { Empty, Row } from 'antd'

const NoData = () => {
  return (
    <>
      <Row
        className="empty-wrap"
        style={{ minHeight: '500px' }}
        align="middle"
        justify="center"
      >
        <Empty />
      </Row>
    </>
  )
}

export default NoData
