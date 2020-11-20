/*
 * @Description 卡片头部按钮
 * @Author bihongbin
 * @Date 2020-11-10 17:20:05
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-10 18:16:53
 */

import React, { useMemo } from 'react'
import { Space, Row, Button, Divider } from 'antd'
import { CardButtonType } from '@/components/LayoutTableList'
import { queryCodeMenuObject } from '@/utils'
import useMenuParams from '@/hooks/useMenuParams'
import { SxyIcon } from '@/style/module/icon'

interface PropsType {
  buttonList: CardButtonType[]
  menuCode?: string
}

function CardHeaderButton(props: PropsType) {
  const currentMenuObj = useMenuParams()

  /**
   * @Description 当前页面权限菜单
   * @Author bihongbin
   * @Date 2020-11-09 09:28:49
   */
  const currentPageAuth = useMemo(
    () => currentMenuObj.currentMenu && currentMenuObj.currentMenu,
    [currentMenuObj.currentMenu],
  )

  const buttonGroup = useMemo(() => {
    return props.buttonList.filter((item) => {
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
    })
  }, [currentPageAuth, props.buttonList, props.menuCode])

  return (
    <Space size={0} split={<Divider type="vertical" />}>
      {buttonGroup.map((item, index) => (
        <Row key={index} align="middle">
          <Button
            className="btn-text-icon"
            onClick={item.clickConfirm}
            type={item.type ? item.type : 'text'}
          >
            {item.icon ? (
              <SxyIcon width={16} height={16} name={item.icon} />
            ) : null}
            {item.name}
          </Button>
        </Row>
      ))}
    </Space>
  )
}

export default CardHeaderButton
