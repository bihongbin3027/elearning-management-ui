import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { message, Avatar, Card } from 'antd'
import { ColumnType } from 'antd/es/table'
import moment from 'moment'
import useSetState from '@/hooks/useSetState'
import TreeNode from '@/components/Tree'
import { TreeType, TreeNodeCallType } from '@/components/Tree/interface'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import { RootStateType } from '@/store/rootReducer'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import CardHeaderButton from '@/components/CardHeaderButton'
import { GlobalConstant } from '@/config'
import { genderData } from '@/config/selectData'
import UserListModal from '@/pages/SystemManage/AuthorityManagement/UserListModal'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import layoutStore from '@/store/module/layout'
import { handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import {
  getOrganization,
  getOrgUser,
  dropTreeUpdate,
  handleOrgTree,
  deleteOrgTreeList,
  deleteOrgUser,
  addOrgUser,
  editOrgUser,
} from '@/api/systemManage/org'

interface StateType {
  searchList: FormListCallType[]
  orgCardButton: CardButtonType[]
  orgTreeList: TreeType[]
  orgTreeSelected: AnyObjectType
  middleEmpty: boolean
  orgHandleModal: LayoutFormPropTypes
  iconModal: {
    visible: boolean
    src: string
  }
  cardHandleButtonList: CardButtonType[]
  orgColumnsList: ColumnType<AnyObjectType>[]
  userListModal: {
    visible: boolean
    width: number
    title: string
    ids: string[]
  }
  jobFormModal: {
    type: 'add' | 'edit'
  } & LayoutFormPropTypes
}

const OrganizationMainList = () => {
  const dispatchRedux = useDispatch()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const orgDepartmentUsers =
    GlobalConstant.menuPermissionsCode.systemManagement.orgDepartmentUsers // 菜单部门用户列表code
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const jobFormModalRef = useRef<LayoutFormModalCallType>()
  const treeNodeRef = useRef<TreeNodeCallType>()
  const {
    orgCategorySelectList, // 使用等级
    dutyCategorySelectList, // 工作岗位
  } = useSelector((state: RootStateType) => ({
    ...state.layout,
  }))
  const [state, setState] = useSetState<StateType>({
    // 头部搜索数据
    searchList: [
      {
        componentName: 'Input',
        name: 'search',
        placeholder: '用户名，中英文，QQ，手机号',
      },
    ],
    orgCardButton: [], // 组织树卡片头操作按钮
    orgTreeList: [], // 组织架构树
    orgTreeSelected: {}, // 当前树选中
    middleEmpty: true, // 无数据状态（默认显示）
    // 组织架构新增编辑查看弹窗
    orgHandleModal: {
      visible: false,
      id: '',
      title: '',
      submitApi: handleOrgTree,
      formList: [],
    },
    // 组织图标弹窗
    iconModal: {
      visible: false,
      src: '',
    },
    cardHandleButtonList: [], // 部门用户卡片操作按钮
    orgColumnsList: [], // 部门用户列表表头数据
    // 新增部门用户弹窗
    userListModal: {
      visible: false,
      width: 1000,
      title: '部门添加用户',
      ids: [], // 选中的用户
    },
    // 选择岗位弹窗
    jobFormModal: {
      visible: false,
      width: 420,
      type: 'add', // 新增或修改add、edit
      title: '选择岗位',
      formList: [],
    },
  })

  /**
   * @Description 基础菜单节点选择
   * @Author bihongbin
   * @Date 2020-08-05 14:48:46
   */
  const handleTreeSelectNode = (data: React.Key[], e: AnyObjectType) => {
    if (data.length && layoutTableRef.current) {
      if (!state.middleEmpty) {
        setState({
          middleEmpty: false, // 控制无数据状态
        })
      }
      // 当前树选中的对象
      setState({
        orgTreeSelected: e.node,
      })
    }
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
   * @Description 获取组织机构树
   * @Author bihongbin
   * @Date 2020-10-21 17:17:43
   */
  const getOrgData = useCallback(async () => {
    if (treeNodeRef.current) {
      treeNodeRef.current.setLoading(true)
      try {
        const result = await getOrganization() // 获取组织机构数据
        if (result.data && result.data.length) {
          // 转换树
          const transformTreeData = (data: AnyObjectType[]) => {
            let eachTree = (list: AnyObjectType[], mark: string = '0') => {
              for (let [index, item] of list.entries()) {
                item.title = item.name
                item.key = `${mark}_${index}` // 生成唯一标识key
                if (parseInt(item.pid) === 0) {
                  item.processOpen = true
                }
                if (item.children) {
                  eachTree(item.children, item.key)
                }
              }
            }
            eachTree(data)
            return data as TreeType[]
          }
          const treeData = transformTreeData([...result.data])
          setState({
            middleEmpty: false, // 关闭无数据状态
            orgTreeList: treeData, // 设置组织机构数据
          })
          if (
            treeNodeRef.current &&
            !treeNodeRef.current.getSelectNode().length
          ) {
            const record = result.data[0]
            treeNodeRef.current.setSelectNode([record.key]) // 设置组织机构默认选中
            setState({
              orgTreeSelected: record,
            })
          }
        }
      } catch (error) {}
      treeNodeRef.current.setLoading(false)
    }
  }, [setState])

  /**
   * @Description 是否允许拖拽
   * @Author bihongbin
   * @Date 2020-10-26 09:28:03
   */
  const verificationDropTreeCallback = (info: AnyObjectType) => {
    if (parseInt(info.dragNode.allowEdit) === 0) {
      message.warn('不允许修改', 1.5)
      return true
    }
    return false
  }

  /**
   * @Description 拖拽完成回调
   * @Author bihongbin
   * @Date 2020-10-26 09:27:17
   */
  const dropTreeCallback = async (info: AnyObjectType, tree: TreeType[]) => {
    const currentKey = info.dragNode.key.substr(0, 3)
    // 查找当前拖拽的祖先模块
    const deepModule = (data: TreeType[]) => {
      let rootModule = {} as TreeType
      const getDeep = (list: TreeType[]) => {
        for (let item of list) {
          if (item.key.substr(0, 3) === currentKey) {
            rootModule = item
            return
          }
          if (item.children) {
            getDeep(item.children)
          }
        }
      }
      getDeep(data)
      return rootModule
    }
    const module = deepModule(tree)
    if (module.id) {
      try {
        await dropTreeUpdate({
          id: info.dragNode.id,
          data: module,
        })
        message.success('操作成功', 1.5)
      } catch (error) {}
    }
  }

  /**
   * @Description 添加用户
   * @Author bihongbin
   * @Date 2020-10-22 11:53:52
   */
  const setUserData = async (data: AnyObjectType = {}) => {
    const type = state.jobFormModal.type
    jobFormModalRef.current?.setFormSaveLoading(true)
    try {
      if (type === 'add') {
        await addOrgUser({
          id: state.orgTreeSelected.id,
          data: {
            userIdList: state.userListModal.ids,
            ...data,
          },
        })
        message.success('新增成功', 1.5)
      }
      if (type === 'edit') {
        await editOrgUser({
          idList: state.userListModal.ids,
          ...data,
        })
        message.success('修改成功', 1.5)
      }
      setState((prev) => {
        prev.jobFormModal.visible = false
        return prev
      })
      if (layoutTableRef.current) {
        layoutTableRef.current.getTableList()
      }
    } catch (error) {}
    jobFormModalRef.current?.setFormSaveLoading(false)
  }

  /**
   * @Description 设置组织架构卡片头按操作按钮
   * @Author bihongbin
   * @Date 2020-11-10 17:48:00
   */
  useEffect(() => {
    setState({
      orgCardButton: [
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            let selectData = getTreeSelectNode()
            if (selectData.length) {
              setState((prev) => {
                prev.orgHandleModal.id = ''
                prev.orgHandleModal.visible = true
                prev.orgHandleModal.title = '新增组织'
                return prev
              })
            }
          },
        },
        {
          name: '编辑',
          authCode: authBasic.EDIT,
          icon: 'icon_list_add.png',
          clickConfirm: async () => {
            let selectData = getTreeSelectNode()
            if (selectData.length) {
              setState((prev) => {
                prev.orgHandleModal.id = state.orgTreeSelected.id
                prev.orgHandleModal.visible = true
                prev.orgHandleModal.title = '编辑组织'
                return prev
              })
              if (layoutFormModalRef.current) {
                layoutFormModalRef.current.setFormLoading(true)
                try {
                  const result = await handleOrgTree(
                    { id: state.orgTreeSelected.id },
                    'get',
                  )
                  layoutFormModalRef.current.setFormValues({
                    orgCode: result.data.orgCode,
                    orgCategory: String(result.data.orgCategory),
                    orgCabr: result.data.orgCabr,
                    orgEabr: result.data.orgEabr,
                    orgCname: result.data.orgCname,
                    orgEname: result.data.orgEname,
                    sortSeq: result.data.sortSeq,
                    parentName: result.data.parentName,
                    startTime: moment(result.data.startTime),
                    endTime: moment(result.data.endTime),
                    leafFlag: String(result.data.leafFlag),
                    orgIcon: result.data.orgIcon,
                    innerFlag: String(result.data.innerFlag),
                    remark: result.data.remark,
                  })
                } catch (error) {}
                layoutFormModalRef.current.setFormLoading(false)
              }
            }
          },
        },
      ],
    })
  }, [authBasic.ADD, authBasic.EDIT, setState, state.orgTreeSelected.id])

  /**
   * @Description 设置组织架构新增编辑查看弹窗数据
   * @Author bihongbin
   * @Date 2020-08-06 10:46:54
   */
  useEffect(() => {
    setState((prev) => {
      prev.orgHandleModal.formList = [
        {
          componentName: 'Input',
          name: 'orgCode',
          label: '组织编码',
          placeholder: '请输入组织编码',
          rules: [
            {
              required: true,
              message: '请输入组织编码',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'orgCategory',
          label: '组织类型',
          placeholder: '请选择组织类型',
          selectData: orgCategorySelectList,
          rules: [
            {
              required: true,
              message: '请选择组织类型',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'orgCabr',
          label: '组织中文名',
          placeholder: '请输入组织中文名',
          rules: [
            {
              required: true,
              message: '请输入组织中文名',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'orgEabr',
          label: '组织英文名',
          placeholder: '请输入组织英文名',
        },
        {
          componentName: 'Input',
          name: 'orgCname',
          label: '组织中文全称',
          placeholder: '请输入组织中文全称',
          rules: [
            {
              required: true,
              message: '请输入组织中文全称',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'orgEname',
          label: '组织英文全称',
          placeholder: '请输入组织英文全称',
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
        },
        {
          componentName: 'Input',
          name: 'parentName',
          label: '父级组织',
          placeholder: '请输入父级组织',
          disabled: true,
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
          componentName: 'Radio',
          name: 'leafFlag',
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
        // TODO 图标功能未做
        {
          componentName: 'HideInput',
          name: 'orgIcon',
          label: '组织图标',
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  setState((prev) => {
                    prev.iconModal.visible = false
                    return prev
                  })
                }}
              >
                <Avatar
                  className="pointer"
                  src={state.iconModal.src}
                  shape="square"
                  size="large"
                  alt="组织图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 请选择自己心仪的图标
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'Radio',
          name: 'innerFlag',
          label: '是否内部组织',
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
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
        },
      ]
      return prev
    })
  }, [orgCategorySelectList, setState, state.iconModal.src])

  /**
   * @Description 设置默认父级组织值
   * @Author bihongbin
   * @Date 2020-10-22 09:24:39
   */
  useEffect(() => {
    if (state.orgHandleModal.visible) {
      setTimeout(() => {
        if (
          layoutFormModalRef.current &&
          Object.keys(state.orgTreeSelected).length
        ) {
          // 设置父级组织
          layoutFormModalRef.current.setFormValues({
            parentName: state.orgTreeSelected.name,
          })
        }
      })
    }
  }, [state.orgHandleModal.visible, state.orgTreeSelected])

  /**
   * @Description 新增部门用户
   * @Author bihongbin
   * @Date 2020-08-06 11:15:02
   */
  useEffect(() => {
    setState({
      cardHandleButtonList: [
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.userListModal.title = '添加部门用户'
              prev.userListModal.visible = true
              return prev
            })
          },
        },
        {
          name: '修改工作岗位',
          authCode: authBasic.EDIT,
          icon: 'icon_list_edit.png',
          clickConfirm: () => {
            if (layoutTableRef.current) {
              const ids = layoutTableRef.current.getSelectIds()
              console.log('ids', ids)
              if (!ids.length) {
                message.warn('请选择部门用户', 1.5)
                return
              }
              setState((prev) => {
                prev.userListModal.ids = ids
                return prev
              })
              setState((prev) => {
                prev.jobFormModal.visible = true
                prev.jobFormModal.type = 'edit'
                return prev
              })
            }
          },
        },
      ],
    })
  }, [authBasic.ADD, authBasic.EDIT, setState])

  /**
   * @Description 工作岗位表单
   * @Author bihongbin
   * @Date 2020-10-22 11:04:01
   */
  useEffect(() => {
    setState((prev) => {
      prev.jobFormModal.formList = [
        {
          componentName: 'Select',
          name: 'workDuty',
          label: '工作岗位',
          placeholder: '请选择工作岗位',
          selectData: dutyCategorySelectList,
          colProps: {
            span: 24,
          },
        },
      ]
      return prev
    })
  }, [dutyCategorySelectList, setState])

  /**
   * @Description 设置部门用户列表表头数据
   * @Author bihongbin
   * @Date 2020-08-03 18:19:06
   */
  useEffect(() => {
    setState({
      orgColumnsList: [
        {
          width: 80,
          title: '序号',
          dataIndex: 'sortSeq',
          ellipsis: true,
        },
        {
          title: '用户名',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '工号',
          dataIndex: 'workNumber',
          ellipsis: true,
        },
        {
          title: '用户姓名',
          dataIndex: 'cname',
          ellipsis: true,
        },
        {
          title: '工作岗位',
          dataIndex: 'workDuty',
          ellipsis: true,
          render: (value: string) => {
            const result = dutyCategorySelectList.find(
              (item) => item.value === value,
            )
            return result ? result.label : value
          },
        },
        {
          title: '性别',
          dataIndex: 'gender',
          ellipsis: true,
          render: (value: number) => {
            const result = genderData.find(
              (item) => parseInt(item.value) === value,
            )
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
          width: 250,
          title: '默认部门',
          dataIndex: 'orgName',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 55,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
            if (value > 0) {
              operatingData.push({
                name: '删除',
                authCode: authBasic.DELETE,
                svg: 'table_delete.png',
                onClick: () => {
                  if (layoutTableRef.current) {
                    handleRowDelete(
                      [record.id],
                      deleteOrgUser,
                      layoutTableRef.current.getTableList,
                    )
                  }
                },
              })
            }
            return (
              <TableOperate
                menuCode={orgDepartmentUsers.code}
                operateButton={operatingData}
              />
            )
          },
        },
      ],
    })
  }, [
    authBasic.DELETE,
    dutyCategorySelectList,
    orgDepartmentUsers.code,
    setState,
  ])

  /**
   * @Description 数据字典
   * @Author bihongbin
   * @Date 2020-10-21 15:45:58
   */
  useEffect(() => {
    // 使用等级
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_ORG_CATEGORY',
        saveName: 'orgCategorySelectList',
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
   * @Description 获取部门用户列表
   * @Author bihongbin
   * @Date 2020-10-21 17:50:47
   */
  useEffect(() => {
    if (layoutTableRef.current && state.orgTreeSelected.id) {
      // 加载用户列表
      layoutTableRef.current.getTableList({
        orgId: state.orgTreeSelected.id,
      })
    }
  }, [state.orgTreeSelected.id])

  /**
   * @Description 获取组织机构树
   * @Author bihongbin
   * @Date 2020-10-21 14:30:23
   */
  useEffect(() => {
    getOrgData()
  }, [getOrgData])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getOrgUser}
        layoutTableListAuthCode={orgDepartmentUsers.code}
        middleEmpty={state.middleEmpty}
        searchFormList={state.searchList}
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="部门用户列表"
        searchRightBtnOpen={false}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.orgColumnsList,
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
            <Card
              className="mb-5"
              title="组织架构"
              extra={<CardHeaderButton buttonList={state.orgCardButton} />}
            >
              <TreeNode
                ref={treeNodeRef}
                searchOpen
                processOpen
                draggableOpen
                deleteApi={deleteOrgTreeList}
                data={state.orgTreeList}
                onSelect={handleTreeSelectNode}
                onDropCallBack={dropTreeCallback}
                onVerificationDropCallBack={verificationDropTreeCallback}
                updateCallBack={getOrgData}
              />
            </Card>
          ),
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            leafFlag: '1',
            innerFlag: '1',
          },
        }}
        submitExtraParameters={{
          parentId: state.orgHandleModal.id
            ? state.orgTreeSelected.pid
            : state.orgTreeSelected.id,
        }}
        onCancel={() => {
          setState((prev) => {
            prev.orgHandleModal.visible = false
            return prev
          })
        }}
        onConfirm={() => {
          getOrgData()
        }}
        {...state.orgHandleModal}
      />
      <UserListModal
        onCancel={() => {
          setState((prev) => {
            prev.userListModal.visible = false
            return prev
          })
        }}
        onConfirm={(data) => {
          if (data && data.length) {
            // 保存选择的用户
            setState((prev) => {
              prev.userListModal.ids = data
              return prev
            })
            // 打开选择岗位弹窗
            setState((prev) => {
              prev.jobFormModal.visible = true
              prev.jobFormModal.type = 'add'
              return prev
            })
            return Promise.resolve(true)
          } else {
            return Promise.reject('请选择用户')
          }
        }}
        {...state.userListModal}
      />
      <LayoutFormModal
        ref={jobFormModalRef}
        onCancel={() => {
          setState((prev) => {
            prev.jobFormModal.visible = false
            return prev
          })
        }}
        onConfirm={(data: AnyObjectType) => {
          setUserData(data)
        }}
        {...state.jobFormModal}
      />
      <IconSelectionModal
        {...state.iconModal}
        onCancel={() => {
          setState((prev) => {
            prev.iconModal.visible = false
            return prev
          })
        }}
        onConfirm={(item) => {
          layoutFormModalRef.current?.setFormValues({
            ii: item.src,
          })
          setState((prev) => {
            prev.iconModal.visible = false
            prev.iconModal.src = item.src
            return prev
          })
        }}
      />
    </>
  )
}

export default OrganizationMainList
