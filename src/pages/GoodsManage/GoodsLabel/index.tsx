import React, { useEffect, useRef, useReducer, useCallback } from 'react'
import { Space, Button, message, Switch } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import { handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import { SxyButton } from '@/style/module/button'
import { SxyTips } from '@/style/module/tips'
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
  SET_COLUMNS = '[SetColumns Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  // 头部搜索数据
  searchFormList: [] as FormListCallType[],
  // 表格表头
  tableColumns: [],
  // 卡片操作按钮
  cardHandleButtonList: [] as CardButtonType[],
  // 分类弹窗
  handleModal: {
    visible: false,
    title: '添加新标签组',
    disabled: false,
    loading: false,
    saveLoading: false,
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
}

const GoodsLabelMainList = () => {
  const tableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置卡片操作按钮
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增、编辑、查看弹窗数据
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
   * @Description 设置头部搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-04 10:07:50
   */
  const handleSearchFormState = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-09-04 10:25:42
   */
  const handleCardButtonState = (data: StateType['cardHandleButtonList']) => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置新增、编辑弹窗数据
   * @Author bihongbin
   * @Date 2020-09-04 10:07:09
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 启用和禁用
   * @Author bihongbin
   * @param { String } type enable启用 disable禁用
   * @Date 2020-09-04 10:37:38
   */
  const handleDisabled = (type: 'enable' | 'disable') => {
    const rows = tableRef.current?.getSelectIds()
    if (rows && !rows.length) {
      message.warn('请选择数据', 1.5)
      return
    }
  }

  /**
   * @Description 修改开关状态
   * @Author bihongbin
   * @Date 2020-08-20 11:02:30
   */
  const handleCourseStatus = (data: number) => {
    console.log('开关状态', data)
  }

  /**
   * @Description 编辑和查看
   * @Author bihongbin
   * @Date 2020-09-04 10:29:21
   */
  const getOpenModal = useCallback(
    (record: AnyObjectType, type: 'look' | 'edit') => {
      // 查看
      if (type === 'look') {
        handleModalState({
          visible: true,
          title: '标签组详情',
          disabled: true,
        })
      }
      // 编辑
      if (type === 'edit') {
        handleModalState({
          visible: true,
          title: '编辑标签组',
          disabled: false,
        })
      }
    },
    [],
  )

  /**
   * @Description 设置头部搜索
   * @Author bihongbin
   * @Date 2020-09-04 10:07:24
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '请输入标签组名称搜索',
      },
    ])
  }, [])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-09-04 10:11:34
   */
  useEffect(() => {
    handleCardButtonState([
      {
        name: '添加新标签组',
        icon: 'card_add.png',
        clickConfirm: () => {
          handleModalState({
            visible: true,
            title: '添加新标签组',
          })
        },
      },
    ])
  }, [])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-04 10:28:25
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_COLUMNS,
      payload: [
        {
          title: '标签组名称',
          dataIndex: 'qtyCname',
          width: 200,
        },
        {
          title: '组内标签数量',
          dataIndex: 'costCategory',
          width: 200,
        },
        {
          title: '状态',
          dataIndex: 'c1',
          render: (value: number, record: any) => {
            return (
              <Switch
                defaultChecked
                checkedChildren="开"
                unCheckedChildren="关"
                onChange={() => handleCourseStatus(value)}
              />
            )
          },
        },
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
              onClick: () => getOpenModal(record, 'edit'),
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
  }, [getOpenModal])

  /**
   * @Description 设置新增编辑弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-09-04 10:57:01
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '标签组名称',
          placeholder: '请输入标签组名称',
          rules: [{ required: true, message: '请输入标签组名称' }],
          disabled: state.handleModal.disabled,
          colProps: {
            span: 24,
          },
        },
        {
          componentName: 'Radio',
          name: 'b',
          label: '是否启用',
          placeholder: '请选择是否启用',
          rules: [{ required: true, message: '请选择是否启用' }],
          disabled: state.handleModal.disabled,
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
          colProps: {
            span: 24,
          },
        },
        {
          componentName: 'HideInput',
          name: 'c',
          label: '组内标签',
          rules: [{ required: true, message: '请选择组内标签' }],
          colProps: {
            span: 24,
          },
          render: () => (
            <>
              <Button type="primary">添加标签</Button>
              <div className="mt-5">
                <SxyButton
                  className="mr-5"
                  mode="dust"
                  border={false}
                  size="large"
                >
                  标签一
                  <CloseOutlined className="sxy-button-close" />
                </SxyButton>
                <SxyButton
                  className="mr-5"
                  mode="dust"
                  border={false}
                  size="large"
                >
                  标签二
                  <CloseOutlined className="sxy-button-close" />
                </SxyButton>
                <SxyButton
                  className="mr-5"
                  mode="dust"
                  border={false}
                  size="large"
                >
                  标签三
                  <CloseOutlined className="sxy-button-close" />
                </SxyButton>
              </div>
            </>
          ),
        },
      ],
    })
  }, [state.handleModal.disabled])

  return (
    <>
      <SxyTips>
        <div className="tips-title">TIPS:</div>
        <div className="tips-text">标签组是编辑商品信息时可调取。</div>
      </SxyTips>
      <LayoutTableList
        ref={tableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle={
          <Space size={10}>
            <Button onClick={() => handleDisabled('enable')}>启用</Button>
            <Button onClick={() => handleDisabled('disable')}>禁用</Button>
          </Space>
        }
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            b: '0',
          },
        }}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </>
  )
}

export default GoodsLabelMainList
