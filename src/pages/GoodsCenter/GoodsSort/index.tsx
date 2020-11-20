import React, { useEffect, useRef, useCallback } from 'react'
import { Space, Avatar, Button, Typography } from 'antd'
import { ColumnType } from 'antd/es/table'
import useSetState from '@/hooks/useSetState'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import { GlobalConstant } from '@/config'
import { handleRowDelete } from '@/utils'
import { SxyIcon } from '@/style/module/icon'
import { AnyObjectType } from '@/typings'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

const { Text } = Typography

interface StateType {
  searchFormList: FormListCallType[]
  tableColumns: ColumnType<AnyObjectType>[]
  cardHandleButtonList: CardButtonType[]
  handleModal: LayoutFormPropTypes
  transferModal: LayoutFormPropTypes
}

const GoodsSort = () => {
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const tableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const transferModalRef = useRef<LayoutFormModalCallType>()
  const [state, setState] = useSetState<StateType>({
    // 头部搜索数据
    searchFormList: [],
    // 表格表头
    tableColumns: [],
    // 卡片操作按钮
    cardHandleButtonList: [],
    // 分类弹窗
    handleModal: {
      visible: false,
      title: '新增商品信息',
      disable: false,
      submitApi: handleBasicQtyList,
      formList: [],
    },
    // 商品转移弹窗
    transferModal: {
      visible: false,
      title: '商品转移',
      width: 420,
      submitApi: handleBasicQtyList,
      formList: [],
    },
  })

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-09-03 16:27:35
   */
  const formSubmit = () => {
    if (tableRef.current) {
      tableRef.current.getTableList()
    }
  }

  /**
   * @Description 编辑和查看
   * @Author bihongbin
   * @Date 2020-09-03 16:46:12
   */
  const getOpenModal = useCallback(
    (record: AnyObjectType, type: 'look' | 'edit') => {
      setState((prev) => {
        // 查看
        if (type === 'look') {
          prev.handleModal.visible = true
          prev.handleModal.title = '商品分类详情'
          prev.handleModal.disable = true
        }
        // 编辑
        if (type === 'edit') {
          prev.handleModal.visible = true
          prev.handleModal.title = '编辑商品分类'
          prev.handleModal.disable = false
        }
        return prev
      })
    },
    [setState],
  )

  /**
   * @Description 设置头部搜索
   * @Author bihongbin
   * @Date 2020-09-03 16:37:01
   */
  useEffect(() => {
    setState({
      searchFormList: [
        {
          componentName: 'Select',
          name: 'a',
          placeholder: '请选择店铺商品分类',
          selectData: [
            {
              label: '分类一',
              value: '1',
            },
            {
              label: '分类二',
              value: '2',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          placeholder: '请输入商品ID/名称/关键词搜索商品',
        },
      ],
    })
  }, [setState])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-09-03 16:40:59
   */
  useEffect(() => {
    setState({
      cardHandleButtonList: [
        {
          name: '添加新分类',
          authCode: authBasic.ADD,
          icon: 'card_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.handleModal.visible = true
              prev.handleModal.id = ''
              prev.handleModal.title = '新增商品分类'
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
   * @Date 2020-09-03 16:44:31
   */
  useEffect(() => {
    setState({
      tableColumns: [
        {
          title: '分类层级',
          dataIndex: 'qtyCname',
        },
        {
          title: '排序',
          dataIndex: 'costCategory',
        },
        {
          title: '分类名称',
          dataIndex: 'c1',
        },
        {
          title: '商品数量',
          dataIndex: 'd1',
        },
        {
          title: '是否显示',
          dataIndex: 'e1',
        },
        {
          title: '是否店铺首页推荐',
          dataIndex: 'f1',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 135,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
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
            // 更多
            operatingData.push({
              name: '更多',
              authCode: authBasic.MORE,
              svg: 'table_more.png',
              moreList: [
                {
                  name: '转移商品',
                  onClick: () => {
                    setState((prev) => {
                      prev.transferModal.visible = true
                      return prev
                    })
                  },
                },
                {
                  name: '添加子类',
                  onClick: () => {
                    setState((prev) => {
                      prev.handleModal.visible = true
                      prev.handleModal.title = '添加商品子类'
                      prev.handleModal.disable = false
                      return prev
                    })
                  },
                },
              ],
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [authBasic.DELETE, authBasic.EDIT, authBasic.MORE, getOpenModal, setState])

  /**
   * @Description 设置新增编辑弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-09-03 17:14:23
   */
  useEffect(() => {
    setState((prev) => {
      prev.handleModal.formList = [
        {
          componentName: 'Input',
          name: 'a',
          label: '分类排序',
          placeholder: '请输入分类排序',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '上级分类',
          placeholder: '请选择上级分类',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '分类名称',
          placeholder: '请输入分类名称',
          rules: [{ required: true, message: '请输入分类名称' }],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '关键词',
          placeholder: '请输入关键词',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'HideInput',
          name: 'e',
          label: '分类图标',
          render: () => {
            return (
              <>
                <div>
                  <Space size={20}>
                    <Avatar
                      className="pointer"
                      shape="square"
                      size={100}
                      alt="分类图标"
                    />
                    {!state.handleModal.disable && (
                      <Button type="primary">上传</Button>
                    )}
                  </Space>
                </div>
                <div className="mt-2">
                  <Text className="font-12" type="secondary">
                    分类图标最佳尺寸200*200，商品分类图标显示在分类页面，标识分类特征
                  </Text>
                </div>
              </>
            )
          },
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'f',
          label: '是否关联平台分类',
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
          rules: [{ required: true, message: '请选择是否关联平台分类' }],
          disabled: state.handleModal.disable,
          colProps: {
            span: 24,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              设置是否在店铺分类页面展示分类名称
            </Text>
          ),
        },
        {
          componentName: 'Radio',
          name: 'g',
          label: '是否店铺首页推荐',
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
          rules: [{ required: true, message: '请选择是否店铺首页推荐' }],
          disabled: state.handleModal.disable,
          colProps: {
            span: 24,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              设置是否在店铺首页展示分类名称
            </Text>
          ),
        },
        {
          componentName: 'TextArea',
          name: 'h',
          label: '分类描述',
          placeholder: '最多可以输入300个字',
          rows: 3,
          colProps: {
            span: 24,
          },
          rules: [{ max: 300, message: '最多可以输入300个字' }],
          disabled: state.handleModal.disable,
        },
      ]
      return prev
    })
  }, [setState, state.handleModal.disable])

  /**
   * @Description 设置商品转移弹窗表单数据
   * @Author bihongbin
   * @Date 2020-09-03 17:37:02
   */
  useEffect(() => {
    setState((prev) => {
      prev.transferModal.formList = [
        {
          componentName: 'Select',
          name: 'd',
          label: '转移的分类',
          placeholder: '请选择转移的分类',
          disabled: state.handleModal.disable,
          selectData: [],
          rules: [{ required: true, message: '请选择转移的分类' }],
          colProps: {
            span: 24,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              选择新分类后，所选商品将归属新的分类
            </Text>
          ),
        },
      ]
      return prev
    })
  }, [setState, state.handleModal.disable])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-09-03 16:27:54
   */
  useEffect(() => {
    formSubmit()
  }, [])

  return (
    <>
      <LayoutTableList
        ref={tableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="商品分类"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
            expandable: {
              expandedRowRender: (record) => (
                <div style={{ marginLeft: 106 }}>{record.qtyCname}</div>
              ),
              expandIcon: ({ expanded, onExpand, record }) => {
                let iconName = expanded
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
              },
            },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => {
          setState((prev) => {
            prev.handleModal.visible = false
            return prev
          })
        }}
        formConfig={{
          initialValues: {
            f: '0',
            g: '0',
          },
        }}
        {...state.handleModal}
      />
      <LayoutFormModal
        ref={transferModalRef}
        onCancel={() => {
          setState((prev) => {
            prev.transferModal.visible = false
            return prev
          })
        }}
        {...state.transferModal}
      />
    </>
  )
}

export default GoodsSort
