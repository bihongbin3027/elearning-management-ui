/*
 * @Description 全局表格列表+搜索组件
 * @Author bihongbin
 * @Date 2020-07-31 09:53:54
 * @LastEditors bihongbin
 * @LastEditTime 2020-09-11 15:23:57
 */

import React, {
  useRef,
  useReducer,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Button, Divider, Row, Col, Card, Space } from 'antd'
import { TablePaginationConfig, TableProps } from 'antd/es/table'
import moment from 'moment'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import Empty from '@/components/Empty'
import { AnyObjectType, AjaxResultType } from '@/typings'
import { GlobalConstant } from '@/config'
import { SxyButton, SxyButtonIconGroup } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'

export type LayoutTableCallType = TableCallType // 暴漏方法给父组件的类型
export type FormFuncCallType = FormCallType // 表单可使用的方法类型
export type FormListCallType = FormListType // 表单list数据类型

type ReducerType = (state: StateType, action: Action) => StateType
export interface CardButtonType {
  name: string
  icon?: string
  type?:
    | 'text'
    | 'link'
    | 'ghost'
    | 'default'
    | 'primary'
    | 'dashed'
    | undefined
  clickConfirm: () => void
}

interface SizeType {
  xs?: number // 屏幕 < 576px 响应式栅格
  sm?: number // 屏幕 ≥ 576px 响应式栅格
  md?: number // 屏幕 ≥ 768px 响应式栅格
  lg?: number // 屏幕 ≥ 992px 响应式栅格
  xl?: number // 屏幕 ≥ 1200px 响应式栅格
  xxl?: number // 屏幕 ≥ 1600px 响应式栅格
}

interface RenderType {
  jsx: JSX.Element
  size?: SizeType
}

export interface LayoutTableListProp {
  api?: (data: any) => Promise<AjaxResultType> // 数据来源接口
  autoGetList?: boolean // 是否开启默认查询功能
  middleEmpty?: boolean // 是否显示无数据的状态
  searchFormList?: FormListType[] // 搜索表单数据
  // 时间类型格式转换
  searchFormDateTransform?: {
    name: string // 需要转换的默认参数
    format?: string // 转换的格式（默认为：YYYY-MM-DD）
    transform: [string, string?] // 最终转换的参数
  }
  searchExtraParameters?: AnyObjectType // 查询的额外参数
  searchCallback?: (data: any) => void // 查询回调
  searchRightBtnOpen?: boolean // 是否显示头部搜索右侧刷新和筛选按钮
  leftRender?: RenderType // 左侧需要渲染的额外元素和尺寸
  topRender?: RenderType // 上方需要渲染的额外元素和尺寸
  rightRender?: RenderType // 右侧需要渲染的额外元素和尺寸
  censusTips?: React.ReactNode // 一些统计提示
  cardTopTitle?: React.ReactNode // 卡片标题
  cardTopButton?: CardButtonType[] // 卡片头部操作按钮
  // 表格头数据和表格尺寸
  tableColumnsList: {
    rowType?: 'checkbox' | 'radio' | undefined // 是否开启表格行选中 checkbox多选 radio单选
    list: AnyObjectType[] // 表格头数据
    tableConfig?: TableProps<any> // 自定义配置，支持antd官方表格所有参数
    size?: SizeType // 表格区域宽度
  }
  paginationConfig?: false | TablePaginationConfig // 控制分页格式
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_TABLE_WIDTH = '[SetTableWidth Action]',
  SET_SEARCH_RIGHT_BTN_OPEN = '[SetSearchRightBtnOpen]',
  SET_AUTO_GET_LIST = '[SetAutoGetList Action]',
}

const stateValue = {
  autoGetList: false, // 是否开启默认查询功能
  searchRightBtnOpen: true, // 是否显示头部搜索右侧刷新和筛选按钮
  // 表格区域宽度
  tableWidth: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
    xxl: 24,
  },
}

const LayoutTableList = (props: LayoutTableListProp, ref: any) => {
  const { formSearchColConfig } = GlobalConstant
  const {
    api,
    searchFormList,
    leftRender,
    topRender,
    rightRender,
    cardTopTitle,
    cardTopButton,
    tableColumnsList,
  } = props
  const searchForm = useRef<FormCallType>(null)
  const tableRef = useRef<TableCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_AUTO_GET_LIST: // 设置是否开启默认查询功能
        return {
          ...state,
          autoGetList: action.payload,
        }
      case ActionType.SET_SEARCH_RIGHT_BTN_OPEN: // 设置是否显示头部搜索右侧刷新和筛选按钮
        return {
          ...state,
          searchRightBtnOpen: action.payload,
        }
      case ActionType.SET_TABLE_WIDTH: // 设置表格的宽度
        return {
          ...state,
          tableWidth: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  /**
   *
   * @Description 重置
   * @Author bihongbin
   * @Date 2020-07-31 10:27:40
   */
  const formReset = () => {
    if (searchForm.current) {
      searchForm.current.formReset()
    }
    formSubmit()
  }

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-07-31 10:24:34
   */
  const formSubmit = useCallback(async () => {
    if (searchForm.current && tableRef.current) {
      let result = await searchForm.current.formSubmit()
      if (result) {
        // 组装查询的额外参数（searchExtraParameters从父组件传入）
        result = {
          ...result,
          ...props.searchExtraParameters,
        }
        // 开始时间和结束时间的格式转换
        if (props.searchFormDateTransform) {
          const { name, transform, format } = props.searchFormDateTransform
          if (result[name]) {
            const formatStr = format ? format : 'YYYY-MM-DD'
            let startTime = moment(result[name][0]).format(formatStr)
            let endTime = moment(result[name][1]).format(formatStr)
            if (transform.length) {
              delete result[name]
              if (transform.length === 1) {
                result[transform[0]] = `${startTime}-${endTime}`
              }
              if (transform[1]) {
                result[transform[0]] = startTime
                result[transform[1]] = endTime
              }
            }
          }
        }
        if (props.searchCallback) {
          props.searchCallback(result) // 查询回调
        }
        tableRef.current.getTableList(result)
      }
    }
  }, [props])

  /**
   * @Description 父组件有传表格显示尺寸，应用该尺寸
   * @Author bihongbin
   * @Date 2020-07-31 14:05:33
   */
  useEffect(() => {
    if (props.tableColumnsList.size) {
      dispatch({
        type: ActionType.SET_TABLE_WIDTH,
        payload: props.tableColumnsList.size,
      })
    }
  }, [props.tableColumnsList.size])

  /**
   * @Description 开启默认查询功能
   * @Author bihongbin
   * @Date 2020-08-05 14:09:53
   */
  useEffect(() => {
    if (props.autoGetList) {
      dispatch({
        type: ActionType.SET_AUTO_GET_LIST,
        payload: props.autoGetList,
      })
    }
  }, [props.autoGetList])

  /**
   * @Description 设置头部搜索右侧刷新和筛选按钮不显示
   * @Author bihongbin
   * @Date 2020-08-20 15:17:55
   */
  useEffect(() => {
    if (props.searchRightBtnOpen === false) {
      dispatch({
        type: ActionType.SET_SEARCH_RIGHT_BTN_OPEN,
        payload: props.searchRightBtnOpen,
      })
    }
  }, [props.searchRightBtnOpen])

  /**
   * @Description 初始查询
   * @Author bihongbin
   * @Date 2020-07-31 14:06:06
   */
  useEffect(() => {
    if (tableRef.current && state.autoGetList) {
      tableRef.current.getTableList()
    }
  }, [state.autoGetList])

  /**
   * @Description 暴漏给父组件调用
   * @Author bihongbin
   * @Date 2020-07-31 14:49:18
   */
  useImperativeHandle<any, LayoutTableCallType>(ref, () => ({
    // 调用api获取数据
    getTableList: (values) => {
      if (tableRef.current) {
        tableRef.current.getTableList(values)
      }
    },
    // 表格选中ids
    getSelectIds: () => {
      if (tableRef.current) {
        return tableRef.current.getSelectIds()
      }
      return []
    },
    // 表格选中的所有数组
    getSelectRowsArray: () => {
      if (tableRef.current) {
        return tableRef.current.getSelectRowsArray()
      }
      return []
    },
    // 获取表格所有行数据
    getStaticDataList: () => {
      if (tableRef.current) {
        return tableRef.current.getStaticDataList()
      }
      return []
    },
  }))

  return (
    <>
      <Row justify="space-between" gutter={20}>
        <Col span={21}>
          {searchFormList && searchFormList.length ? (
            <GenerateForm
              className="search-form"
              rowGridConfig={{ gutter: 10 }}
              colGirdConfig={formSearchColConfig}
              ref={searchForm}
              list={searchFormList}
              render={() => {
                if (searchFormList && searchFormList.length) {
                  return (
                    <Space size={10}>
                      <Button type="primary" onClick={formSubmit}>
                        查询
                      </Button>
                      <Button className="btn-reset" onClick={formReset}>
                        重置
                      </Button>
                    </Space>
                  )
                }
                return <></>
              }}
            />
          ) : null}
        </Col>
        {state.searchRightBtnOpen ? (
          <Col>
            <SxyButtonIconGroup>
              <SxyButton
                mode="dust"
                border={false}
                title="刷新"
                onClick={formSubmit}
              >
                <SxyIcon width={12} height={12} name="search_form_reset.png" />
              </SxyButton>
              <SxyButton mode="dust" border={false} title="筛选">
                <SxyIcon width={12} height={12} name="search_form_screen.png" />
              </SxyButton>
            </SxyButtonIconGroup>
          </Col>
        ) : null}
      </Row>
      <Row gutter={20}>
        {leftRender ? <Col {...leftRender.size}>{leftRender.jsx}</Col> : null}
        <Col {...state.tableWidth}>
          {props.middleEmpty ? (
            <Card>
              <Empty />
            </Card>
          ) : (
            <>
              {topRender ? topRender.jsx : null}
              <Card
                className={`table-card ${!cardTopTitle && 'card-header-none'}`}
                title={cardTopTitle}
                extra={
                  <Space size={0}>
                    {cardTopButton && cardTopButton.length
                      ? cardTopButton.map((item, index) => (
                          <div key={index}>
                            <Button
                              className="btn-text-icon"
                              onClick={item.clickConfirm}
                              type={item.type ? item.type : 'text'}
                            >
                              {item.icon ? (
                                <SxyIcon
                                  width={16}
                                  height={16}
                                  name={item.icon}
                                />
                              ) : null}
                              {item.name}
                            </Button>
                            {cardTopButton.length > 1 &&
                            index < cardTopButton.length - 1 ? (
                              <Divider type="vertical" />
                            ) : null}
                          </div>
                        ))
                      : null}
                  </Space>
                }
              >
                {props.censusTips && props.censusTips}
                <GenerateTable
                  ref={tableRef}
                  rowType={props.tableColumnsList.rowType}
                  apiMethod={api}
                  columns={tableColumnsList.list}
                  paginationConfig={props.paginationConfig}
                  tableConfig={tableColumnsList.tableConfig}
                />
              </Card>
            </>
          )}
        </Col>
        {rightRender ? (
          <Col {...rightRender.size}>{rightRender.jsx}</Col>
        ) : null}
      </Row>
    </>
  )
}

export default React.memo(forwardRef(LayoutTableList))
