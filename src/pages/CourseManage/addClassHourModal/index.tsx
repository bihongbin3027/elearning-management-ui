import React, { useReducer, useRef, useEffect, useCallback } from 'react'
import { Modal, Row, Col, Button } from 'antd'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import { SxyButton } from '@/style/module/button'
import { AnyObjectType } from '@/typings'
import { getBasicQtyList, deleteBasicQtyList } from '@/api/basicData'

interface PropType {
  visible: boolean
  id?: string
  onEdit?: (data: AnyObjectType) => void
  onCancel: () => void
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_ADD_LOADING = '[SetAddLoading Action]',
  SET_TABLE_COLUMNS = '[SetTableColumns Action]',
}

const stateValue = {
  addLoading: false, // 添加课时loading
  // 表格头
  tableColumns: [],
}

const AddClassHourView = (props: PropType) => {
  const tableRef = useRef<TableCallType>()
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
      case ActionType.SET_ADD_LOADING: // 设置添加课时loading
        return {
          ...state,
          addLoading: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-08-20 17:07:59
   */
  const formSubmit = useCallback(() => {
    if (tableRef.current) {
      tableRef.current.getTableList({
        id: props.id,
      })
    }
  }, [props.id])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-08-20 17:03:11
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: [
        {
          title: '课程名称',
          dataIndex: 'qtyCname',
          render: (value: string) => (
            <SxyButton mode="dark-grey">{value}</SxyButton>
          ),
        },
        { title: '授课方式', dataIndex: 'costCategory' },
        { title: '时长', dataIndex: 'startTime' },
        { title: '试卷数量', dataIndex: 'status' },
        { title: '资料数量', dataIndex: 'status' },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 85,
          render: (value: number, record: any) => {
            const operatingData = []
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => {
                if (props.onEdit) {
                  props.onEdit(record)
                }
              },
              svg: 'table_edit.png',
            })
            // 删除
            operatingData.push({
              name: '删除',
              onClick: () => {
                if (tableRef.current) {
                  handleRowDelete(
                    [record.id],
                    deleteBasicQtyList,
                    tableRef.current.getTableList,
                  )
                }
              },
              svg: 'table_delete.png',
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [props])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-08-20 17:07:34
   */
  useEffect(() => {
    formSubmit()
  }, [formSubmit])

  return (
    <Modal
      width={900}
      visible={props.visible}
      title="添加课时"
      onCancel={props.onCancel}
      forceRender
      maskClosable={false}
      footer={null}
    >
      <GenerateTable
        ref={tableRef}
        apiMethod={getBasicQtyList}
        columns={state.tableColumns}
        tableConfig={{
          className: 'table-header-blank',
          pagination: false,
        }}
      />
      <Row className="mt-8 mb-3" justify="center">
        <Col span={4}>
          <Button type="primary" size="large" loading={state.addLoading} block>
            添加课时
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default AddClassHourView
