import React, { useReducer, useEffect } from 'react'
import { Row, Col, Card, Typography, Button } from 'antd'
import LayoutFormModal, {
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import { SxyButton } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import { handleBasicQtyList } from '@/api/basicData'

const { Text } = Typography

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    width: 420,
    title: '添加银行卡',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
}

const MainPage = () => {
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑弹窗
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 新增弹窗
   * @Author bihongbin
   * @Date 2020-09-25 15:05:11
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置新增编辑弹窗数据
   * @Author bihongbin
   * @Date 2020-09-25 15:06:42
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Select',
          name: 'a',
          label: '开户行',
          placeholder: '请选择开户行',
          colProps: { span: 24 },
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '银行卡号',
          placeholder: '请输入银行卡号',
          colProps: { span: 24 },
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '户名',
          placeholder: '请输入户名',
          colProps: { span: 24 },
        },
      ],
    })
  }, [])

  return (
    <div className="mt-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} xl={8} xxl={6}>
          <Card className="shaded card-hover card-centered">
            <Button
              className="btn-text-icon is-btn-link"
              onClick={() => handleModalState({ visible: true })}
            >
              <SxyIcon width={16} height={16} name="card_add.png" />
              添加新银行卡
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} xl={8} xxl={6}>
          <Card className="shaded card-hover">
            <Row justify="space-between" align="middle">
              <Col>中国工商银行</Col>
              <Col>
                <SxyButton mode="light-blue" radius={15}>
                  设为默认
                </SxyButton>
              </Col>
            </Row>
            <div className="mt-3">
              <Text type="secondary">银行卡号：**************516</Text>
            </div>
            <div className="mt-4">
              <Text type="secondary">开户行：中国工商银行</Text>
            </div>
            <Row className="mt-4" justify="space-between">
              <Col>
                <Text type="secondary">户名：王啦啦</Text>
              </Col>
              <Col>
                <Button className="is-btn-link" danger type="text">
                  删除
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <LayoutFormModal
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </div>
  )
}

export default MainPage
