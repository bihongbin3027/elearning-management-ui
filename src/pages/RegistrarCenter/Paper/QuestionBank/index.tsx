import React, { useRef, useReducer, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Typography, Button } from 'antd'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import { handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

const { Text } = Typography

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
  searchFormList: [] as FormListCallType[],
  cardHandleButtonList: [], // 卡片操作按钮
  tableColumnsList: [], // 表格数据列表表头数据
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    disable: false,
    width: 420,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
}

const QuestionBankMainList = () => {
  const history = useHistory()
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
          placeholder: '题库名称',
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
          label: '题库名称',
          placeholder: '请输入题库名称',
          rules: [
            {
              required: true,
              message: '请输入题库名称',
            },
          ],
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'a2',
          label: '题库简介',
          placeholder:
            '请输入有关题库的内容介绍，面向专业或行业，练习该题库要求等',
          rows: 3,
          colProps: {
            span: 24,
          },
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
              title: '创建题库',
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
          title: '编号',
          dataIndex: 'id',
          width: 60,
        },
        {
          title: '题库名称',
          dataIndex: 'qtyCname',
        },
        {
          title: '题库简介',
          dataIndex: 'dataFlag',
        },
        {
          title: '题目数量',
          dataIndex: 'dataStep',
        },
        {
          title: '创建时间',
          dataIndex: 'startTime',
        },
        {
          title: '分享好友',
          dataIndex: 'c',
          render: (value: string) => (
            <Button className="is-btn-link" type="link">
              分享
            </Button>
          ),
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
                history.push({
                  pathname: '/test-questions-manage',
                  search: `id=${record.id}`,
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
                  title: '编辑题库',
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
  }, [history])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="我的题库"
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
        topRender={
          <Text className="mb-2" type="danger" style={{ display: 'block' }}>
            建议您先去【题库集市】搜索
            题库名称或试题名称，搜索到后，添加收藏即可练习，无需上传导入。
          </Text>
        }
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </>
  )
}

export default QuestionBankMainList
