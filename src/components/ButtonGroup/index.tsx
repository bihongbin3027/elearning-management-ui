/**
 * @Description 按钮组选中组件
 * @Author bihongbin
 * @Date 2020-08-04 11:12:24
 */
import React, {
  useReducer,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Row } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { SxyButton } from '@/style/module/button'
import {
  ButtonGroupTypeProps,
  ButtonGroupListType,
  ButtonGroupCallType,
} from '@/components/ButtonGroup/interface'

type ReducerType = (state: StateType, action: Action) => StateType

type Action = {
  type: ActionType
  payload: any
}

interface StateType {
  type: ButtonGroupTypeProps['checkType']
  deleteOpen: boolean
  data: ButtonGroupTypeProps['data']
}

enum ActionType {
  SET_TYPE = '[SetType Action]',
  SET_DELETE_OPEN = '[SetDeleteOpen Action]',
  SET_DATA = '[SetData Action]',
}

const stateValue: StateType = {
  type: 'checkbox', // 选择类型（单选和多选）
  deleteOpen: false, // 是否开启删除功能
  data: [], // 按钮数据
}

const ButtonGroup = (props: ButtonGroupTypeProps, ref: any) => {
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_TYPE: // 设置类型
        return {
          ...state,
          type: action.payload,
        }
      case ActionType.SET_DELETE_OPEN: // 设置是否打开删除功能
        return {
          ...state,
          deleteOpen: action.payload,
        }
      case ActionType.SET_DATA: // 设置按钮数据
        return {
          ...state,
          data: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 设置按钮状态选中
   * @Author bihongbin
   * @Date 2020-08-04 11:29:36
   */
  const handleSelected = (item: ButtonGroupListType, index: number) => {
    let formatList = [] as ButtonGroupListType[]
    // 当打开删除功能的时候，不能进行单选和多选
    if (props.deleteOpen) {
      return
    }
    if (state.data) {
      // 多选
      if (state.type === 'checkbox') {
        state.data[index].selected = !item.selected
        formatList = state.data
      }
      // 单选
      if (state.type === 'radio') {
        formatList = state.data.map((t, i) => {
          let bool = false
          if (index === i) {
            bool = !item.selected
          }
          return {
            ...t,
            selected: bool,
          }
        })
      }
    }
    if (props.onChange) {
      props.onChange(formatList)
    }
    dispatch({
      type: ActionType.SET_DATA,
      payload: formatList,
    })
  }

  /**
   * @Description 删除
   * @Author bihongbin
   * @Date 2020-08-04 14:15:37
   */
  const handleDelete = (index: number) => {
    if (state.data) {
      const d = state.data.filter((m, i) => index !== i)
      if (props.onChange) {
        props.onChange(d)
      }
      dispatch({
        type: ActionType.SET_DATA,
        payload: d,
      })
    }
  }

  /**
   * @Description 设置单选和多选
   * @Author bihongbin
   * @Date 2020-10-19 10:32:39
   */
  useEffect(() => {
    if (props.checkType) {
      dispatch({
        type: ActionType.SET_TYPE,
        payload: props.checkType,
      })
    }
  }, [props.checkType])

  /**
   * @Description 是否打开删除功能
   * @Author bihongbin
   * @Date 2020-10-19 10:32:50
   */
  useEffect(() => {
    if (props.deleteOpen) {
      dispatch({
        type: ActionType.SET_DELETE_OPEN,
        payload: props.deleteOpen,
      })
    }
  }, [props.deleteOpen])

  /**
   * @Description 设置按钮默认的selected
   * @Author bihongbin
   * @Date 2020-10-19 10:23:56
   */
  useEffect(() => {
    if (props.data) {
      const data = props.data.map((item) => {
        if (item.selected === undefined) {
          item.selected = false
        }
        return item
      })
      dispatch({
        type: ActionType.SET_DATA,
        payload: data,
      })
    }
  }, [props.data])

  /**
   * @Description 暴漏方法给父组件调用
   * @Author bihongbin
   * @Date 2020-08-04 11:51:33
   */
  useImperativeHandle<any, ButtonGroupCallType>(ref, () => ({
    // 当前选中的按钮
    getButtonGroupSelected: () => state.data.filter((item) => item.selected),
  }))

  return (
    <Row>
      {state.data.map((item, index) => (
        <span className={`position ${props.buttonClassName}`} key={index}>
          <SxyButton
            mode={item.selected ? 'primary' : 'dust'}
            border={false}
            onClick={() => handleSelected(item, index)}
          >
            {item.name}
            {state.deleteOpen ? (
              <CloseOutlined
                onClick={() => handleDelete(index)}
                className="sxy-button-close"
              />
            ) : null}
          </SxyButton>
        </span>
      ))}
    </Row>
  )
}

export default forwardRef(ButtonGroup)
