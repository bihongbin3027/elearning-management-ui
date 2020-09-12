import React, { useReducer, useEffect, useRef } from 'react'
import { Row, Button, Divider, Modal, message, Avatar, Spin, Card } from 'antd'
import TreeNode, { TreeNodeCallType } from '@/components/Tree'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import LayoutTableList, {
  LayoutTableCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import ButtonGroup from '@/components/ButtonGroup'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
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
  SET_BASIC_MENU = '[SetBasicMenu Action]',
  SET_MIDDLE_EMPTY = '[SetMiddleEmpty Action]',
  SET_MENU_HANDLE_MODAL = '[SetMenuHandleModal Action]',
  SET_MENU_ICON_MODAL = '[SetIconModal Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_CONFIG_BASIC_PERMISSIONS_MODAL = '[SetConfigBasicPermissionsModal Action]',
  SET_MENU_CODE_COLUMNS_LIST = '[SetMenuCodeColumnsList Action]',
  SET_MENU_CODE_MODAL = '[SetMenuCodeModal Action]',
}

const stateValue = {
  basicMenu: [], // 基础菜单数据
  middleEmpty: true, // 无数据状态（默认显示）
  // 新增编辑查看菜单弹窗
  menuHandleModal: {
    visible: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListType[],
  },
  // 菜单图标弹窗
  iconModal: {
    visible: false,
    src: '',
  },
  // 资源菜单信息
  resourceMenuFormList: [
    {
      componentName: 'Input',
      name: 'a',
      label: '菜单编码',
    },
    {
      componentName: 'Input',
      name: 'b',
      label: '菜单中文名',
    },
    {
      componentName: 'Input',
      name: 'c',
      label: 'id/序号',
    },
    {
      componentName: 'Input',
      name: 'd',
      label: '应用级别',
    },
    {
      componentName: 'Input',
      name: 'e',
      label: '菜单地址',
    },
  ] as FormListType[],
  cardHandleButtonList: [], // 菜单权限码列表操作按钮
  // 配置基础权限弹窗
  configBasicPermissionsModal: {
    loading: false,
    visible: false, // 弹窗显示隐藏
    id: [] as string[], // 当前选择的行id
    // 基础权限按钮
    basicList: [
      {
        name: 'A新增',
        value: '0',
      },
      {
        name: 'B编辑',
        value: '1',
      },
      {
        name: 'C删除',
        value: '2',
      },
      {
        name: 'D查询',
        value: '3',
      },
      {
        name: 'F设置',
        value: '4',
      },
      {
        name: 'G导入',
        value: '5',
      },
      {
        name: 'H上传',
        value: '6',
      },
    ],
    formList: [
      {
        componentName: 'Input',
        name: 'a',
        label: '权限编码',
        colProps: {
          span: 24,
        },
      },
      {
        componentName: 'Input',
        name: 'b',
        label: '描述',
        colProps: {
          span: 24,
        },
      },
    ] as FormListType[],
    customizeVisible: false, // 自定义切换显示
    // 自定义权限按钮
    customizeButton: [],
  },
  menuCodeColumnsList: [], // 菜单权限码列表表头
  // 新增编辑查看菜单权限编码弹窗
  menuCodeModal: {
    visible: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListType[],
  },
}

const MenuMainList = () => {
  const resourceMenuInfoFormRef = useRef<FormCallType>()
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const treeNodeRef = useRef<TreeNodeCallType>()
  const menuCodeFormRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_BASIC_MENU: // 设置基础菜单数据
        return {
          ...state,
          basicMenu: action.payload,
        }
      case ActionType.SET_MIDDLE_EMPTY: // 设置无数据状态
        return {
          ...state,
          middleEmpty: action.payload,
        }
      case ActionType.SET_MENU_HANDLE_MODAL: // 设置新增编辑查看菜单弹窗数据
        return {
          ...state,
          menuHandleModal: {
            ...state.menuHandleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_MENU_ICON_MODAL: // 设置菜单图标弹窗数据
        return {
          ...state,
          iconModal: {
            ...state.iconModal,
            ...action.payload,
          },
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置菜单权限码列表操作按钮数据
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_CONFIG_BASIC_PERMISSIONS_MODAL: // 设置配置基础权限弹窗数据
        return {
          ...state,
          configBasicPermissionsModal: {
            ...state.configBasicPermissionsModal,
            ...action.payload,
          },
        }
      case ActionType.SET_MENU_CODE_COLUMNS_LIST: // 设置菜单权限码列表表头数据
        return {
          ...state,
          menuCodeColumnsList: action.payload,
        }
      case ActionType.SET_MENU_CODE_MODAL: // 设置新增编辑查看菜单权限编码弹窗数据
        return {
          ...state,
          menuCodeModal: {
            ...state.menuCodeModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置配置基础权限弹窗数据
   * @Author bihongbin
   * @Date 2020-08-04 10:35:04
   */
  const handleConfigBasicModalState = (
    data: Partial<StateType['configBasicPermissionsModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_CONFIG_BASIC_PERMISSIONS_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 基础菜单节点选择
   * @Author bihongbin
   * @Date 2020-08-05 14:48:46
   */
  const handleTreeSelectNode = async (data: React.Key[]) => {
    if (data.length && layoutTableRef.current) {
      // 控制无数据状态
      await dispatch({
        type: ActionType.SET_MIDDLE_EMPTY,
        payload: false,
      })
      layoutTableRef.current.getTableList()
    }
  }

  /**
   * @Description 设置新增编辑查看菜单数据
   * @Author bihongbin
   * @Date 2020-08-04 15:24:35
   */
  const handleMenuState = (data: Partial<StateType['menuHandleModal']>) => {
    dispatch({
      type: ActionType.SET_MENU_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置菜单图标弹窗相关
   * @Author bihongbin
   * @Date 2020-08-04 16:52:03
   */
  const handleIconState = (data: Partial<StateType['iconModal']>) => {
    dispatch({
      type: ActionType.SET_MENU_ICON_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置新增编辑菜单权限编码数据
   * @Author bihongbin
   * @Date 2020-08-04 17:05:29
   */
  const handleMenuCodeState = (data: Partial<StateType['menuCodeModal']>) => {
    dispatch({
      type: ActionType.SET_MENU_CODE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 获取树选中的节点
   * @Author bihongbin
   * @Date 2020-08-04 15:43:13
   */
  const getTreeSelectNode = () => {
    if (treeNodeRef.current) {
      let selectData = treeNodeRef.current.getSelectNode()
      if (!selectData.length) {
        message.warn('请选择节点', 1.5)
        return []
      }
      return selectData
    }
    return []
  }

  /**
   * @Description 新增菜单信息
   * @Author bihongbin
   * @Date 2020-08-04 15:31:52
   */
  const handleAddMenu = () => {
    let selectData = getTreeSelectNode()
    if (selectData.length) {
      handleMenuState({
        id: '',
        visible: true,
        title: '新增菜单信息',
      })
    }
  }

  /**
   * @Description 编辑菜单信息
   * @Author bihongbin
   * @Date 2020-08-04 15:32:27
   */
  const handleEditMenu = () => {
    let selectData = getTreeSelectNode()
    if (selectData.length) {
      handleMenuState({
        id: '123',
        visible: true,
        title: '编辑菜单信息',
      })
    }
  }

  /**
   * @Description 设置基础菜单数据
   * @Author bihongbin
   * @Date 2020-08-03 16:59:37
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_BASIC_MENU,
      payload: [
        {
          title: '华旅云创科技有限公司',
          key: '0-0',
          isLocked: false,
          children: [
            {
              title: '研发部',
              key: '0-0-1',
              isLocked: false,
              children: [
                {
                  title: '技术组',
                  key: '0-0-1-0',
                  isLocked: false,
                },
                {
                  title: '运维组',
                  key: '0-0-1-1',
                  isLocked: true,
                },
                {
                  title: '测试组',
                  key: '0-0-1-2',
                  isLocked: false,
                },
              ],
            },
            {
              title: '销售部',
              key: '0-0-2',
              isLocked: false,
            },
          ],
        },
        {
          title: '森鑫源实业发展有限公司',
          key: '0-1',
          isLocked: false,
          children: [
            {
              title: '财务部',
              key: '0-1-1',
              isLocked: false,
              children: [
                {
                  title: '结算部',
                  key: '0-1-1-0',
                  isLocked: false,
                },
                {
                  title: '会计部',
                  key: '0-1-1-1',
                  isLocked: false,
                },
              ],
            },
            {
              title: '人力资源部',
              key: '0-1-2',
              isLocked: false,
            },
          ],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置新增编辑查看菜单表单数据
   * @Author bihongbin
   * @Date 2020-08-04 15:48:47
   */
  useEffect(() => {
    handleMenuState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '菜单编码',
          placeholder: '请输入菜单编码',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请输入菜单编码',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '排序序号',
          placeholder: '请输入排序序号',
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '菜单中文名',
          placeholder: '请输入菜单中文名',
          rules: [
            {
              required: true,
              message: '请输入菜单中文名',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '菜单英文名',
          placeholder: '请输入菜单英文名',
          rules: [
            {
              required: true,
              message: '请输入菜单英文名',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'e',
          label: '菜单类型',
          placeholder: '请选择菜单类型',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请选择菜单类型',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'f',
          label: '应用级别',
          placeholder: '请选择应用级别',
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'g',
          label: '菜单地址',
          placeholder: '请输入菜单地址',
          colProps: {
            span: 20,
          },
        },
        {
          componentName: 'Switch',
          name: 'h',
          label: ' ',
          valuePropName: 'checked',
          colProps: {
            span: 4,
          },
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
        },
        {
          componentName: 'Input',
          name: 'i',
          label: '界面引用',
          placeholder: '请输入界面引用',
        },
        {
          componentName: 'Select',
          name: 'j',
          label: '层级',
          selectData: [],
          placeholder: '请选择层级',
        },
        {
          componentName: 'Select',
          name: 'k',
          label: '父级菜单',
          selectData: [],
          placeholder: '请选择父级菜单',
          rules: [
            {
              required: true,
              message: '请选择父级菜单',
            },
          ],
        },
        {
          componentName: 'Radio',
          name: 'l',
          label: '节点',
          selectData: [
            {
              label: '父节点',
              value: '0',
            },
            {
              label: '子节点',
              value: '1',
            },
          ],
        },
        {
          componentName: 'Radio',
          name: 'm',
          label: '展开状态',
          selectData: [
            {
              label: '折叠',
              value: '0',
            },
            {
              label: '展开',
              value: '1',
            },
          ],
        },
        {
          componentName: 'HideInput',
          name: 'ii',
          label: '菜单图标',
          colProps: { span: 24 },
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => handleIconState({ visible: true })}
              >
                <Avatar
                  className="pointer"
                  src={state.iconModal.src}
                  shape="square"
                  size="large"
                  alt="菜单图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 请选择自己心仪的菜单图标
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'Switch',
          name: 'o',
          label: '是否可见',
          valuePropName: 'checked',
          colProps: {
            span: 8,
          },
        },
        {
          componentName: 'Switch',
          name: 'p',
          label: '是否公开',
          valuePropName: 'checked',
          colProps: {
            span: 8,
          },
        },
        {
          componentName: 'Switch',
          name: 'q',
          label: '权限域',
          valuePropName: 'checked',
          colProps: {
            span: 8,
          },
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
        },
      ],
    })
  }, [state.iconModal.src])

  /**
   * @Description 设置菜单权限码列表操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-03 18:18:41
   */
  useEffect(() => {
    /**
     * @Description 验证是否选择
     * @Author bihongbin
     * @Date 2020-08-05 15:13:56
     */
    const layoutTableVerification = () => {
      let bool = false
      if (layoutTableRef.current) {
        let ids = layoutTableRef.current.getSelectIds()
        if (!ids.length) {
          message.warn('请选择数据', 1.5)
          return bool
        }
        if (ids.length > 1) {
          message.warn('最多只能选个1条', 1.5)
          return bool
        }
        return ids
      }
      return bool
    }
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '新增',
          clickConfirm: () => {
            handleMenuCodeState({
              id: '',
              title: '新增菜单权限编码',
              visible: true,
            })
          },
        },
        {
          name: '基础权限',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids) {
              handleConfigBasicModalState({ visible: true, id: ids })
            }
          },
        },
        {
          name: '数据权限',
          clickConfirm: () => {},
        },
        {
          name: '页面权限',
          clickConfirm: (e: any) => {},
        },
        {
          name: '参数配置',
          clickConfirm: () => {},
        },
      ],
    })
  }, [])

  /**
   * @Description 设置菜单权限码列表表头数据
   * @Author bihongbin
   * @Date 2020-08-03 18:19:06
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_MENU_CODE_COLUMNS_LIST,
      payload: [
        {
          width: 60,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '菜单权限编码*',
          dataIndex: 'a',
        },
        {
          title: '描述*',
          dataIndex: 'b',
          ellipsis: true,
        },
        {
          title: '权限约束',
          dataIndex: 'c',
        },
        {
          title: '状态',
          dataIndex: 'd',
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
          width: 85,
          render: (value: number, record: any) => {
            const operatingData = []
            // 编辑权限
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleMenuCodeState({
                  title: '编辑菜单权限编码',
                  visible: true,
                  id: record.id,
                })
              },
              svg: 'table_edit.png',
            })
            // 删除权限
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

  /**
   * @Description 设置菜单权限编码表单数据
   * @Author bihongbin
   * @Date 2020-08-04 17:09:47
   */
  useEffect(() => {
    handleMenuCodeState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '权限编码',
          placeholder: '请输入权限编码',
          rules: [
            {
              required: true,
              message: '请输入权限编码',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '描述',
          placeholder: '请输入描述',
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '权限约束',
          placeholder: '请输入权限约束',
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '排序序号',
          placeholder: '请输入排序序号',
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
        },
      ],
    })
  }, [])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getBasicQtyList}
        middleEmpty={state.middleEmpty}
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="菜单权限码列表"
        searchRightBtnOpen={false}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.menuCodeColumnsList,
          size: {
            xs: 24,
            sm: 24,
            xxl: 18,
          },
          tableConfig: {
            scroll: { x: 1200, y: 500 },
          },
        }}
        leftRender={{
          size: {
            xs: 24,
            sm: 24,
            xxl: 6,
          },
          jsx: (
            <Card
              title="基础菜单"
              extra={
                <>
                  <Button type="text" onClick={handleAddMenu}>
                    新增
                  </Button>
                  <Divider type="vertical" />
                  <Button type="text" onClick={handleEditMenu}>
                    编辑
                  </Button>
                </>
              }
            >
              <TreeNode
                ref={treeNodeRef}
                searchOpen
                processOpen
                data={state.basicMenu}
                onSelect={handleTreeSelectNode}
              />
            </Card>
          ),
        }}
        topRender={{
          jsx: (
            <Card className="mb-5" title="资源菜单信息">
              <GenerateForm
                className="form-large-font14 form-margin-bottom-none"
                formConfig={{ size: 'large', labelCol: { span: 5 } }}
                rowGridConfig={{ gutter: 60 }}
                colGirdConfig={{
                  span: 12,
                }}
                ref={resourceMenuInfoFormRef}
                list={state.resourceMenuFormList}
              />
            </Card>
          ),
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleMenuState({ visible: false })}
        {...state.menuHandleModal}
      />
      <LayoutFormModal
        ref={menuCodeFormRef}
        onCancel={() => handleMenuCodeState({ visible: false })}
        {...state.menuCodeModal}
      />
      <IconSelectionModal
        {...state.iconModal}
        onCancel={() => handleIconState({ visible: false })}
        onConfirm={(item) => {
          layoutFormModalRef.current?.setFormValues({
            ii: item.src,
          })
          handleIconState({
            visible: false,
            src: item.src,
          })
        }}
      />
      <Modal
        width={500}
        visible={state.configBasicPermissionsModal.visible}
        destroyOnClose
        onCancel={() => handleConfigBasicModalState({ visible: false })}
        maskClosable={false}
        footer={null}
      >
        <Spin spinning={state.configBasicPermissionsModal.loading}>
          <Row className="mb-5" align="middle" justify="space-between">
            <div className="divider-title bold">配置基础权限</div>
            <Button
              className="mr-5"
              type="link"
              onClick={() => {
                dispatch({
                  type: ActionType.SET_CONFIG_BASIC_PERMISSIONS_MODAL,
                  payload: {
                    customizeVisible: !state.configBasicPermissionsModal
                      .customizeVisible,
                  },
                })
              }}
            >
              自定义
            </Button>
          </Row>
          <div className="mb-2">
            <ButtonGroup
              buttonClassName="sxy-btn-round mr-6 mb-6"
              data={state.configBasicPermissionsModal.basicList}
              onChange={(data) => {
                dispatch({
                  type: ActionType.SET_CONFIG_BASIC_PERMISSIONS_MODAL,
                  payload: {
                    customizeButton: data,
                  },
                })
              }}
            />
          </div>
          <Divider className="mn" />
          {state.configBasicPermissionsModal.customizeVisible ? (
            <>
              <div className="divider-title bold mt-5 mb-5">自定义权限</div>
              <ButtonGroup
                buttonClassName="sxy-btn-round mr-6 mb-6"
                deleteOpen
                data={state.configBasicPermissionsModal.customizeButton}
              />
            </>
          ) : (
            <>
              <div className="divider-title bold mt-5 mb-5">配置自定义权限</div>
              <GenerateForm
                className="form-ash-theme form-large-font14 mb-5"
                rowGridConfig={{ gutter: 10 }}
                formConfig={{ size: 'large', labelCol: { span: 4 } }}
                list={state.configBasicPermissionsModal.formList}
              />
            </>
          )}
          <Divider className="mn" />
          <Row className="mt-8" justify="center">
            <Button
              className="font-14 mr-5"
              size="large"
              onClick={() => handleConfigBasicModalState({ visible: false })}
            >
              关闭
            </Button>
            <Button className="font-14" size="large" type="primary">
              保存
            </Button>
          </Row>
        </Spin>
      </Modal>
    </>
  )
}

export default MenuMainList
