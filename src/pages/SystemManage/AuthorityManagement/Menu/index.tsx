import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Row,
  Button,
  Divider,
  Modal,
  message,
  Avatar,
  Spin,
  Card,
  Typography,
  Tabs,
  Space,
} from 'antd'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { ColumnType } from 'antd/es/table'
import useSetState from '@/hooks/useSetState'
import TreeNode from '@/components/Tree'
import { RootStateType } from '@/store/rootReducer'
import { TreeType, TreeNodeCallType } from '@/components/Tree/interface'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import LayoutTableList, {
  LayoutTableCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import ButtonGroup from '@/components/ButtonGroup'
import { ButtonGroupListType } from '@/components/ButtonGroup/interface'
import { ButtonGroupCallType } from '@/components/ButtonGroup/interface'
import layoutStore from '@/store/module/layout'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import CardHeaderButton from '@/components/CardHeaderButton'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import { AnyObjectType } from '@/typings'
import { statusData } from '@/config/selectData'
import { handleRowDelete } from '@/utils'
import useMenuParams from '@/hooks/useMenuParams'
import { GlobalConstant } from '@/config'
import {
  getMenuTreeList,
  handleMenuList,
  getMenuPermissionList,
  deleteMenuTreeList,
  switchMenuTreeList,
  getBasicButtonList,
  getDataButtonList,
  getResourceButtonMenuList,
  addMenuPermissionList,
  addMenuPermissionView,
  dropTreeUpdate,
} from '@/api/systemManage/menu'
import { handlePermissionList } from '@/api/systemManage/permission'
import { handleModuleList } from '@/api/systemManage/module'

const { TabPane } = Tabs
const { Text } = Typography

interface StateType {
  menuCardButton: CardButtonType[]
  basicMenu: TreeType[]
  treeSelected: AnyObjectType
  middleEmpty: boolean
  menuHandleModal: LayoutFormPropTypes
  iconModal: {
    visible: boolean
    src: string
  }
  resourceMenuFormList: FormListType[]
  cardHandleTabs: {
    current: string
    data: {
      name: string
      value: string
      code: string
    }[]
  }
  configBasicPermissionsModal: {
    loading: boolean
    saveLoading: boolean
    visible: boolean
    id: string
    basicList: ButtonGroupListType[]
    basicPagesText: string
    basicPages: {
      page: number
      size: number
    }
    tabsType: string
    formList: FormListType[]
    customizeVisible: boolean
    customizeButton: ButtonGroupListType[]
  }
  menuCodeColumnsList: ColumnType<AnyObjectType>[]
  menuCodeModal: LayoutFormPropTypes
}

const loadMoreText = '加载更多'

const MenuMainList = () => {
  const dispatchRedux = useDispatch()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const currentMenuObj = useMenuParams()
  const resourceMenuInfoFormRef = useRef<FormCallType>()
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const treeNodeRef = useRef<TreeNodeCallType>()
  const menuCodeFormRef = useRef<LayoutFormModalCallType>()
  const buttonGroupRef = useRef<ButtonGroupCallType>()
  const customizeFormRef = useRef<FormCallType>()
  const {
    useLevelSelectList, // 使用等级
  } = useSelector((state: RootStateType) => ({
    ...state.layout,
  }))
  const [state, setState] = useSetState<StateType>({
    menuCardButton: [], // 菜单树卡片头操作按钮
    basicMenu: [], // 基础菜单数据
    treeSelected: {}, // 当前树选中
    middleEmpty: true, // 无数据状态（默认显示）
    // 新增编辑菜单弹窗
    menuHandleModal: {
      visible: false,
      id: '',
      title: '',
      submitApi: handleMenuList,
      formList: [],
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
        name: 'menuCode',
        label: '菜单编码',
      },
      {
        componentName: 'Input',
        name: 'menuCname',
        label: '菜单中文名',
      },
      {
        componentName: 'Input',
        name: 'id',
        label: 'id/序号',
      },
      {
        componentName: 'Input',
        name: 'permissionGrade',
        label: '应用级别',
      },
      {
        componentName: 'Input',
        name: 'navigateUrl',
        label: '菜单地址',
      },
    ],
    cardHandleTabs: {
      current: 'PERMISSION',
      data: [
        {
          name: '基础权限',
          value: 'PERMISSION',
          code: 'RBAC_MENU_MGR_PERMISSION',
        },
        { name: '数据权限', value: 'DATA', code: 'RBAC_MENU_MGR_DATA' },
        { name: '资源权限', value: 'RESOURCE', code: 'RBAC_MENU_MGR_RESOURCE' },
      ],
    },
    // 配置基础权限弹窗
    configBasicPermissionsModal: {
      loading: false,
      saveLoading: false,
      visible: false, // 弹窗显示隐藏
      id: '', // 当前选择的行id
      // 菜单权限按钮
      basicList: [],
      basicPagesText: loadMoreText,
      // 分页
      basicPages: {
        page: 1,
        size: 20,
      },
      // 菜单权限弹窗标题
      tabsType: '',
      formList: [
        {
          componentName: 'Input',
          name: 'permissionCode',
          label: '权限编码',
          colProps: {
            span: 24,
          },
        },
        {
          componentName: 'Input',
          name: 'permissionName',
          label: '权限名称',
          colProps: {
            span: 24,
          },
        },
      ],
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
      submitApi: handlePermissionList,
      formList: [],
    },
  })

  /**
   * @Description 基础菜单节点选择
   * @Author bihongbin
   * @Date 2020-08-05 14:48:46
   */
  const handleTreeSelectNode = (data: React.Key[], e: AnyObjectType) => {
    // 当前树选中的对象
    setState({
      treeSelected: e.node,
    })
    if (e.node.category === 'MENU' || e.node.category === 'MODULE') {
      setState({
        middleEmpty: false, // 关闭无数据状态
      })
      setTimeout(() => {
        getLayoutData(e.node)
      }, 100)
      switchTabsChange(state.cardHandleTabs.current) // 切换菜单权限码列表
    }
  }

  /**
   * @Description 当前页面权限菜单
   * @Author bihongbin
   * @Date 2020-11-09 09:28:49
   */
  const currentPageAuth = useMemo(
    () => currentMenuObj.currentMenu && currentMenuObj.currentMenu,
    [currentMenuObj.currentMenu],
  )

  /**
   * @Description 获取树菜单
   * @Author bihongbin
   * @Date 2020-10-15 17:12:19
   */
  const getTreeData = useCallback(async () => {
    if (treeNodeRef.current) {
      treeNodeRef.current.setLoading(true)
      try {
        const result = await getMenuTreeList() // 获取树数据
        if (result.data && result.data.length) {
          // 转换树
          const transformTreeData = (data: AnyObjectType[]) => {
            let eachTree = (list: AnyObjectType[], mark: string = '0') => {
              for (let [index, item] of list.entries()) {
                item.title = item.name
                item.key = `${mark}_${index}` // 生成唯一标识key
                if (item.category === 'SYSTEM') {
                  item.disabled = true
                  item.processOpen = true
                  item.noDrag = true
                }
                if (item.category === 'MODULE') {
                  item.processOpen = true
                  item.noDrag = true
                }
                if (item.children) {
                  eachTree(item.children, item.key)
                }
              }
            }
            eachTree(data)
            return data as TreeType[]
          }
          setState({
            basicMenu: transformTreeData(result.data), // 设置树数据
          })
        }
      } catch (error) {}
      treeNodeRef.current.setLoading(false)
    }
  }, [setState])

  /**
   * @Description 是否允许拖拽
   * @Author bihongbin
   * @Date 2020-10-21 13:57:08
   */
  const verificationDropTreeCallback = (info: AnyObjectType) => {
    if (info.dragNode.moduleId !== info.node.moduleId) {
      message.warn('只允许在同一个系统模块下拖动', 1.5)
      return true
    }
    return false
  }

  /**
   * @Description 拖拽完成回调
   * @Author bihongbin
   * @Date 2020-10-21 11:05:14
   */
  const dropTreeCallback = async (info: AnyObjectType, tree: TreeType[]) => {
    // 查找当前拖拽的父级系统模块
    const deepModule = (data: TreeType[]) => {
      let obj = { id: '', parent: {} }
      let parentModule = {} as TreeType
      const getDeep = (list: TreeType[], parent?: TreeType) => {
        for (let item of list) {
          if (item.category === 'MODULE') {
            parentModule = item
          }
          if (item.key === info.dragNode.key) {
            obj.id = item.id || ''
            obj.parent = parent || {}
            return
          }
          if (item.children) {
            getDeep(item.children, parentModule)
          }
        }
      }
      getDeep(data)
      return obj
    }
    const module = deepModule([...tree])
    if (module.id) {
      try {
        await dropTreeUpdate({
          id: module.id,
          data: module.parent,
        })
        message.success('操作成功', 1.5)
      } catch (error) {}
    }
  }

  /**
   * @Description 获取主界面详情数据
   * @Author bihongbin
   * @Date 2020-10-15 09:37:06
   */
  const getLayoutData = useCallback(
    async (data: AnyObjectType) => {
      if (layoutTableRef.current) {
        // 应用级别
        const getPermissionGradeName = (value: string | number) => {
          let permissionGradeName = useLevelSelectList.find(
            (item) => item.value === value,
          )
          return permissionGradeName?.label
        }
        try {
          if (resourceMenuInfoFormRef.current) {
            // 模块
            if (data.category === 'MODULE') {
              const result = await handleModuleList(
                {
                  id: data.id,
                },
                'get',
              )
              const {
                moduleCode,
                moduleCname,
                id,
                permissionGrade,
              } = result.data
              // 资源菜单信息
              resourceMenuInfoFormRef.current.formSetValues({
                menuCode: moduleCode,
                menuCname: moduleCname,
                id,
                permissionGrade: getPermissionGradeName(permissionGrade),
                navigateUrl: '',
              })
            }
            // 菜单
            if (data.category === 'MENU') {
              const result = await handleMenuList(
                {
                  id: data.id,
                },
                'get',
              )
              const {
                menuCode,
                menuCname,
                id,
                permissionGrade,
                navigateUrl,
              } = result.data
              // 资源菜单信息
              resourceMenuInfoFormRef.current.formSetValues({
                menuCode,
                menuCname,
                id,
                permissionGrade: getPermissionGradeName(permissionGrade),
                navigateUrl,
              })
            }
          }
        } catch (error) {}
      }
    },
    [useLevelSelectList],
  )

  /**
   * @Description 获取树选中的节点
   * @Author bihongbin
   * @Date 2020-08-04 15:43:13
   */
  const getTreeSelectNode = (params: AnyObjectType) => {
    if (treeNodeRef.current) {
      let selectData = treeNodeRef.current.getSelectCurrent()
      if (!selectData.length) {
        if (params.type === 'edit') {
          message.warn('请选择菜单节点', 1.5)
        }
        if (params.type === 'add') {
          message.warn('请选择节点', 1.5)
        }
        return []
      } else {
        // 编辑必须选择菜单节点
        if (params.type === 'edit' && selectData[0].category !== 'MENU') {
          message.warn('请选择菜单节点', 1.5)
          return []
        }
      }
      return selectData
    }
    return []
  }

  /**
   * @Description 获取菜单权限码弹窗列表
   * @Author bihongbin
   * @Date 2020-11-16 09:57:51
   */
  const getBasicButtonData = useCallback(
    async (searchParams, activeKey, loadMore?) => {
      setState((prev) => {
        prev.configBasicPermissionsModal.loading = true
        return prev
      })
      searchParams = {
        status: 1,
        ...searchParams,
      }
      try {
        let buttonList: any[] = []
        let tabsType = ''
        // 基础权限
        if (activeKey === 'PERMISSION') {
          const result = await getBasicButtonList(searchParams)
          buttonList = result.data.content.map((item: AnyObjectType) => {
            item.name = item.buttonCname
            item.value = item.buttonCode
            return item
          })
          tabsType = '基础权限'
        }
        // 数据权限
        if (activeKey === 'DATA') {
          const result = await getDataButtonList(searchParams)
          buttonList = result.data.content.map((item: AnyObjectType) => {
            item.name = item.ruleCname
            item.value = item.ruleCode
            return item
          })
          tabsType = '数据权限'
        }
        // 资源权限
        if (activeKey === 'RESOURCE') {
          const result = await getResourceButtonMenuList(searchParams)
          buttonList = result.data.content.map((item: AnyObjectType) => {
            item.name = item.resourceName
            item.value = item.resourceCode
            return item
          })
          tabsType = '资源权限'
        }
        // 设置菜单权限按钮
        setState((prev) => {
          prev.configBasicPermissionsModal.loading = false
          prev.configBasicPermissionsModal.tabsType = tabsType
          if (loadMore) {
            if (buttonList.length) {
              prev.configBasicPermissionsModal.basicList = prev.configBasicPermissionsModal.basicList.concat(
                buttonList,
              )
            } else {
              prev.configBasicPermissionsModal.basicPagesText = '没有更多了'
            }
          } else {
            prev.configBasicPermissionsModal.basicList = buttonList
          }
          return prev
        })
      } catch (error) {
        setState((prev) => {
          prev.configBasicPermissionsModal.loading = false
          return prev
        })
      }
    },
    [setState],
  )

  /**
   * @Description 获取菜单权限码弹窗列表回显
   * @Author bihongbin
   * @Date 2020-11-16 09:58:16
   */
  const getBasicButtonDetails = useCallback(async () => {
    setState((prev) => {
      prev.configBasicPermissionsModal.loading = true
      return prev
    })
    try {
      // 新增菜单权限码回显数据
      const result = await addMenuPermissionView({
        menuId: state.treeSelected.id,
        category: state.cardHandleTabs.current,
      })
      // 找出里面禁用的按钮
      const groupButtonList = state.configBasicPermissionsModal.basicList.map(
        (item) => {
          item.selected = result.data.permissionIdList.some(
            (i: string) => i === item.id,
          )
          return item
        },
      )
      setState((prev) => {
        prev.configBasicPermissionsModal.loading = false
        prev.configBasicPermissionsModal.basicList = groupButtonList // 设置权限配置按钮
        // 设置权限配置自定义
        prev.configBasicPermissionsModal.customizeButton = result.data.customList.map(
          (item: AnyObjectType) => {
            item.name = item.permissionName
            item.value = item.permissionCode
            return item
          },
        )
        return prev
      })
    } catch (error) {
      setState((prev) => {
        prev.configBasicPermissionsModal.loading = false
        return prev
      })
    }
  }, [
    setState,
    state.cardHandleTabs,
    state.configBasicPermissionsModal.basicList,
    state.treeSelected.id,
  ])

  /**
   * @Description 切换菜单权限码列表
   * @Author bihongbin
   * @Date 2020-10-16 15:13:54
   */
  const switchTabsChange = useCallback(
    async (activeKey: string) => {
      setState((prev) => {
        prev.configBasicPermissionsModal.basicPagesText = loadMoreText
        prev.configBasicPermissionsModal.basicPages = {
          page: 1,
          size: 20,
        }
        prev.cardHandleTabs.current = activeKey
        return prev
      })
    },
    [setState],
  )

  /**
   * @Description 打开菜单权限码弹窗
   * @Author bihongbin
   * @Date 2020-10-19 09:42:20
   */
  const openMenuPermissionCodeModal = useCallback(async () => {
    if (currentPageAuth && !currentPageAuth.children) {
      message.warn('暂无权限', 1.5)
      return
    }
    setState((prev) => {
      prev.configBasicPermissionsModal.visible = true
      return prev
    })
    // 当分页是第一页的时候才查询
    if (state.configBasicPermissionsModal.basicPages.page === 1) {
      // 接口参数
      const searchParams = {
        page: 1,
        size: 20,
      }
      // 加载列表
      await getBasicButtonData(searchParams, state.cardHandleTabs.current)
      // 加载列表回显
      await getBasicButtonDetails()
    }
  }, [
    currentPageAuth,
    getBasicButtonData,
    getBasicButtonDetails,
    setState,
    state.cardHandleTabs,
    state.configBasicPermissionsModal.basicPages.page,
  ])

  /**
   * @Description 菜单权限码加载更多
   * @Author bihongbin
   * @Date 2020-11-16 09:06:56
   */
  const loadMore = async () => {
    let searchParams = {
      page: state.configBasicPermissionsModal.basicPages.page + 1,
      size: 20,
    }
    if (state.configBasicPermissionsModal.basicPagesText === loadMoreText) {
      setState((prev) => {
        prev.configBasicPermissionsModal.basicPages.page = searchParams.page
        return prev
      })
      // 加载列表
      await getBasicButtonData(searchParams, state.cardHandleTabs.current, true)
      // 加载列表回显
      await getBasicButtonDetails()
    }
  }

  /**
   * @Description 新增菜单权限码
   * @Author bihongbin
   * @Date 2020-10-16 16:32:03
   */
  const addMenuPermissionCodeModal = async () => {
    setState((prev) => {
      prev.configBasicPermissionsModal.saveLoading = true
      return prev
    })
    try {
      if (
        buttonGroupRef.current &&
        layoutTableRef.current &&
        customizeFormRef.current
      ) {
        let params: AnyObjectType[] = []
        const selectedButtonGroup = buttonGroupRef.current.getButtonGroupSelected()
        const {
          permissionCode,
          permissionName,
        } = await customizeFormRef.current.formSubmit()
        let auth = false
        // 验证
        if (!selectedButtonGroup.length) {
          if (permissionCode && !permissionName) {
            message.warn('请输入权限名称', 1.5)
            auth = true
          } else if (!permissionCode && permissionName) {
            message.warn('请输入权限编码', 1.5)
            auth = true
          } else {
            message.warn('请选择权限', 1.5)
            auth = true
          }
        } else {
          if (permissionCode && !permissionName) {
            message.warn('请输入权限名称', 1.5)
            auth = true
          } else if (!permissionCode && permissionName) {
            message.warn('请输入权限编码', 1.5)
            auth = true
          }
        }
        if (auth) {
          setState((prev) => {
            prev.configBasicPermissionsModal.saveLoading = false
            return prev
          })
          return
        }
        // 常规选中的按钮
        selectedButtonGroup.forEach((item) => {
          params.push({
            permissionBaseId: item.id,
            permissionCategory: state.cardHandleTabs.current,
            permissionName: item.name,
            permissionCode: item.value,
            resourceCategory: state.treeSelected.category,
            resourceId: state.treeSelected.id,
          })
        })
        // 自定义权限按钮
        state.configBasicPermissionsModal.customizeButton.forEach((item) => {
          params.push({
            permissionBaseId: 0,
            permissionCategory: state.cardHandleTabs.current,
            permissionName: item.name,
            permissionCode: item.value,
            resourceCategory: state.treeSelected.category,
            resourceId: state.treeSelected.id,
          })
        })
        // 自定义权限表单
        if (permissionCode && permissionName) {
          params.push({
            permissionBaseId: 0,
            permissionCategory: state.cardHandleTabs.current,
            permissionName,
            permissionCode,
            resourceCategory: state.treeSelected.category,
            resourceId: state.treeSelected.id,
          })
        }
        await addMenuPermissionList({
          id: state.treeSelected.id,
          params,
        })
        message.success('新增成功', 1.5)
        setState((prev) => {
          prev.configBasicPermissionsModal.saveLoading = false
          prev.configBasicPermissionsModal.visible = false
          return prev
        })
        layoutTableRef.current.getTableList()
      }
    } catch (error) {
      setState((prev) => {
        prev.configBasicPermissionsModal.saveLoading = false
        return prev
      })
    }
  }

  /**
   * @Description 菜单权限码详情
   * @Author bihongbin
   * @Date 2020-10-16 17:08:52
   */
  const getMenuPermissionCodeDetails = useCallback(async (id: string) => {
    if (menuCodeFormRef.current) {
      menuCodeFormRef.current.setFormLoading(true)
      try {
        const result = await handlePermissionList(
          {
            id,
          },
          'get',
        )
        const {
          permissionCode,
          permissionName,
          permissionConstraint,
          sortSeq,
          startTime,
          endTime,
          remark,
        } = result.data
        menuCodeFormRef.current.setFormValues({
          permissionCode,
          permissionName,
          permissionConstraint,
          sortSeq,
          startTime: moment(startTime),
          endTime: moment(endTime),
          remark,
        })
      } catch (error) {}
      menuCodeFormRef.current.setFormLoading(false)
    }
  }, [])

  /**
   * @Description 设置权限码列表卡片头权限
   * @Author bihongbin
   * @Date 2020-11-06 17:32:55
   */
  const permissionCodeList = useCallback(() => {
    let cardTabsList = [...state.cardHandleTabs.data]
    cardTabsList = cardTabsList.filter((item) => {
      if (currentMenuObj.currentMenu && currentMenuObj.currentMenu.children) {
        return currentMenuObj.currentMenu.children.some(
          (s) => s.code === item.code,
        )
      }
      return false
    })
    return (
      <Space size={32}>
        <Button
          className="is-btn-link"
          type="text"
          onClick={openMenuPermissionCodeModal}
        >
          新增
        </Button>
        <Tabs
          className="card-header-rightTop-tabs"
          activeKey={state.cardHandleTabs.current}
          onChange={switchTabsChange}
        >
          {cardTabsList.map((item) => (
            <TabPane tab={item.name} key={item.value} />
          ))}
        </Tabs>
      </Space>
    )
  }, [
    currentMenuObj.currentMenu,
    openMenuPermissionCodeModal,
    state.cardHandleTabs,
    switchTabsChange,
  ])

  /**
   * @Description 设置组织架构卡片头按操作按钮
   * @Author bihongbin
   * @Date 2020-11-10 18:28:43
   */
  useEffect(() => {
    setState({
      menuCardButton: [
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            let selectData = getTreeSelectNode({
              type: 'add',
            })
            if (selectData.length) {
              setState((prev) => {
                prev.menuHandleModal.id = ''
                prev.menuHandleModal.visible = true
                prev.menuHandleModal.title = '新增菜单信息'
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
            let selectData = getTreeSelectNode({
              type: 'edit',
            })
            if (selectData.length) {
              setState((prev) => {
                prev.menuHandleModal.id = state.treeSelected.id
                prev.menuHandleModal.visible = true
                prev.menuHandleModal.title = '编辑菜单信息'
                return prev
              })
              if (layoutFormModalRef.current) {
                layoutFormModalRef.current.setFormLoading(true)
                try {
                  const result = await handleMenuList(
                    { id: state.treeSelected.id },
                    'get',
                  )
                  const {
                    menuCode,
                    sortSeq,
                    menuCname,
                    menuEname,
                    menuType,
                    permissionGrade,
                    navigateUrl,
                    urlFlag,
                    startTime,
                    endTime,
                    interfaceRef,
                    parentId,
                    parentName,
                    leafFlag,
                    unfoldedFlag,
                    menuIcon,
                    visibleFlag,
                    publicFlag,
                    scopeFlag,
                    remark,
                  } = result.data
                  layoutFormModalRef.current.setFormValues({
                    menuCode,
                    sortSeq,
                    menuCname,
                    menuEname,
                    menuType: String(menuType),
                    permissionGrade: String(permissionGrade),
                    navigateUrl,
                    urlFlag: parseInt(urlFlag) === 1 ? true : false,
                    startTime: moment(startTime),
                    endTime: moment(endTime),
                    interfaceRef,
                    parentName: parentId === '0' ? parentId : parentName,
                    leafFlag: String(leafFlag),
                    unfoldedFlag: String(unfoldedFlag),
                    menuIcon,
                    visibleFlag: parseInt(visibleFlag) === 1 ? true : false,
                    publicFlag: parseInt(publicFlag) === 1 ? true : false,
                    scopeFlag: parseInt(scopeFlag) === 1 ? true : false,
                    remark,
                  })
                } catch (error) {}
                layoutFormModalRef.current.setFormLoading(false)
              }
            }
          },
        },
      ],
    })
  }, [authBasic.ADD, authBasic.EDIT, setState, state.treeSelected.id])

  /**
   * @Description 设置默认父级菜单值
   * @Author bihongbin
   * @Date 2020-10-15 17:36:36
   */
  useEffect(() => {
    if (state.menuHandleModal.visible && state.menuHandleModal.id === '') {
      setTimeout(() => {
        if (
          layoutFormModalRef.current &&
          Object.keys(state.treeSelected).length
        ) {
          // 设置父级菜单
          layoutFormModalRef.current.setFormValues({
            parentName:
              state.treeSelected.category === 'MODULE'
                ? 0
                : state.treeSelected.name,
          })
        }
      })
    }
  }, [
    state.menuHandleModal.id,
    state.menuHandleModal.visible,
    state.treeSelected,
  ])

  /**
   * @Description 设置新增编辑查看菜单表单数据
   * @Author bihongbin
   * @Date 2020-08-04 15:48:47
   */
  useEffect(() => {
    setState((prev) => {
      prev.menuHandleModal.formList = [
        {
          componentName: 'Input',
          name: 'menuCode',
          label: '菜单编码',
          placeholder: '请输入菜单编码',
          rules: [
            {
              required: true,
              message: '请输入菜单编码',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
        },
        {
          componentName: 'Input',
          name: 'menuCname',
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
          name: 'menuEname',
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
          name: 'menuType',
          label: '菜单类型',
          placeholder: '请选择菜单类型',
          selectData: [
            { label: '目录', value: '1' },
            { label: '菜单', value: '2' },
          ],
          rules: [
            {
              required: true,
              message: '请选择菜单类型',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'permissionGrade',
          label: '应用级别',
          placeholder: '请选择应用级别',
          selectData: useLevelSelectList,
        },
        {
          componentName: 'Input',
          name: 'navigateUrl',
          label: '菜单地址',
          placeholder: '请输入菜单地址',
          colProps: {
            span: 20,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              开启状态下为：外部地址；关闭状态为：内部地址；
            </Text>
          ),
        },
        {
          componentName: 'Switch',
          name: 'urlFlag',
          label: <span>&nbsp;</span>,
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
          name: 'interfaceRef',
          label: '界面引用',
          placeholder: '请输入界面引用',
        },
        {
          componentName: 'Input',
          name: 'parentName',
          label: '父级菜单',
          placeholder: '请输入父级菜单',
          disabled: true,
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
        {
          componentName: 'Radio',
          name: 'unfoldedFlag',
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
        // TODO 图标功能未做
        {
          componentName: 'HideInput',
          name: 'menuIcon',
          label: '菜单图标',
          colProps: {
            span: 24,
          },
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  setState((prev) => {
                    prev.iconModal.visible = true
                    return prev
                  })
                }}
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
          name: 'visibleFlag',
          label: '是否可见',
          valuePropName: 'checked',
          colProps: {
            span: 8,
          },
        },
        {
          componentName: 'Switch',
          name: 'publicFlag',
          label: '是否公开',
          valuePropName: 'checked',
          colProps: {
            span: 8,
          },
        },
        {
          componentName: 'Switch',
          name: 'scopeFlag',
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
      ]
      return prev
    })
  }, [setState, state.iconModal.src, useLevelSelectList])

  /**
   * @Description 获取菜单权限码列表
   * @Author bihongbin
   * @Date 2020-10-16 12:04:17
   */
  useEffect(() => {
    if (layoutTableRef.current) {
      let params = {
        menuId: undefined,
        category: state.cardHandleTabs.current,
        moduleId: undefined,
      }
      if (state.treeSelected.category === 'MODULE') {
        params.moduleId = state.treeSelected.id
      }
      if (state.treeSelected.category === 'MENU') {
        params.menuId = state.treeSelected.id
      }
      layoutTableRef.current.getTableList(params)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.cardHandleTabs.current,
    state.treeSelected.category,
    state.treeSelected.id,
  ])

  /**
   * @Description 设置菜单权限码列表表头数据
   * @Author bihongbin
   * @Date 2020-08-03 18:19:06
   */
  useEffect(() => {
    setState({
      menuCodeColumnsList: [
        {
          width: 80,
          title: '序号',
          dataIndex: 'sortSeq',
          ellipsis: true,
        },
        {
          title: '权限编码',
          dataIndex: 'permissionCode',
          ellipsis: true,
        },
        {
          title: '权限名称',
          dataIndex: 'permissionName',
          ellipsis: true,
        },
        {
          title: '权限约束',
          dataIndex: 'permissionConstraint',
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
          title: '生效日期',
          dataIndex: 'startTime',
          ellipsis: true,
        },
        {
          title: '失效日期',
          dataIndex: 'endTime',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 85,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
            // 菜单code
            let menuCode = ''
            let getMenuCurrentObj = state.cardHandleTabs.data.find(
              (item) => item.value === state.cardHandleTabs.current,
            )
            if (state.cardHandleTabs.current && getMenuCurrentObj) {
              menuCode = getMenuCurrentObj.code
            }
            if (value > 0) {
              // 编辑
              operatingData.push({
                name: '编辑',
                authCode: authBasic.EDIT,
                svg: 'table_edit.png',
                onClick: () => {
                  setState((prev) => {
                    prev.menuCodeModal.id = record.id
                    prev.menuCodeModal.visible = true
                    prev.menuCodeModal.title = '编辑菜单权限编码'
                    return prev
                  })
                  getMenuPermissionCodeDetails(record.id)
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
                      handlePermissionList,
                      layoutTableRef.current.getTableList,
                    )
                  }
                },
              })
            }
            return (
              <TableOperate menuCode={menuCode} operateButton={operatingData} />
            )
          },
        },
      ],
    })
  }, [
    authBasic.DELETE,
    authBasic.EDIT,
    getMenuPermissionCodeDetails,
    setState,
    state.cardHandleTabs,
  ])

  /**
   * @Description 设置菜单权限编码表单数据
   * @Author bihongbin
   * @Date 2020-08-04 17:09:47
   */
  useEffect(() => {
    setState((prev) => {
      prev.menuCodeModal.formList = [
        {
          componentName: 'Input',
          name: 'permissionCode',
          label: '权限编码',
          placeholder: '请输入权限编码',
          rules: [
            {
              required: true,
              message: '请输入权限编码',
            },
          ],
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'permissionName',
          label: '权限名称',
          placeholder: '请输入描述',
        },
        {
          componentName: 'Input',
          name: 'permissionConstraint',
          label: '权限约束',
          placeholder: '请输入权限约束',
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
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
      ]
      return prev
    })
  }, [setState])

  /**
   * @Description 数据字典
   * @Author bihongbin
   * @Date 2020-10-15 14:48:29
   */
  useEffect(() => {
    // 使用等级
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_PERMISSION_GRADE',
        saveName: 'useLevelSelectList',
      }),
    )
  }, [dispatchRedux])

  /**
   * @Description 获取菜单树
   * @Author bihongbin
   * @Date 2020-10-15 09:29:30
   */
  useEffect(() => {
    getTreeData()
  }, [getTreeData])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getMenuPermissionList}
        middleEmpty={state.middleEmpty}
        cardTopButton={permissionCodeList()}
        cardTopTitle="权限码列表"
        searchRightBtnOpen={false}
        tableColumnsList={{
          list: state.menuCodeColumnsList,
          size: {
            xs: 24,
            lg: 18,
            xxl: 18,
          },
          tableConfig: {
            scroll: { x: 1200, y: 500 },
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
              title="基础菜单"
              extra={<CardHeaderButton buttonList={state.menuCardButton} />}
            >
              <TreeNode
                ref={treeNodeRef}
                searchOpen
                processOpen
                draggableOpen
                deleteApi={deleteMenuTreeList}
                unLockApi={switchMenuTreeList}
                lockApi={switchMenuTreeList}
                data={state.basicMenu}
                onSelect={handleTreeSelectNode}
                onDropCallBack={dropTreeCallback}
                onVerificationDropCallBack={verificationDropTreeCallback}
                updateCallBack={getTreeData}
              />
            </Card>
          ),
        }}
        topRender={{
          jsx: (
            <Card className="mb-5" title="基础信息">
              <GenerateForm
                ref={resourceMenuInfoFormRef}
                className="form-large-font14 form-margin-bottom-none"
                list={state.resourceMenuFormList}
                formConfig={{ size: 'large', labelCol: { span: 5 } }}
                rowGridConfig={{ gutter: 60 }}
                colGirdConfig={{
                  span: 12,
                }}
              />
            </Card>
          ),
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            unfoldedFlag: '0',
            leafFlag: '1',
            menuType: '2',
            permissionGrade: 'U2',
            visibleFlag: true,
          },
        }}
        submitExtraParameters={{
          moduleId:
            state.treeSelected.category === 'MODULE'
              ? state.treeSelected.id
              : state.treeSelected.moduleId,
          parentId:
            state.treeSelected.category === 'MODULE'
              ? '0'
              : state.treeSelected.id,
        }}
        switchTransform={['visibleFlag', 'publicFlag', 'scopeFlag', 'urlFlag']}
        onCancel={() => {
          setState((prev) => {
            prev.menuHandleModal.visible = false
            return prev
          })
        }}
        onConfirm={() => {
          getTreeData()
        }}
        {...state.menuHandleModal}
      />
      <LayoutFormModal
        ref={menuCodeFormRef}
        submitExtraParameters={{
          permissionBaseId: state.menuCodeModal.id,
          permissionCategory: state.cardHandleTabs.current,
          resourceCategory: 'MENU',
          resourceId: state.treeSelected.id,
        }}
        onCancel={() => {
          setState((prev) => {
            prev.menuCodeModal.visible = false
            return prev
          })
        }}
        onConfirm={() => {
          layoutTableRef.current?.getTableList()
        }}
        {...state.menuCodeModal}
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
      <Modal
        width={500}
        visible={state.configBasicPermissionsModal.visible}
        destroyOnClose
        onCancel={() => {
          setState((prev) => {
            prev.configBasicPermissionsModal.visible = false
            return prev
          })
        }}
        maskClosable={false}
        footer={null}
      >
        <Spin spinning={state.configBasicPermissionsModal.loading}>
          <Row className="mb-5" align="middle" justify="space-between">
            <div className="divider-title bold">
              配置
              {state.configBasicPermissionsModal.tabsType}
            </div>
            <Button
              className="mr-5"
              type="link"
              onClick={() => {
                setState((prev) => {
                  prev.configBasicPermissionsModal.customizeVisible = !state
                    .configBasicPermissionsModal.customizeVisible
                  return prev
                })
              }}
            >
              自定义
            </Button>
          </Row>
          <div className="mb-2" style={{ maxHeight: 320, overflowY: 'auto' }}>
            <ButtonGroup
              ref={buttonGroupRef}
              buttonClassName="sxy-btn-round mr-5 mb-5"
              data={state.configBasicPermissionsModal.basicList}
            />
            <Row justify="center">
              <span className="pointer" onClick={loadMore}>
                {state.configBasicPermissionsModal.basicPagesText}
              </span>
            </Row>
          </div>
          <Divider className="mn" />
          <div
            style={{
              display: state.configBasicPermissionsModal.customizeVisible
                ? 'block'
                : 'none',
            }}
          >
            <div className="divider-title bold mt-5 mb-5">自定义权限</div>
            {state.configBasicPermissionsModal.customizeButton.length ? (
              <ButtonGroup
                buttonClassName="sxy-btn-round mr-5 mb-5"
                deleteOpen
                data={state.configBasicPermissionsModal.customizeButton}
                onChange={(data) => {
                  setState((prev) => {
                    prev.configBasicPermissionsModal.customizeButton = data
                    return prev
                  })
                }}
              />
            ) : (
              '无'
            )}
          </div>
          <div
            style={{
              display: !state.configBasicPermissionsModal.customizeVisible
                ? 'block'
                : 'none',
            }}
          >
            <div className="divider-title bold mt-5 mb-5">配置自定义权限</div>
            <GenerateForm
              ref={customizeFormRef}
              className="form-ash-theme form-large-font14 mb-5"
              rowGridConfig={{ gutter: 10 }}
              formConfig={{ size: 'large', labelCol: { span: 4 } }}
              list={state.configBasicPermissionsModal.formList}
            />
          </div>
          <Divider className="mn" />
          <Row className="mt-8" justify="center">
            <Button
              className="font-14 mr-5"
              size="large"
              onClick={() => {
                setState((prev) => {
                  prev.configBasicPermissionsModal.visible = false
                  return prev
                })
              }}
            >
              关闭
            </Button>
            <Button
              className="font-14"
              size="large"
              type="primary"
              loading={state.configBasicPermissionsModal.saveLoading}
              onClick={addMenuPermissionCodeModal}
            >
              保存
            </Button>
          </Row>
        </Spin>
      </Modal>
    </>
  )
}

export default MenuMainList
