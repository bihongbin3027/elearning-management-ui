/*
 * @Description 表格右侧操作按钮组件
 * @Author bihongbin
 * @Date 2020-07-10 16:09:40
 * @LastEditors bihongbin
 * @LastEditTime 2020-08-18 14:15:07
 */

import React from 'react'
import { Tooltip, Menu, Dropdown, Space } from 'antd'
import { SxyIcon } from '@/style/module/icon'
import { SxyHandleBtn } from '@/components/TableOperate/style'

interface DropdownItemType {
  name: string
  onClick: () => void
}

interface OperateButtonType {
  name: string
  type?: string
  onClick?: () => void
  svg: string
  moreList?: DropdownItemType[]
}

interface PropsType {
  operateButton: OperateButtonType[]
}

const TableOperate = (props: PropsType) => {
  const { operateButton } = props

  /**
   * @Description 渲染操作按钮
   * @Author bihongbin
   * @Date 2020-08-05 11:23:04
   */
  const renderButton = (item: OperateButtonType, index: number) => {
    return (
      <SxyHandleBtn onClick={(event) => handleClick(event, item)}>
        <SxyIcon width={10} height={10} name={item.svg} />
      </SxyHandleBtn>
    )
  }

  /**
   * @Description 操作按钮点击
   * @Author bihongbin
   * @Date 2020-08-05 11:24:05
   */
  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    item: OperateButtonType,
  ) => {
    if (item.type !== 'more' && item.onClick) {
      item.onClick()
    }
    event.stopPropagation() // 阻止事件冒泡
  }

  return (
    <Space size={10}>
      {operateButton.map((item, index) => (
        <Tooltip placement="top" title={item.name} key={index}>
          {item.type ? (
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
