/*
 * @Description 动态表格组件
 * @Author bihongbin
 * @Date 2020-06-24 13:59:28
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-12 16:09:17
 */

import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react'
import _ from 'lodash'
import { Table, Form, Input } from 'antd'
import { TablePaginationConfig, TableProps, ColumnType } from 'antd/es/table'
import ResizableTitle from './ResizableTitle'
import { AnyObjectType, PromiseAxiosResultType } from '@/typings'

const EditableContext = React.createContext<any>(null)

// 导出该组件可调用的方法类型
export interface TableCallType {
  setTableLoading: (data: boolean) => void
  setRowSelected: (selectedRowKeys: string[]) => void
  getTableList: (values?: AnyObjectType, callBack?: () => void) => void
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
  apiMethod?: (data: any) => PromiseAxiosResultType // 列表请求函数
  columns: ColumnType<AnyObjectType>[] // 表格头
  data?: AnyObjectType[] // 列表数据
  onSelect?: (selectedRows: AnyObjectType[], selectedRowKeys: any[]) => void // 行选中回调
  paginationConfig?: false | TablePaginationConfig // 控制分页格式
}

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: string
  record: AnyObjectType
  handleSave: (record: AnyObjectType) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<any>()
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }
  const save = async (e: any) => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        // rules={[
        //   {
        //     required: true,
        //     message: `请输入${title}`,
        //   },
        // ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

const GenerateTable = (props: GenerateTableProp, ref: any) => {
  const { tableConfig, rowType, scroll, apiMethod, columns } = props
  const queryParameters = useRef<AnyObjectType>() // 额外查询参数
  const queryPagination = useRef<TablePaginationConfig>({
    current: 1, // 当前第几页
    total: 10, // 总共多少条
    pageSize: 10, // 每页显示多少条数据
    showSizeChanger: true, // 显示分页总数量
  })
  const [formatColumns, setFormatColumns] = useState<any[]>(columns) // 表格头
  const [listLoading, setListLoading] = useState(false) // 列表loading
  const [listData, setListData] = useState<any[]>([]) // 列表数据
  const [selectRowIds, setSelectRowIds] = useState<string[]>([]) // 表格选中行的ids
  const [selectRowArray, setSelectRowArray] = useState<AnyObjectType[]>([]) // 表格选中行的所有数组
  // 固定列
  const [scrollXY, setScrollXY] = useState<ScrollXYType>({})

  /**
   * @Description 获取表格数据 values包含{ updateSelected: false }时，不会更新复选框和单选选中的值
   * @Author bihongbin
   * @Date 2020-06-24 14:43:05
   */
  const getList = useCallback(
    async (values?: AnyObjectType) => {
      let updateSelected = true // 加载列表时，是否更新复选框和单选选中的值（默认更新）
      setListLoading(true)
      if (values) {
        if (values.updateSelected !== undefined) {
          updateSelected = values.updateSelected
          delete values.updateSelected
        }
        queryParameters.current = {
          ...queryParameters.current,
          ...values,
        }
      }
      try {
        const queryParams: AnyObjectType = {
          ...queryParameters.current,
          page: queryPagination.current.current,
          size: queryPagination.current.pageSize,
        }
        // 查询时，分页重置到第一页
        if (values && values.current) {
          queryParams.page = values.current
          queryPagination.current.current = values.current
        }
        if (apiMethod) {
          delete queryParams.current
          const result = await apiMethod(_.pickBy(queryParams, _.identity))
          queryPagination.current.total = result.data.total

          // 更新表格选中的数据id
          if (_.isArray(result.data.content)) {
            if (updateSelected) {
              let ids: string[] = []
              result.data.content.forEach((data: AnyObjectType) => {
                if (selectRowIds.length) {
                  selectRowIds.forEach((row) => {
                    if (data.id === row) {
                      ids.push(row)
                    }
                  })
                }
              })
              setSelectRowIds(ids)
            }
            setListData(result.data.content)
          }
        }
      } catch (error) {}
      setListLoading(false)
    },
    [apiMethod, selectRowIds],
  )

  /**
   * @Description 分页切换
   * @Author bihongbin
   * @Date 2020-06-24 14:05:28
   */
  const changeEstimatesList = (pagination: TablePaginationConfig) => {
    queryPagination.current = pagination
    getList({ updateSelected: false })
  }

  /**
   * @Description 行选择
   * @Author bihongbin
   * @Date 2020-06-24 15:16:07
   */
  const rowSelection = useMemo(
    () => ({
      fixed: true,
      type: rowType,
      selectedRowKeys: selectRowIds,
      onChange(selectedRowKeys: any[], selectedRows: AnyObjectType[]) {
        setSelectRowIds(selectedRowKeys)
        setSelectRowArray(selectedRows)
        props.onSelect && props.onSelect(selectedRows, selectedRowKeys)
      },
    }),
    [props, rowType, selectRowIds],
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
   * @Description 保存input数据
   * @Author bihongbin
   * @Date 2020-09-24 12:04:56
   */
  const handleSave = useCallback(
    (row: AnyObjectType) => {
      const newData = [...listData]
      const index = newData.findIndex((item) => row.id === item.id)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        ...row,
      })
      setListData(newData)
    },
    [listData],
  )

  /**
   * @Description 设置表头
   * @Author bihongbin
   * @Date 2020-07-21 09:31:16
   */
  useEffect(() => {
    let columns = props.columns
    columns = columns.map((col: AnyObjectType, index) => {
      let obj: AnyObjectType = {
        ...col,
        onHeaderCell: (column: any) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
      }
      if (col.editable) {
        obj.onCell = (record: AnyObjectType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave,
        })
      }
      return obj
    })
    setFormatColumns(columns)
  }, [handleSave, props.columns])

  /**
   * @Description 更新表格行选中的数据
   * @Author bihongbin
   * @Date 2020-10-29 17:37:10
   */
  useEffect(() => {
    let rows: AnyObjectType[] = []
    for (let item of listData) {
      for (let ids of selectRowIds) {
        if (item.id === ids) {
          rows.push(item)
        }
      }
    }
    setSelectRowArray(rows)
  }, [listData, selectRowIds])

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
    // 设置loading
    setTableLoading: (data) => {
      setListLoading(data)
    },
    // 设置表格选中行
    setRowSelected: (selectedRowKeys) => {
      setSelectRowIds(selectedRowKeys)
    },
    // 调用接口获取表格数据
    getTableList: (values, callback) => {
      // 重置分页
      if (values) {
        values.current = 1
      }
      getList(values)
      // 查询回调
      if (callback) {
        callback()
      }
    },
    // 表格选中ids
    getSelectIds: () => selectRowIds,
    // 表格选中的所有数组
    getSelectRowsArray: () => selectRowArray,
    // 获取表格所有行数据
    getStaticDataList: () => listData,
  }))

  return (
    <>
      <Table
        rowKey="id"
        rowClassName={() => 'editable-row'}
        loading={listLoading}
        components={{
          header: {
            cell: ResizableTitle,
          },
          body: {
            row: EditableRow,
            cell: EditableCell,
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

export default forwardRef(GenerateTable)
