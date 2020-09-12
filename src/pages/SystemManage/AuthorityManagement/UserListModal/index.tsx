import React, { useRef, useReducer, useEffect } from 'react'
import { Modal, Row, Col, Button, message } from 'antd'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import { AnyObjectType } from '@/typings'
import { getBasicQtyList } from '@/api/basicData'

interface PropType {
  visible: boolean
  width?: number
  title: string
  onCancel: () => void
  onConfirm?: (data?: AnyObjectType[]) => Promise<boolean>
}

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_USER_COLUMNS_LIST = '[SetUserColumnsList Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 搜索表单数据
  userColumnsList: [], // 用户列表表头
  saveLoading: false, // 保存loading
}

const UserListModal = (props: PropType) => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_USER_COLUMNS_LIST: // 设置用户列表表头
        return {
          ...state,
          userColumnsList: action.payload,
        }
      case ActionType.SET_SAVE_LOADING: // 保存loading
        return {
          ...state,
          saveLoading: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-06 13:55:28
   */
  const handleConfirm = () => {
    let data = undefined
    if (props.onConfirm) {
      if (layoutTableRef.current) {
        data = layoutTableRef.current.getSelectRowsArray()
      }
      props
        .onConfirm(data)
        .then((res) => {
          if (res) {
            props.onCancel()
          }
        })
        .catch((err) => {
          message.warn(err, 1.5)
        })
    }
  }

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-08-06 11:52:31
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: [
        {
          componentName: 'Input',
          name: 'a1',
          placeholder: '用户名',
        },
        {
          componentName: 'Input',
          name: 'b1',
          placeholder: '用户中、英文名',
        },
        {
          componentName: 'Input',
          name: 'c1',
          placeholder: '工号',
        },
      ],
    })
  }, [])

  /**
   * @Description 设置用户列表表头
   * @Author bihongbin
   * @Date 2020-08-06 11:32:55
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_USER_COLUMNS_LIST,
      payload: [
        {
          width: 60,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '用户名',
          dataIndex: 'a',
        },
        {
          title: '工号',
          dataIndex: 'b',
        },
        {
          title: '用户姓名',
          dataIndex: 'c',
        },
        {
          title: '性别',
          dataIndex: 'd',
        },
        {
          title: 'QQ号码',
          dataIndex: 'e',
        },
        {
          title: '手机号',
          dataIndex: 'f',
        },
        {
          title: '企业QQ号码',
          dataIndex: 'd',
        },
      ],
    })
  }, [])

  return (
    <Modal
      width={props.width}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      forceRender
      maskClosable={false}
      footer={null}
    >
      <div className="form-solid-line">
        <LayoutTableList
          ref={layoutTableRef}
          api={getBasicQtyList}
          searchFormList={state.searchFormList}
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
