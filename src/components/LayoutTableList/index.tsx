/*
 * @Description 全局表格列表+搜索组件
 * @Author bihongbin
 * @Date 2020-07-31 09:53:54
 * @LastEditors bihongbin
 * @LastEditTime 2021-02-25 14:45:55
 */

import React, {
  useRef,
  useReducer,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import _ from 'lodash'
import { Button, Row, Col, Card, Space } from 'antd'
import { TablePaginationConfig, TableProps, ColumnType } from 'antd/es/table'
import moment from 'moment'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import Empty from '@/components/Empty'
import { AnyObjectType, PromiseAxiosResultType } from '@/typings'
import { GlobalConstant } from '@/config'
import { addSelectMenuAll } from '@/utils'
import CardHeaderButton from '@/components/CardHeaderButton'
import { SxyButton, SxyButtonIconGroup } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'

export type LayoutTableCallType = TableCallType &
  Pick<FormCallType, 'formSetValues' | 'formGetValues'> // 暴漏方法给父组件的类型
export type FormFuncCallType = FormCallType // 表单可使用的方法类型
export type FormListCallType = FormListType // 表单list数据类型

export interface CardButtonType {
  name: string
  authCode?: string
  icon?: string
  type?: 'text' | 'link' | 'ghost' | 'default' | 'primary' | 'dashed'
  clickConfirm: () => void
}

export interface SizeType {
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

interface searchFormDateTransformType {
  name: string // 需要转换的默认参数
  format?: string // 转换的格式（默认为：YYYY-MM-DD）
  transform: [string, string?] // 最终转换的参数
}
export interface LayoutTableListProp {
  api?: (data: any) => PromiseAxiosResultType // 数据来源接口
  data?: AnyObjectType[] // 列表数据
  layoutTableListAuthCode?: string // 权限码（用来控制权限按钮是否显示）
  autoGetList?: boolean // 是否开启默认查询功能
  middleEmpty?: boolean // 是否显示无数据的状态
  searchClassName?: true // 是否去掉search-form样式
  searchFormList?: FormListType[] // 搜索表单数据
  searchFormListSize?: SizeType
  // 时间类型格式转换
  searchFormDateTransform?:
    | searchFormDateTransformType
    | searchFormDateTransformType[]
  searchExtraParameters?: AnyObjectType // 查询的额外参数
  searchCallback?: (data: any) => void // 查询回调
  searchRightBtnOpen?: boolean // 是否显示头部搜索右侧刷新和筛选按钮
  leftRender?: RenderType // 左侧需要渲染的额外元素和尺寸
  topRender?: RenderType // 上方需要渲染的额外元素和尺寸
  rightRender?: RenderType // 右侧需要渲染的额外元素和尺寸
  censusTips?: React.ReactNode // 一些统计提示（或其他jsx元素）
  cardTopTitle?: React.ReactNode // 卡片标题
  cardTopButton?: CardButtonType[] | JSX.Element // 卡片头部操作按钮
  // 表格头数据和表格尺寸
  tableColumnsList: {
    rowType?: 'checkbox' | 'radio' | undefined // 是否开启表格行选中 checkbox多选 radio单选
    list: ColumnType<AnyObjectType>[] // 表格头数据
    onSelect?: (selectedRows: AnyObjectType[], selectedRowKeys: any[]) => void // 行选中回调
    tableConfig?: TableProps<any> // 自定义配置，支持antd官方表格所有参数
    size?: SizeType // 表格区域宽度
  }
  paginationConfig?: false | TablePaginationConfig // 控制分页格式
}

type ReducerType = (state: StateType, action: Action) => StateType

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

const reducer: ReducerType = (state, action) => {
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
  const [state, dispatch] = useReducer<ReducerType>(reducer, stateValue)

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
   * @Description 渲染卡片头右测内容
   * @Author bihongbin
   * @Date 2020-10-16 11:16:28
   */
  const cardTopRightRender = () => {
    if (cardTopButton && _.isArray(cardTopButton)) {
      return (
        <CardHeaderButton
          buttonList={cardTopButton}
          menuCode={props.layoutTableListAuthCode}
        />
      )
    } else {
      return cardTopButton
    }
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
        const formatTransform = (data: searchFormDateTransformType) => {
          const { name, transform, format } = data
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
          } else {
            if (transform && transform.length) {
              for (let item of transform) {
                if (item) {
                  result[item] = undefined
                }
              }
            }
          }
        }
        // 开始时间和结束时间的格式转换（对象）
        if (_.isObject(props.searchFormDateTransform)) {
          formatTransform(
            props.searchFormDateTransform as searchFormDateTransformType,
          )
        }
        // 开始时间和结束时间的格式转换（数组）
        if (_.isArray(props.searchFormDateTransform)) {
          for (let trans of props.searchFormDateTransform) {
            formatTransform(trans)
          }
        }
        // 时间格式转换
        for (let o in result) {
          const formatStr = 'YYYY-MM-DD HH:mm:ss'
          if (moment(result[o], formatStr, true).isValid()) {
            result[o] = moment(result[o]).format(formatStr)
          }
        }
        tableRef.current.getTableList(result, () => {
          if (props.searchCallback) {
            props.searchCallback(result) // 查询回调
          }
        })
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
    // 设置loading
    setTableLoading: (data) => {
      if (tableRef.current) {
        tableRef.current.setTableLoading(data)
      }
    },
    // 设置表格选中
    setRowSelected: (selectedRowKeys) => {
      if (tableRef.current) {
        tableRef.current.setRowSelected(selectedRowKeys)
      }
    },
    // 调用api获取数据
    getTableList: (values, callback) => {
      if (tableRef.current) {
        tableRef.current.getTableList(values, callback)
      }
    },
    // 获取表单值
    formGetValues: (data) => {
      if (searchForm.current) {
        return searchForm.current.formGetValues(data)
      }
      return {}
    },
    // 设置表单值
    formSetValues: (values) => {
      if (searchForm.current) {
        searchForm.current.formSetValues(values)
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
      <Row justify="space-between" gutter={16}>
        <Col span={21}>
          <div
            style={{
              display:
                searchFormList && searchFormList.length ? 'block' : 'none',
            }}
          >
            <GenerateForm
              className={!props.searchClassName ? 'search-form' : undefined}
              rowGridConfig={{ gutter: 10 }}
              colGirdConfig={props.searchFormListSize || formSearchColConfig}
              ref={searchForm}
              list={addSelectMenuAll(searchFormList)}
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
          </div>
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
      <Row gutter={16}>
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
                extra={cardTopRightRender()}
              >
                {props.censusTips && props.censusTips}
                <GenerateTable
                  ref={tableRef}
                  rowType={props.tableColumnsList.rowType}
                  apiMethod={api}
                  data={props.data}
                  columns={tableColumnsList.list}
                  onSelect={props.tableColumnsList.onSelect}
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
