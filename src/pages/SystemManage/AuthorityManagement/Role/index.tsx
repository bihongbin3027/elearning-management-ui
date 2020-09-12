import React, { useRef, useReducer, useEffect } from 'react'
import {
  Button,
  Tabs,
  Row,
  Col,
  Checkbox,
  Avatar,
  Modal,
  message,
  Card,
} from 'antd'
import _ from 'lodash'
import { TableCallType } from '@/components/GenerateTable'
import LayoutTableList, { FormListCallType } from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import TreeNode from '@/components/Tree'
import useToggle from '@/hooks/useToggle'
import PermissionsViewModal from '@/pages/SystemManage/AuthorityManagement/PermissionsViewModal'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import Upload from '@/components/Upload'
import { AnyObjectType } from '@/typings'
import { GlobalConstant } from '@/config'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import { SxyIcon } from '@/style/module/icon'
import {
  getBasicQtyList,
  handleBasicQtyList,
  setBasicQtyStatus,
  deleteBasicQtyList,
} from '@/api/basicData'

const { TabPane } = Tabs
const { Group } = Checkbox

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_LIST = '[SetSearchList Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_COLUMNS_LIST = '[SetColumnsList Action]',
  SET_BASIC_RULE = '[SetBasicRule Action]',
  SET_ROLE_HANDLE_MODAL = '[SetRoleHandleModal Action]',
  SET_ROLE_ICON_MODAL = '[SetIconModal Action]',
  SET_PORT_UPLOAD_MODAL = '[SetPortUploadModal Action]',
  SET_RULE_VIEW_MODAL = '[SetRuleViewModal Action]',
}

const stateValue = {
  searchList: [], // 头部搜索数据
  cardHandleButtonList: [], // 卡片操作按钮数据
  columnsList: [], // 表格头数据
  basicRule: [], // 基础权限数据
  // 新增编辑查看角色弹窗
  roleHandleModal: {
    visible: false,
    disable: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
  // 角色图标弹窗
  iconModal: {
    visible: false,
    src: '',
  },
  // 导入上传弹窗
  portUploadModal: {
    visible: false,
    data: [] as AnyObjectType[],
  },
  // 角色权限视图弹窗
  ruleViewModal: {
    visible: false,
  },
}

const RoleMainList = () => {
  const layoutTableRef = useRef<TableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  // 角色权限授权菜单卡片显示隐藏状态
  const [controlLayoutState, { setLeft, setRight }] = useToggle(
    {
      size: {
        xs: 24,
        sm: 24,
        xxl: 24,
      },
      visible: false,
    },
    {
      size: {
        xs: 24,
        sm: 24,
        xxl: 18,
      },
      visible: true,
    },
  )
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_LIST: // 设置头部搜索数据
        return {
          ...state,
          searchList: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置卡片操作按钮数据
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_COLUMNS_LIST: // 设置表格头数据
        return {
          ...state,
          columnsList: action.payload,
        }
      case ActionType.SET_BASIC_RULE: // 设置基础权限数据
        return {
          ...state,
          basicRule: action.payload,
        }
      case ActionType.SET_ROLE_HANDLE_MODAL: // 设置新增编辑查看角色弹窗数据
        return {
          ...state,
          roleHandleModal: {
            ...state.roleHandleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_ROLE_ICON_MODAL: // 设置角色图标弹窗数据
        return {
          ...state,
          iconModal: {
            ...state.iconModal,
            ...action.payload,
          },
        }
      case ActionType.SET_PORT_UPLOAD_MODAL: // 设置导入（上传）弹窗数据
        return {
          ...state,
          portUploadModal: {
            ...state.portUploadModal,
            ...action.payload,
          },
        }
      case ActionType.SET_RULE_VIEW_MODAL: // 设置角色权限视图弹窗数据
        return {
          ...state,
          ruleViewModal: {
            ...state.ruleViewModal,
            ...action.payload,
          },
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 设置新增编辑查看角色弹窗数据
   * @Author bihongbin
   * @Date 2020-08-01 16:20:02
   */
  const handleRoleState = (data: Partial<StateType['roleHandleModal']>) => {
    dispatch({
      type: ActionType.SET_ROLE_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置角色权限授权菜单预览
   * @Author bihongbin
   * @Date 2020-08-01 11:22:34
   */
  const handlePreviewState = (data: Partial<StateType['ruleViewModal']>) => {
    dispatch({
      type: ActionType.SET_RULE_VIEW_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置角色图标弹窗相关
   * @Author bihongbin
   * @Date 2020-08-03 10:17:30
   */
  const handleIconState = (data: Partial<StateType['iconModal']>) => {
    dispatch({
      type: ActionType.SET_ROLE_ICON_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置导入（上传）弹窗数据
   * @Author bihongbin
   * @Date 2020-08-03 11:52:46
   */
  const handleProtUpload = (data: Partial<StateType['portUploadModal']>) => {
    dispatch({
      type: ActionType.SET_PORT_UPLOAD_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 上传成功回调
   * @Author bihongbin
   * @Date 2020-08-03 11:43:42
   */
  const handlePortUploadSuccess = (data: AnyObjectType[]) => {
    let params: AnyObjectType[] = []
    for (let item of data) {
      if (item.response && _.isArray(item.response.data)) {
        params = [...params, ...item.response.data]
      }
    }
    handleProtUpload({ data: params })
  }

  /**
   * @Description 导入
   * @Author bihongbin
   * @Date 2020-08-03 13:46:53
   */
  const handlePortUploadSave = () => {
    console.log('需要导入的数据', state.portUploadModal.data)
  }

  /**
   * @Description 设置头部搜索数据
   * @Author bihongbin
   * @Date 2020-07-31 16:19:56
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_SEARCH_LIST,
      payload: [
        {
          componentName: 'Input',
          name: 'a',
          placeholder: '角色名称',
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '角色状态',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'c',
          placeholder: '角色类型',
          selectData: [],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置卡片头操作数据
   * @Author bihongbin
   * @Date 2020-08-01 16:25:57
   */
  useEffect(() => {
    /**
     * @Description 验证是否选择
     * @Author bihongbin
     * @Date 2020-08-05 15:13:45
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
          name: '查看',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids) {
              handlePreviewState({ visible: true })
            }
          },
        },
        {
          name: '授权',
          clickConfirm: () => {},
        },
        {
          name: '新增',
          clickConfirm: () => {
            handleRoleState({
              visible: true,
              disable: false,
              title: '新增角色信息',
            })
          },
        },
        {
          name: '导入',
          clickConfirm: () => {
            handleProtUpload({
              visible: true,
            })
          },
        },
        {
          name: '导出',
          clickConfirm: () => {},
        },
      ],
    })
  }, [])

  /**
   * @Description 设置新增编辑查看角色弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-01 16:30:55
   */
  useEffect(() => {
    handleRoleState({
      formList: [
        {
          componentName: 'Select',
          name: 'a',
          label: '角色类型',
          selectData: [],
          placeholder: '请选择角色类型',
          rules: [
            {
              required: true,
              message: '请选择角色类型',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '系统',
          selectData: [],
          placeholder: '请选择系统',
          rules: [
            {
              required: true,
              message: '请选择系统',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '角色中文名',
          placeholder: '请输入角色中文名',
          rules: [
            {
              required: true,
              message: '请输入角色中文名',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '角色英文名',
          placeholder: '请输入角色英文名',
          rules: [
            {
              required: true,
              message: '请输入角色英文名',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'e',
          label: '公司',
          placeholder: '请选择公司',
          selectData: [],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'f',
          label: '公司范围',
          placeholder: '请选择公司范围',
          selectData: [],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'g',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'h',
          label: '使用等级',
          placeholder: '请选择使用等级',
          selectData: [],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'HideInput',
          name: 'ii',
          label: '角色图标',
          disabled: state.roleHandleModal.disable,
          colProps: { span: 24 },
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  if (!state.roleHandleModal.disable) {
                    handleIconState({ visible: true })
                  }
                }}
              >
                <Avatar
                  className="pointer"
                  src={state.iconModal.src}
                  shape="square"
                  size="large"
                  alt="角色图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 点击图标可以任意更换角色图标哦
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'Switch',
          name: 'j',
          label: '默认组织',
          valuePropName: 'checked',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'k',
          label: '是否显示',
          valuePropName: 'checked',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.roleHandleModal.disable,
        },
      ],
    })
  }, [state.roleHandleModal.disable, state.iconModal.src])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-08-01 16:26:41
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_COLUMNS_LIST,
      payload: [
        {
          width: 60,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '角色名称',
          dataIndex: 'a',
        },
        {
          title: '英文名称',
          dataIndex: 'b',
        },
        {
          title: '状态',
          dataIndex: 'c',
        },
        {
          title: '系统',
          dataIndex: 'd',
        },
        {
          title: '角色公司',
          dataIndex: 'e',
        },
        {
          title: '级别',
          dataIndex: 'f',
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
                handleRoleState({
                  visible: true,
                  disable: true,
                  id: record.id,
                  title: '查看角色信息',
                })
              },
              svg: 'table_see.png',
            })
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleRoleState({
                  visible: true,
                  disable: false,
                  id: record.id,
                  title: '编辑角色信息',
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

  /**
   * @Description 设置基础权限数据
   * @Author bihongbin
   * @Date 2020-08-01 16:27:25
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_BASIC_RULE,
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

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getBasicQtyList}
        autoGetList
        searchFormList={state.searchList}
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="角色列表"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.columnsList,
          size: controlLayoutState.size,
          tableConfig: {
            onRow: (record) => {
              return {
                onClick: () => setRight(),
              }
            },
          },
        }}
        rightRender={
          controlLayoutState.visible
            ? {
                jsx: (
                  <Card
                    title="角色权限授权菜单"
                    extra={
                      <>
                        <Button
                          type="text"
                          onClick={() => handlePreviewState({ visible: true })}
                        >
                          预览
                        </Button>
                      </>
                    }
                  >
                    <Tabs className="mb-4" defaultActiveKey="1">
                      <TabPane tab="基础权限" key="1">
                        <TreeNode
                          searchOpen
                          checkedOpen
                          data={state.basicRule}
                        />
                      </TabPane>
                      <TabPane tab="数据权限" key="2">
                        Content of Tab Pane 2
                      </TabPane>
                      <TabPane tab="页面权限" key="3">
                        Content of Tab Pane 3
                      </TabPane>
                      <TabPane tab="分配公司" key="4">
                        Content of Tab Pane 4
                      </TabPane>
                    </Tabs>
                    <Tabs className="mb-4" defaultActiveKey="1">
                      <TabPane tab="常规角色" key="1">
                        <Group>
                          <Row>
                            <Col className="mb-3" span={24}>
                              <Checkbox value="A">
                                admin<span className="ml-5">超级管理员</span>
                              </Checkbox>
                            </Col>
                            <Col className="mb-3" span={24}>
                              <Checkbox value="B">
                                min123<span className="ml-5">超级用户</span>
                              </Checkbox>
                            </Col>
                            <Col className="mb-3" span={24}>
                              <Checkbox value="C">
                                abc<span className="ml-5">普通用户</span>
                              </Checkbox>
                            </Col>
                          </Row>
                        </Group>
                      </TabPane>
                      <TabPane tab="拒绝角色" key="2">
                        Content of Tab Pane 2
                      </TabPane>
                    </Tabs>
                    <Row justify="center">
                      <Button className="mr-5" onClick={setLeft}>
                        关闭
                      </Button>
                      <Button type="primary">保存</Button>
                    </Row>
                  </Card>
                ),
                size: {
                  xs: 24,
                  sm: 24,
                  xxl: 6,
                },
              }
            : undefined
        }
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
        width={360}
        title="文件导入"
        visible={state.portUploadModal.visible}
        destroyOnClose
        onCancel={() => handleProtUpload({ visible: false })}
        maskClosable={false}
        footer={null}
      >
        <Upload
          action={GlobalConstant.fieldConfigUploadHttp}
          uploadType={['xls', 'xlsx']}
          uploadSuccess={handlePortUploadSuccess}
          multiple
        >
          <>
            <Row className="ml-5" align="middle">
              <Col>
                <SxyIcon
                  className="pointer"
                  width={60}
                  height={60}
                  name="curriculum_upload.png"
                />
              </Col>
              <Col>
                <div className="ml-3">请选择文件</div>
              </Col>
            </Row>
            <div className="text-desc mt-5 ml-5">支持xls、xlsx文件格式</div>
          </>
        </Upload>
        <Row className="mt-10 mb-5" justify="center">
          <Col>
            <Button
              className="font-14"
              size="large"
              onClick={() => handleProtUpload({ visible: false })}
            >
              取消
            </Button>
            <Button
              className="font-14 ml-5"
              size="large"
              type="primary"
              onClick={handlePortUploadSave}
            >
              导入
            </Button>
          </Col>
        </Row>
      </Modal>
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleRoleState({ visible: false })}
        {...state.roleHandleModal}
      />
      <PermissionsViewModal
        onCancel={() => handlePreviewState({ visible: false })}
        {...state.ruleViewModal}
      />
    </>
  )
}

export default RoleMainList
