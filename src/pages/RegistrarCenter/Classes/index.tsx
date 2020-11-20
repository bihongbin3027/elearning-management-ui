import React, { useReducer, useRef, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Space,
  Button,
  Tabs,
  Modal,
  Spin,
  Avatar,
  Switch,
} from 'antd'
import { ColumnType } from 'antd/es/table'
import { SxyButton, SxyButtonIconGroup } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import { GlobalConstant } from '@/config'
import { SxyBadge } from '@/style/module/badge'
import { AnyObjectType } from '@/typings'
import { getBasicQtyList, deleteBasicQtyList } from '@/api/basicData'

const { TabPane } = Tabs

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_TABS_KEY = '[SetTabsKey Action]',
  SET_CLASS_TABLE_COLUMNS = '[SetClassTableColumns Action]',
  SET_DIVISION_TABLE_COLUMNS = '[SetDivisionTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  tabsKey: '1', // 标签页
  classTableColumns: [] as ColumnType<AnyObjectType>[], // 班级列表表格头
  divisionTableColumns: [] as ColumnType<AnyObjectType>[], // 分班操作表格头
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    loading: false,
    id: '',
    title: '',
    saveLoading: false,
    classInfoFormList: [] as FormListType[], // 班级信息表单
    signSettingsFormList: [] as FormListType[], // 签到设置
    signSwitch: false, // 签到设置开关
  },
}

const ClassesMainList = () => {
  const { formSearchColConfig } = GlobalConstant
  const history = useHistory()
  const searchFormRef = useRef<FormCallType>(null)
  const classListTableRef = useRef<TableCallType>(null)
  const divisionLogTableRef = useRef<TableCallType>(null)
  const classInfoFormModalRef = useRef<FormCallType>(null)
  const signSettingFormModalRef = useRef<FormCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_TABS_KEY: // 设置标签页切换
        return {
          ...state,
          tabsKey: action.payload,
        }
      case ActionType.SET_CLASS_TABLE_COLUMNS: // 设置班级列表表格头
        return {
          ...state,
          classTableColumns: action.payload,
        }
      case ActionType.SET_DIVISION_TABLE_COLUMNS: // 设置分班操作日志表格头
        return {
          ...state,
          divisionTableColumns: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑查看弹窗数据
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置新增编辑查看弹窗数据
   * @Author bihongbin
   * @Date 2020-08-07 15:36:34
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置班级列表表格头
   * @Author bihongbin
   * @Date 2020-09-09 10:16:08
   */
  const handleClassColumnsState = (data: StateType['classTableColumns']) => {
    dispatch({
      type: ActionType.SET_CLASS_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置分班操作表格头
   * @Author bihongbin
   * @Date 2020-09-09 10:17:16
   */
  const handleDivisionColumnsState = (
    data: StateType['divisionTableColumns'],
  ) => {
    dispatch({
      type: ActionType.SET_DIVISION_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 班级列表查询
   * @Author bihongbin
   * @Date 2020-08-20 11:05:21
   */
  const formSubmit = useCallback(async () => {
    if (searchFormRef.current) {
      let result = await searchFormRef.current.formSubmit()
      // 班级列表
      if (state.tabsKey === '1') {
        if (classListTableRef.current) {
          classListTableRef.current.getTableList(result)
        }
      }
      // 分班操作日志
      if (state.tabsKey === '2') {
        if (divisionLogTableRef.current) {
          divisionLogTableRef.current.getTableList(result)
        }
      }
    }
  }, [state.tabsKey])

  /**
   * @Description 班级列表重置
   * @Author bihongbin
   * @Date 2020-09-05 14:39:05
   */
  const formReset = () => {
    if (searchFormRef.current) {
      searchFormRef.current.formReset()
    }
    formSubmit()
  }

  /**
   * @Description 查询详情
   * @Author bihongbin
   * @Date 2020-09-07 16:44:24
   */
  const getClassDetails = useCallback((record: AnyObjectType) => {
    handleModalState({
      visible: true,
      id: record.id,
      title: '编辑班级',
    })
  }, [])

  /**
   * @Description 新建或编辑班级保存
   * @Author bihongbin
   * @Date 2020-09-07 16:37:00
   */
  const handleModalSave = async () => {
    const classInfoParams = await classInfoFormModalRef.current?.formSubmit()
    const signSettingParams = await signSettingFormModalRef.current?.formSubmit()
    if (classInfoParams && signSettingParams) {
      handleModalState({ saveLoading: true })
      setTimeout(() => {
        console.log('提交参数：', {
          ...classInfoParams,
          ...signSettingParams,
        })
        handleModalState({ visible: false, saveLoading: false })
      }, 2000)
    }
  }

  /**
   * @Description 渲染头部搜索表单
   * @Author bihongbin
   * @Date 2020-09-07 14:26:20
   */
  const searchFormRender = () => {
    let formList = [] as FormListType[]
    // 班级列表
    if (state.tabsKey === '1') {
      formList = [
        {
          componentName: 'Select',
          name: 'a',
          placeholder: '校区',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '课程类别',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'c',
          placeholder: '班级状态',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'd',
          placeholder: '收费模式',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'e',
          placeholder: '招生状态',
          selectData: [],
        },
        {
          componentName: 'RangePicker',
          name: 'f',
        },
        {
          componentName: 'Input',
          name: 'g',
          placeholder: '请输入班级名称',
        },
      ]
    }
    // 分班操作日志
    if (state.tabsKey === '2') {
      formList = [
        {
          componentName: 'RangePicker',
          name: 'a',
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '报读校区',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'c',
          placeholder: '类型',
          selectData: [],
        },
      ]
    }
    return (
      <Row justify="space-between" gutter={20}>
        <Col span={21}>
          <GenerateForm
            className="search-form"
            rowGridConfig={{ gutter: 10 }}
            colGirdConfig={formSearchColConfig}
            ref={searchFormRef}
            list={formList}
            render={() => {
              if (formList.length) {
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
    )
  }

  /**
   * @Description 设置班级列表表格头数据
   * @Author bihongbin
   * @Date 2020-08-20 10:07:49
   */
  useEffect(() => {
    handleClassColumnsState([
      {
        title: '班级名称',
        dataIndex: 'qtyCname',
        render: () => (
          <div>
            <span className="btn btn-blue btn-round mr-2">班</span>
            张某某_钢琴三级
          </div>
        ),
      },
      { title: '人数', dataIndex: 'costCategory' },
      { title: '代课老师', dataIndex: 'dataStep' },
      { title: '状态', dataIndex: 'sourceType' },
      { title: '开班时间', dataIndex: 'startTime' },
      { title: '上课时间', dataIndex: 'createTime' },
      {
        title: '招生状态',
        dataIndex: 'status',
        render: (value: number) => {
          if (value === 1) {
            return (
              <SxyButton mode="light-green" radius={15}>
                开放招生
              </SxyButton>
            )
          }
          if (value === 2) {
            return (
              <SxyButton mode="light-red" radius={15}>
                结束招生
              </SxyButton>
            )
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 135,
        render: (value: number, record: AnyObjectType) => {
          const operatingData: TableOperateButtonType[] = []
          // 编辑
          operatingData.push({
            name: '编辑',
            type: 'edit',
            onClick: () => getClassDetails(record),
            svg: 'table_edit.png',
          })
          // 删除
          operatingData.push({
            name: '删除',
            type: 'delete',
            onClick: () => {
              if (classListTableRef.current) {
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
                name: '分配学员',
                onClick: () => {
                  history.push(`/classes-details?id=${record.id}`)
                },
              },
              {
                name: '排课',
                onClick: () => {},
              },
            ],
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [formSubmit, getClassDetails, history])

  /**
   * @Description 设置分班操作日志表格头数据
   * @Author bihongbin
   * @Date 2020-09-07 14:43:12
   */
  useEffect(() => {
    handleDivisionColumnsState([
      { title: '开班时间', dataIndex: 'createTime' },
      { title: '操作人', dataIndex: 'qtyCname' },
      { title: '学员', dataIndex: 'qtyCname' },
      { title: '校区', dataIndex: 'qtyCname' },
      { title: '班级', dataIndex: 'qtyCname' },
      { title: '操作类型', dataIndex: 'qtyCname' },
      { title: '操作类型', dataIndex: 'qtyCname' },
    ])
  }, [])

  /**
   * @Description 设置新增编辑弹窗表单数据
   * @Author bihongbin
   * @Date 2020-09-07 15:42:37
   */
  useEffect(() => {
    handleModalState({
      classInfoFormList: [
        {
          componentName: 'Select',
          name: 'a',
          label: '选择课程',
          placeholder: '请选择课程类型',
          rules: [{ required: true, message: '请选择课程类型' }],
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '班级名称',
          placeholder: '请输入班级名称',
          rules: [{ required: true, message: '请输入班级名称' }],
        },
        {
          componentName: 'DatePicker',
          name: 'c',
          label: '起始时间',
          placeholder: '请选择起始时间',
        },
        {
          componentName: 'DatePicker',
          name: 'd',
          label: '终止时间',
          placeholder: '请选择终止时间',
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '任课老师',
          placeholder: '请输入任课老师',
          rules: [{ required: true, message: '请输入任课老师' }],
        },
        {
          componentName: 'Select',
          name: 'f',
          label: '班级状态',
          placeholder: '请选择班级状态',
          selectData: [],
        },
        {
          componentName: 'Input',
          inputConfig: {
            inputMode: 'number',
          },
          name: 'g',
          label: '最大容纳学生数',
          placeholder: '请输入最大容纳学生数',
        },
        {
          componentName: 'DatePicker',
          name: 'h',
          label: '失效时间',
          placeholder: '请选择失效时间',
        },
      ],
      signSettingsFormList: [
        {
          componentName: 'Input',
          inputConfig: {
            inputMode: 'number',
          },
          name: 'a',
          label: '签到次数',
          placeholder: '请输入签到次数',
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '签到方式',
          placeholder: '请选择签到方式',
          selectData: [],
        },
        {
          componentName: 'HideInput',
          name: 'c',
          label: '签到码',
          render: () => <Avatar shape="square" size={100} />,
        },
      ],
    })
  }, [])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-08-20 11:05:59
   */
  useEffect(() => {
    formSubmit() // 查询班级列表
  }, [formSubmit])

  return (
    <>
      <Card className="card-header-tabs">
        <Tabs
          activeKey={state.tabsKey}
          onChange={(activeKey) => {
            dispatch({
              type: ActionType.SET_TABS_KEY,
              payload: activeKey,
            })
          }}
        >
          <TabPane tab="班级列表" key="1" />
          <TabPane tab="分班操作日志" key="2" />
        </Tabs>
      </Card>
      <div className="mt-5">
        {state.tabsKey === '1' ? (
          <>
            {searchFormRender()}
            <Card
              className="table-card"
              title={
                <Space size={10}>
                  <Button>批量删除</Button>
                  <Button>批量编辑</Button>
                  <Button>导出班级</Button>
                  <Button>导入班级</Button>
                </Space>
              }
              extra={
                <Button
                  className="btn-text-icon"
                  type="text"
                  onClick={() => {
                    handleModalState({
                      visible: true,
                      id: '',
                      title: '新建班级',
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
                个班级
                <Button className="is-btn-link ml-1 mr-1" type="link">
                  692
                </Button>
                班级正在开办； 共计在读学员
                <Button className="is-btn-link ml-1 mr-1" type="link">
                  557
                </Button>
                名 共计在读人次
                <Button className="is-btn-link ml-1 mr-1" type="link">
                  934
                </Button>
                个
              </div>
              <GenerateTable
                ref={classListTableRef}
                rowType="checkbox"
                apiMethod={getBasicQtyList}
                columns={state.classTableColumns}
                scroll={{ x: 1300, y: 500 }}
              />
            </Card>
          </>
        ) : null}
        {state.tabsKey === '2' ? (
          <>
            {searchFormRender()}
            <Card className="table-card">
              <GenerateTable
                ref={divisionLogTableRef}
                rowType="checkbox"
                apiMethod={getBasicQtyList}
                columns={state.divisionTableColumns}
                scroll={{ x: 1300, y: 500 }}
              />
            </Card>
          </>
        ) : null}
      </div>
      <Modal
        visible={state.handleModal.visible}
        width={600}
        title={state.handleModal.title}
        onCancel={() => handleModalState({ visible: false })}
        destroyOnClose
        maskClosable={false}
        footer={null}
      >
        <Spin spinning={state.handleModal.loading}>
          <div className="modal-form-height">
            <Space size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">班级信息</span>
            </Space>
            <GenerateForm
              ref={classInfoFormModalRef}
              className="form-ash-theme form-large-font14"
              formConfig={{
                size: 'large',
                labelCol: { span: 24 },
              }}
              rowGridConfig={{ gutter: [40, 0] }}
              colGirdConfig={{ span: 12 }}
              list={state.handleModal.classInfoFormList}
            />
            <Space className="mt-5" size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">签到设置</span>
              <Switch
                checked={state.handleModal.signSwitch}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={(checked) =>
                  handleModalState({ signSwitch: checked })
                }
              />
            </Space>
            {state.handleModal.signSwitch ? (
              <GenerateForm
                ref={signSettingFormModalRef}
                className="form-ash-theme form-large-font14"
                formConfig={{
                  size: 'large',
                  labelCol: { span: 24 },
                }}
                rowGridConfig={{ gutter: [40, 0] }}
                colGirdConfig={{ span: 12 }}
                list={state.handleModal.signSettingsFormList}
              />
            ) : null}
            <Row className="mt-10 mb-5" justify="center">
              <Col>
                <Button
                  className="font-14"
                  size="large"
                  onClick={() => handleModalState({ visible: false })}
                >
                  取消
                </Button>
                <Button
                  className="font-14 ml-5"
                  size="large"
                  type="primary"
                  loading={state.handleModal.saveLoading}
                  onClick={handleModalSave}
                >
                  提交
                </Button>
              </Col>
            </Row>
          </div>
        </Spin>
      </Modal>
    </>
  )
}

export default ClassesMainList
