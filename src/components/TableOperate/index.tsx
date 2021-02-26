/*
 * @Description 表格右侧操作按钮组件
 * @Author bihongbin
 * @Date 2020-07-10 16:09:40
 * @LastEditors bihongbin
 * @LastEditTime 2020-12-17 17:11:40
 */

import React, { useMemo } from 'react'
import { Tooltip, Menu, Dropdown, Space, Typography } from 'antd'
import { queryCodeMenuObject } from '@/utils'
import { GlobalConstant } from '@/config'
import useMenuParams from '@/hooks/useMenuParams'
import { SxyIcon } from '@/style/module/icon'

interface DropdownItemType {
  name: string
  onClick: () => void
}

const { Link } = Typography
export interface TableOperateButtonType {
  name: string
  type?: string
  authCode?: string // 权限码（用来控制权限按钮是否显示）
  onClick?: () => void
  svg?: string
  moreList?: DropdownItemType[]
}

interface PropsType {
  menuCode?: string // 如果有菜单code拿匹配到的code的权限
  operateButton: TableOperateButtonType[]
}

const TableOperate = (props: PropsType) => {
  const { operateButton } = props
  const currentMenuObj = useMenuParams()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限

  /**
   * @Description 当前页面权限菜单
   * @Author bihongbin
   * @Date 2020-11-04 18:29:04
   */
  const currentPageAuth = useMemo(
    () => currentMenuObj.currentMenu && currentMenuObj.currentMenu,
    [currentMenuObj.currentMenu],
  )

  /**
   * @Description 渲染操作按钮
   * @Author bihongbin
   * @Date 2020-08-05 11:23:04
   */
  const renderButton = (item: TableOperateButtonType, index: number) => {
    if (item.svg) {
      return (
        <div
          className="table-handle-btn-bg"
          onClick={(event) => handleClick(event, item)}
        >
          <SxyIcon width={10} height={10} name={item.svg} />
        </div>
      )
    } else {
      return (
        <Link onClick={(event) => handleClick(event, item)}>{item.name}</Link>
      )
    }
  }

  /**
   * @Description 操作按钮点击
   * @Author bihongbin
   * @Date 2020-08-05 11:24:05
   */
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    item: TableOperateButtonType,
  ) => {
    if (item.type !== 'more' && item.onClick) {
      item.onClick()
    }
    event.stopPropagation() // 阻止事件冒泡
  }

  /**
   * @Description 过滤权限
   * @Author bihongbin
   * @Date 2020-11-03 18:10:55
   */
  const buttonList = useMemo(() => {
    const filterButton = operateButton.filter(
      (item: TableOperateButtonType) => {
        let permissionCodeList: string[] =
          currentPageAuth?.permissionCodeList || [] // 默认当前url匹配到的菜单权限
        // 获取对应code的菜单
        if (props.menuCode) {
          let getCodeMenu = queryCodeMenuObject(props.menuCode)
          if (getCodeMenu) {
            permissionCodeList = getCodeMenu.permissionCodeList
          }
        }
        // 如果permissionCodeList数组有内容，那么设置权限
        if (permissionCodeList.length) {
          if (item.authCode) {
            return permissionCodeList.includes(item.authCode)
          } else {
            return false
          }
        } else {
          // 否则给予所有权限
          return true
        }
      },
    )
    return filterButton
  }, [currentPageAuth, operateButton, props.menuCode])

  return (
    <Space size={10}>
      {buttonList.map((item, index) => (
        <Tooltip placement="top" title={item.name} key={index}>
          {item.authCode === authBasic.MORE ? (
            <Dropdown
              overlay={
                <Menu>
                  {item.moreList
                    ? item.moreList.map((m, i) => (
                        <Menu.Item onClick={() => m.onClick()} key={i}>
                          {m.name}
                        </Menu.Item>
                      ))
                    : null}
                </Menu>
              }
            >
              {renderButton(item, index)}
            </Dropdown>
          ) : (
            renderButton(item, index)
          )}
        </Tooltip>
      ))}
    </Space>
  )
}

export default React.memo(TableOperate)
