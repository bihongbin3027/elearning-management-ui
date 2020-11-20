import React, { useRef, useEffect, useCallback } from 'react'
import { Card, message, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { ColumnType } from 'antd/es/table'
import useSetState from '@/hooks/useSetState'
import TreeNode from '@/components/Tree'
import { RootStateType } from '@/store/rootReducer'
import { TreeType, TreeNodeCallType } from '@/components/Tree/interface'
import GenerateForm from '@/components/GenerateForm'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import LayoutTableList, {
  FormFuncCallType,
  FormListCallType,
  LayoutTableCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import layoutStore from '@/store/module/layout'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import PermissionsViewModal from '@/pages/SystemManage/AuthorityManagement/PermissionsViewModal'
import AssigningRolesModal from '@/pages/SystemManage/AuthorityManagement/AssigningRolesModal'
import RoleDetailsModal from '@/pages/SystemManage/AuthorityManagement/RoleDetailsModal'
import ResetPasswordModal from '@/components/ResetPasswordModal'
import {
  transformTreeData,
  handleRowEnableDisable,
  handleRowDelete,
} from '@/utils'
import { AnyObjectType, SubmitApiType, SelectType } from '@/typings'
import { statusData, genderData } from '@/config/selectData'
import { GlobalConstant } from '@/config'
import {
  getUserList,
  handleUserList,
  resetPassword,
  switchUserList,
} from '@/api/systemManage/user'
import { getOrganization } from '@/api/systemManage/org'

interface StateType {
  searchList: FormListCallType[]
  orgTreeList: TreeType[]
  orgTreeSelected: AnyObjectType
  orgCardTitle: JSX.Element | string
  middleEmpty: boolean
  orgFormList: FormListCallType[]
  cardHandleButtonList: CardButtonType[]
  columnsList: ColumnType<AnyObjectType>[]
  userHandleModal: {
    modalType: 'add' | 'look' | 'edit'
  } & LayoutFormPropTypes
  ruleViewModal: {
    visible: boolean
    loading: boolean
    treeList: TreeType[]
    companyList: SelectType[]
  }
  assigningRolesModal: {
    visible: boolean
    width: number
    title: string
    id: string
  }
  roleDetailsModal: {
    visible: boolean
    width: number
    title: string
    id: string
  }
  resetPasswordModal: {
    visible: boolean
    title: string
    id: string
    submitApi: SubmitApiType
  }
}

const UserMainList = () => {
  const dispatchRedux = useDispatch()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const orgTreeRef = useRef<TreeNodeCallType>()
  const orgInfoFormRef = useRef<FormFuncCallType>()
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const {
    useLevelSelectList, // 使用等级
    dutyCategorySelectList, // 工作岗位
  } = useSelector((state: RootStateType) => ({
    ...state.layout,
  }))
  const [state, setState] = useSetState<StateType>({
    searchList: [], // 头部搜索数据
    orgTreeList: [], // 归属组织树数据
    orgTreeSelected: {}, // 当前树选中
    orgCardTitle: '组织/研发部', // 组织卡片标题
    middleEmpty: true, // 无数据状态（默认显示）
    // 组织详情
    orgFormList: [
      {
        componentName: 'Input',
        name: 'code',
        label: '组织编码',
      },
      {
        componentName: 'Input',
        name: 'categoryName',
        label: '组织类型',
      },
      {
        componentName: 'Input',
        name: 'name',
        label: '组织中文名',
      },
      {
        componentName: 'Input',
        name: 'ename',
        label: '组织英文名',
      },
    ],
    cardHandleButtonList: [], // 用户列表卡片操作按钮数据
    columnsList: [], // 表格头数据
    // 新增编辑查看角色弹窗
    userHandleModal: {
      visible: false,
      modalType: 'add',
      disable: false,
      id: '',
      title: '',
      submitApi: handleUserList,
      formList: [],
    },
    // 角色权限视图弹窗
    ruleViewModal: {
      visible: false,
      loading: false,
      treeList: [],
      companyList: [],
    },
    // 分配角色弹窗
    assigningRolesModal: {
      visible: false,
      width: 640,
      title: '给用户分配角色',
      id: '',
    },
    // 角色详情弹窗
    roleDetailsModal: {
      visible: false,
      width: 640,
      title: '用户角色详情',
      id: '',
    },
    // 重置密码弹窗
    resetPasswordModal: {
      visible: false,
      title: '重置密码',
      id: '',
      submitApi: resetPassword,
    },
  })

  /**
   * @Description 获取主界面详情数据
   * @Author bihongbin
   * @Date 2020-10-13 17:46:11
   */
  const getLayoutData = useCallback(
    (data: AnyObjectType) => {
      if (layoutTableRef.current) {
        setState({
          // 当前树选中的对象
          orgTreeSelected: data,
          // 卡片标题
          orgCardTitle: (
            <>
              组织/
              <Button className="is-btn-link font-16" type="link">
                {data.name}
              </Button>
            </>
          ),
        })
        // 组织详情
        orgInfoFormRef.current?.formSetValues({
          code: data.code,
          categoryName: data.categoryName,
          name: data.name,
          ename: data.ename,
        })
        // 加载用户列表
        layoutTableRef.current.getTableList({
          orgId: data.id,
        })
      }
    },
    [setState],
  )

  /**
   * @Description 归属组织节点选择
   * @Author bihongbin
   * @Date 2020-08-05 14:23:54
   */
  const handleTreeSelectNode = (data: React.Key[], e: AnyObjectType) => {
    getLayoutData(e.node)
  }

  /**
   * @Description 获取用户详情
   * @Author bihongbin
   * @Date 2020-10-12 15:34:20
   */
  const getListDetails = async (id: string) => {
    if (layoutFormModalRef.current) {
      layoutFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleUserList({ id }, 'get')
        layoutFormModalRef.current.setFormValues({
          userName: result.data.userName,
          permissionGrade: String(result.data.permissionGrade),
          mobilePhone: result.data.mobilePhone,
          email: result.data.email,
          cname: result.data.cname,
          ename: result.data.ename,
          sortSeq: result.data.sortSeq,
          gender: String(result.data.gender),
          workQq: result.data.workQq,
          workNumber: result.data.workNumber,
          startTime: moment(result.data.startTime),
          endTime: moment(result.data.endTime),
          adminFlag: String(result.data.adminFlag),
          enabled: parseInt(result.data.enabled) === 1 ? true : false,
          locked: parseInt(result.data.locked) === 1 ? true : false,
          loginLimit: parseInt(result.data.loginLimit) === 1 ? true : false,
          remark: result.data.remark,
        })
      } catch (error) {}
      layoutFormModalRef.current.setFormLoading(false)
    }
  }

  /**
   * @Description 数据字典
   * @Author bihongbin
   * @Date 2020-10-14 12:03:00
   */
  useEffect(() => {
    // 使用等级
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_PERMISSION_GRADE',
        saveName: 'useLevelSelectList',
      }),
    )
    // 工作岗位
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'SYS_DUTY_CATEGORY',
        saveName: 'dutyCategorySelectList',
      }),
    )
  }, [dispatchRedux])

  /**
   * @Description 设置头部表单搜索数据
   * @Author bihongbin
   * @Date 2020-08-04 18:05:34
   */
  useEffect(() => {
    setState({
      searchList: [
        {
          componentName: 'Input',
          name: 'search',
          placeholder: '账号，中英文，QQ，手机号',
        },
        {
          componentName: 'Select',
          name: 'status',
          placeholder: '状态',
          selectData: statusData,
        },
      ],
    })
  }, [setState])

  /**
   * @Description 设置用户列表卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-05 10:21:10
   */
  useEffect(() => {
    /**
     * @Description 验证是否选择
     * @Author bihongbin
     * @Date 2020-08-05 15:28:08
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
    setState({
      cardHandleButtonList: [
        {
          name: '权限',
          authCode: authBasic.VIEW_AUTH,
          icon: 'icon_list_see.png',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids) {
              setState((prev) => {
                prev.ruleViewModal.visible = true
                return prev
              })
            }
          },
        },
        {
          name: '分配',
          authCode: authBasic.AUTHORITY,
          icon: 'icon_list_empower.png',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids && layoutTableRef.current) {
              const ids = layoutTableRef.current.getSelectIds()
              setState((prev) => {
                prev.assigningRolesModal.visible = true
                prev.assigningRolesModal.id = ids[0]
                return prev
              })
            }
          },
        },
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.userHandleModal.modalType = 'add'
              prev.userHandleModal.disable = false
              prev.userHandleModal.visible = true
              prev.userHandleModal.id = ''
              prev.userHandleModal.title = '新增用户账号'
              return prev
            })
          },
        },
        {
          name: '导出',
          authCode: authBasic.EXPORT,
          icon: 'icon_list_import.png',
          clickConfirm: () => {},
        },
      ],
    })
  }, [
    authBasic.ADD,
    authBasic.AUTHORITY,
    authBasic.EXPORT,
    authBasic.VIEW_AUTH,
    setState,
  ])

  /**
   * @Description 设置新增编辑查看角色弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-05 18:14:10
   */
  useEffect(() => {
    const modalType = state.userHandleModal.modalType
    const isLook = modalType === 'look' // 查看
    const formVisible = isLook || modalType === 'edit' // 查看和编辑
    setState((prev) => {
      prev.userHandleModal.formList = [
        {
          componentName: 'Input',
          name: 'userName',
          label: '用户名',
          placeholder: '请输入用户名',
          rules: [
            {
              required: true,
              message: '请输入用户名',
            },
          ],
          disabled: isLook,
        },
        {
          componentName: 'Select',
          name: 'permissionGrade',
          label: '应用级别',
          placeholder: '请选择应用级别',
          selectData: useLevelSelectList,
          disabled: isLook,
        },
        {
          visible: formVisible,
          componentName: 'Input',
          name: 'password',
          label: '设置密码',
          placeholder: '请输入密码',
          rules: [
            {
              required: true,
              message: '请输入密码',
            },
          ],
        },
        {
          visible: formVisible,
          componentName: 'Input',
          name: 'password_confirm',
          label: '确认密码',
          dependencies: ['password'],
          placeholder: '请输入确认密码',
          rules: [
            {
              required: true,
              message: '请再次输入密码',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('两次输入的密码不一致')
              },
            }),
          ],
        },
        {
          componentName: 'Input',
          name: 'mobilePhone',
          label: '手机号码',
          placeholder: '请输入手机号码',
          disabled: isLook,
          rules: [
            () => ({
              validator(rule, value) {
                if (value) {
                  if (GlobalConstant.regular.iPhone.test(value)) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject('请输入正确格式的手机号码')
                  }
                } else {
                  return Promise.resolve()
                }
              },
            }),
          ],
        },
        {
          componentName: 'Input',
          name: 'email',
          label: '邮箱',
          placeholder: '请输入邮箱',
          disabled: isLook,
          rules: [
            () => ({
              validator(rule, value) {
                if (value) {
                  if (GlobalConstant.regular.email.test(value)) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject('请输入正确格式的邮箱')
                  }
                } else {
                  return Promise.resolve()
                }
              },
            }),
          ],
        },
        {
          componentName: 'Input',
          name: 'cname',
          label: '用户中文名',
          placeholder: '请输入用户中文名',
          disabled: isLook,
        },
        {
          componentName: 'Input',
          name: 'ename',
          label: '用户英文名',
          placeholder: '请输入用户英文名',
          disabled: isLook,
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: isLook,
        },
        {
          componentName: 'Select',
          name: 'gender',
          label: '性别',
          placeholder: '请选择性别',
          selectData: genderData,
          disabled: isLook,
        },
        {
          componentName: 'Select',
          name: 'workDuty',
          label: '工作岗位',
          placeholder: '请选择工作岗位',
          selectData: dutyCategorySelectList,
          disabled: isLook,
        },
        {
          componentName: 'Radio',
          name: 'staffFlag',
          label: '是否职员',
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
          disabled: isLook,
        },
        {
          componentName: 'Input',
          name: 'workQq',
          label: '工作QQ',
          placeholder: '请输入工作QQ',
          disabled: isLook,
        },
        {
          componentName: 'Input',
          name: 'workNumber',
          label: '工号',
          placeholder: '请输入工号',
          disabled: isLook,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: isLook,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: isLook,
        },
        {
          componentName: 'Radio',
          name: 'adminFlag',
          label: '是否设为管理员',
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
          disabled: isLook,
        },
        {
          componentName: 'Switch',
          name: 'enabled',
          label: '启用',
          valuePropName: 'checked',
          disabled: isLook,
        },
        {
          componentName: 'Switch',
          name: 'locked',
          label: '锁定',
          valuePropName: 'checked',
          disabled: isLook,
        },
        {
          componentName: 'Switch',
          name: 'loginLimit',
          label: '登录设备（限制多台设备同时登录）',
          valuePropName: 'checked',
          disabled: isLook,
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: isLook,
        },
      ]
      return prev
    })
  }, [
    dutyCategorySelectList,
    setState,
    state.userHandleModal.modalType,
    useLevelSelectList,
  ])

  /**
   * @Description 设置用户列表表格头
   * @Author bihongbin
   * @Date 2020-08-05 10:16:41
   */
  useEffect(() => {
    setState({
      columnsList: [
        {
          width: 80,
          title: '序号',
          dataIndex: 'sortSeq',
          ellipsis: true,
        },
        {
          title: '账号',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '中文名',
          dataIndex: 'cname',
          ellipsis: true,
        },
        {
          title: '英文名',
          dataIndex: 'ename',
          ellipsis: true,
        },
        {
          title: '级别',
          dataIndex: 'permissionGrade',
          ellipsis: true,
          render: (value: string) => {
            let result = useLevelSelectList.find((item) => item.value === value)
            return result && result.label
          },
        },
        {
          title: 'QQ号码',
          dataIndex: 'workQq',
          ellipsis: true,
        },
        {
          title: '手机号',
          dataIndex: 'mobilePhone',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          ellipsis: true,
          render: (value: number) => {
            let result = statusData.find(
              (item) => parseInt(item.value) === value,
            )
            return result && result.label
          },
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          align: 'right',
          width: 170,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
            // 查看
            operatingData.push({
              name: '查看',
              authCode: authBasic.QUERY,
              svg: 'table_see.png',
              onClick: () => {
                setState((prev) => {
                  prev.userHandleModal.modalType = 'look'
                  prev.userHandleModal.visible = true
                  prev.userHandleModal.disable = true
                  prev.userHandleModal.title = '用户账号详情'
                  prev.userHandleModal.id = record.id
                  return prev
                })
                getListDetails(record.id)
              },
            })
            if (value > 0) {
              // 编辑
              operatingData.push({
                name: '编辑',
                authCode: authBasic.EDIT,
                svg: 'table_edit.png',
                onClick: () => {
                  setState((prev) => {
                    prev.userHandleModal.modalType = 'edit'
                    prev.userHandleModal.visible = true
                    prev.userHandleModal.disable = false
                    prev.userHandleModal.title = '编辑用户账号'
                    prev.userHandleModal.id = record.id
                    return prev
                  })
                  getListDetails(record.id)
                },
              })
              // 删除
              operatingData.push({
                name: '删除',
                authCode: authBasic.DELETE,
                svg: 'table_delete.png',
                onClick: () => {
                  if (layoutTableRef.current) {
                    handleRowDelete(
                      [record.id],
                      handleUserList,
                      layoutTableRef.current.getTableList,
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
                    name: record.enabled === 0 ? '启用' : '禁用',
                    onClick: () => {
                      if (layoutTableRef.current) {
                        handleRowEnableDisable(
                          {
                            id: [record.id],
                            status: record.enabled,
                          },
                          switchUserList,
                          layoutTableRef.current.getTableList,
                        )
                      }
                    },
                  },
                  {
                    name: record.locked === 0 ? '锁定' : '解锁',
                    onClick: () => {
                      if (layoutTableRef.current) {
                        handleRowEnableDisable(
                          {
                            id: [record.id],
                            status: record.locked + 2,
                          },
                          switchUserList,
                          layoutTableRef.current.getTableList,
                        )
                      }
                    },
                  },
                  {
                    name: '重置密码',
                    onClick: () => {
                      setState((prev) => {
                        prev.resetPasswordModal.id = record.id
                        prev.resetPasswordModal.visible = true
                        return prev
                      })
                    },
                  },
                  {
                    name: '关联信息',
                    onClick: () => {},
                  },
                  {
                    name: '查看角色',
                    onClick: () => {
                      setState((prev) => {
                        prev.roleDetailsModal.id = record.id
                        prev.roleDetailsModal.visible = true
                        return prev
                      })
                    },
                  },
                ],
              })
            }
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [
    authBasic.DELETE,
    authBasic.EDIT,
    authBasic.MORE,
    authBasic.QUERY,
    setState,
    useLevelSelectList,
  ])

  /**
   * @Description 获取组织机构树
   * @Author bihongbin
   * @Date 2020-10-10 15:57:46
   */
  useEffect(() => {
    const getOrgData = async () => {
      if (orgTreeRef.current) {
        orgTreeRef.current.setLoading(true)
        try {
          const result = await getOrganization() // 获取组织机构数据
          if (result.data && result.data.length) {
            const treeData = transformTreeData(result.data, 'name')
            setState({
              middleEmpty: false, // 关闭无数据状态
              orgTreeList: treeData, // 设置组织机构数据
            })
            if (orgTreeRef.current) {
              const record = result.data[0]
              orgTreeRef.current.setSelectNode([record.id]) // 设置组织机构默认选中
              getLayoutData(record)
            }
          }
        } catch (error) {}
        orgTreeRef.current.setLoading(false)
      }
    }
    getOrgData()
  }, [getLayoutData, setState])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getUserList}
        middleEmpty={state.middleEmpty}
        searchFormList={state.searchList}
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="用户列表"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.columnsList,
          size: {
            xs: 24,
            lg: 18,
            xxl: 18,
          },
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
        leftRender={{
          size: {
            xs: 24,
            lg: 6,
            xxl: 6,
          },
          jsx: (
            <Card className="mb-5" title="归属组织">
              <TreeNode
                ref={orgTreeRef}
                searchOpen
                data={state.orgTreeList}
                onSelect={handleTreeSelectNode}
              />
            </Card>
          ),
        }}
        topRender={{
          jsx: (
            <Card className="mb-5" title={state.orgCardTitle}>
              <GenerateForm
                className="form-margin-bottom-none form-large-font14"
                ref={orgInfoFormRef}
                formConfig={{ size: 'large', labelCol: { span: 5 } }}
                rowGridConfig={{ gutter: 60 }}
                colGirdConfig={{
                  span: 12,
                }}
                list={state.orgFormList}
              />
            </Card>
          ),
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            permissionGrade: 'U2',
            gender: '1',
            adminFlag: '1',
            staffFlag: '1',
            enabled: true,
          },
        }}
        switchTransform={['enabled', 'locked', 'loginLimit']}
        submitExtraParameters={{ orgId: state.orgTreeSelected.id }}
        onCancel={() => {
          setState((prev) => {
            prev.userHandleModal.visible = false
            return prev
          })
        }}
        onConfirm={() => layoutTableRef.current?.getTableList()}
        {...state.userHandleModal}
      />
      <PermissionsViewModal
        onCancel={() => {
          setState((prev) => {
            prev.ruleViewModal.visible = false
            return prev
          })
        }}
        {...state.ruleViewModal}
      />
      <AssigningRolesModal
        onCancel={() => {
          setState((prev) => {
            prev.assigningRolesModal.visible = false
            return prev
          })
        }}
        {...state.assigningRolesModal}
      />
      <RoleDetailsModal
        onCancel={() => {
          setState((prev) => {
            prev.roleDetailsModal.visible = false
            return prev
          })
        }}
        {...state.roleDetailsModal}
      />
      <ResetPasswordModal
        submitExtraParameters={{ id: state.resetPasswordModal.id }}
        onConfirm={() => {
          setState((prev) => {
            prev.resetPasswordModal.visible = false
            return prev
          })
        }}
        onCancel={() => {
          setState((prev) => {
            prev.resetPasswordModal.visible = false
            return prev
          })
        }}
        {...state.resetPasswordModal}
      />
    </>
  )
}

export default UserMainList
