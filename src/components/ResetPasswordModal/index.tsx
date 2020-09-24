import React, { useReducer, useEffect, useRef } from 'react'
import { Modal, Row, Button, Col, message } from 'antd'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import { AnyObjectType, AjaxResultType } from '@/typings'

interface PropType {
  visible: boolean
  width?: number
  title: string
  id?: string
  submitExtraParameters?: AnyObjectType // 需要提交表单的额外参数
  submitApi?: (data: any, method: 'put' | 'post') => Promise<AjaxResultType> // 提交表单的接口
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
   * @Description 设置修改密码弹窗表单数据
   * @Author bihongbin
   * @Date 2020-09-17 15:35:22
   */
  const handleFormState = (data: StateType['formList']) => {
    dispatch({
      type: ActionType.SET_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-05 16:29:26
   */
  const handleModalSave = async () => {
    if (formRef.current) {
      let formParams = await formRef.current.formSubmit()
      if (formParams) {
        // 合并父组件传过来的额外参数
        formParams = {
          ...formParams,
          ...props.submitExtraParameters,
        }
        if (props.submitApi) {
          try {
            dispatch({
              type: ActionType.SET_SAVE_LOADING,
              payload: true,
            })
            await props.submitApi(formParams, 'put')
            dispatch({
              type: ActionType.SET_SAVE_LOADING,
              payload: false,
            })
            message.success('修改成功', 1.5)
          } catch (error) {
            message.warn('修改失败', 1.5)
          }
        }
      }
    }
  }

  /**
   * @Description 设置表单数据
   * @Author bihongbin
   * @Date 2020-08-05 16:21:31
   */
  useEffect(() => {
    handleFormState([
      {
        componentName: 'Input',
        name: 'password',
        label: '密码',
        inputConfig: {
          inputMode: 'password',
        },
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
        inputConfig: {
          inputMode: 'password',
        },
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
    ])
  }, [])

  return (
    <Modal
      width={props.width || 420}
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
            className="form-ash-theme form-large-font14"
            formConfig={{
              size: 'large',
              labelCol: { span: 24 },
            }}
            rowGridConfig={{ gutter: [40, 0] }}
            colGirdConfig={{ span: 24 }}
            list={state.formList}
          />
        </Col>
      </Row>
      <Row className="mt-10 mb-5" justify="center">
        <Col>
          <Button
            className="font-14"
            size="large"
            onClick={() => props.onCancel()}
          >
            返回
          </Button>
          <Button
            className="font-14 ml-5"
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

export default React.memo(ResetPasswordView)
