import React, { useMemo } from 'react'
import { Switch, Row, Col, Form, Space, Card, Input, Button } from 'antd'
import { SxyBadge } from '@/style/module/badge'
import { AnyObjectType } from '@/typings'

const StudentAppointmentRule = () => {
  /**
   * @Description 表单行高
   * @Author bihongbin
   * @Date 2020-09-14 11:39:25
   */
  const lineHeight = useMemo(() => ({ lineHeight: 2.2 }), [])

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
            <span className="font-16">学员预约规则</span>
          </Space>
          <Form
            className="form-ash-theme form-large-font14"
            size="large"
            onFinish={onSubmit}
            initialValues={{
              a: false,
              c: false,
              e: false,
            }}
          >
            <Row className="mt-5">
              <Col>
                <Form.Item
                  name="a"
                  label="开放预约"
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
                  label=" "
                  labelCol={{ span: 24 }}
                  className="hide-star"
                  style={lineHeight}
                >
                  开启后，自当前时间至
                  <Form.Item
                    name="b"
                    noStyle
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          console.log('value', value)
                          if (!value && getFieldValue('a')) {
                            return Promise.reject('请输入天数')
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Input
                      className="w140 ml-1 mr-1"
                      type="number"
                      placeholder="请输入天数"
                    />
                  </Form.Item>
                  周内的日程开放至校宝家展示
                  <br />
                  关闭后，不显示学员预约功能
                </Form.Item>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Form.Item
                  name="c"
                  label="预约限制"
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
                  label=" "
                  labelCol={{ span: 24 }}
                  className="hide-star"
                  style={lineHeight}
                >
                  开启后，提前
                  <Form.Item
                    name="d"
                    noStyle
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value && getFieldValue('c')) {
                            return Promise.reject('请输入天数')
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Input
                      className="w140 ml-1 mr-1"
                      type="number"
                      placeholder="请输入天数"
                    />
                  </Form.Item>
                  天前允许学员约课
                  <br />
                  关闭后，所有课程上课前均可预约
                </Form.Item>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <Form.Item
                  name="e"
                  label="取消预约"
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
                  label=" "
                  labelCol={{ span: 24 }}
                  className="hide-star"
                  style={lineHeight}
                >
                  开启后，开课时间
                  <Form.Item
                    name="f"
                    noStyle
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value && getFieldValue('e')) {
                            return Promise.reject('请输入天数')
                          }
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Input
                      className="w140 ml-1 mr-1"
                      type="number"
                      placeholder="请输入天数"
                    />
                  </Form.Item>
                  小时之前，学员可取消预约
                  <br />
                  关闭后，所有课程上课前均可预约
                </Form.Item>
              </Col>
            </Row>
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

export default StudentAppointmentRule
