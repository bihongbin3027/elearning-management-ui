import React, { useEffect, useRef, useCallback } from 'react'
import { Space, Button, message, Switch } from 'antd'
import { ColumnType } from 'antd/es/table'
import { CloseOutlined } from '@ant-design/icons'
import useSetState from '@/hooks/useSetState'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import { GlobalConstant } from '@/config'
import { handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import { SxyButton } from '@/style/module/button'
import { SxyTips } from '@/style/module/tips'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

interface StateType {
  searchFormList: FormListCallType[]
  tableColumns: ColumnType<AnyObjectType>[]
  cardHandleButtonList: CardButtonType[]
  handleModal: LayoutFormPropTypes
}

const GoodsLabelMainList = () => {
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const tableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, setState] = useSetState<StateType>({
    // 头部搜索数据
    searchFormList: [
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '请输入标签组名称搜索',
      },
    ],
    // 表格表头
    tableColumns: [],
    // 卡片操作按钮
    cardHandleButtonList: [],
    // 分类弹窗
    handleModal: {
      visible: false,
      title: '添加新标签组',
      disable: false,
      submitApi: handleBasicQtyList,
      formList: [],
    },
  })

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
      setState((prev) => {
        // 查看
        if (type === 'look') {
          prev.handleModal.visible = true
          prev.handleModal.title = '标签组详情'
          prev.handleModal.disable = true
        }
        // 编辑
        if (type === 'edit') {
          prev.handleModal.visible = true
          prev.handleModal.title = '编辑标签组'
          prev.handleModal.disable = false
        }
        return prev
      })
    },
    [setState],
  )

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-09-04 10:11:34
   */
  useEffect(() => {
    setState({
      cardHandleButtonList: [
        {
          name: '添加新标签组',
          authCode: authBasic.ADD,
          icon: 'card_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.handleModal.visible = true
              prev.handleModal.id = ''
              prev.handleModal.title = '添加新标签组'
              return prev
            })
          },
        },
      ],
    })
  }, [authBasic.ADD, setState])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-04 10:28:25
   */
  useEffect(() => {
    setState({
      tableColumns: [
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
              authCode: authBasic.EDIT,
              svg: 'table_edit.png',
              onClick: () => getOpenModal(record, 'edit'),
            })
            // 删除
            operatingData.push({
              name: '删除',
              authCode: authBasic.DELETE,
              svg: 'table_delete.png',
              onClick: () => {
                if (tableRef.current) {
                  handleRowDelete(
                    [record.id],
                    deleteBasicQtyList,
                    tableRef.current.getTableList,
                  )
                }
              },
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [authBasic.DELETE, authBasic.EDIT, getOpenModal, setState])

  /**
   * @Description 设置新增编辑弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-09-04 10:57:01
   */
  useEffect(() => {
    setState((prev) => {
      prev.handleModal.formList = [
        {
          componentName: 'Input',
          name: 'a',
          label: '标签组名称',
          placeholder: '请输入标签组名称',
          rules: [{ required: true, message: '请输入标签组名称' }],
          disabled: state.handleModal.disable,
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
          disabled: state.handleModal.disable,
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
      ]
      return prev
    })
  }, [setState, state.handleModal.disable])

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
        onCancel={() => {
          setState((prev) => {
            prev.handleModal.visible = false
            return prev
          })
        }}
        {...state.handleModal}
      />
    </>
  )
}

export default GoodsLabelMainList
