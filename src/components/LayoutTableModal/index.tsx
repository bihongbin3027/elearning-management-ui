/*
 * @Description 弹窗表格组件
 * @Author bihongbin
 * @Date 2020-08-07 11:55:09
 * @LastEditors bihongbin
 * @LastEditTime 2020-10-29 17:22:49
 */

import React, {
  useRef,
  useEffect,
  useReducer,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Modal, Row, Col, Button, message } from 'antd'
import { TableProps, ColumnType } from 'antd/es/table'
import { AnyObjectType, PromiseAxiosResultType } from '@/typings'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'

export interface LayoutTableModalCallType {
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
  apiMethod: (data: any) => PromiseAxiosResultType // 列表请求函数
  onCancel?: () => void // 取消或关闭弹窗
  onConfirm?: (data: AnyObjectType[]) => Promise<boolean> // 确定弹窗操作
}

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
}

const stateValue = {
  loading: false, // loading
  saveLoading: false, // 保存按钮loading
}

const LayoutTableModal = (props: LayoutTableModalPropType, ref: any) => {
  const layoutTableRef = useRef<LayoutTableCallType>()
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
      default:
        return state
    }
  }, stateValue)

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
      dispatch({
        type: ActionType.SET_SAVE_LOADING,
        payload: true,
      })
      props
        .onConfirm(data)
        .then((res) => {
          dispatch({
            type: ActionType.SET_SAVE_LOADING,
            payload: false,
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
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-10-29 17:17:51
   */
  useEffect(() => {
    if (props.visible && layoutTableRef.current) {
      layoutTableRef.current.getTableList({
        updateSelected: false,
      })
    }
  }, [props.visible])

  // 暴漏给父组件调用
  useImperativeHandle<any, LayoutTableModalCallType>(ref, () => ({
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
          autoGetList
          tableColumnsList={props.tableColumnsList}
        />
      </div>
      <Row className="mt-5 mb-5" justify="center">
        <Col>
          <Button
            className="font-14"
            size="large"
            onClick={() => props.onCancel && props.onCancel()}
          >
            取消
          </Button>
          <Button
            className="font-14 ml-5"
            size="large"
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

export default forwardRef(LayoutTableModal)
