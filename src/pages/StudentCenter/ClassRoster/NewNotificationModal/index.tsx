import React, { useRef, useReducer, useEffect } from 'react'
import { Row, Col, Modal, Card, Divider, Form, Input, Button } from 'antd'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import TreeNode from '@/components/Tree'
import Editor from '@/components/Editor'

interface PropTypes {
  visible: boolean
  onCancel: () => void
}

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LEFT_FORM_LIST = '[SetLeftFormList Action]',
  SET_TREE_LIST = '[SetTreeList Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
}

const stateValue = {
  leftFormList: [] as FormListType[], // 头部搜索数据
  treeList: [], // 树数据
  saveLoading: false, // 保存loading
}

const NewNotificationModal = (props: PropTypes) => {
  const leftFormRef = useRef<FormCallType>()
  const [rightForm] = Form.useForm()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_LEFT_FORM_LIST: // 设置左侧表单
        return {
          ...state,
          leftFormList: action.payload,
        }
      case ActionType.SET_TREE_LIST: // 设置树数据
        return {
          ...state,
          treeList: action.payload,
        }
      case ActionType.SET_SAVE_LOADING: // 保存loading
        return {
          ...state,
          saveLoading: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 设置左侧表单
   * @Author bihongbin
   * @Date 2020-09-17 17:33:24
   */
  const handleLeftFormState = (data: StateType['leftFormList']) => {
    dispatch({
      type: ActionType.SET_LEFT_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置左侧表单数据
   * @Author bihongbin
   * @Date 2020-09-17 17:32:58
   */
  useEffect(() => {
    handleLeftFormState([
      {
        componentName: 'Select',
        name: 'a',
        label: '全部课程',
        placeholder: '请选择课程',
        colProps: { span: 24 },
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'b',
        label: '小班',
        placeholder: '小班',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        label: '小班',
        placeholder: '小班',
        selectData: [],
      },
    ])
  }, [])

  /**
   * @Description 设置树数据
   * @Author bihongbin
   * @Date 2020-09-17 17:40:25
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TREE_LIST,
      payload: [
        {
          title: '华旅云创科技有限公司',
          key: '0-0',
          isLocked: false,
          children: [
            {
              title: '研发部',
              key: '0-0-1',
              isLocked: false,
              children: [
                {
                  title: '技术组',
                  key: '0-0-1-0',
                  isLocked: false,
                },
                {
                  title: '运维组',
                  key: '0-0-1-1',
                  isLocked: true,
                },
                {
                  title: '测试组',
                  key: '0-0-1-2',
                  isLocked: false,
                },
              ],
            },
            {
              title: '销售部',
              key: '0-0-2',
              isLocked: false,
            },
          ],
        },
      ],
    })
  }, [])

  return (
    <Modal
      width={1000}
      title="新建通知"
      visible={props.visible}
      onCancel={() => props.onCancel()}
      footer={null}
    >
      <Row gutter={20}>
        <Col span={8}>
          <Card>
            <GenerateForm
              ref={leftFormRef}
              className="form-ash-theme form-large-font14"
              formConfig={{
                size: 'large',
                labelCol: { span: 24 },
              }}
              rowGridConfig={{ gutter: [20, 0] }}
              colGirdConfig={{ span: 12 }}
              list={state.leftFormList}
            />
            <Divider />
            <TreeNode searchOpen checkedOpen data={state.treeList} />
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <Form
              className="form-ash-theme form-large-font14 form-large-margin"
              form={rightForm}
              labelCol={{ span: 3 }}
              size="large"
              colon={false}
            >
              <Form.Item
                label="发送对象"
                name="a"
                rules={[{ required: true, message: '请输入发送对象' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="标题"
                name="b"
                rules={[
                  { required: true, max: 20, message: '最多可以输入20个字' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="摘要"
                name="c"
                rules={[
                  { required: true, max: 20, message: '最多可以输入20个字' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="模板"
                name="d"
                rules={[
                  { required: true, max: 20, message: '最多可以输入20个字' },
                ]}
              >
                <Button type="default">选择模板</Button>
              </Form.Item>
              <Form.Item
                label="正文"
                name="e"
                rules={[{ required: true, message: '请输入正文' }]}
              >
                <Editor
                  contentStyle={{ height: 200 }}
                  excludeControls={[
                    'letter-spacing',
                    'line-height',
                    'clear',
                    'headings',
                    'list-ol',
                    'list-ul',
                    'remove-styles',
                    'superscript',
                    'subscript',
                    'hr',
                    'text-align',
                  ]}
                />
              </Form.Item>
              <Form.Item label=" ">
                <Row className="mt-10 mb-5" justify="center">
                  <Col>
                    <Button
                      className="font-14"
                      size="large"
                      type="default"
                      onClick={() => props.onCancel()}
                    >
                      取消
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      className="font-14 ml-5"
                      size="large"
                      type="primary"
                      loading={state.saveLoading}
                    >
                      发送
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Modal>
  )
}

export default NewNotificationModal
