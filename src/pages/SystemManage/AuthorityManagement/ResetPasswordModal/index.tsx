import React, { useReducer, useEffect, useRef } from 'react'
import { Modal, Row, Button, Col } from 'antd'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'

interface PropType {
  visible: boolean
  width?: number
  title: string
  id?: string
  onCancel: () => void
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_FORM_LIST = '[SetFormList Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
}

const stateValue = {
  formList: [] as FormListType[], // 表单数据
  saveLoading: false, // 保存loading
}

const ResetPasswordView = (props: PropType) => {
  const formRef = useRef<FormCallType>()
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
      case ActionType.SET_FORM_LIST: // 设置表单数据
        return {
          ...state,
          formList: action.payload,
        }
      case ActionType.SET_SAVE_LOADING: // 保存loading
        return {
          ...state,
          saveLoading: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-05 16:29:26
   */
  const handleModalSave = async () => {
    if (formRef.current) {
      const result = await formRef.current.formSubmit()
      if (result) {
        console.log('重置密码弹窗', result)
      }
    }
  }

  /**
   * @Description 设置表单数据
   * @Author bihongbin
   * @Date 2020-08-05 16:21:31
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_FORM_LIST,
      payload: [
        {
          componentName: 'Input',
          name: 'password',
          label: '密码',
          rules: [
            {
              required: true,
              message: '请输入密码',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'confirm',
          label: '确认密码',
          dependencies: ['password'],
          rules: [
            {
              required: true,
              message: '请输入确认密码',
            },
            ({ getFieldValue }: any) => ({
              validator(rule: any, value: any) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('您输入的两个密码不匹配')
              },
            }),
          ],
        },
      ],
    })
  }, [])

  return (
    <Modal
      width={props.width}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Row justify="center">
        <Col span={23}>
          <GenerateForm
            ref={formRef}
            formConfig={{
              labelCol: { span: 24 },
            }}
            rowGridConfig={{ gutter: [40, 0] }}
            colGirdConfig={{ span: 12 }}
            list={state.formList}
          />
        </Col>
      </Row>
      <Row className="mt-10 mb-5" justify="center">
        <Col>
          <Button size="large" onClick={() => props.onCancel()}>
            返回
          </Button>
          <Button
            className="ml-5"
            size="large"
            type="primary"
            loading={state.saveLoading}
            onClick={handleModalSave}
          >
            确定
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default ResetPasswordView
