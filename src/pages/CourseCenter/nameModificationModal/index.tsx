import React, { useRef, useReducer, useEffect } from 'react'
import { Modal, Row, Col, Button } from 'antd'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'

interface PropType {
  visible: boolean
  title: string
  id: string
  width?: number
  onCancel: () => void
  onConfirm: () => void
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
  SET_FORM_LIST = '[SetFormList Action]',
}

const stateValue = {
  saveLoading: false, // 保存loading
  formList: [] as FormListType[], // 表单数据
}

const NameModificationView = (props: PropType) => {
  const formRef = useRef<FormCallType>(null)
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
      case ActionType.SET_SAVE_LOADING: // 设置保存loading
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
   * @Description 表单提交
   * @Author bihongbin
   * @Date 2020-08-21 17:35:59
   */
  const formSubmit = async () => {
    let formParams = await formRef.current?.formSubmit()
    console.log('formParams', formParams)
  }

  /**
   * @Description 设置表单数据
   * @Author bihongbin
   * @Date 2020-08-21 17:33:19
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_FORM_LIST,
      payload: [
        {
          componentName: 'Input',
          name: 'a',
          label: props.title,
          placeholder: `请输入${props.title}`,
          rules: [{ required: true, message: `请输入${props.title}` }],
        },
      ],
    })
  }, [props.title])

  return (
    <Modal
      width={props.width ? props.width : 350}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      forceRender
      maskClosable={false}
      footer={null}
    >
      <GenerateForm
        ref={formRef}
        formConfig={{
          labelCol: { span: 24 },
        }}
        rowGridConfig={{ gutter: [40, 0] }}
        colGirdConfig={{ span: 24 }}
        list={state.formList}
      />
      <Row className="mt-10 mb-5" justify="center">
        <Col>
          <Button className="font-14" size="large" onClick={props.onCancel}>
            取消
          </Button>
          <Button
            className="font-14 ml-5"
            size="large"
            type="primary"
            loading={state.saveLoading}
            onClick={formSubmit}
          >
            确定
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default NameModificationView
