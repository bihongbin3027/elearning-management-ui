import React, { useRef, useReducer, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Space,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Switch,
  Divider,
  Modal,
  Menu,
  Dropdown,
} from 'antd'
import { ColumnType } from 'antd/es/table'
import { MenuInfo } from 'rc-menu/lib/interface'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import LayoutTableModal from '@/components/LayoutTableModal'
import { SxyButton } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import { GlobalConstant } from '@/config'
import { SxyTips } from '@/style/module/tips'
import {
  AdmissionsFormWrapper,
  CardContents,
  CardFooters,
} from '@/pages/MarketingCenter/AdmissionsForm/Main/style'
import { AnyObjectType } from '@/typings'
import { handleRowDelete } from '@/utils'
import { getBasicQtyList, deleteBasicQtyList } from '@/api/basicData'

const { Text, Title } = Typography

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_PREVIEW_FORM_MODAL = '[SetPreviewFormModal Action]',
  SET_RELEASE_FORM_MODAL = '[SetReleaseFormModal Action]',
  SET_PROMOTE_TABLE_MODAL = '[SetPromoteTableModal Action]',
  SET_PURCHASER_TABLE_MODAL = '[SetPurchaserTableModal Action]',
}

const stateValue = {
  searchFormList: [] as FormListType[],
  previewFormModal: {
    visible: false,
    title: '日常采单',
    width: 420,
    formList: [
      {
        componentName: 'Input',
        name: 'a',
        label: '学员姓名',
        colProps: { span: 24 },
        placeholder: '请输入学员姓名',
        rules: [{ required: true, message: '请输入学员姓名' }],
      },
      {
        componentName: 'Input',
        name: 'b',
        label: '联系电话',
        colProps: { span: 24 },
        placeholder: '请输入联系电话',
        rules: [{ required: true, message: '请输入联系电话' }],
      },
    ] as LayoutFormModalListType[],
  },
  releaseFormModal: {
    visible: false,
    title: '发布',
    width: 420,
    formList: [] as LayoutFormModalListType[],
  },
  promoteTableModal: {
    visible: false,
    title: '去推广',
    width: 660,
    tableColumns: [] as ColumnType<AnyObjectType>[],
  },
  purchaserTableModal: {
    visible: false,
    title: '添加采单员',
    apiMethod: getBasicQtyList,
    width: 660,
    tableColumnsList: {
      tableConfig: {
        className: 'table-header-grey',
        scroll: { y: 300 },
      },
      rowType: 'checkbox' as 'checkbox',
      list: [
        {
          title: '员工姓名',
          dataIndex: 'qtyEname',
        },
        {
          title: '手机',
          dataIndex: 'a',
        },
      ] as ColumnType<AnyObjectType>[],
    },
  },
}

const MainPage = () => {
  const history = useHistory()
  const { formSearchColConfig } = GlobalConstant
  const searchForm = useRef<FormCallType>(null)
  const previewModalRef = useRef<LayoutFormModalCallType>()
  const promoteModalTableRef = useRef<TableCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置搜索表单
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_PREVIEW_FORM_MODAL: // 设置预览弹窗
        return {
          ...state,
          previewFormModal: {
            ...state.previewFormModal,
            ...action.payload,
          },
        }
      case ActionType.SET_RELEASE_FORM_MODAL: // 设置发布弹窗
        return {
          ...state,
          releaseFormModal: {
            ...state.releaseFormModal,
            ...action.payload,
          },
        }
      case ActionType.SET_PROMOTE_TABLE_MODAL: // 去推广弹窗
        return {
          ...state,
          promoteTableModal: {
            ...state.promoteTableModal,
            ...action.payload,
          },
        }
      case ActionType.SET_PURCHASER_TABLE_MODAL: // 添加采单员弹窗
        return {
          ...state,
          purchaserTableModal: {
            ...state.purchaserTableModal,
            ...action.payload,
          },
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-28 16:15:04
   */
  const handleSearchFormModalState = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置预览弹窗数据
   * @Author bihongbin
   * @Date 2020-09-29 09:53:11
   */
  const handlePreviewModalState = (
    data: Partial<StateType['previewFormModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_PREVIEW_FORM_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置去推广弹窗
   * @Author bihongbin
   * @Date 2020-09-29 10:20:04
   */
  const handlePromoteTableModalState = (
    data: Partial<StateType['promoteTableModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_PROMOTE_TABLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置发布弹窗
   * @Author bihongbin
   * @Date 2020-09-29 14:38:23
   */
  const handleReleaseModalState = (
    data: Partial<StateType['releaseFormModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_RELEASE_FORM_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置添加采单员弹窗
   * @Author bihongbin
   * @Date 2020-09-29 14:07:32
   */
  const handlePurchaserTableModalState = (
    data: Partial<StateType['purchaserTableModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_PURCHASER_TABLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 跳转页面
   * @Author bihongbin
   * @Date 2020-09-30 10:34:05
   */
  const toPage = (url: string) => {
    history.push(url)
  }

  /**
   * @Description 转为失效
   * @Author bihongbin
   * @Date 2020-09-29 14:24:05
   */
  const handleDeactivatedConfirm = () => {
    Modal.confirm({
      title: '转为失效',
      width: 360,
      className: 'confirm-modal',
      centered: true,
      content: '失效后，该表单将不能再次进行推广',
      onOk() {
        // 这里需要使用promise
        console.log('确定')
      },
      onCancel() {
        console.log('取消')
      },
    })
  }

  /**
   * @Description 多个操作
   * @Author bihongbin
   * @Date 2020-09-29 14:24:05
   */
  const handleMenuItem = (data: MenuInfo) => {
    // 删除
    if (data.key === 'delete') {
      Modal.confirm({
        title: '删除提示',
        width: 360,
        className: 'confirm-modal',
        centered: true,
        content: (
          <span>
            删除后，该表单将不能推广且
            <br />
            相关数据无法查看
          </span>
        ),
        onOk() {
          // 这里需要使用promise
          console.log('确定')
        },
        onCancel() {
          console.log('取消')
        },
      })
    }
  }

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-09-28 10:35:34
   */
  const formSubmit = () => {}

  /**
   * @Description 重置
   * @Author bihongbin
   * @Date 2020-09-28 10:35:50
   */
  const formReset = () => {}

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-28 16:14:19
   */
  useEffect(() => {
    handleSearchFormModalState([
      {
        componentName: 'Select',
        name: 'a',
        placeholder: '校区',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '状态',
        selectData: [],
      },
    ])
  }, [])

  /**
   * @Description 设置去推广弹窗表头
   * @Author bihongbin
   * @Date 2020-09-28 16:14:19
   */
  useEffect(() => {
    handlePromoteTableModalState({
      tableColumns: [
        { title: '采单员姓名', dataIndex: 'qtyEname' },
        { title: '手机', dataIndex: 'a' },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 150,
          render: (value, record) => {
            return (
              <Space size={20}>
                <Button className="is-btn-link" type="link">
                  领取二维码
                </Button>
                <Button
                  className="is-btn-link"
                  type="link"
                  onClick={() => {
                    handleRowDelete([record.id], deleteBasicQtyList, () =>
                      promoteModalTableRef.current?.getTableList(),
                    )
                  }}
                >
                  移除
                </Button>
              </Space>
            )
          },
        },
      ],
    })
  }, [])

  useEffect(() => {
    handleReleaseModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '表单',
          placeholder: '请输入表单',
          colProps: { span: 24 },
        },
        {
          componentName: 'Switch',
          name: 'b',
          label: '设置来源线索',
          valuePropName: 'checked',
          colProps: { span: 24 },
        },
        {
          componentName: 'Select',
          name: 'c',
          label: '渠道',
          placeholder: '请选择渠道',
          colProps: { span: 24 },
        },
      ],
    })
  }, [])

  /**
   * @Description 加载去推广列表
   * @Author bihongbin
   * @Date 2020-09-29 15:06:23
   */
  useEffect(() => {
    if (promoteModalTableRef.current) {
      promoteModalTableRef.current?.getTableList()
    }
  }, [])

  return (
    <AdmissionsFormWrapper>
      <GenerateForm
        className="search-form mt-4"
        rowGridConfig={{ gutter: 10 }}
        colGirdConfig={formSearchColConfig}
        ref={searchForm}
        list={state.searchFormList}
        render={() => (
          <Space size={10}>
            <Button type="primary" onClick={formSubmit}>
              查询
            </Button>
            <Button className="btn-reset" onClick={formReset}>
              重置
            </Button>
          </Space>
        )}
      />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} xl={8} xxl={6}>
          <Card className="shaded card-hover card-centered">
            <Button className="btn-text-icon is-btn-link">
              <SxyIcon width={16} height={16} name="card_add.png" />
              新建表单
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} xl={8} xxl={6}>
          <Card className="shaded card-hover">
            <Row justify="space-between" align="middle">
              <Col>
                <Space size={10}>
                  <Title className="mb-none" level={5}>
                    日常采单
                  </Title>
                  <Switch />
                </Space>
              </Col>
              <Col>
                <SxyButton mode="light-blue" radius={15}>
                  系统预设
                </SxyButton>
                {/* <SxyButton mode="light-green" radius={15}>
                  已发布
                </SxyButton> */}
                {/* <SxyButton mode="light-red" radius={15}>
                  未发布
                </SxyButton> */}
              </Col>
            </Row>
            <CardContents className="mt-5">
              <Text type="secondary">
                用于收集更精准的意向学员信息，便于后续邀约试听和转化。
              </Text>
              {/* <Row justify="space-between">
                <Col>
                  <div>
                    <Text type="secondary">采单员</Text>
                  </div>
                  <div className="font-16 mt-1">5</div>
                </Col>
                <Col>
                  <div>
                    <Text type="secondary">总浏览量</Text>
                  </div>
                  <div className="font-16 mt-1">1</div>
                </Col>
                <Col>
                  <div>
                    <Text type="secondary">总线索量</Text>
                  </div>
                  <div className="font-16 mt-1">1</div>
                </Col>
              </Row> */}
            </CardContents>
            <Row className="card-foot-text" justify="space-between">
              <Col>
                <Text type="secondary">创建人：系统</Text>
              </Col>
              <Col>
                <Text type="secondary">创建时间：2020-08-27</Text>
              </Col>
            </Row>
            <CardFooters className="card-foot-button">
              <Row id="cart-foot-row-1" align="middle" justify="space-around">
                {/* <Button
                  type="text"
                  onClick={() => handlePreviewModalState({ visible: true })}
                >
                  预览
                </Button>
                <Divider type="vertical" />
                <Button type="link">去使用</Button> */}
                <Button
                  type="text"
                  onClick={() =>
                    handlePromoteTableModalState({ visible: true })
                  }
                >
                  去推广
                </Button>
                <Divider type="vertical" />
                <Button
                  type="text"
                  onClick={() => toPage('/marketing/form/statistics')}
                >
                  查看数据
                </Button>
                <Divider type="vertical" />
                <Button type="text" onClick={handleDeactivatedConfirm}>
                  转为失效
                </Button>
                <Divider type="vertical" />
                <Dropdown
                  getPopupContainer={() =>
                    document.getElementById('cart-foot-row-1') || document.body
                  }
                  overlay={
                    <Menu onClick={(data) => handleMenuItem(data)}>
                      <Menu.Item className="font-12" key="1">
                        复制
                      </Menu.Item>
                      <Menu.Item className="font-12" key="delete">
                        删除
                      </Menu.Item>
                      <Menu.Item className="font-12" key="3">
                        编辑渠道
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="link">更多</Button>
                </Dropdown>
                {/* <Button
                  type="text"
                  onClick={() => handleReleaseModalState({ visible: true })}
                >
                  去发布
                </Button>
                <Divider type="vertical" />
                <Button type="text">编辑</Button>
                <Divider type="vertical" />
                <Button
                  type="text"
                  onClick={() => handlePreviewModalState({ visible: true })}
                >
                  预览
                </Button>
                <Divider type="vertical" />
                <Dropdown
                  overlay={
                    <Menu onClick={(data) => handleMenuItem(data)}>
                      <Menu.Item className="font-12" key="1">
                        复制
                      </Menu.Item>
                      <Menu.Item className="font-12" key="delete">
                        删除
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="link">更多</Button>
                </Dropdown> */}
              </Row>
            </CardFooters>
          </Card>
        </Col>
      </Row>
      <LayoutFormModal
        ref={previewModalRef}
        topRender={
          <div className="mb-5">
            家长朋友您好，
            <br />
            华旅教育是一家专注高中数理化辅导的教育培训机构，致力为学生提供最优质、最高效的学习辅导，在历年高考中屡创佳绩，欢迎您到店咨询试听。
            地址：XX区XX路XX号 电话：138XXXX0000
          </div>
        }
        onCancel={() => handlePreviewModalState({ visible: false })}
        {...state.previewFormModal}
      />
      <LayoutFormModal
        ref={previewModalRef}
        onCancel={() => handlePreviewModalState({ visible: false })}
        {...state.releaseFormModal}
      />
      <Modal
        {...state.promoteTableModal}
        onCancel={() => handlePromoteTableModalState({ visible: false })}
        forceRender={true}
        getContainer={false}
        maskClosable={false}
        footer={null}
      >
        <SxyTips mode="primary">
          <div>
            1.点击“添加采单员”，可以生成采单员专属二维码。机构打开“采单员”设置后，当家长扫码录
            入信息，该线索会标注对应的采单员。
            <br />
            2.请前往“咨询本-设置-售前人员设置”里打开“采单员”设置。
            <br />
            3.点击“批量下载二维码”可快速下载二维码分配给采单员，也可单独领取各个采单员的二维码。
          </div>
        </SxyTips>
        <Space size={10}>
          <Button
            type="primary"
            onClick={() => handlePurchaserTableModalState({ visible: true })}
          >
            添加采单员
          </Button>
          <Button>批量下载二维码</Button>
        </Space>
        <div className="mt-4 mb-2">
          共
          <Button className="is-btn-link ml-1 mr-1" type="link">
            41
          </Button>
          名采单员
        </div>
        <GenerateTable
          ref={promoteModalTableRef}
          rowType="checkbox"
          apiMethod={getBasicQtyList}
          columns={state.promoteTableModal.tableColumns}
          tableConfig={{
            className: 'table-header-grey',
            scroll: {
              y: 300,
            },
          }}
        />
      </Modal>
      <LayoutTableModal
        {...state.purchaserTableModal}
        onCancel={() => handlePurchaserTableModalState({ visible: false })}
        onConfirm={(data) => {
          console.log('添加采单员：', data)
          return Promise.resolve(true)
        }}
      />
    </AdmissionsFormWrapper>
  )
}

export default MainPage
