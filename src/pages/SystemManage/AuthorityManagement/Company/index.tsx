import React, { useRef, useReducer, useEffect } from 'react'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import TableOperate from '@/components/TableOperate'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
  setBasicQtyStatus,
} from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_TABLE_COLUMNS_LIST = '[SetTableColumnsList Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  // 头部搜索表单数据
  searchFormList: [
    {
      componentName: 'Input',
      name: 'companyName',
      placeholder: '公司名称',
    },
    {
      componentName: 'Input',
      name: 'companyCode',
      placeholder: '公司编号',
    },
    {
      componentName: 'Input',
      name: 'id',
      placeholder: 'id',
    },
  ] as FormListCallType[],
  cardHandleButtonList: [], // 卡片操作按钮
  tableColumnsList: [], // 表格数据列表表头数据
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    disable: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
}

const CompanyMainList = () => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置公司卡片操作按钮
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS_LIST: // 设置列表表头数据
        return {
          ...state,
          tableColumnsList: action.payload,
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
  const handleCompanyState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置新增编辑查看弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-08-07 15:44:58
   */
  useEffect(() => {
    handleCompanyState({
      formList: [
        {
          componentName: 'Input',
          name: 'companyCode',
          label: '公司编码',
          placeholder: '请输入公司编码',
          rules: [
            {
              required: true,
              message: '请输入公司编码',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'companyName',
          label: '公司名称',
          placeholder: '请输入公司名称',
          rules: [
            {
              required: true,
              message: '请输入公司名称',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'parentId',
          label: '父级公司',
          placeholder: '请选择父级公司',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'groupFlag',
          label: '集团组织',
          selectData: [
            {
              label: '否',
              value: '0',
            },
            {
              label: '是',
              value: '1',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'innerFlag',
          label: '内部组织',
          selectData: [
            {
              label: '外部',
              value: '0',
            },
            {
              label: '内部',
              value: '1',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'publicFlag',
          label: '是否公开',
          selectData: [
            {
              label: '否',
              value: '0',
            },
            {
              label: '是',
              value: '1',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.handleModal.disable,
        },
      ],
    })
  }, [state.handleModal.disable])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-07 15:32:06
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '新增',
          clickConfirm: () => {
            handleCompanyState({
              visible: true,
              disable: false,
              id: '',
              title: '新增公司',
            })
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置表格列表表头数据
   * @Author bihongbin
   * @Date 2020-08-07 15:24:52
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS_LIST,
      payload: [
        {
          width: 60,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '公司名称',
          dataIndex: 'companyName',
        },
        {
          title: '公司编号',
          dataIndex: 'companyCode',
        },
        // {
        //   title: '状态',
        //   dataIndex: 'status',
        // },
        {
          title: '创建人',
          dataIndex: 'createUserName',
        },
        {
          title: '生效日期',
          dataIndex: 'startTime',
        },
        {
          title: '失效日期',
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 170,
          render: (value: number, record: any) => {
            const operatingData = []
            // 查看
            operatingData.push({
              name: '查看',
              onClick: () => {
                handleCompanyState({
                  visible: true,
                  disable: true,
                  id: record.id,
                  title: '查看公司',
                })
              },
              svg: 'table_see.png',
            })
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleCompanyState({
                  visible: true,
                  disable: false,
                  id: record.id,
                  title: '编辑公司',
                })
              },
              svg: 'table_edit.png',
            })
            // 删除
            operatingData.push({
              name: '删除',
              onClick: () => {
                if (layoutTableRef.current) {
                  handleRowDelete(
                    [record.id],
                    deleteBasicQtyList,
                    layoutTableRef.current.getTableList,
                  )
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
                  name:
                    (value === 1 && '禁用') ||
                    (value === 2 && '启用') ||
                    '未知',
                  onClick: () => {
                    if (layoutTableRef.current) {
                      handleRowEnableDisable(
                        {
                          id: record.id,
                          status: (value === 1 && 2) || (value === 2 && 1) || 0,
                        },
                        setBasicQtyStatus,
                        layoutTableRef.current.getTableList,
                      )
                    }
                  },
                },
              ],
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="公司列表"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumnsList,
          tableConfig: {
            scroll: { y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            sortSeq: '10',
            groupFlag: '0',
            innerFlag: '1',
            publicFlag: '0',
          },
        }}
        onCancel={() => handleCompanyState({ visible: false })}
        {...state.handleModal}
      />
    </>
  )
}

export default CompanyMainList
