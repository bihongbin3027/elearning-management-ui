import React from 'react'
import { Button } from 'antd'
import useSetState from '@/hooks/useSetState'
import FileSelection from '@/components/FileSelection'

function Home() {
  const [state, setState] = useSetState({
    visible: false,
  })

  return (
    <div>
      您好，欢迎回来，
      <Button onClick={() => setState({ visible: true })}>打开选择文件</Button>
      <FileSelection
        mode="modal"
        selectedMethod="checkbox"
        // fileExt="jpg"
        visible={state.visible}
        openManagement={false}
        onCancel={() => setState({ visible: false })}
        onConfirm={(data) => {
          console.log('选中的文件：', data)
        }}
      />
    </div>
  )
}

export default Home
