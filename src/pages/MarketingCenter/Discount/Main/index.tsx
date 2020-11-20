import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import { SxyButton } from '@/style/module/button'
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import { SxyBadge } from '@/style/module/badge'
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
  SET_TABLE_COLUMNS = '[SetMainTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    disable: false,
    width: 650,
    title: '新建优惠活动',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
}

const Discount = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS: // 设置表格头
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
    }
  }, stateValue)

  /**
   * @Description 新增编辑弹窗
   * @Author bihongbin
   * @Date 2020-09-12 14:52:16
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置搜索表单值
   * @Author bihongbin
   * @Date 2020-09-11 15:34:35
   */
  const handleSearchFormState = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-09-11 15:39:07
   */
  const handleTableColumnsState = (data: StateType['tableColumns']) => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-11 17:01:13
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Input',
        name: 'a',
        placeholder: '活动名称',
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '活动状态',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '活动类型',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'd',
        placeholder: '校区',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'e',
        placeholder: '课程',
        selectData: [],
      },
      {
        componentName: 'RangePicker',
        name: 'f',
      },
    ])
  }, [])

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-09-11 15:39:43
   */
  useEffect(() => {
    handleTableColumnsState([
      { title: '活动名称', dataIndex: 'qtyEname' },
      { title: '活动类型', dataIndex: 'a' },
      {
        title: '状态',
        dataIndex: 'b',
        render: () => {
          return (
            <SxyButton mode="light-green" radius={15}>
              生效中
            </SxyButton>
            // <SxyButton mode="light-red" radius={15}>
            //   已结束
            // </SxyButton>
          )
        },
      },
      { title: '失效日期', dataIndex: 'c' },
      { title: '付款交易数', dataIndex: 'd' },
      { title: '实际金额（元）', dataIndex: 'e' },
      { title: '开启/关闭', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 135,
        render: (value: number, record: AnyObjectType) => {
          const operatingData = []
          // 查看
          operatingData.push({
            name: '查看',
            onClick: () => {
              handleModalState({
                visible: true,
                id: record.id,
                disable: true,
                title: '查看优惠活动',
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
                id: record.id,
                disable: false,
                title: '编辑优惠活动',
              })
            },
            svg: 'table_edit.png',
          })
          // 删除
          operatingData.push({
            name: '删除',
            onClick: () => {
              handleRowDelete([record.id], deleteBasicQtyList, () =>
                mainListTableRef.current?.getTableList(),
              )
            },
            svg: 'table_delete.png',
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  /**
   * @Description 设置新增编辑查看弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-09-12 15:31:50
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Radio',
          name: 'a',
          label: '优惠活动类型',
          placeholder: '请选择优惠活动类型',
          disabled: state.handleModal.disable,
          colProps: { span: 24 },
          rules: [
            {
              required: true,
              message: '请选择优惠活动类型',
            },
          ],
          selectData: [
            { label: '直减', value: '0' },
            { label: '折扣', value: '1' },
            { label: '满减', value: '2' },
            { label: '现金抵用券', value: '3' },
            { label: '红包', value: '4' },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '活动名称',
          placeholder: '请输入活动名称',
          rules: [
            {
              required: true,
              message: '请输入活动名称',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '活动描述',
          placeholder: '请输入活动描述',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'd',
          label: '是否存在最低消费',
          disabled: state.handleModal.disable,
          selectData: [
            { label: '是', value: '0' },
            { label: '否', value: '1' },
          ],
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '最低消费金额',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入最低消费金额',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'f',
          label: '优惠可享用次数（同一用户）默认一次',
          placeholder: '请输入共享次数',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'g',
          label: '是否随机',
          disabled: state.handleModal.disable,
          selectData: [
            { label: '是', value: '0' },
            { label: '否', value: '1' },
          ],
        },
        {
          componentName: 'Input',
          name: 'h',
          label: '最大面值（红包显示）',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入最大面值',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'i',
          label: '最小面值（红包显示）',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入最小面值',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'j',
          label: '优惠方式',
          placeholder: '请选择优惠方式',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'k',
          label: '优惠金额',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入优惠金额',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'l',
          label: '优惠折扣率',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入优惠折扣率',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'm',
          label: '累计最大优惠金额',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入累计最大优惠金额',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'n',
          label: '会员等级',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入会员等级',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'o',
          label: '领取限制',
          placeholder: '请输入领取限制',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'p',
          label: '展示生效时间',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'q',
          label: '展示失效时间',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'r',
          label: '领取生效时间（使用优惠券）',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 's',
          label: '领取失效时间（使用优惠券）',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 't',
          label: '使用生效时间',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'u',
          label: '使用失效时间',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'v',
          label: '是否所有商品通用',
          selectData: [
            { label: '是', value: '0' },
            { label: '否', value: '1' },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'w',
          label: '是否支持团报',
          selectData: [
            { label: '是', value: '0' },
            { label: '否', value: '1' },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'x',
          label: '是否开启',
          valuePropName: 'checked',
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
          render: () => (
            <Space className="mt-5" size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">活动范围</span>
            </Space>
          ),
        },
        {
          componentName: 'Input',
          name: 'y',
          label: '所属课程',
          placeholder: '请输入所属课程',
          disabled: state.handleModal.disable,
        },
      ],
    })
  }, [state.handleModal.disable])

  return (
    <div className="mt-4">
      <LayoutTableList
        ref={mainListTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopTitle="优惠活动"
        censusTips={
          <div className="sxy-alert-box">
            当前结果：
            <Button className="is-btn-link ml-1 mr-1" type="link">
              85
            </Button>
            个营销活动
          </div>
        }
        cardTopButton={[
          {
            name: '新建',
            icon: 'card_add.png',
            clickConfirm: () => {
              handleModalState({
                visible: true,
                title: '新建优惠活动',
              })
            },
          },
        ]}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1500, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        topRender={
          <Space size={10} style={{ width: '100%' }}>
            <SxyBadge bg="#5860F8" />
            <span className="font-16">活动信息</span>
          </Space>
        }
        formConfig={{
          initialValues: {
            a: '0',
            d: '0',
            g: '0',
            v: '1',
            w: '1',
          },
        }}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </div>
  )
}

export default Discount
