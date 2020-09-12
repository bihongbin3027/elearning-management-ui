import React, { useReducer } from 'react'
import { Avatar, Modal, Row, Col, Button, message } from 'antd'

interface PropType {
  visible: boolean
  width?: number
  title?: string
  onCancel: () => void
  onConfirm?: (item: IconType) => void
}

interface IconType {
  src: string
}

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_ICON = '[SetIcon Action]',
}

const userImg = require('@/assets/images/default.jpg')

const stateValue = {
  // 图标
  iconModal: {
    selected: -1,
    list: [
      { src: userImg },
      { src: userImg },
      { src: userImg },
      { src: userImg },
      { src: userImg },
      { src: userImg },
      { src: userImg },
      { src: userImg },
      { src: userImg },
    ] as IconType[],
  },
}

const IconSelectionView = (props: PropType) => {
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_ICON: // 设置图标
        return {
          ...state,
          iconModal: {
            ...state.iconModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 点击图标
   * @Author bihongbin
   * @Date 2020-08-18 17:36:40
   */
  const handleIconState = (index: number) => {
    dispatch({
      type: ActionType.SET_ICON,
      payload: {
        selected: index,
      },
    })
  }

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-18 17:34:47
   */
  const handleIconSave = () => {
    if (state.iconModal.selected === -1) {
      message.warn('请选择图标', 1.5)
      return
    }
    const item = state.iconModal.list[state.iconModal.selected]
    if (props.onConfirm) {
      props.onConfirm(item)
    }
  }

  return (
    <Modal
      width={props.width ? props.width : 505}
      visible={props.visible}
      title={props.title ? props.title : '图标选择'}
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Row className="ml-3 mr-3" gutter={[16, 16]}>
        {state.iconModal.list.map((item, index) => (
          <Col flex="62px" key={index}>
            <div
              className={`avatar-selected ${
                index === state.iconModal.selected ? 'avatar-selected-bg' : null
              }`}
              onClick={() => handleIconState(index)}
            >
              <Avatar
                className="pointer"
                src={item.src}
                shape="square"
                size={64}
                alt="图标"
              />
            </div>
          </Col>
        ))}
      </Row>
      <Row className="mt-10 mb-5" justify="center">
        <Col>
          <Button className="font-14" size="large" onClick={props.onCancel}>
            取消
          </Button>
          <Button
            className="font-14 ml-5"
            size="large"
            type="primary"
            onClick={handleIconSave}
          >
            确定
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default IconSelectionView
