/*
 * @Description // BUG 该组件后期要删除，主要是为了暂时解决动态组件和styled-component使用出现的问题
 * @Author bihongbin
 * @Date 2020-11-13 15:31:27
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-20 09:26:17
 */

import React from 'react'
import { FilePreview } from '@/pages/FileCenter/Preview/style'
import { Items as FileItems } from '@/pages/FileCenter/FileItems/style'
import { EditorBox } from '@/components/Editor/style'
import { SxyTable } from '@/style/module/table'
import { SxyTips } from '@/style/module/tips'

function ComStyle() {
  return (
    <div style={{ display: 'none' }}>
      <FilePreview />
      <FileItems />
      <EditorBox />
      <SxyTable />
      <SxyTips />
    </div>
  )
}

export default ComStyle
