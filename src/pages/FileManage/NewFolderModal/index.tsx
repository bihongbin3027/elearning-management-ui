import React, { useReducer, useRef, useContext } from 'react'
import { Modal, Row, Button, Col, message } from 'antd'
import GenerateForm, { FormCallType } from '@/components/GenerateForm'
import {
  FileManageContext,
  ActionType as ParentActionType,
} from '@/pages/FileManage'

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

const NewFolderView = () => {
  const { mainState, mainDispatch } = useContext(FileManageContext)
  const formRef = useRef<FormCallType>()
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
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
   * @Description 关闭弹窗
   * @Author bihongbin
   * @Date 2020-08-13 11:20:57
   */
  const handleClose = () => {
    mainDispatch({
      type: ParentActionType.SET_NEW_FOLDER_MODAL_DATA,
      payload: {
        ...mainState.newFolderModal,
        visible: false,
      },
    })
  }

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-05 16:29:26
   */
  const handleModalSave = async () => {
    if (formRef.current) {
      const result = await formRef.current.formSubmit()
      if (result) {
        if (mainState.newFolderModal.id) {
          dispatch({
            type: ActionType.SET_SAVE_LOADING,
            payload: true,
          })
          setTimeout(() => {
            dispatch({
              type: ActionType.SET_SAVE_LOADING,
              payload: false,
            })
            // 修改当前预览文件
            mainDispatch({
              type: ParentActionType.SET_OPEN_PREVIEW,
              payload: {
                ...mainState.openPreview,
                current: {
                  ...mainState.openPreview.current,
                  originalFileName: result.originalFileName,
                },
                list: mainState.openPreview.list.map((item) => {
                  if (item.id === mainState.openPreview.current.id) {
                    item.originalFileName = result.originalFileName
                  }
                  return item
                }),
              },
            })
            // 修改主页面文件
            mainDispatch({
              type: ParentActionType.SET_FILE_LIST,
              payload: mainState.fileList.map((item) => {
                if (item.id === mainState.openPreview.current.id) {
                  item.originalFileName = result.originalFileName
                }
                return item
              }),
            })
            message.warn('修改成功', 1.5)
            handleClose() // 关闭弹窗
          }, 1000)
        } else {
          setTimeout(() => {
            console.log('创建成功')
          }, 1000)
        }
      }
    }
  }

  return (
    <Modal
      width={mainState.newFolderModal.width}
      visible={mainState.newFolderModal.visible}
      title={mainState.newFolderModal.title}
      onCancel={handleClose}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Row justify="center">
        <Col span={20}>
          <GenerateForm
            ref={formRef}
            className="form-ash-theme form-large-font14"
            formConfig={{
              size: 'large',
              labelCol: { span: 24 },
            }}
            rowGridConfig={{ gutter: [40, 0] }}
            colGirdConfig={{ span: 24 }}
            list={mainState.newFolderModal.formList}
          />
        </Col>
      </Row>
      <Row className="mt-10 mb-5" justify="center">
        <Col>
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

export default NewFolderView
