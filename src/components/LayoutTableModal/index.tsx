/*
 * @Description 弹窗表格组件
 * @Author bihongbin
 * @Date 2020-08-07 11:55:09
 * @LastEditors bihongbin
 * @LastEditTime 2021-01-28 18:04:13
 */

import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Modal, Row, Col, Button, message } from 'antd'
import { TableProps, ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import useSetState from '@/hooks/useSetState'
import { AnyObjectType, PromiseAxiosResultType } from '@/typings'

export interface LayoutTableModalCallType {
  setSavaLoading: (data: boolean) => void
  LayoutTableListRef: () => LayoutTableCallType | undefined
}

export interface LayoutTableModalPropType {
  visible: boolean // 打开或关闭
  title: React.ReactNode // 弹窗标题
  width?: number // 弹窗宽度
  searchFormList?: FormListCallType[] // 搜索表单数据
  tableColumnsList: {
    rowType?: 'checkbox' | 'radio' | undefined // 是否开启表格行选中 checkbox多选 radio单选
    list: ColumnType<AnyObjectType>[] // 表格头数据
    tableConfig?: TableProps<any> // 自定义配置，支持antd官方表格所有参数
  }
  autoGetList?: true // 是否开启默认查询功能
  apiMethod: (data: any) => PromiseAxiosResultType // 列表请求函数
  onCancel?: () => void // 取消或关闭弹窗
  onConfirm?: (data: AnyObjectType[]) => Promise<boolean> // 确定弹窗操作
}

interface StateType {
  autoGetList: boolean
  saveLoading: boolean
}

const LayoutTableModal = (props: LayoutTableModalPropType, ref: any) => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const [state, setState] = useSetState<StateType>({
    autoGetList: false, // 是否开启默认查询功能(true是 false否)
    saveLoading: false, // 保存按钮loading
  })

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-07 13:48:41
   */
  const handleConfirm = () => {
    let data: AnyObjectType[] = []
    if (props.onConfirm) {
      if (layoutTableRef.current) {
        data = layoutTableRef.current.getSelectRowsArray()
      }
      setState({
        saveLoading: true,
      })
      props
        .onConfirm(data)
        .then((res) => {
          setState({
            saveLoading: false,
          })
          if (res) {
            props.onCancel && props.onCancel()
          }
        })
        .catch((err) => {
          message.warn(err, 1.5)
        })
    }
  }

  /**
   * @Description 开启默认查询功能
   * @Author bihongbin
   * @Date 2020-08-05 14:09:53
   */
  useEffect(() => {
    if (props.autoGetList) {
      setState({
        autoGetList: props.autoGetList,
      })
    }
  }, [props.autoGetList, setState])

  /**
   * @Description 初始查询
   * @Author bihongbin
   * @Date 2020-10-29 17:17:51
   */
  useEffect(() => {
    if (props.visible && layoutTableRef.current && state.autoGetList) {
      layoutTableRef.current.getTableList({
        updateSelected: false,
      })
    }
  }, [props.visible, state.autoGetList])

  // 暴漏给父组件调用
  useImperativeHandle<any, LayoutTableModalCallType>(ref, () => ({
    // 设置保存loading
    setSavaLoading: (data) => {
      setState({
        saveLoading: data,
      })
    },
    // 表格实例对象方法
    LayoutTableListRef: () => layoutTableRef.current,
  }))

  return (
    <Modal
      width={props.width}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      forceRender
      maskClosable={false}
      footer={null}
    >
      <div className="form-solid-line card-disappear">
        <LayoutTableList
          ref={layoutTableRef}
          api={props.apiMethod}
          searchRightBtnOpen={false}
          searchFormList={props.searchFormList}
          tableColumnsList={props.tableColumnsList}
        />
      </div>
      <Row justify="center">
        <Col>
          <Button onClick={() => props.onCancel && props.onCancel()}>
            关闭
          </Button>
          <Button
            className="ml-5"
            type="primary"
            loading={state.saveLoading}
            onClick={handleConfirm}
          >
            确定
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default React.memo(forwardRef(LayoutTableModal))
