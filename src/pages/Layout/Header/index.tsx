import React, { useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Menu,
  Row,
  Col,
  Dropdown,
  Avatar,
  Modal,
  Button,
  Space,
  Form,
  Input,
  message,
  Typography,
} from 'antd'
import { MenuInfo } from 'rc-menu/lib/interface'
import {
  LockOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons'
import authStore from '@/store/module/auth'
import { RootStateType } from '@/store/rootReducer'
import useSetState from '@/hooks/useSetState'
import LayoutFormModal, {
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import { SxyButton } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import { AnyObjectType } from '@/typings'
import { SetUserMenuPayloadType } from '@/store/module/auth/types'
import { GlobalConstant } from '@/config'
import { queryCurrentMenuObject } from '@/utils'
import { resetUserPassword, logout } from '@/api/layout'
import { HeaderStyle } from '@/pages/Layout/Header/style'

const { confirm } = Modal
const { Text } = Typography

interface StateType {
  headerNav: {
    title: string
    width: number
    height: number
    icon: string
  }[]
  userInfoModal: LayoutFormPropTypes
  passwordModal: {
    visible: boolean
    saveLoading: boolean
  }
  closeTabsPage: boolean
}

const HeaderBox = () => {
  const location = useLocation()
  const history = useHistory()
  const dispatchRedux = useDispatch()
  const { user, tabLayout, systemInfo, openSider } = useSelector(
    (state: RootStateType) => ({
      ...state.auth,
      ...state.layout,
    }),
  )
  const [editPasswordForm] = Form.useForm() // 修改密码模态框表单
  const [state, setState] = useSetState<StateType>({
    // 头部菜单
    headerNav: [
      {
        title: '下载中心',
        width: 14,
        height: 14,
        icon: 'icon_head_download.png',
      },
      {
        title: '帮助中心',
        width: 14,
        height: 14,
        icon: 'icon_head_help.png',
      },
      {
        title: '公众号',
        width: 16,
        height: 14,
        icon: 'icon_head_chat.png',
      },
    ],
    // 个人信息弹窗
    userInfoModal: {
      visible: false,
      disable: true,
      title: '我的基本信息',
      formList: [
        {
          componentName: 'Input',
          name: 'cname',
          label: '姓名',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'userName',
          label: '用户名',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'orgName',
          label: '部门',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'workNumber',
          label: '工号',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'mobilePhone',
          label: '手机号码',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'email',
          label: '电子邮箱',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'workDuty',
          label: '职位',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'roleNames',
          label: '角色',
          disabled: true,
        },
      ],
    },
    // 修改密码模态窗
    passwordModal: {
      visible: false,
      saveLoading: false,
    },
    // 关闭全部tab菜单
    closeTabsPage: false,
  })

  /**
   * @Description 根据url查到当前路由对象
   * @Author bihongbin
   * @Date 2020-11-04 18:29:04
   */
  const currentMenuMemo = useMemo(
    () => queryCurrentMenuObject(tabLayout.tabList, location.pathname),
    [location.pathname, tabLayout.tabList],
  )

  /**
   * @Description 修改密码模态窗参数
   * @Author bihongbin
   * @Date 2020-08-15 13:48:11
   */
  const formItemLayout = useMemo(() => {
    return {
      form: editPasswordForm,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    }
  }, [editPasswordForm])

  /**
   * @Description 操作关闭tab菜单
   * @Author bihongbin
   * @Date 2020-09-10 14:56:11
   */
  const handleDropdownCloseTab = (e: MenuInfo) => {
    // 关闭所有，跳转到首页
    if (e.key === 'all') {
      const filterTabList = tabLayout.tabList.filter((item) => item.id === '-1')
      dispatchRedux(
        authStore.actions.setTopTab({
          tabList: filterTabList,
        }),
      )
      history.push('/index')
    }
    // 关闭当前页
    if (e.key === 'current') {
      // 不可关闭首页
      if (currentMenuMemo.currentMenu) {
        if (currentMenuMemo.currentMenu.navigateUrl !== '/index') {
          closeCurrentTab(currentMenuMemo.currentMenu, currentMenuMemo.index)
        }
      }
    }
    setState({
      closeTabsPage: false,
    })
  }

  /**
   * @Description 切换tab
   * @Author bihongbin
   * @Date 2020-11-02 15:39:46
   */
  const switchPage = (index: number) => {
    history.push(tabLayout.tabList[index].navigateUrl)
  }

  /**
   * @Description 关闭当前页
   * @Date 2020-11-03 15:54:24
   */
  const closeCurrentTab = (item: SetUserMenuPayloadType, index: number) => {
    const filterList = tabLayout.tabList.filter(
      (k) => k.navigateUrl !== item.navigateUrl,
    )
    if (index <= currentMenuMemo.index) {
      currentMenuMemo.index = currentMenuMemo.index - 1
    }
    dispatchRedux(
      authStore.actions.setTopTab({
        tabList: filterList,
      }),
    )
    history.push(filterList[currentMenuMemo.index].navigateUrl)
  }

  /**
   * @Description 关闭tab
   * @Author bihongbin
   * @Date 2020-08-17 14:57:48
   */
  const handleCloseTab = (
    item: SetUserMenuPayloadType,
    index: number,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    closeCurrentTab(item, index)
  }

  /**
   * @Description 操作修改密码和退出
   * @Author bihongbin
   * @Param {Object} Dropdown选项
   * @Date 2020-05-28 16:57:36
   */
  const handleDropdownMenu = (e: AnyObjectType) => {
    const { key } = e
    if (key === 'user') {
      setState((prev) => {
        prev.userInfoModal.visible = true
        return prev
      })
    }
    if (key === 'password') {
      setState((prev) => {
        prev.passwordModal.visible = true
        return prev
      })
    }
    if (key === 'logout') {
      confirm({
        title: '提示',
        width: 360,
        className: 'confirm-modal',
        centered: true,
        content: '确定退出吗？',
        onOk() {
          return new Promise((resolve, reject) => {
            logout()
              .then(() => {
                history.push('/login')
                resolve()
              })
              .catch(() => {
                reject()
              })
          })
        },
      })
    }
  }

  /**
   * @Description 取消修改密码
   * @Author bihongbin
   * @Date 2020-10-12 10:26:39
   */
  const handlePasswordModalOkCancel = () => {
    editPasswordForm.resetFields()
    setState((prev) => {
      prev.passwordModal.visible = false
      prev.passwordModal.saveLoading = false
      return prev
    })
  }

  /**
   * @Description 修改密码
   * @Author bihongbin
   * @Date 2020-08-19 12:06:13
   */
  const handlePasswordModalOk = () => {
    editPasswordForm.validateFields().then(async (values: AnyObjectType) => {
      setState((prev) => {
        prev.passwordModal.saveLoading = true
        return prev
      })
      try {
        await resetUserPassword({
          userId: user?.id || '',
          password: values.password,
        })
        message.success('修改成功', 1.5)
        editPasswordForm.resetFields()
        setState((prev) => {
          prev.passwordModal.visible = false
          prev.passwordModal.saveLoading = false
          return prev
        })
      } catch (error) {}
      setState((prev) => {
        prev.passwordModal.saveLoading = false
        return prev
      })
    })
  }

  return (
    <>
      <HeaderStyle
        style={{
          left: openSider
            ? GlobalConstant.siderCollapsedWidth
            : GlobalConstant.siderWidth,
        }}
      >
        <Row className="header-top" align="middle" justify="space-between">
          <Col>
            <Space size={90}>
              <h2>{systemInfo.sysName}</h2>
            </Space>
          </Col>
          <Col>
            <Row align="middle">
              <Space className="header-right-link" size={30}>
                {state.headerNav.map((item, index) => (
                  <Button className="is-btn-link" type="text" key={index}>
                    <Row align="middle">
                      <SxyIcon
                        width={item.width}
                        height={item.height}
                        name={item.icon}
                        className="mr-1"
                      />
                      {item.title}
                    </Row>
                  </Button>
                ))}
              </Space>
              <Dropdown
                className="dropdown-quit is-btn-link"
                placement="bottomRight"
                overlay={
                  <Menu onClick={handleDropdownMenu}>
                    <Menu.Item key="user">
                      <UserOutlined />
                      个人信息
                    </Menu.Item>
                    <Menu.Item key="password">
                      <LockOutlined />
                      修改密码
                    </Menu.Item>
                    <Menu.Item key="logout">
                      <LogoutOutlined />
                      退出
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button className="button-color-normal" type="link">
                  <Row align="middle" gutter={8}>
                    <Col>
                      <Text type="secondary">hi～</Text>
                      {user?.userName}
                    </Col>
                    <Col>
                      <Avatar
                        className="user-avatar"
                        size={30}
                        shape="square"
                        src={require('@/assets/images/default.jpg')}
                        alt="头像"
                      />
                    </Col>
                  </Row>
                </Button>
              </Dropdown>
            </Row>
          </Col>
        </Row>
        <Row className="header-nav" align="middle" gutter={15}>
          <Col className="header-tab" span={23}>
            <Space className="header-tab-scroll" size={10}>
              {tabLayout.tabList.map((item, index) => (
                <SxyButton
                  mode={
                    index === currentMenuMemo.index ? 'primary' : 'dark-grey'
                  }
                  font={12}
                  key={item.id}
                  onClick={() => {
                    switchPage(index)
                  }}
                >
                  <Row align="middle">
                    {item.name}
                    {item.navigateUrl !== '/index' ? (
                      index === currentMenuMemo.index ? (
                        <SxyIcon
                          className="ml-1"
                          width={12}
                          height={12}
                          name="icon_label_delete_selected.png"
                          title="关闭"
                          onClick={(e) => handleCloseTab(item, index, e)}
                        />
                      ) : (
                        <SxyIcon
                          className="ml-1"
                          width={6}
                          height={6}
                          name="icon_label_delete_unchecked.png"
                          title="关闭"
                          onClick={(e) => handleCloseTab(item, index, e)}
                        />
                      )
                    ) : null}
                  </Row>
                </SxyButton>
              ))}
            </Space>
            <LeftOutlined className="tab-cur-left pointer" />
            <RightOutlined className="tab-cur-right pointer" />
          </Col>
          <Col className="tabs-handle" span={1}>
            <Dropdown
              overlay={
                <Menu onClick={handleDropdownCloseTab}>
                  <Menu.Item className="font-12" key="current">
                    关闭当前
                  </Menu.Item>
                  <Menu.Item className="font-12" key="all">
                    关闭所有
                  </Menu.Item>
                </Menu>
              }
              onVisibleChange={(flag) => {
                setState({
                  closeTabsPage: flag,
                })
              }}
              visible={state.closeTabsPage}
            >
              <SxyIcon
                className="pointer"
                width={24}
                height={24}
                name="icon_label_tab_delete.png"
                onClick={(e) => e.preventDefault()}
              />
            </Dropdown>
          </Col>
        </Row>
      </HeaderStyle>
      <LayoutFormModal
        formConfig={{
          initialValues: user,
        }}
        onCancel={() => {
          setState((prev) => {
            prev.userInfoModal.visible = false
            return prev
          })
        }}
        {...state.userInfoModal}
      />
      <Modal
        width={450}
        title="修改密码"
        visible={state.passwordModal.visible}
        onCancel={handlePasswordModalOkCancel}
        footer={null}
        maskClosable={false}
      >
        <Form
          className="form-ash-theme form-large-font14"
          name="edit-password-modal"
          size="large"
          {...formItemLayout}
        >
          <Form.Item
            className="mb-5"
            name="password"
            label="新密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['password']}
            hasFeedback
            rules={[
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
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
        <Row className="mt-10 mb-5" justify="center">
          <Col>
            <Button
              className="font-14"
              size="large"
              onClick={handlePasswordModalOkCancel}
            >
              取消
            </Button>
            <Button
              className="font-14 ml-5"
              size="large"
              type="primary"
              loading={state.passwordModal.saveLoading}
              onClick={handlePasswordModalOk}
            >
              确定
            </Button>
          </Col>
        </Row>
      </Modal>
    </>
  )
}

export default HeaderBox
