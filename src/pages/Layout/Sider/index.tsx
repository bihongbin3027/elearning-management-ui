import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import { Menu, Button, Avatar, message } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import layoutStore from '@/store/module/layout'
import authStore from '@/store/module/auth'
import { RootStateType } from '@/store/rootReducer'
import { AnyObjectType } from '@/typings'
import { SetUserMenuPayloadType } from '@/store/module/auth/types'
import { SxyIcon } from '@/style/module/icon'
import { GlobalConstant } from '@/config'
import useMenuParams from '@/hooks/useMenuParams'
import { queryCodeMenuObject } from '@/utils'
import { SiderStyle } from '@/pages/Layout/Sider/style'

const { SubMenu } = Menu

const SiderBox = () => {
  const history = useHistory()
  const dispatchRedux = useDispatch()
  const currentMenuObj = useMenuParams()
  const { rootMenuList, tabLayout, systemInfo, openSider } = useSelector(
    (state: RootStateType) => ({
      ...state.auth,
      ...state.layout,
    }),
  )

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
   * @Description 递归渲染菜单
   * @Author bihongbin
   * @Date 2020-08-17 10:13:20
   */
  const transformMenuList = (list: SetUserMenuPayloadType[]) => {
    const menuList = [...list]
    return menuList.map((item) => {
      // visibleFlag = 1 是可见菜单
      if (item.children && item.children.some((c) => c.visibleFlag === 1)) {
        return (
          <SubMenu key={item.id} title={item.name} icon={<AppstoreOutlined />}>
            {transformMenuList(item.children)}
          </SubMenu>
        )
      } else {
        return item.visibleFlag === 1 ? (
          <Menu.Item key={item.code}>{item.name}</Menu.Item>
        ) : null
      }
    })
  }

  /**
   * @Description 侧边栏菜单被选中时调用
   * @Author bihongbin
   * @Date 2020-08-18 09:42:32
   */
  const handleSiderMenuSelect = (menu: AnyObjectType) => {
    let tabData = tabLayout.tabList
    if (menu.key === 'INDEX') {
      history.push('/index')
    } else {
      const item = queryCodeMenuObject(menu.key)
      if (item) {
        if (item.navigateUrl && item.interfaceRef) {
          tabData = _.unionBy(_.concat(tabData, item), (e) => e.navigateUrl) // 合并去重
          dispatchRedux(
            authStore.actions.setTopTab({
              tabList: tabData,
            }),
          )
          // 外部链接
          if (item.urlFlag === 1) {
            window.open(item.navigateUrl)
            return
          } else {
            history.push(item.navigateUrl)
          }
        } else {
          message.warn('无效菜单', 1.5)
        }
      }
    }
  }

  /**
   * @Description 菜单选中
   * @Author bihongbin
   * @Date 2020-11-05 17:23:37
   */
  const menuState = useMemo(() => {
    let arrKeys: {
      openKeys: string[]
      selectedKeys: string[]
    } = {
      openKeys: [],
      selectedKeys: [],
    }
    if (currentPageAuth) {
      arrKeys.openKeys = currentPageAuth.parentIds.split('_') || [] // 菜单展开的key
      arrKeys.selectedKeys = [currentPageAuth.code] || ['INDEX'] // 菜单选中的key
    }
    return arrKeys
  }, [currentPageAuth])

  return (
    <SiderStyle
      width={GlobalConstant.siderWidth}
      collapsedWidth={GlobalConstant.siderCollapsedWidth}
      collapsed={openSider}
      onCollapse={(open) => {
        dispatchRedux(layoutStore.actions.setLeftSiderOpen(open))
      }}
    >
      <div className="logo-wrap">
        <div className="logo-box">
          {systemInfo.logoImageUrl ? (
            <Avatar shape="square" size={40} src={systemInfo.logoImageUrl} />
          ) : (
            <SxyIcon
              className="logo-icon"
              width={50}
              height={50}
              name="logo.png"
            />
          )}
          <h1>{systemInfo.companyName}</h1>
        </div>
        <Button
          type="text"
          className="sider-open-btn is-btn-link"
          onClick={() => {
            dispatchRedux(layoutStore.actions.setLeftSiderOpen(!openSider))
          }}
        >
          {openSider ? (
            <SxyIcon
              className="logo-icon"
              width={14}
              height={14}
              name="head_arrow_right.png"
            />
          ) : (
            <SxyIcon
              className="logo-icon"
              width={14}
              height={14}
              name="head_arrow_left.png"
            />
          )}
        </Button>
      </div>
      <Menu
        className="slider-menu-scroll"
        defaultOpenKeys={menuState.openKeys}
        selectedKeys={menuState.selectedKeys}
        mode="inline"
        theme="dark"
        onClick={handleSiderMenuSelect}
      >
        <Menu.Item key="INDEX" icon={<HomeOutlined />}>
          首页
        </Menu.Item>
        {transformMenuList(rootMenuList)}
      </Menu>
    </SiderStyle>
  )
}

export default SiderBox
