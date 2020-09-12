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

export interface TypeProps {
  buttonClassName?: string // button的className
  checkType?: 'checkbox' | 'radio' // 单选和多选
  deleteOpen?: boolean // 是否打开删除功能
  data?: DataList[] // 按钮组数据
  onChange?: (data: DataList[]) => void
}

interface DataList {
  name: string
  value: string | number
  selected?: boolean
}

type ReducerType = (state: StateType, action: Action) => StateType

type Action = {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_TYPE = '[SetType Action]',
  SET_DELETE_OPEN = '[SetDeleteOpen Action]',
  SET_DATA = '[SetData Action]',
}

const stateValue = {
  type: 'checkbox' as TypeProps['checkType'], // 选择类型（单选和多选）
  deleteOpen: false, // 是否开启删除功能
  data: [] as TypeProps['data'], // 按钮数据
}

const ButtonGroup = (props: TypeProps, ref: any) => {
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

  const filterSelected = (data: DataList[]) => {
    return data.filter((item) => item.selected)
  }

  /**
   * @Description 设置按钮状态选中
   * @Author bihongbin
   * @Date 2020-08-04 11:29:36
   */
  const handleSelected = (item: DataList, index: number) => {
    let formatList = [] as DataList[]
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
      props.onChange(filterSelected(formatList))
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
        props.onChange(filterSelected(d))
      }
      dispatch({
        type: ActionType.SET_DATA,
        payload: d,
      })
    }
  }

  useEffect(() => {
    if (props.checkType) {
      dispatch({
        type: ActionType.SET_TYPE,
        payload: props.checkType,
      })
    }
  }, [props.checkType])

  useEffect(() => {
    if (props.deleteOpen) {
      dispatch({
        type: ActionType.SET_DELETE_OPEN,
        payload: props.deleteOpen,
      })
    }
  }, [props.deleteOpen])

  useEffect(() => {
    if (props.data) {
      const data = props.data.map((item) => ({
        ...item,
        selected: false,
      }))
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
  useImperativeHandle(ref, () => ({
    // 当前选中的按钮
    getButtonGroupSelected: () =>
      state.data ? state.data.filter((item) => item.selected) : [],
  }))

  return (
    <Row>
      {state.data
        ? state.data.map((item, index) => (
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
          ))
        : null}
    </Row>
  )
}

export default forwardRef(ButtonGroup)
