import React, { useEffect, useRef, useReducer } from 'react'
import { Row, Col, Card, Button, Space } from 'antd'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import { SxyBadge } from '@/style/module/badge'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
  SET_FORM_LIST = '[SetFormList Action]',
}

const stateValue = {
  loading: false, // loading
  saveLoading: false, // 保存按钮loading
  formList: [] as FormListType[],
}

const AliPay = () => {
  const formRef = useRef<FormCallType>() // 表单实例
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置loading状态
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_SAVE_LOADING: // 设置保存按钮loading状态
        return {
          ...state,
          saveLoading: action.payload,
        }
      case ActionType.SET_FORM_LIST: // 设置表单数据
        return {
          ...state,
          formList: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 设置表单
   * @Author bihongbin
   * @Date 2020-09-27 15:55:43
   */
  const handleFormListState = (data: StateType['formList']) => {
    dispatch({
      type: ActionType.SET_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置保存loading
   * @Author bihongbin
   * @Date 2020-09-27 15:57:56
   */
  const handleSaveLoadingState = (data: StateType['saveLoading']) => {
    dispatch({
      type: ActionType.SET_SAVE_LOADING,
      payload: data,
    })
  }

  /**
   * @Description 保存
   * @Author bihongbin
   * @Date 2020-09-27 15:57:11
   */
  const formSubmit = () => {
    handleSaveLoadingState(true)
    setTimeout(() => {
      handleSaveLoadingState(false)
    }, 1000)
  }

  /**
   * @Description 设置表单数据
   * @Author bihongbin
   * @Date 2020-09-27 16:01:20
   */
  useEffect(() => {
    handleFormListState([
      {
        componentName: 'Switch',
        name: 'a',
        label: '状态',
        valuePropName: 'checked',
        colProps: { span: 24 },
      },
      {
        componentName: 'Input',
        name: 'b',
        label: 'PID',
        placeholder: '请输入PID',
        colProps: { span: 24 },
      },
      {
        componentName: 'Input',
        name: 'c',
        label: 'MD5密钥',
        placeholder: '请输入MD5密钥',
        colProps: { span: 24 },
      },
      {
        componentName: 'Input',
        name: 'd',
        label: '账户',
        placeholder: '请输入账户',
        colProps: { span: 24 },
      },
    ])
  }, [])

  return (
    <Card className="mt-4">
      <Row>
        <Col offset={1} xs={24} sm={18} md={12} xl={8}>
          <Space className="mt-5" size={10} style={{ width: '100%' }}>
            <SxyBadge bg="#5860F8" />
            <span className="font-16">支付宝账号配置</span>
          </Space>
          <GenerateForm
            ref={formRef}
            className="form-ash-theme form-large-font14 mt-3"
            formConfig={{
              size: 'large',
              labelCol: { span: 24 },
            }}
            rowGridConfig={{ gutter: [40, 0] }}
            colGirdConfig={{ span: 12 }}
            list={state.formList}
          />
          <Row className="mt-10 mb-5" justify="center">
            <Col>
              <Button
                className="font-14 ml-5"
                size="large"
                type="primary"
                loading={state.saveLoading}
                onClick={formSubmit}
              >
                保存
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default AliPay
