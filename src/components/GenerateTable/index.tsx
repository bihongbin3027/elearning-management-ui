/*
 * @Description 动态表格组件
 * @Author bihongbin
 * @Date 2020-06-24 13:59:28
 * @LastEditors bihongbin
 * @LastEditTime 2021-01-28 17:44:40
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
import { v4 as uuidV4 } from 'uuid'
import moment from 'moment'
import { Table, Form, Input, Select, DatePicker, Spin } from 'antd'
import { TablePaginationConfig, TableProps, ColumnType } from 'antd/es/table'
import { Rule } from 'rc-field-form/lib/interface'
import ResizableTitle from './ResizableTitle'
import { SelectType, AnyObjectType, PromiseAxiosResultType } from '@/typings'

const { Option } = Select
const EditableContext = React.createContext<any>(null)

type remoteValueType = string | undefined
type remotePromiseType = (value: remoteValueType) => Promise<SelectType[]>

// 导出表格头类型
export type TableColumns<T = AnyObjectType> = ColumnType<T> &
  Partial<EditableColumnsType>

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
  x?: string | number | true | undefined
  y?: string | number | undefined
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
  getCheckboxProps?: (record: AnyObjectType) => AnyObjectType // 选择框的默认属性配置
}

interface EditableColumnsType {
  editable: boolean
  inputType: 'number'
  valueType: 'Select' | 'DatePicker' | 'RemoteSearch' // 单元格表单类型
  valueEnum: SelectType[]
  formChange: (record: AnyObjectType) => AnyObjectType // 表单值改变触发
  remoteConfig: {
    remoteApi: remotePromiseType // 远程搜索的api
    remoteMode?: 'multiple' | 'tags' // 远程搜索模式为多选或标签
  }
  formItemProps: {
    rules: Rule[]
  }
}

type EditableCellProps = {
  title: React.ReactNode
  children: React.ReactNode
  dataIndex: string
  record: AnyObjectType
  handleSave: (record: AnyObjectType) => void
} & EditableColumnsType

const EditableRow: React.FC = (props, func) => {
  const [form] = Form.useForm()
  const [uuId] = useState(uuidV4())

  return (
    <Form name={uuId} form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  inputType,
  valueType,
  valueEnum,
  formChange,
  remoteConfig,
  formItemProps,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const inputRef = useRef<any>()
  const form = useContext(EditableContext)
  // 远程搜索loading
  const [remoteFetching, setRemoteFetching] = useState(false)
  // 远程搜索数据结果
  const [remoteData, setRemoteData] = useState<{ [key: string]: SelectType[] }>(
    {},
  )

  /**
   * @Description 远程数据搜索
   * @Author bihongbin
   * @Date 2021-01-05 11:14:45
   */
  const fetchRemote = (
    value: remoteValueType,
    fieldName: string | undefined,
    remoteApi?: remotePromiseType,
  ) => {
    if (remoteApi) {
      setRemoteFetching(true)
      remoteApi(value).then((res) => {
        setRemoteFetching(false)
        if (fieldName) {
          setRemoteData({
            [fieldName]: res,
          })
        }
      })
    }
  }

  // 如果是表单表格项，初始化数据赋值
  if (editable) {
    let val = record[dataIndex]
    // 如果是时间类型，转换
    if (moment(val, 'YYYY-MM-DD', true).isValid()) {
      val = moment(val)
    }
    setTimeout(() => {
      form.setFieldsValue({
        [dataIndex]: val,
      })
    })
  }

  // 显示不同类型的表单
  const filterFormType = (
    type: EditableCellProps['valueType'],
    title: string,
  ) => {
    let node = null
    switch (type) {
      case 'Select':
        node = (
          <Select ref={inputRef} onSelect={save} placeholder={title}>
            {_.isArray(valueEnum)
              ? valueEnum.map((m, i) => (
                  <Option key={i} value={m.value}>
                    {m.label}
                  </Option>
                ))
              : null}
          </Select>
        )
        break
      case 'DatePicker':
        node = <DatePicker ref={inputRef} onChange={save} placeholder={title} />
        break
      case 'RemoteSearch':
        node = (
          <Select
            mode={remoteConfig.remoteMode}
            placeholder={title}
            notFoundContent={remoteFetching ? <Spin size="small" /> : null}
            filterOption={false}
            allowClear
            showSearch
            // 当获取焦点查询全部
            onFocus={() =>
              fetchRemote(undefined, dataIndex, remoteConfig.remoteApi)
            }
            onSearch={(value) =>
              fetchRemote(value, dataIndex, remoteConfig.remoteApi)
            }
          >
            {dataIndex && remoteData[dataIndex]
              ? remoteData[dataIndex].map((s: SelectType, k) => (
                  <Option value={s.value} key={k}>
                    {s.label}
                  </Option>
                ))
              : null}
          </Select>
        )
        break
      default:
        node = (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            placeholder={title}
            type={inputType ? inputType : 'text'}
          />
        )
        break
    }
    return node
  }

  // 更新值到record
  const save = async () => {
    try {
      const values = await form.validateFields()
      let data = { ...record, ...values }
      for (let i in data) {
        // 如果是时间类型，转换
        if (moment.isMoment(data[i])) {
          data[i] = moment(data[i]).format('YYYY-MM-DD')
        }
      }
      if (formChange) {
        data = formChange(data) // 单元格值改变触发
      }
      handleSave(data)
    } catch (errInfo) {
      console.log('保存表单字段失败:', errInfo)
    }
  }

  let childNode = children
  if (editable) {
    childNode = (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={formItemProps ? formItemProps.rules : undefined}
      >
        {filterFormType(valueType, title as string)}
      </Form.Item>
    )
  }

  return (
    <td {...restProps} title={title as string}>
      {childNode}
    </td>
  )
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
  // 表格横向纵向滚动条
  const [scrollXY, setScrollXY] = useState<ScrollXYType>({
    x: 'max-content',
    y: 500,
  })

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
              let rowIds: string[] = []
              // 递归
              const deepTable = (list: AnyObjectType[]) => {
                if (selectRowIds.length) {
                  for (let item of list) {
                    for (let ids of selectRowIds) {
                      if (tableConfig && tableConfig.rowKey) {
                        if (typeof tableConfig.rowKey === 'string') {
                          if (item[tableConfig.rowKey] === ids) {
                            rowIds.push(ids)
                          }
                        }
                      } else {
                        if (item.id === ids) {
                          rowIds.push(ids)
                        }
                      }
                    }
                    if (item.children) {
                      deepTable(item.children)
                    }
                  }
                }
              }
              deepTable(result.data.content)
              setSelectRowIds(rowIds)
            }
            setListData(result.data.content)
          }
        }
      } catch (error) {}
      setListLoading(false)
    },
    [apiMethod, selectRowIds, tableConfig],
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
      getCheckboxProps: props.getCheckboxProps,
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
          inputType: col.inputType,
          valueType: col.valueType,
          valueEnum: col.valueEnum,
          formChange: col.formChange,
          remoteConfig: col.remoteConfig,
          formItemProps: col.formItemProps,
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
    // 递归
    const deepTable = (list: AnyObjectType[]) => {
      for (let item of list) {
        for (let ids of selectRowIds) {
          if (tableConfig && tableConfig.rowKey) {
            if (typeof tableConfig.rowKey === 'string') {
              if (item[tableConfig.rowKey] === ids) {
                rows.push(item)
              }
            }
          } else {
            if (item.id === ids) {
              rows.push(item)
            }
          }
        }
        if (item.children) {
          deepTable(item.children)
        }
      }
    }
    deepTable(listData)
    setSelectRowArray(rows)
  }, [listData, selectRowIds, tableConfig])

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
    getTableList: async (values, callback) => {
      // 重置分页
      if (values) {
        values.current = 1
      }
      await getList(values)
      // 查询回调
      if (callback) {
        callback()
      }
    },
    // 表格选中的id
    getSelectIds: () =>
      selectRowArray.map((item) => {
        if (tableConfig && tableConfig.rowKey) {
          if (typeof tableConfig.rowKey === 'string') {
            return item[tableConfig.rowKey]
          } else {
            return undefined
          }
        } else {
          return item.id
        }
      }),
    // 表格选中的数组对象
    getSelectRowsArray: () => selectRowArray,
    // 获取表格所有数据
    getStaticDataList: () => listData,
  }))

  return (
    <>
      <Table
        rowKey="id"
        rowClassName={() => 'editable-row'}
        loading={listLoading}
        bordered
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
                size: 'small',
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
