import React, { useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Form,
  Input,
  Select,
  Checkbox,
} from 'antd'
import Editor from '@/components/Editor'
import { AnyObjectType } from '@/typings'

const { Option } = Select
const { TabPane } = Tabs

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
}

const stateValue = {
  saveLoading: false, // 保存loading
}

const Notice = () => {
  const history = useHistory()
  const [form] = Form.useForm()
  const [state] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SAVE_LOADING: // 保存loading
        return {
          ...state,
          saveLoading: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 发送
   * @Author bihongbin
   * @Date 2020-09-15 17:57:23
   */
  const onSubmit = (values: AnyObjectType) => {
    values.b = values.b.toHTML()
    console.log('发送', values)
  }

  return (
    <>
      <Card className="card-header-tabs">
        <Tabs>
          <TabPane tab="新通知公告" key="1" />
        </Tabs>
      </Card>
      <Card className="mt-4">
        <Form
          className="form-ash-theme form-large-font14 mt-8"
          form={form}
          onFinish={onSubmit}
          size="large"
          labelCol={{
            span: 2,
          }}
          wrapperCol={{
            span: 10,
          }}
        >
          <Form.Item
            name="a"
            label="通知标题"
            rules={[{ required: true, message: '请输入通知标题' }]}
          >
            <Input
              addonBefore={
                <Form.Item name="prefix" noStyle>
                  <Select style={{ width: 70 }}>
                    <Option value="86">+86</Option>
                    <Option value="87">+87</Option>
                  </Select>
                </Form.Item>
              }
              placeholder="请输入通知标题"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="b"
            label="通知正文"
            rules={[
              { required: true, message: '请输入正文内容' },
              () => ({
                validator(rule, value) {
                  if (value && value.isEmpty && value.isEmpty()) {
                    return Promise.reject('请输入正文内容')
                  } else {
                    return Promise.resolve()
                  }
                },
              }),
            ]}
          >
            <Editor />
          </Form.Item>
          <Form.Item name="c" label="查看权限">
            <Checkbox.Group>
              <Checkbox value="1">所有人</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="d" label="通知校区">
            <Checkbox.Group>
              <Checkbox value="1">全部</Checkbox>
              <Checkbox value="2">七校区</Checkbox>
              <Checkbox value="3">八校区</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item name="e" label="通知校区">
            <Checkbox.Group>
              <Checkbox value="1">突出显示在通知列表的第一位</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <Row className="mt-10 mb-5" justify="center">
            <Col>
              <Button
                className="font-14"
                size="large"
                onClick={() => history.goBack()}
              >
                取消
              </Button>
            </Col>
            <Col>
              <Button
                className="font-14 ml-5"
                size="large"
                type="primary"
                htmlType="submit"
                loading={state.saveLoading}
              >
                发送
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  )
}

export default Notice
