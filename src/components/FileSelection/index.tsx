/*
 * @Description 弹窗选择文件组件
 * @Author bihongbin
 * @Date 2020-11-18 09:33:55
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-18 15:40:22
 */

import React, { useRef } from 'react'
import { Modal } from 'antd'
import FileCenter, { FileCenterCallType } from '@/pages/FileCenter'
import { PropTypes } from '@/components/FileSelection/interface'

const FileSelection: React.FC<PropTypes> = (props) => {
  const fileCenterRef = useRef<FileCenterCallType>()

  return (
    <Modal
      className="file-selection-modal"
      title={props.title || '选择文件'}
      visible={props.visible}
      width={props.width || 900}
      onCancel={props.onCancel}
      onOk={() => {
        if (fileCenterRef.current) {
          // 获取选中的数据
          props.onConfirm(fileCenterRef.current.getSelectedFile())
          props.onCancel()
        }
      }}
      maskClosable={false}
      destroyOnClose
    >
      <FileCenter
        ref={fileCenterRef}
        mode={props.mode}
        selectedMethod={props.selectedMethod}
        fileExt={props.fileExt}
        sourceType={props.sourceType}
        openManagement={props.openManagement}
      />
    </Modal>
  )
}

export default FileSelection
