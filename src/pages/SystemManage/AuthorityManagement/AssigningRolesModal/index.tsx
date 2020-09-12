import React, { useReducer, useEffect, useRef } from 'react'
import { Modal, Row, Button, Col, Divider, Radio, Checkbox, Spin } from 'antd'
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

interface RoleCheckType {
  name: string
  value: string | number
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_FORM_LIST = '[SetFormList Action]',
  SET_ROLE_CHECK_LIST = '[SetRoleCheckList Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
}

const stateValue = {
  loading: false, // 弹窗全局显示loading
  formList: [] as FormListType[], // 表单数据
  roleCheckList: [] as RoleCheckType[], // 角色数据
  saveLoading: false, // 保存loading
}

const AssigningRolesView = (props: PropType) => {
  const formRef = useRef<FormCallType>()
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置全局显示loading
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_FORM_LIST: // 设置表单数据
        return {
          ...state,
          formList: action.payload,
        }
      case ActionType.SET_ROLE_CHECK_LIST: // 设置角色数据
        return {
          ...state,
          roleCheckList: action.payload,
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
  const handleModalSave = () => {}

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
          componentName: 'Select',
          name: 'as1',
          label: '公司',
          placeholder: '请选择公司',
          selectData: [],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置角色数据
   * @Author bihongbin
   * @Date 2020-08-05 16:21:49
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_ROLE_CHECK_LIST,
      payload: [
        {
          name: '总经办',
          value: '0',
        },
        {
          name: '系统管理员',
          value: '1',
        },
        {
          name: '客服专员',
          value: '2',
        },
        {
          name: '行政专员',
          value: '3',
        },
        {
          name: '人事专员',
          value: '4',
        },
        {
          name: '出票管理员',
          value: '5',
        },
        {
          name: '出票原',
          value: '6',
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
      <Spin spinning={state.loading}>
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
            <Divider className="mt-2 mb-5" />
            <Row justify="space-between">
              <Col>
                <Radio.Group
                  className="sxy-radio-group"
                  defaultValue="a"
                  buttonStyle="solid"
                >
                  <Radio.Button value="a">用户组</Radio.Button>
                  <Radio.Button value="b">常规角色</Radio.Button>
                  <Radio.Button value="c">拒绝角色</Radio.Button>
                </Radio.Group>
              </Col>
              <Col>
                <Button type="link">清空</Button>
              </Col>
            </Row>
            <Checkbox.Group className="mt-5">
              <Row gutter={[20, 10]}>
                {state.roleCheckList.map((item, index) => (
                  <Col span={12} key={index}>
                    <Checkbox
                      className="sxy-checkbox-button"
                      value={item.value}
                    >
                      {item.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
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
      </Spin>
    </Modal>
  )
}

export default AssigningRolesView
