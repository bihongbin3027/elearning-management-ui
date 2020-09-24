import React from 'react'
import { Row, Col, Switch, Space, Card, Form, Button } from 'antd'
import { SxyBadge } from '@/style/module/badge'
import { AnyObjectType } from '@/typings'

const EliminationOfClass = () => {
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
            <span className="font-16">消课设置</span>
          </Space>
          <Form
            className="form-ash-theme form-large-font14"
            onFinish={onSubmit}
            size="large"
            initialValues={{
              a: false,
              b: false,
            }}
          >
            <Row className="mt-3">
              <Col>
                <Form.Item
                  name="a"
                  label="请假是否消课"
                  valuePropName="checked"
                  labelCol={{ span: 24 }}
                  className="mt-1"
                  rules={[{ required: true }]}
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name="b"
                  label="未到是否消课"
                  valuePropName="checked"
                  labelCol={{ span: 24 }}
                  className="mt-1"
                  rules={[{ required: true }]}
                >
                  <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item className="mt-4">
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

export default EliminationOfClass
