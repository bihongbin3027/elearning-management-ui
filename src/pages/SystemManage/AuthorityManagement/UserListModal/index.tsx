import React, { useRef, useEffect } from 'react'
import { Modal, Row, Col, Button, message } from 'antd'
import { ColumnType } from 'antd/es/table'
import useSetState from '@/hooks/useSetState'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import { AnyObjectType } from '@/typings'
import { genderData } from '@/config/selectData'
import { getUserList } from '@/api/systemManage/user'

interface PropType {
  visible: boolean
  width?: number
  title: string
  onCancel: () => void
  onConfirm?: (data?: string[]) => Promise<boolean>
}

interface StateType {
  searchFormList: FormListCallType[]
  userColumnsList: ColumnType<AnyObjectType>[]
  saveLoading: boolean
}

const UserListModal = (props: PropType) => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const [state, setState] = useSetState<StateType>({
    searchFormList: [
      {
        componentName: 'Input',
        name: 'search',
        placeholder: '用户名，中英文，QQ，手机号',
      },
    ], // 搜索表单数据
    userColumnsList: [], // 用户列表表头
    saveLoading: false, // 保存loading
  })

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-06 13:55:28
   */
  const handleConfirm = () => {
    let data = undefined
    if (props.onConfirm) {
      if (layoutTableRef.current) {
        data = layoutTableRef.current.getSelectIds()
      }
      setState({
        saveLoading: true,
      })
      props
        .onConfirm(data)
        .then((res) => {
          setTimeout(() => {
            setState({
              saveLoading: false,
            })
          })
          if (res) {
            props.onCancel()
          }
        })
        .catch((err) => {
          setTimeout(() => {
            setState({
              saveLoading: false,
            })
          })
          message.warn(err, 1.5)
        })
    }
  }

  /**
   * @Description 设置用户列表表头
   * @Author bihongbin
   * @Date 2020-08-06 11:32:55
   */
  useEffect(() => {
    setState({
      userColumnsList: [
        {
          width: 80,
          title: '序号',
          dataIndex: 'sortSeq',
          ellipsis: true,
        },
        {
          title: '用户名',
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '工号',
          dataIndex: 'workNumber',
          ellipsis: true,
        },
        {
          title: '用户姓名',
          dataIndex: 'cname',
          ellipsis: true,
        },
        {
          title: '性别',
          dataIndex: 'gender',
          ellipsis: true,
          render: (value: number) => {
            const result = genderData.find(
              (item) => parseInt(item.value) === value,
            )
            return result && result.label
          },
        },
        {
          title: 'QQ号码',
          dataIndex: 'workQq',
          ellipsis: true,
        },
        {
          title: '手机号',
          dataIndex: 'mobilePhone',
          ellipsis: true,
        },
      ],
    })
  }, [setState])

  return (
    <Modal
      width={props.width}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      maskClosable={false}
      footer={null}
    >
      <div className="form-solid-line">
        <LayoutTableList
          ref={layoutTableRef}
          api={getUserList}
          searchFormList={state.searchFormList}
          searchFormListSize={{ sm: 8 }}
          autoGetList
          tableColumnsList={{
            rowType: 'checkbox',
            list: state.userColumnsList,
            tableConfig: {
              scroll: { y: 500 },
            },
          }}
        />
      </div>
      <Row className="mt-5 mb-5" justify="center">
        <Col>
          <Button
            className="font-14"
            size="large"
            onClick={() => props.onCancel()}
          >
            取消
          </Button>
          <Button
            className="font-14 ml-5"
            size="large"
            type="primary"
            loading={state.saveLoading}
            onClick={handleConfirm}
          >
            确定
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default UserListModal
