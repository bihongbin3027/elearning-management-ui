import React, { useRef, useReducer, useEffect, useCallback } from 'react'
import {
  Tabs,
  Card,
  Row,
  Col,
  Button,
  Input,
  Space,
  Modal,
  Spin,
  DatePicker,
} from 'antd'
import { ColumnType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import { SxyButton, SxyButtonIconGroup } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import TableOperate from '@/components/TableOperate'
import { GlobalConstant } from '@/config'
import { AnyObjectType } from '@/typings'
import { handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  deleteBasicQtyList,
  handleBasicQtyList,
} from '@/api/basicData'

const { TabPane } = Tabs
const { formSearchColConfig } = GlobalConstant

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_COLUMNS = '[SetColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
  SET_COURSE_ARRANGEMENT = '[SetCourseArrangement] Action',
  SET_COURSE_MODAL_COLUMNS = '[SetCourseModalColumns Action]',
  SET_REPEAT_COURSE_MODAL = '[SetRepeatCourseModal Action]',
  SET_HOW_END_TYPE = '[SetHowEndType Action]',
  SET_HOW_END_VALUE = '[SetHowEndValue Action]',
}

const stateValue = {
  searchFormList: [] as FormListType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    disable: false,
    id: '',
    title: '新建排课',
    loading: false,
    saveLoading: false,
    submitApi: handleBasicQtyList,
    formList: [] as FormListType[],
  },
  courseArrangement: '0', // 排课方式
  courseModalColumns: [] as ColumnType<AnyObjectType>[], // 排课弹窗表格头
  // 新增编辑弹窗
  repeatCourseModal: {
    visible: false,
    disable: false,
    id: '',
    title: '新建重复排课',
    formList: [] as LayoutFormModalListType[],
  },
  howEndType: '0', // 重复排课结束方式
  howEndValue: '', // 重复排课结束方式值(input或picker)
}

const CourseMainList = () => {
  const searchFormRef = useRef<FormCallType>(null)
  const tableRef = useRef<TableCallType>(null)
  const modalFormRef = useRef<FormCallType>(null)
  const modalTableStaticRef = useRef<TableCallType>(null)
  const addCourseModalFormRef = useRef<LayoutFormModalCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑弹窗
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_COURSE_ARRANGEMENT: // 设置排课方式
        return {
          ...state,
          courseArrangement: action.payload,
        }
      case ActionType.SET_COURSE_MODAL_COLUMNS: // 设置排课弹窗表格表格头
        return {
          ...state,
          courseModalColumns: action.payload,
        }
      case ActionType.SET_REPEAT_COURSE_MODAL: // 设置重复排课弹窗
        return {
          ...state,
          repeatCourseModal: {
            ...state.repeatCourseModal,
            ...action.payload,
          },
        }
      case ActionType.SET_HOW_END_TYPE: // 设置重复排课结束方式
        return {
          ...state,
          howEndType: action.payload,
        }
      case ActionType.SET_HOW_END_VALUE: // 设置重复排课结束方式值(input或picker)
        return {
          ...state,
          howEndValue: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 设置搜索表单值
   * @Author bihongbin
   * @Date 2020-09-08 18:13:14
   */
  const handleSearchFormState = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-09 09:51:22
   */
  const handleTableColumns = (data: StateType['tableColumns']) => {
    dispatch({
      type: ActionType.SET_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 新增编辑弹窗
   * @Author bihongbin
   * @Date 2020-09-09 10:32:46
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置排课弹窗表格头
   * @Author bihongbin
   * @Date 2020-09-09 15:26:38
   */
  const handleModalTableColumnsState = (
    data: Partial<StateType['courseModalColumns']>,
  ) => {
    dispatch({
      type: ActionType.SET_COURSE_MODAL_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置重复排课弹窗数据
   * @Author bihongbin
   * @Date 2020-09-09 16:50:03
   */
  const handleRepeatCourseModalState = (
    data: Partial<StateType['repeatCourseModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_REPEAT_COURSE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 搜索
   * @Author bihongbin
   * @Date 2020-09-08 16:42:08
   */
  const onSearchText = (e: any) => {
    e.persist()
    console.log(e.target.value)
  }

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-09-08 18:09:01
   */
  const formSubmit = async () => {
    if (searchFormRef.current) {
      const result = await searchFormRef.current.formSubmit()
      if (result) {
        tableRef.current?.getTableList(result)
      }
    }
  }

  /**
   * @Description 重置
   * @Author bihongbin
   * @Date 2020-09-08 18:09:20
   */
  const formReset = () => {
    if (searchFormRef.current) {
      searchFormRef.current.formReset()
      formSubmit()
    }
  }

  /**
   * @Description 新建、编辑弹窗保存
   * @Author bihongbin
   * @Date 2020-09-09 14:08:27
   */
  const modalFormSubmit = async () => {
    let formParams = await modalFormRef.current?.formSubmit()
    console.log('提交参数：', formParams)
  }

  /**
   * @Description 弹窗表单字段更新触发
   * @Author bihongbin
   * @Date 2020-09-09 16:03:56
   */
  const formValueChange = useCallback((data: any) => {
    let formList: FormListType[] = [
      {
        componentName: 'Input',
        name: 'a',
        label: '上课主题',
        placeholder: '请输入上课主题',
        rules: [{ required: true, message: '请输入上课主题' }],
      },
      {
        componentName: 'Select',
        name: 'b',
        label: '班级',
        placeholder: '请选择班级',
        rules: [{ required: true, message: '请选择班级' }],
        selectData: [],
      },
      {
        componentName: 'Radio',
        name: 'c',
        label: '排课方式',
        selectData: [
          { label: '自由排课', value: '0' },
          { label: '批量排课', value: '1' },
        ],
      },
    ]
    // 自由排课
    if (data === '0') {
      formList = [
        ...formList,
        {
          componentName: 'DatePicker',
          name: 'd',
          label: '上课日期',
          rules: [{ required: true, message: '请选择上课日期' }],
        },
        {
          componentName: 'Select',
          name: 'e',
          label: '上课时段',
          placeholder: '请选择上课时段',
          rules: [{ required: true, message: '请选择上课时段' }],
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'f',
          label: '上课教师',
          placeholder: '请选择上课教师',
          rules: [{ required: true, message: '请选择上课教师' }],
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'g',
          label: '上课教师',
          placeholder: '请选择上课教室',
          rules: [{ required: true, message: '请选择上课教室' }],
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'h',
          label: '助教',
          placeholder: '请选择助教',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'i',
          label: '科目',
          placeholder: '请选择科目',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'j',
          label: '上课主题',
          placeholder: '请选择上课主题',
          selectData: [],
        },
      ]
    }
    // 设置排课弹窗表格头
    handleModalState({
      formList,
    })
    // 切换排课方式
    dispatch({
      type: ActionType.SET_COURSE_ARRANGEMENT,
      payload: data,
    })
  }, [])

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-08 18:11:28
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Select',
        name: 'a',
        placeholder: '筛选',
        selectData: [],
      },
    ])
  }, [])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-09 09:51:41
   */
  useEffect(() => {
    handleTableColumns([
      { title: '上课日期', dataIndex: 'startTime' },
      { title: '时间段', dataIndex: 'endTime' },
      {
        title: '班级',
        dataIndex: 'a',
        ellipsis: true,
        render: () => (
          <div>
            <span className="btn btn-blue btn-round mr-2">班</span>
            张某某_钢琴三级
          </div>
        ),
      },
      { title: '教师', dataIndex: 'b' },
      { title: '教室', dataIndex: 'c' },
      { title: '科目', dataIndex: 'd' },
      {
        title: '记上课状态',
        dataIndex: 'e',
        render: () => (
          <SxyButton mode="light-green" radius={15}>
            开放招生
          </SxyButton>
        ),
      },
      { title: '应到/实到', dataIndex: 'f' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 135,
        render: (value: number, record: any) => {
          const operatingData = []
          // 编辑
          operatingData.push({
            name: '编辑',
            onClick: () => {
              handleModalState({
                visible: true,
                disable: false,
                id: record.id,
                title: '编辑排课',
              })
            },
            svg: 'table_edit.png',
          })
          // 删除
          operatingData.push({
            name: '删除',
            onClick: () => {
              if (tableRef.current) {
                handleRowDelete([record.id], deleteBasicQtyList, formSubmit)
              }
            },
            svg: 'table_delete.png',
          })
          // 更多
          operatingData.push({
            name: '更多',
            type: 'more',
            svg: 'table_more.png',
            moreList: [
              {
                name: '更多1',
                onClick: () => {},
              },
            ],
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  /**
   * @Description 设置新增编辑弹窗表单数据
   * @Author bihongbin
   * @Date 2020-09-09 10:36:02
   */
  useEffect(() => {
    formValueChange('0')
  }, [formValueChange])

  /**
   * @Description 设置排课弹窗表格头
   * @Author bihongbin
   * @Date 2020-09-09 15:27:35
   */
  useEffect(() => {
    handleModalTableColumnsState([
      { title: '排课方式', dataIndex: 'a' },
      { title: '上课时间', dataIndex: 'b' },
      { title: '上课时段', dataIndex: 'c' },
      { title: '教师', dataIndex: 'd' },
      { title: '助教', dataIndex: 'e' },
      { title: '教室', dataIndex: 'f' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 90,
        render: (value: number, record: any) => {
          const operatingData = []
          // 编辑
          operatingData.push({
            name: '编辑',
            onClick: () => {
              // handleModalState({
              //   visible: true,
              //   disable: false,
              //   id: record.id,
              //   title: '编辑排课',
              // })
            },
            svg: 'table_edit.png',
          })
          // 删除
          operatingData.push({
            name: '删除',
            onClick: () => {
              // if (tableRef.current) {
              //   handleRowDelete([record.id], deleteBasicQtyList, formSubmit)
              // }
            },
            svg: 'table_delete.png',
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  /**
   * @Description 设置重复排课弹窗表单数据
   * @Author bihongbin
   * @Date 2020-09-09 16:50:35
   */
  useEffect(() => {
    handleRepeatCourseModalState({
      formList: [
        {
          componentName: 'DatePicker',
          name: 'a',
          label: '开始日期',
          rules: [{ required: true, message: '请选择开始日期' }],
        },
        {
          componentName: 'Radio',
          name: 'e',
          label: '节假日过滤',
          selectData: [
            { label: '节假日不排课', value: '0' },
            { label: '节假日排课', value: '1' },
          ],
        },
        {
          componentName: 'Radio',
          name: 'b',
          label: '结束方式',
          rules: [
            { required: true },
            () => ({
              validator: (rule, value) => {
                if (state.howEndType === '0' && !state.howEndValue) {
                  return Promise.reject('请选择日期')
                } else if (state.howEndType === '1' && !state.howEndValue) {
                  return Promise.reject('请输入课节')
                } else {
                  return Promise.resolve()
                }
              },
            }),
          ],
          selectData: [
            { label: '按日期结束', value: '0' },
            { label: '按课节结束', value: '1' },
          ],
          render: () => {
            // 按日期结束
            if (state.howEndType === '0') {
              return (
                <DatePicker
                  onChange={(date) => {
                    dispatch({
                      type: ActionType.SET_HOW_END_VALUE,
                      payload: date,
                    })
                  }}
                />
              )
            } else {
              return (
                <Input
                  placeholder="请输入课节"
                  onChange={(e) => {
                    e.persist()
                    dispatch({
                      type: ActionType.SET_HOW_END_VALUE,
                      payload: e.target.value,
                    })
                  }}
                />
              )
            }
          },
        },
        {
          componentName: 'Radio',
          name: 'c',
          label: '重复方式',
          selectData: [
            { label: '每周重复', value: '0' },
            { label: '隔周重复', value: '1' },
          ],
        },
        {
          componentName: 'Checkbox',
          name: 'd',
          label: '周几上课',
          rules: [{ required: true, message: '请选择周几上课' }],
          colProps: { span: 24 },
          selectData: [
            { label: '周一', value: '0' },
            { label: '周二', value: '1' },
            { label: '周三', value: '2' },
            { label: '周四', value: '3' },
            { label: '周五', value: '4' },
            { label: '周六', value: '5' },
            { label: '周日', value: '6' },
          ],
        },
        {
          componentName: 'Select',
          name: 'f',
          label: '上课时段',
          placeholder: '请选择上课时段',
          rules: [
            {
              required: true,
              message: '请选择上课时段',
            },
          ],
          selectData: [
            { label: '节假日不排课', value: '0' },
            { label: '节假日排课', value: '1' },
          ],
        },
        {
          componentName: 'Select',
          name: 'g',
          label: '上课教师',
          placeholder: '请选择上课教师',
          rules: [{ required: true, message: '请选择上课教师' }],
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'h',
          label: '助教',
          placeholder: '请选择助教',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'i',
          label: '上课教室',
          placeholder: '请选择上课教室',
          rules: [{ required: true, message: '请选择上课教室' }],
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'j',
          label: '科目',
          placeholder: '请选择科目',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'k',
          label: '上课主题',
          placeholder: '请选择上课主题',
          selectData: [],
        },
      ],
    })
  }, [state.howEndType, state.howEndValue])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-09-09 09:44:03
   */
  useEffect(() => {
    formSubmit()
  }, [])

  return (
    <>
      <Card className="card-header-tabs">
        <Row align="middle" justify="space-between">
          <Col>
            <Tabs defaultActiveKey="1" tabBarGutter={60}>
              <TabPane tab="课程表" key="1" />
              <TabPane tab="日程列表" key="2" />
              <TabPane tab="冲突日程" key="3" />
            </Tabs>
          </Col>
          <Col className="ant-form form-ash-theme">
            <div className="ant-form-item-control">
              <Input
                placeholder="请输入班级/一对一名称"
                prefix={<SearchOutlined />}
                onPressEnter={(e) => onSearchText(e)}
                style={{ width: 240, height: 30 }}
              />
            </div>
          </Col>
        </Row>
      </Card>
      <Row className="mt-5" justify="space-between" gutter={20}>
        <Col span={21}>
          <GenerateForm
            className="search-form"
            rowGridConfig={{ gutter: 10 }}
            colGirdConfig={formSearchColConfig}
            ref={searchFormRef}
            list={state.searchFormList}
            render={() => {
              if (state.searchFormList.length) {
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
        </Col>
        <Col>
          <Space size={20}>
            <SxyButtonIconGroup>
              <SxyButton title="刷新" onClick={formSubmit}>
                <SxyIcon width={12} height={12} name="search_form_reset.png" />
              </SxyButton>
              <SxyButton title="筛选">
                <SxyIcon width={12} height={12} name="search_form_screen.png" />
              </SxyButton>
            </SxyButtonIconGroup>
          </Space>
        </Col>
      </Row>
      <Card
        className="table-card"
        title={
          <Space size={10}>
            <Button>批量删除</Button>
            <Button>批量编辑</Button>
            <Button>导出日程</Button>
          </Space>
        }
        extra={
          <Button
            className="btn-text-icon"
            type="text"
            onClick={() => {
              handleModalState({
                visible: true,
                disable: false,
                id: '',
                title: '新建排课',
              })
            }}
          >
            <SxyIcon width={16} height={16} name="card_add.png" />
            新建
          </Button>
        }
      >
        <div className="sxy-alert-box">
          当前结果：共计
          <Button className="is-btn-link ml-1 mr-1" type="link">
            698
          </Button>
          条排课
        </div>
        <GenerateTable
          ref={tableRef}
          rowType="checkbox"
          apiMethod={getBasicQtyList}
          columns={state.tableColumns}
          scroll={{ x: 1500, y: 500 }}
        />
        <Modal
          width={650}
          title={state.handleModal.title}
          visible={state.handleModal.visible}
          onCancel={() => handleModalState({ visible: false })}
          destroyOnClose
          maskClosable={false}
          footer={null}
        >
          <Spin spinning={state.handleModal.loading}>
            <div className="modal-form-height">
              <GenerateForm
                ref={modalFormRef}
                className="form-ash-theme form-large-font14"
                formConfig={{
                  size: 'large',
                  labelCol: { span: 24 },
                  initialValues: {
                    c: '0',
                  },
                  onValuesChange: (changedFields) => {
                    const ce = changedFields['c']
                    formValueChange(ce)
                  },
                }}
                rowGridConfig={{ gutter: [40, 0] }}
                colGirdConfig={{ span: 12 }}
                list={state.handleModal.formList}
              />
              {state.courseArrangement === '1' ? (
                <>
                  <div className="mt-2">
                    <Button
                      className="font-14"
                      size="large"
                      type="primary"
                      onClick={() =>
                        handleRepeatCourseModalState({ visible: true })
                      }
                    >
                      添加排课
                    </Button>
                  </div>
                  <GenerateTable
                    ref={modalTableStaticRef}
                    tableConfig={{
                      className: 'table-border-single mt-4',
                    }}
                    columns={state.courseModalColumns}
                    scroll={{ x: 1000, y: 500 }}
                  />
                </>
              ) : null}
            </div>
            <Row className="mt-10 mb-5" justify="center">
              <Col>
                <Button
                  className="font-14"
                  size="large"
                  onClick={() => handleModalState({ visible: false })}
                >
                  取消
                </Button>
                {!state.handleModal.disable && (
                  <Button
                    className="font-14 ml-5"
                    size="large"
                    type="primary"
                    loading={state.handleModal.saveLoading}
                    onClick={modalFormSubmit}
                  >
                    提交
                  </Button>
                )}
              </Col>
            </Row>
          </Spin>
        </Modal>
      </Card>
      <LayoutFormModal
        ref={addCourseModalFormRef}
        onConfirm={(result) => console.log('静态表单值：', result)}
        onCancel={() => handleRepeatCourseModalState({ visible: false })}
        formConfig={{
          initialValues: {
            b: state.howEndType,
            c: '0',
            e: '0',
          },
          onValuesChange: (changedFields) => {
            const ce = changedFields['b']
            // 清空重复排课结束方式值(input或picker)
            dispatch({
              type: ActionType.SET_HOW_END_VALUE,
              payload: '',
            })
            dispatch({
              type: ActionType.SET_HOW_END_TYPE,
              payload: ce,
            })
          },
        }}
        {...state.repeatCourseModal}
      />
    </>
  )
}

export default CourseMainList
