import React, { useRef, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { parse } from 'query-string'
import { Modal, Row, Button, Col, message } from 'antd'
import useSetState from '@/hooks/useSetState'
import GenerateForm, { FormCallType } from '@/components/GenerateForm'
import { FileManageContext } from '@/pages/FileCenter'
import { RootStateType } from '@/store/rootReducer'
import { handleFileFolderList, handleFileList } from '@/api/fileManage'

interface PropTypes {
  getFileFolderListData?: () => Promise<void>
}

interface StateType {
  saveLoading: boolean
}

const NewFolderView = (props: PropTypes) => {
  const location = useLocation()
  const queryUrl = parse(location.search)
  const auth = useSelector((state: RootStateType) => state.auth)
  const { mainState, mainSetState } = useContext(FileManageContext)
  const formRef = useRef<FormCallType>()
  const [state, setState] = useSetState<StateType>({
    saveLoading: false, // 保存loading
  })

  /**
   * @Description 关闭弹窗
   * @Author bihongbin
   * @Date 2020-08-13 11:20:57
   */
  const handleClose = () => {
    mainSetState((prev) => {
      prev.newFolderModal.visible = false
      return prev
    })
  }

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-05 16:29:26
   */
  const handleModalSave = async () => {
    if (formRef.current) {
      const formValue = await formRef.current.formSubmit()
      if (formValue) {
        // 打开按钮loading
        setState({
          saveLoading: true,
        })
        if (mainState.newFolderModal.id) {
          if (mainState.openPreview.current.fileExt) {
            // 修改文件
            await handleFileList(
              {
                id: mainState.newFolderModal.id,
                originalFileName: formValue.originalFileName,
              },
              'put',
            )
          } else {
            // 修改文件夹
            await handleFileFolderList(
              {
                id: mainState.newFolderModal.id,
                originalFileName: formValue.originalFileName,
              },
              'put',
            )
          }
          mainSetState((prev) => {
            const openPreview = { ...prev.openPreview }
            // 修改当前预览文件
            openPreview.current.originalFileName = formValue.originalFileName
            // 在主列表修改对应的改过的文件
            openPreview.list = mainState.openPreview.list.map((item) => {
              if (item.id === mainState.openPreview.current.id) {
                item.originalFileName = formValue.originalFileName
              }
              return item
            })
            // 修改主页面文件
            prev.fileList = mainState.fileList.map((item) => {
              if (item.id === mainState.openPreview.current.id) {
                item.originalFileName = formValue.originalFileName
              }
              return item
            })
            return prev
          })
          // 关闭按钮loading
          setState({
            saveLoading: false,
          })
          message.warn('修改成功', 1.5)
          handleClose() // 关闭弹窗
        } else {
          // 创建文件夹
          await handleFileFolderList(
            {
              cId: auth.user?.cid,
              parentId: queryUrl.parentId,
              name: formValue.originalFileName,
            },
            'post',
          )
          // 关闭按钮loading
          setState({
            saveLoading: false,
          })
          message.success('创建成功', 1.5)
          handleClose() // 关闭弹窗
          if (props.getFileFolderListData) {
            props.getFileFolderListData() // 更新文件夹列表
          }
        }
      }
    }
  }

  /**
   * @Description 设置文件夹或文件默认名称（只有编辑状态才设置）
   * @Author bihongbin
   * @Date 2020-11-16 15:38:02
   */
  useEffect(() => {
    if (mainState.newFolderModal.visible) {
      if (mainState.newFolderModal.id) {
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.formSetValues({
              originalFileName: mainState.openPreview.current.originalFileName,
            })
          }
        }, 100)
      }
    }
  }, [mainState])

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
            className="font-14"
            type="primary"
            size="large"
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
