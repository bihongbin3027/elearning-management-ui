import React, { useReducer, useEffect, useCallback } from 'react'
import { Modal, Row, Col, Button, Tag, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import GenerateTable from '@/components/GenerateTable'
import { handleRowDelete } from '@/utils'
import { SxyIcon } from '@/style/module/icon'
import { SxyButton } from '@/style/module/button'
import { AnyObjectType } from '@/typings'
import NameModificationModal from '@/pages/CourseCenter/nameModificationModal'
import { deleteBasicQtyList } from '@/api/basicData'

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
  SET_TABLE_DATA = '[SetTableData Action]',
  SET_MODIFY_NAME_MODAL = '[SetModifyNameModal Action]',
}

const stateValue = {
  addLoading: false, // 添加课时loading
  // 表格头
  tableColumns: [],
  // 表格数据
  tableData: [],
  // 修改名称弹窗
  modifyNameModal: {
    visible: false,
    id: '',
    title: '',
  },
}

const AddChapterView = (props: PropType) => {
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
      case ActionType.SET_TABLE_DATA: // 设置表格数据
        return {
          ...state,
          tableData: action.payload,
        }
      case ActionType.SET_MODIFY_NAME_MODAL: // 设置修改名称弹窗数据
        return {
          ...state,
          modifyNameModal: {
            ...state.modifyNameModal,
            ...action.payload,
          },
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 设置修改名称弹窗数据
   * @Author bihongbin
   * @Date 2020-08-21 17:23:42
   */
  const handleModifyNameState = (
    data: Partial<StateType['modifyNameModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_MODIFY_NAME_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-08-20 17:07:59
   */
  const formSubmit = useCallback(() => {
    dispatch({
      type: ActionType.SET_TABLE_DATA,
      payload: [
        {
          id: 1,
          name: '课程章名称一',
          mode: '',
          duration: '',
          testPaper: '',
          means: '',
          status: 1,
          children: [
            {
              id: 11,
              name: '课程节名称1',
              mode: '',
              duration: '',
              testPaper: '',
              means: '',
              status: 2,
              children: [
                {
                  id: 21,
                  name: '课程课时名称1',
                  mode: '现场授课',
                  duration: '00:45:00',
                  testPaper: '0套',
                  means: '0套',
                  status: 3,
                },
              ],
            },
          ],
        },
      ],
    })
  }, [])

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
          dataIndex: 'name',
          width: 215,
          render: (value: string, record: any) => {
            return record.status === 3 ? (
              <SxyButton className="ml-2" mode="dark-grey">
                {value}
              </SxyButton>
            ) : (
              <span
                className="text-icon-hover pointer align-middle ml-2"
                title="点击修改"
                onClick={() => {
                  handleModifyNameState({
                    visible: true,
                    id: record.id,
                    title: record.status === 1 ? '章节名称' : '课程名称',
                  })
                }}
              >
                {value}
                <EditOutlined className="ml-2" />
              </span>
            )
          },
        },
        { title: '授课方式', dataIndex: 'mode' },
        { title: '时长', dataIndex: 'duration' },
        { title: '试卷数量', dataIndex: 'testPaper' },
        { title: '资料数量', dataIndex: 'means' },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 115,
          align: 'right',
          render: (value: number, record: any) => {
            const operatingData = []
            // 章节
            if (value === 1) {
              operatingData.push(
                <Tooltip title="添加节" key={`${record.id}-1`}>
                  <Tag className="pointer tag-blue mr-3">添加节</Tag>
                </Tooltip>,
              )
            }
            // 课程
            if (value === 2) {
              operatingData.push(
                <Tooltip title="添加课程" key={`${record.id}-2`}>
                  <SxyIcon
                    width={20}
                    height={20}
                    name="round_add.png"
                    className="pointer mr-3"
                  />
                </Tooltip>,
              )
            }
            // 课时
            if (value === 3) {
              operatingData.push(
                <Tooltip title="编辑课时" key={`${record.id}-3`}>
                  <SxyIcon
                    width={20}
                    height={20}
                    name="round_edit.png"
                    className="pointer mr-3"
                    onClick={() => {
                      if (props.onEdit) {
                        props.onEdit(record)
                      }
                    }}
                  />
                </Tooltip>,
              )
            }
            // 删除
            operatingData.push(
              <Tooltip title="删除" key={`${record.id}-4`}>
                <SxyIcon
                  key={`${record.id}-4`}
                  width={20}
                  height={20}
                  name="round_delete.png"
                  className="pointer"
                  onClick={() => {
                    handleRowDelete([record.id], deleteBasicQtyList, formSubmit)
                  }}
                />
              </Tooltip>,
            )
            return operatingData
          },
        },
      ],
    })
  }, [formSubmit, props])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-08-20 17:07:34
   */
  useEffect(() => {
    formSubmit()
  }, [formSubmit])

  return (
    <>
      <Modal
        width={900}
        visible={props.visible}
        title="添加章节"
        onCancel={props.onCancel}
        maskClosable={false}
        footer={null}
      >
        <GenerateTable
          columns={state.tableColumns}
          data={state.tableData}
          tableConfig={{
            className: 'table-header-blank',
            expandable: {
              expandIcon: ({ expanded, onExpand, record }) => {
                let iconName = ''
                if (record.status === 1) {
                  iconName = expanded
                    ? 'table_tree_open2.png'
                    : 'table_tree_shut2.png'
                  return (
                    <SxyIcon
                      width={12}
                      height={12}
                      name={iconName}
                      className="pointer"
                      onClick={(e) => onExpand(record, e)}
                    />
                  )
                }
                if (record.status === 2) {
                  iconName = expanded
                    ? 'table_tree_open1.png'
                    : 'table_tree_shut1.png'
                  return (
                    <SxyIcon
                      width={12}
                      height={12}
                      name={iconName}
                      className="pointer"
                      onClick={(e) => onExpand(record, e)}
                    />
                  )
                }
              },
            },
          }}
        />
        <Row className="mt-8 mb-3" justify="center">
          <Col span={4}>
            <Button
              type="primary"
              size="large"
              loading={state.addLoading}
              block
            >
              添加章节
            </Button>
          </Col>
        </Row>
      </Modal>
      <NameModificationModal
        {...state.modifyNameModal}
        onCancel={() => handleModifyNameState({ visible: false })}
        onConfirm={() => {}}
      />
    </>
  )
}

export default AddChapterView
