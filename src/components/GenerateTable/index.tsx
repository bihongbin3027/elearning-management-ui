/*
 * @Description 动态表格组件
 * @Author bihongbin
 * @Date 2020-06-24 13:59:28
 * @LastEditors bihongbin
 * @LastEditTime 2020-09-11 14:54:26
 */

import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import _ from 'lodash'
import { Table } from 'antd'
import { TablePaginationConfig, TableProps } from 'antd/es/table'
import ResizableTitle from './ResizableTitle'
import { GlobalConstant } from '@/config'
import { AnyObjectType, AjaxResultType } from '@/typings'

const { paginationOptions } = GlobalConstant

// 导出该组件可调用的方法类型
export interface TableCallType {
  getTableList: (values?: AnyObjectType) => void
  getSelectIds: () => string[]
  getSelectRowsArray: () => AnyObjectType[]
  getStaticDataList: () => AnyObjectType[]
}

type ScrollXYType = {
  x?: number | true
  y?: number
}

// 组件传参配置
interface GenerateTableProp {
  tableConfig?: TableProps<any> // 支持antd Table组件官方传参所有类型
  rowType?: 'checkbox' | 'radio' | undefined // 是否开启表格行选中 checkbox多选 radio单选
  scroll?: ScrollXYType // 开启固定列参数
  apiMethod?: (data: any) => Promise<AjaxResultType> // 列表请求函数
  columns: AnyObjectType[] // 表格头
  data?: AnyObjectType[] // 列表数据
  onSelect?: (data: AnyObjectType[]) => void // 行选中回调
  paginationConfig?: false | TablePaginationConfig // 控制分页格式
}

const GenerateTable = (props: GenerateTableProp, ref: any) => {
  const { tableConfig, rowType, scroll, apiMethod, columns } = props
  const queryParameters = useRef<AnyObjectType>() // 额外查询参数
  const queryPagination = useRef<TablePaginationConfig>(paginationOptions) // 分页参数
  const [formatColumns, setFormatColumns] = useState<any[]>(columns) // 表格头
  const [listLoading, setListLoading] = useState(false) // 列表loading
  const [listData, setListData] = useState<any[]>([]) // 列表数据
  const [selectRowIds, setSelectRowIds] = useState<string[]>([]) // 表格选中行的ids
  const [selectRowArray, setSelectRowArray] = useState<AnyObjectType[]>([]) // 表格选中行的所有数组
  // 固定列
  const [scrollXY, setScrollXY] = useState<ScrollXYType>({})

  /**
   * @Description 获取表格数据
   * @Author bihongbin
   * @Date 2020-06-24 14:43:05
   */
  const getList = useCallback(
    async (values?: AnyObjectType) => {
      setListLoading(true)
      if (values) {
        queryParameters.current = {
          ...queryParameters.current,
          ...values,
        }
      }
      try {
        const page: AnyObjectType = {
          ...queryParameters.current,
          page: queryPagination.current.current,
          size: queryPagination.current.pageSize,
        }
        if (apiMethod) {
          const result = await apiMethod(_.pickBy(page, _.identity))
          queryPagination.current.total = result.total
          setListData(result.data)
        }
      } catch (error) {}
      setListLoading(false)
    },
    [apiMethod],
  )

  /**
   * @Description 分页切换
   * @Author bihongbin
   * @Date 2020-06-24 14:05:28
   */
  const changeEstimatesList = (pagination: TablePaginationConfig) => {
    queryPagination.current = pagination
    getList()
  }

  /**
   * @Description 行选择
   * @Author bihongbin
   * @Date 2020-06-24 15:16:07
   */
  const rowSelection = useMemo(
    () => ({
      type: rowType,
      onChange(selectedRowKeys: any[], selectedRows: AnyObjectType[]) {
        setSelectRowIds(selectedRowKeys)
        setSelectRowArray(selectedRows)
        props.onSelect && props.onSelect(selectedRows)
      },
    }),
    [props, rowType],
  )

  /**
   * @Description 表头拖动重置宽度
   * @Author bihongbin
   * @Date 2020-07-21 10:36:35
   */
  const handleResize = (index: number) => (e: any, { size }: any) => {
    setFormatColumns((prev) => {
      const nextColumns = [...prev]
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      }
      return nextColumns
    })
  }

  /**
   * @Description 固定列
   * @Author bihongbin
   * @Date 2020-06-28 10:33:20
   */
  useEffect(() => {
    if (scroll?.x || scroll?.y) {
      setScrollXY((prev) => ({ ...prev, ...scroll }))
    } else {
      setScrollXY({ x: undefined, y: undefined })
    }
  }, [listData, scroll])

  // 暴漏给父组件调用
  useImperativeHandle<any, TableCallType>(ref, () => ({
    // 调用接口获取表格数据
    getTableList: (values) => getList(values),
    // 表格选中ids
    getSelectIds: () => selectRowIds,
    // 表格选中的所有数组
    getSelectRowsArray: () => selectRowArray,
    // 获取表格所有行数据
    getStaticDataList: () => listData,
  }))

  /**
   * @Description 设置表头
   * @Author bihongbin
   * @Date 2020-07-21 09:31:16
   */
  useEffect(() => {
    let columns = props.columns
    columns = columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column: any) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    }))
    setFormatColumns(columns)
  }, [props.columns])

  /**
   * @Description 设置静态表格数据
   * @Author bihongbin
   * @Date 2020-07-13 09:16:45
   */
  useEffect(() => {
    if (_.isArray(props.data)) {
      setListData(props.data)
    }
  }, [props.data])

  return (
    <>
      <Table
        rowKey="id"
        loading={listLoading}
        components={{
          header: {
            cell: ResizableTitle,
          },
        }}
        columns={formatColumns}
        dataSource={listData}
        rowSelection={rowType ? rowSelection : undefined}
        pagination={
          _.isFunction(props.apiMethod)
            ? {
                position: ['bottomCenter'],
                showTotal: (total) => `共${total}条`,
                showSizeChanger: true,
                ...queryPagination.current,
                ...props.paginationConfig,
              }
            : false
        }
        onChange={changeEstimatesList}
        scroll={scrollXY}
        {...tableConfig}
      />
    </>
  )
}

export default React.memo(forwardRef(GenerateTable))
