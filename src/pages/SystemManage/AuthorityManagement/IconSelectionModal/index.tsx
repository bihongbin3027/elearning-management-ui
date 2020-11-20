import React from 'react'
import useSetState from '@/hooks/useSetState'
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

interface StateType {
  iconModal: {
    selected: number
    list: IconType[]
  }
}

const userImg = require('@/assets/images/default.jpg')

const IconSelectionView = (props: PropType) => {
  const [state, setState] = useSetState<StateType>({
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
      ],
    },
  })

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
              onClick={() => {
                setState((prev) => {
                  prev.iconModal.selected = index
                  return prev
                })
              }}
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
