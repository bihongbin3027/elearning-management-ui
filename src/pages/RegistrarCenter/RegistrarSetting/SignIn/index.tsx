import React from 'react'
import { Row, Col, Space, Card, Form, Button, Radio, Input } from 'antd'
import { SxyBadge } from '@/style/module/badge'
import { AnyObjectType } from '@/typings'

const SignIn = () => {
  /**
   * @Description 表单提交
   * @Author bihongbin
   * @Date 2020-09-14 11:44:46
   */
  const onSubmit = (values: AnyObjectType) => {
    console.log('表单提交：', values)
  }

  return (
    <Card className="mt-4">
      <Row justify="center">
        <Col span={20}>
          <Space className="mt-5" size={10} style={{ width: '100%' }}>
            <SxyBadge bg="#5860F8" />
            <span className="font-16">签到设置</span>
          </Space>
          <Form
            className="form-ash-theme form-large-font14"
            size="large"
            onFinish={onSubmit}
            initialValues={{
              a: '0',
            }}
          >
            <Form.Item className="mt-4" name="a">
              <Radio.Group>
                <Radio value="0">线上签到</Radio>
                <Radio value="1">线下签到</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <span>上课开始前</span>
              <Form.Item name="b" noStyle>
                <Input className="w140 ml-1 mr-1" type="number" />
              </Form.Item>
              小时可以签到
            </Form.Item>
            <Form.Item>
              <span
                className="text-right"
                style={{ display: 'inline-block', width: 70 }}
              >
                课后
              </span>
              <Form.Item name="c" noStyle>
                <Input className="w140 ml-1 mr-1" type="number" />
              </Form.Item>
              小时内停止签到
            </Form.Item>
            <Form.Item className="mt-5">
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

export default SignIn
