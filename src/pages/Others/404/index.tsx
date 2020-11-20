import React from 'react'
import { Card } from 'antd'

const Page404 = () => {
  const error = require('@/assets/images/404.png')

  return (
    <Card className="card-centered" style={{ height: 'calc(100vh - 156px)' }}>
      <img src={error} alt="404" />
    </Card>
  )
}

export default Page404
