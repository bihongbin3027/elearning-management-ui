import React, {
  useReducer,
  useImperativeHandle,
  forwardRef,
  useRef,
  useMemo,
} from 'react'
import BraftEditor, {
  BraftEditorProps,
  ControlType,
  ExtendControlType,
} from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import 'braft-editor/dist/index.css'
import { EditorBox } from '@/components/Editor/style'
import { AnyObjectType } from '@/typings'

export interface EditorCallType {
  getEditorObject: () => AnyObjectType
}

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_EDITOR_VALUE = '[SetEditorValue Action]',
}

const stateValue = {
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
  ] as ControlType[],
  editorValue: BraftEditor.createEditorState(null), // 编辑器实例（暂时没用到）
}

const Editor = (props: BraftEditorProps, ref: any) => {
  const editorRef = useRef<any>()
  const [state] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_EDITOR_VALUE: {
        // 设置编辑器实例（暂时没用到）
        return {
          ...state,
          editorValue: action.payload,
        }
      }
    }
  }, stateValue)

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
          editorRef.current.setValue(
            ContentUtils.insertText(editorRef.current.getValue(), '你好啊！'),
          )
        },
      },
    ]
    return arr
  }, [])

  /**
   * @Description 暴漏给父组件调用
   * @Author bihongbin
   * @Date 2020-09-16 16:47:40
   */
  useImperativeHandle<any, EditorCallType>(ref, () => ({
    // 获取编辑器实例
    getEditorObject: () => {
      // 在父级使用editRef.current?.getEditorObject().getValue().toHTML()获取内容
      console.log('编辑器实例：', editorRef.current)
      return editorRef.current
    },
  }))

  return (
    <EditorBox>
      <BraftEditor
        ref={editorRef}
        controls={state.controls}
        extendControls={extendControls}
        {...props}
      />
    </EditorBox>
  )
}

export default React.memo(forwardRef(Editor))
