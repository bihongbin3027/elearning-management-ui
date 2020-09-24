import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, Button } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import layoutStore from '@/store/module/layout'
import { RootStateType } from '@/store/rootReducer'
import { AnyObjectType } from '@/typings'
import { SetUserMenuPayloadType } from '@/store/module/auth/types'
import { SxyIcon } from '@/style/module/icon'
import { GlobalConstant } from '@/config'
import { SiderStyle } from '@/pages/Layout/Sider/style'

const { SubMenu } = Menu

const SiderBox = () => {
  const history = useHistory()
  const dispatchRedux = useDispatch()
  const { rootMenuList, openSider } = useSelector((state: RootStateType) => ({
    ...state.auth,
    ...state.layout,
  }))

  /**
   * @Description 递归渲染菜单
   * @Author bihongbin
   * @Date 2020-08-17 10:13:20
   */
  const transformMenuList = useCallback((list: SetUserMenuPayloadType[]) => {
    // 菜单排序
    const menuList = Array.from(list).sort((a, b) => a.seqSort - b.seqSort)
    return menuList.map((item) => {
      if (item.children) {
        return (
          <SubMenu
            key={item.path}
            title={item.name}
            icon={<AppstoreOutlined />}
          >
            {transformMenuList(item.children)}
          </SubMenu>
        )
      } else {
        return <Menu.Item key={item.path}>{item.name}</Menu.Item>
      }
    })
  }, [])

  /**
   * @Description 侧边栏菜单被选中时调用
   * @Author bihongbin
   * @Date 2020-08-18 09:42:32
   */
  const handleSiderMenuSelect = (menu: AnyObjectType) => {
    history.push(menu.key)
  }

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
          <SxyIcon
            className="logo-icon"
            width={50}
            height={50}
            name="logo.png"
            onClick={() => history.push('/index')}
          />
          <h1>华旅云创教育</h1>
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
        defaultSelectedKeys={['/index']}
        mode="inline"
        theme="dark"
        onSelect={handleSiderMenuSelect}
      >
        <Menu.Item key="/index" icon={<HomeOutlined />}>
          工作台
        </Menu.Item>
        <Menu.Item key="/file-center" icon={<AppstoreOutlined />}>
          文件中心
        </Menu.Item>
        <SubMenu
          key="/order-manage"
          title="订单中心"
          icon={<AppstoreOutlined />}
        >
          <Menu.Item key="/goods-manage">商品订单</Menu.Item>
          <Menu.Item key="/service-manage">服务订单</Menu.Item>
        </SubMenu>
        <SubMenu
          key="/course-center"
          title="课程中心"
          icon={<AppstoreOutlined />}
        >
          <Menu.Item key="/course-center">课程管理</Menu.Item>
          <Menu.Item key="/subject-manage">科目管理</Menu.Item>
        </SubMenu>
        <SubMenu key="/clue" title="招生中心" icon={<AppstoreOutlined />}>
          <Menu.Item key="/clue/my">我的线索</Menu.Item>
          <Menu.Item key="/public-clue/pc">公共线索</Menu.Item>
          <Menu.Item key="/admissions/manage">招生管理</Menu.Item>
          <Menu.Item key="/group-newspaper/main-list">企业团报</Menu.Item>
        </SubMenu>
        <SubMenu key="/goods-list" title="商品中心" icon={<AppstoreOutlined />}>
          <Menu.Item key="/goods-list">商品管理</Menu.Item>
          <Menu.Item key="/goods-sort">商品分类</Menu.Item>
          <Menu.Item key="/goods-group">商品组管理</Menu.Item>
          <Menu.Item key="/goods-label">标签组管理</Menu.Item>
        </SubMenu>
        <SubMenu
          key="/classes-manage"
          title="教务中心"
          icon={<AppstoreOutlined />}
        >
          <Menu.Item key="/classes-manage">班级管理</Menu.Item>
          <Menu.Item key="/question-bank-manage">试卷管理</Menu.Item>
          <Menu.Item key="/intelligent-course">智能排课</Menu.Item>
          <Menu.Item key="/class-registration">上课登记</Menu.Item>
          <Menu.Item key="/registrar-setting">教务设置</Menu.Item>
        </SubMenu>
        <SubMenu
          key="/student-center"
          title="学员中心"
          icon={<AppstoreOutlined />}
        >
          <Menu.Item key="/student-center/class-roster">班级花名册</Menu.Item>
          <Menu.Item key="/student-center/enrolled-students">
            在读学生
          </Menu.Item>
        </SubMenu>
        {transformMenuList(rootMenuList)}
      </Menu>
    </SiderStyle>
  )
}

export default SiderBox
