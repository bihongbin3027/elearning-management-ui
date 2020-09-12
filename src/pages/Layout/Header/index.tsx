import React, { useReducer, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
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
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import authStore from '@/store/module/auth'
import { RootStateType } from '@/store/rootReducer'
import { SxyButton } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import { AnyObjectType } from '@/typings'
import { SetUserMenuPayloadType } from '@/store/module/auth/types'
import { GlobalConstant } from '@/config'
import { HeaderStyle } from '@/pages/Layout/Header/style'

const { confirm } = Modal
const { Text } = Typography

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_HEADER_NAV = '[SetHeaderNav Action]',
  SET_PASSWORD_MODAL = '[SetPasswordModal Action]',
  SET_CLOSE_TABS_PAGE = '[SetCloseTabsPage Action]',
}

const stateValue = {
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
  // 修改密码模态窗
  passwordModal: {
    visible: false,
    saveLoading: false,
  },
  // 关闭全部tab菜单
  closeTabsPage: false,
}

const HeaderBox = () => {
  const history = useHistory()
  const dispatchRedux = useDispatch()
  const { user, tabLayout, openSider } = useSelector(
    (state: RootStateType) => ({
      ...state.auth,
      ...state.layout,
    }),
  )
  const [editPasswordForm] = Form.useForm() // 修改密码模态框表单
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_HEADER_NAV: // 设置头部菜单
        return {
          ...state,
          headerNav: action.payload,
        }
      case ActionType.SET_PASSWORD_MODAL: // 设置修改密码模态窗数据
        return {
          ...state,
          passwordModal: {
            ...state.passwordModal,
            ...action.payload,
          },
        }
      case ActionType.SET_CLOSE_TABS_PAGE: // 设置关闭全部tab菜单
        return {
          ...state,
          closeTabsPage: action.payload,
        }
    }
  }, stateValue)

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
    console.log('当前选择：', e.key)
    dispatch({
      type: ActionType.SET_CLOSE_TABS_PAGE,
      payload: false,
    })
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
    let currentIndex = tabLayout.current
    const filterList = tabLayout.tabList.filter((k) => k.path !== item.path)
    if (index <= currentIndex) {
      currentIndex = currentIndex - 1
    }
    dispatchRedux(
      authStore.actions.setTopTab({
        current: currentIndex,
        tabList: filterList,
      }),
    )
    history.push(filterList[currentIndex].path)
  }

  /**
   * @Description 操作修改密码和退出
   * @Author bihongbin
   * @Param {Object} Dropdown选项
   * @Date 2020-05-28 16:57:36
   */
  const handleDropdownMenu = (e: AnyObjectType) => {
    const { key } = e
    if (key === 'password') {
      dispatch({
        type: ActionType.SET_PASSWORD_MODAL,
        payload: {
          visible: true,
        },
      })
    }
    if (key === 'logout') {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '确定退出吗？',
        onOk() {
          dispatchRedux(authStore.actions.logout())
          history.push('/login')
        },
      })
    }
  }

  /**
   * @Description 修改密码
   * @Author bihongbin
   * @Date 2020-08-19 12:06:13
   */
  const handlePasswordModalOk = () => {
    editPasswordForm.validateFields().then((values: AnyObjectType) => {
      dispatch({
        type: ActionType.SET_PASSWORD_MODAL,
        payload: {
          saveLoading: true,
        },
      })
      setTimeout(() => {
        message.success('修改成功', 1.5)
        editPasswordForm.resetFields()
        dispatch({
          type: ActionType.SET_PASSWORD_MODAL,
          payload: {
            visible: false,
            saveLoading: false,
          },
        })
      }, 500)
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
              <h2>机构名称</h2>
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
                      {user?.fullname}
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
                  mode={index === tabLayout.current ? 'primary' : 'dark-grey'}
                  font={12}
                  key={item.path}
                >
                  <Row align="middle">
                    {item.name}
                    {item.path !== '/index' ? (
                      index === tabLayout.current ? (
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
              <SxyButton mode="dark-grey" font={12}>
                <Row align="middle">
                  报表查询
                  <SxyIcon
                    className="ml-1"
                    width={6}
                    height={6}
                    name="icon_label_delete_unchecked.png"
                    title="关闭"
                  />
                </Row>
              </SxyButton>
              <SxyButton mode="dark-grey" font={12}>
                <Row align="middle">
                  排课
                  <SxyIcon
                    className="ml-1"
                    width={6}
                    height={6}
                    name="icon_label_delete_unchecked.png"
                    title="关闭"
                  />
                </Row>
              </SxyButton>
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
                dispatch({
                  type: ActionType.SET_CLOSE_TABS_PAGE,
                  payload: flag,
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
      <Modal
        width={450}
        title="修改密码"
        visible={state.passwordModal.visible}
        confirmLoading={state.passwordModal.saveLoading}
        onOk={handlePasswordModalOk}
        onCancel={() => {
          editPasswordForm.resetFields()
          dispatch({
            type: ActionType.SET_PASSWORD_MODAL,
            payload: {
              visible: false,
              saveLoading: false,
            },
          })
        }}
        maskClosable={false}
      >
        <Form name="edit-password-modal" {...formItemLayout}>
          <Form.Item
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
      </Modal>
    </>
  )
}

export default HeaderBox
