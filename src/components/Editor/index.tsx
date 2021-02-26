import React, { useImperativeHandle, forwardRef, useRef, useMemo } from 'react'
import BraftEditor, {
  BraftEditorProps,
  ControlType,
  ExtendControlType,
} from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import FileSelection from '@/components/FileSelection'
import useSetState from '@/hooks/useSetState'
import 'braft-editor/dist/index.css'
import { EditorCallType } from '@/components/Editor/interface'
import { EditorBox } from '@/components/Editor/style'

interface StateType {
  controls: ControlType[]
  editorState: any
  fileModal: {
    selectedMethod: 'radio' | 'checkbox'
    visible: boolean
  }
}

const Editor = (props: BraftEditorProps, ref: any) => {
  const editorRef = useRef<any>()
  const [state, setState] = useSetState<StateType>({
    controls: [
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'underline',
      'strike-through',
      'separator',
      'superscript',
      'subscript',
      'remove-styles',
      'emoji',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'headings',
      'list-ul',
      'list-ol',
      'blockquote',
      'code',
      'separator',
      'link',
      'separator',
      'hr',
      'separator',
      'separator',
      'clear',
    ],
    editorState: BraftEditor.createEditorState(null), // 编辑器实例
    fileModal: {
      selectedMethod: 'checkbox',
      visible: false,
    },
  })

  /**
   * @Description 自定义扩展控件
   * @Author bihongbin
   * @Date 2020-09-17 11:52:12
   */
  const extendControls = useMemo(() => {
    let arr: ExtendControlType[] = [
      {
        key: 'custom-button',
        type: 'button',
        text: '插入图片',
        onClick: () => {
          setState((prev) => {
            prev.fileModal.visible = true
            return prev
          })
        },
      },
    ]
    return arr
  }, [setState])

  /**
   * @Description 暴漏给父组件调用
   * @Author bihongbin
   * @Date 2020-09-16 16:47:40
   */
  useImperativeHandle<any, EditorCallType>(ref, () => ({
    // 编辑器实例
    getEditorObject: () => {
      return state.editorState
    },
    // 设置编辑器内容
    setEditorValue: (value) => {
      setState({
        editorState: BraftEditor.createEditorState(value),
      })
    },
    // 获取编辑器内容
    getEditorValue: () => {
      return state.editorState.toHTML()
    },
  }))

  return (
    <EditorBox>
      <BraftEditor
        ref={editorRef}
        contentStyle={{ fontSize: '12px', ...props.contentStyle }}
        controls={state.controls}
        extendControls={extendControls}
        value={state.editorState}
        onChange={(editorState) => {
          setState({
            editorState,
          })
        }}
        {...props}
      />
      <FileSelection
        mode="modal"
        fileExt="jpeg,jpg,png,gif"
        selectedMethod={state.fileModal.selectedMethod}
        visible={state.fileModal.visible}
        openManagement={false}
        onCancel={() =>
          setState((prev) => {
            prev.fileModal.visible = false
            return prev
          })
        }
        onConfirm={(data) => {
          // 筛选出图片类型数据
          const filterOutPictures = data.filter(
            (item) =>
              item.fileExt === 'jpeg' ||
              item.fileExt === 'jpg' ||
              item.fileExt === 'png' ||
              item.fileExt === 'gif',
          )
          setState({
            editorState: ContentUtils.insertMedias(
              state.editorState,
              filterOutPictures.map((item) => {
                return {
                  id: item.id,
                  type: 'IMAGE',
                  url: item.fileUrl,
                }
              }),
            ),
          })
        }}
      />
    </EditorBox>
  )
}

export default React.memo(forwardRef(Editor))
