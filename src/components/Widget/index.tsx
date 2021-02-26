/*
 * @Description 页面小组件
 * @Author bihongbin
 * @Date 2021-02-24 10:02:53
 * @LastEditors bihongbin
 * @LastEditTime 2021-02-24 11:48:20
 */

import React, { useEffect } from 'react'
import { Row } from 'antd'
import useSetState from '@/hooks/useSetState'
import IconSelectionModal from '@/components/IconSelectionModal'

// 选择图标组件
export const IconSelect = React.memo(
  (props: { data: { name: string; onConfirm?: (data: string) => void } }) => {
    const [state, setState] = useSetState({
      name: '',
      visible: false,
    })

    const iconStyle: React.CSSProperties = {
      height: 34,
      fontSize: 22,
    }

    // 选择图标弹窗显示隐藏
    const setVisible = (data: boolean) => {
      setState({ visible: data })
    }

    // 更新图标
    useEffect(() => {
      setState({
        name: props.data.name,
      })
    }, [props.data.name, setState])

    return (
      <>
        <Row className="mb-4" align="middle" onClick={() => setVisible(true)}>
          <i className={`iconfont ${state.name}`} style={iconStyle} />
          <span className="pointer text-desc font-12 ml-2">- 选择图标</span>
        </Row>
        <IconSelectionModal
          visible={state.visible}
          onCancel={() => setVisible(false)}
          onConfirm={(data) => {
            props.data.onConfirm && props.data.onConfirm(data)
            setState({
              visible: false,
              name: data,
            })
          }}
        />
      </>
    )
  },
)
