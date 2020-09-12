import React, { useRef, useReducer, useEffect } from 'react'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import AddClassHourModal from '@/pages/CourseManage/addClassHourModal'
import EditClassHourModal from '@/pages/CourseManage/editClassHourModal'
import AddChapterModal from '@/pages/CourseManage/addChapterModal'
import { handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
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
  SET_ADD_CLASS_HOUR_MODAL = '[SetAddClassHourModal Action]',
  SET_EDIT_CLASS_HOUR_MODAL = '[SetEditClassHourModal Action]',
  SET_ADD_CHAPTER_MODAL = '[SetAddChapterModal Action]',
}

const stateValue = {
  // 头部搜索表单数据
  searchFormList: [] as FormListCallType[],
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
  // 新增课时弹窗数据
  addClassHourModal: {
    visible: false,
    id: '',
  },
  // 编辑课时弹窗数据
  editClassHourModal: {
    visible: false,
    id: '',
  },
  // 新增章节弹窗
  addChapterModal: {
    visible: false,
    id: '',
  },
}

const BasicAuthMainList = () => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置卡片操作按钮
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS_LIST: // 设置表格数据列表表头数据
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
      case ActionType.SET_ADD_CLASS_HOUR_MODAL: // 设置课时弹窗数据
        return {
          ...state,
          addClassHourModal: {
            ...state.addClassHourModal,
            ...action.payload,
          },
        }
      case ActionType.SET_EDIT_CLASS_HOUR_MODAL: // 编辑课时弹窗数据
        return {
          ...state,
          editClassHourModal: {
            ...state.editClassHourModal,
            ...action.payload,
          },
        }
      case ActionType.SET_ADD_CHAPTER_MODAL: // 新增章节弹窗数据
        return {
          ...state,
          addChapterModal: {
            ...state.addChapterModal,
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

  const handleEditClassHourState = (
    data: Partial<StateType['editClassHourModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_EDIT_CLASS_HOUR_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置头部搜索表单数据
   * @Author bihongbin
   * @Date 2020-08-20 11:20:33
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: [
        {
          componentName: 'Input',
          name: 'a',
          placeholder: '科目代码',
        },
        {
          componentName: 'Input',
          name: 'b',
          placeholder: '科目标题',
        },
        {
          componentName: 'Select',
          name: 'c',
          placeholder: '是否定义章节',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'd',
          placeholder: '课程分类',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'e',
          placeholder: '课程类型',
          selectData: [],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置新增编辑查看弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-08-07 15:44:58
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a1',
          label: '科目代码',
          placeholder: '请输入科目代码',
          rules: [
            {
              required: true,
              message: '请输入科目代码',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a2',
          label: '科目标题',
          placeholder: '请输入科目标题',
          rules: [
            {
              required: true,
              message: '请输入科目标题',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a3',
          label: '课程类型',
          placeholder: '请选择课程类型',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a4',
          label: '课程分类',
          placeholder: '请选择课程分类',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'a5',
          label: '是否定义章节',
          selectData: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
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
          icon: 'card_add.png',
          clickConfirm: () => {
            handleModalState({
              visible: true,
              disable: false,
              id: '',
              title: '新增科目',
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
          title: '科目代码',
          dataIndex: 'qtyEname',
        },
        {
          title: '科目标题',
          dataIndex: 'qtyCname',
        },
        {
          title: '是否定义章节',
          dataIndex: 'dataFlag',
        },
        {
          title: '课程分类',
          dataIndex: 'dataStep',
        },
        {
          title: '课程类型',
          dataIndex: 'startTime',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 135,
          render: (value: number, record: any) => {
            const operatingData = []
            // 查看
            operatingData.push({
              name: '查看',
              onClick: () => {
                dispatch({
                  type: ActionType.SET_ADD_CHAPTER_MODAL,
                  payload: {
                    visible: true,
                    id: record.id,
                  },
                })
              },
              svg: 'table_see.png',
            })
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleModalState({
                  visible: true,
                  disable: false,
                  id: record.id,
                  title: '编辑科目',
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
        cardTopTitle="科目管理"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumnsList,
          tableConfig: {
            scroll: { x: 1200, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleModalState({ visible: false })}
        formConfig={{
          initialValues: {
            a5: '0',
          },
        }}
        {...state.handleModal}
      />
      <AddClassHourModal
        {...state.addClassHourModal}
        onEdit={(data) => {
          handleEditClassHourState({
            visible: true,
            id: data.id,
          })
        }}
        onCancel={() => {
          dispatch({
            type: ActionType.SET_ADD_CLASS_HOUR_MODAL,
            payload: {
              visible: false,
            },
          })
        }}
      />
      <EditClassHourModal
        {...state.editClassHourModal}
        onCancel={() => {
          handleEditClassHourState({
            visible: false,
          })
        }}
      />
      <AddChapterModal
        {...state.addChapterModal}
        onEdit={(data) => {
          handleEditClassHourState({
            visible: true,
            id: data.id,
          })
        }}
        onCancel={() => {
          dispatch({
            type: ActionType.SET_ADD_CHAPTER_MODAL,
            payload: {
              visible: false,
            },
          })
        }}
      />
    </>
  )
}

export default BasicAuthMainList
