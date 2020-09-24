import React, { useEffect, useRef, useReducer, useCallback } from 'react'
import {
  Space,
  Button,
  Modal,
  Spin,
  Row,
  Col,
  Tabs,
  Typography,
  Avatar,
} from 'antd'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import GenerateForm, { FormCallType } from '@/components/GenerateForm'
import Editor from '@/components/Editor'
import { handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import {
  getReportConfigSubheadList,
  setReportConfigSubheadDelete,
} from '@/api/report'

const { TabPane } = Tabs
const { Text } = Typography

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_COLUMNS = '[SetColumns Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  // 头部搜索数据
  searchFormList: [] as FormListCallType[],
  // 表格表头
  tableColumns: [],
  // 卡片操作按钮
  cardHandleButtonList: [],
  // 详情弹窗
  handleModal: {
    visible: false,
    title: '新增商品信息',
    disabled: false,
    loading: false,
    saveLoading: false,
    basicFormList: [] as FormListCallType[], // 基本信息
    stockFormList: [] as FormListCallType[], // 商品库存
    inventoryReduction: '1', // 库存减法
  },
}

const GoodsMainList = () => {
  const tableRef = useRef<LayoutTableCallType>()
  const basicFormRef = useRef<FormCallType>()
  const stockFormRef = useRef<FormCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置卡片操作按钮
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增、编辑、查看弹窗数据
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-02 10:33:15
   */
  const handleSearchFormList = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置新增、编辑、查看弹窗数据
   * @Author bihongbin
   * @Date 2020-09-02 14:26:03
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 编辑和查看
   * @Author bihongbin
   * @Date 2020-09-03 15:58:11
   */
  const getOpenModal = useCallback(
    (record: AnyObjectType, type: 'look' | 'edit') => {
      // 查看
      if (type === 'look') {
        handleModalState({
          visible: true,
          title: '商品信息详情',
          disabled: true,
        })
      }
      // 编辑
      if (type === 'edit') {
        handleModalState({
          visible: true,
          title: '编辑商品信息',
          disabled: false,
        })
      }
    },
    [],
  )

  /**
   * @Description 提交
   * @Author bihongbin
   * @Date 2020-09-02 14:24:20
   */
  const formSubmit = () => {
    console.log('提交表单')
  }

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-02 10:31:25
   */
  useEffect(() => {
    handleSearchFormList([
      {
        componentName: 'Input',
        name: 'a',
        placeholder: '商品名称',
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '商品分组',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '商品状态',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'd',
        placeholder: '商品分类',
        selectData: [],
      },
      {
        componentName: 'Union',
        unionConfig: {
          unionItems: [
            {
              componentName: 'Input',
              name: 'e1',
              placeholder: '销量',
            },
            {
              componentName: 'Input',
              name: 'e2',
              placeholder: '销量',
            },
          ],
        },
      },
      {
        componentName: 'Union',
        unionConfig: {
          unionItems: [
            {
              componentName: 'Input',
              name: 'f1',
              placeholder: '价格',
            },
            {
              componentName: 'Input',
              name: 'f2',
              placeholder: '价格',
            },
          ],
        },
      },
      {
        componentName: 'Select',
        name: 'g',
        placeholder: '商品查看范围',
        selectData: [],
      },
      {
        componentName: 'RangePicker',
        name: 'h',
      },
    ])
  }, [])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-09-02 10:29:36
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '发布商品',
          icon: 'card_add.png',
          clickConfirm: () => {
            handleModalState({
              visible: true,
              title: '新增商品信息',
            })
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-02 10:28:25
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_COLUMNS,
      payload: [
        {
          title: '商品编号',
          dataIndex: 'a1',
        },
        {
          title: '商品名称',
          dataIndex: 'b1',
        },
        {
          title: '价格（元）',
          dataIndex: 'c1',
        },
        {
          title: '库存',
          dataIndex: 'd1',
        },
        {
          title: '商品状态',
          dataIndex: 'e1',
        },
        {
          title: '商品分组',
          dataIndex: 'f1',
        },
        {
          title: '总销量',
          dataIndex: 'h1',
        },
        {
          title: '商品标签',
          dataIndex: 'i1',
          width: 200,
          render: () => {
            return (
              <Space>
                <Button size="small" type="primary" ghost>
                  推荐
                </Button>
                <Button size="small" type="primary" ghost>
                  热卖
                </Button>
                <Button size="small" type="primary" ghost>
                  新品
                </Button>
              </Space>
            )
          },
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 180,
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 135,
          render: (value: number, record: any) => {
            const operatingData = []
            // 查看
            operatingData.push({
              name: '查看',
              onClick: () => getOpenModal(record, 'look'),
              svg: 'table_see.png',
            })
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => getOpenModal(record, 'edit'),
              svg: 'table_edit.png',
            })
            // 删除
            operatingData.push({
              name: '删除',
              onClick: () => {
                if (tableRef.current) {
                  handleRowDelete(
                    [record.id],
                    setReportConfigSubheadDelete,
                    tableRef.current.getTableList,
                  )
                }
              },
              svg: 'table_delete.png',
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [getOpenModal])

  /**
   * @Description 设置商品信息弹窗数据
   * @Author bihongbin
   * @Date 2020-09-02 14:43:36
   */
  useEffect(() => {
    handleModalState({
      // 基本信息
      basicFormList: [
        {
          componentName: 'Radio',
          name: 'a',
          label: '商品类型',
          selectData: [
            {
              label: '课程商品',
              value: '1',
            },
            {
              label: '实体商品',
              value: '2',
            },
            {
              label: '组合商品',
              value: '3',
            },
            {
              label: '批发商品',
              value: '4',
            },
          ],
          disabled: state.handleModal.disabled,
          colProps: {
            span: 24,
          },
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '课程选择',
          placeholder: '请选择课程',
          selectData: [],
          disabled: state.handleModal.disabled,
          rules: [{ required: true, message: '请选择课程' }],
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '商品名称',
          placeholder: '请输入商品名称',
          disabled: state.handleModal.disabled,
          rules: [{ required: true, message: '请输入商品名称' }],
        },
        {
          componentName: 'Select',
          name: 'd',
          label: '商品分类',
          placeholder: '请选择分类',
          selectData: [],
          disabled: state.handleModal.disabled,
          rules: [{ required: true, message: '请选择分类' }],
        },
        {
          componentName: 'Input',
          name: 'de',
          label: '商品副标题',
          placeholder: '请输入商品副标题',
          disabled: state.handleModal.disabled,
          rules: [{ required: true, message: '请输入商品副标题' }],
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '关键词',
          placeholder: '请输入关键词',
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Input',
          name: 'f',
          label: '商品排序',
          placeholder: '请输入商品排序',
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Select',
          name: 'g',
          label: '商品计量单位',
          selectData: [],
          rules: [{ required: true, message: '请选择商品计量单位' }],
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
          render: () => (
            <Text className="font-12" type="secondary">
              请输入计量单位，例如：个、斤等；请尽量填写常规使用计量单位，便于数据分析
            </Text>
          ),
        },
        {
          componentName: 'Checkbox',
          name: 'h',
          label: '商品属性',
          selectData: [
            {
              label: '推荐',
              value: '1',
            },
            {
              label: '新品',
              value: '2',
            },
            {
              label: '热卖',
              value: '3',
            },
          ],
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'HideInput',
          name: 'i',
          label: '商品主图',
          rules: [{ required: true, message: '请选择商品主图' }],
          render: () => {
            return (
              <>
                <div>
                  <Space size={20}>
                    <Avatar
                      className="pointer"
                      shape="square"
                      size={100}
                      alt="商品主图"
                    />
                    {!state.handleModal.disabled && (
                      <Button type="primary">上传</Button>
                    )}
                  </Space>
                </div>
                <div className="mt-2">
                  <Text className="font-12" type="secondary">
                    商品主图片最佳尺寸400*400，商品主图显示在商品列表，只能上传一张
                  </Text>
                </div>
              </>
            )
          },
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'HideInput',
          name: 'j',
          label: '商品特色图',
          rules: [{ required: true, message: '请选择商品特色图' }],
          render: () => {
            return (
              <>
                <div>
                  <Space size={20}>
                    <Avatar
                      className="pointer"
                      shape="square"
                      size={100}
                      alt="商品特色图"
                    />
                    {!state.handleModal.disabled && (
                      <Button type="primary">上传</Button>
                    )}
                  </Space>
                </div>
                <div className="mt-2">
                  <Text className="font-12" type="secondary">
                    商品特色图片最小宽度750，最大宽度1920，最多上传5张图片
                  </Text>
                </div>
              </>
            )
          },
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Radio',
          name: 'k',
          label: '是否上架',
          rules: [{ required: true, message: '请选择' }],
          selectData: [
            {
              label: '上架',
              value: '1',
            },
            {
              label: '下架',
              value: '2',
            },
          ],
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
        },
      ],
      // 商品库存
      stockFormList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '商品编码',
          placeholder: '请输入商品编码',
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '商品条码',
          placeholder: '请输入商品条码',
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '商品重量',
          placeholder: '请输入商品重量',
          inputConfig: {
            suffix: 'g',
          },
          rules: [{ required: true, message: '请输入商品重量' }],
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '商品库存',
          placeholder: '请输入商品库存',
          rules: [{ required: true, message: '请输入商品库存' }],
          colProps: {
            span: 14,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Radio',
          name: 'e',
          label: '是否显示库存',
          selectData: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
          colProps: {
            span: 10,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Radio',
          name: 'f',
          label: '库存扣减方式',
          selectData: [
            {
              label: '永不减库存',
              value: '0',
            },
            {
              label: '付款减库存',
              value: '1',
            },
            {
              label: '拍下减库存',
              value: '2',
            },
          ],
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Input',
          name: 'g',
          label: '库存预警',
          placeholder: '请输入库存预警',
          colProps: {
            span: 24,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              当商品库存低于这个数值，商品进入预警状态。
            </Text>
          ),
          disabled: state.handleModal.disabled,
        },
      ],
    })
  }, [state.handleModal.disabled, state.handleModal.inventoryReduction])

  return (
    <>
      <LayoutTableList
        ref={tableRef}
        api={getReportConfigSubheadList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle={
          <Space size={10}>
            <Button>上架</Button>
            <Button>下架</Button>
            <Button>改分组</Button>
            <Button>批量设置</Button>
          </Space>
        }
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
      />
      <Modal
        visible={state.handleModal.visible}
        width={720}
        title={state.handleModal.title}
        onCancel={() => handleModalState({ visible: false })}
        getContainer={false}
        footer={null}
      >
        <Spin spinning={state.handleModal.loading}>
          <Tabs tabBarGutter={40} defaultActiveKey="1">
            <TabPane tab="基本信息" key="1">
              <div className="modal-form-height">
                <GenerateForm
                  ref={basicFormRef}
                  className="form-ash-theme form-large-font14 mr-5"
                  formConfig={{
                    size: 'large',
                    initialValues: {
                      a: '1',
                      h: '1',
                      k: '1',
                    },
                    labelCol: { span: 24 },
                  }}
                  rowGridConfig={{ gutter: [40, 0] }}
                  colGirdConfig={{ span: 12 }}
                  list={state.handleModal.basicFormList}
                />
              </div>
            </TabPane>
            <TabPane tab="商品库存" key="2">
              <div className="modal-form-height">
                <GenerateForm
                  ref={stockFormRef}
                  className="form-ash-theme form-large-font14 mr-5"
                  formConfig={{
                    size: 'large',
                    initialValues: {
                      e: '0',
                      f: '1',
                    },
                    labelCol: { span: 24 },
                  }}
                  rowGridConfig={{ gutter: [40, 0] }}
                  colGirdConfig={{ span: 12 }}
                  list={state.handleModal.stockFormList}
                />
              </div>
            </TabPane>
            <TabPane tab="商品详情" key="3" forceRender>
              <div className="modal-form-height">
                <Editor />
              </div>
            </TabPane>
            <TabPane tab="分销" key="4">
              <div className="modal-form-height">Content of Tab Pane 3</div>
            </TabPane>
          </Tabs>
          <Row className="mt-10 mb-5" justify="center">
            <Col>
              <Button
                className="font-14"
                size="large"
                onClick={() => {
                  handleModalState({ visible: false })
                }}
              >
                取消
              </Button>
              {!state.handleModal.disabled && (
                <Button
                  className="font-14 ml-5"
                  size="large"
                  type="primary"
                  loading={state.handleModal.saveLoading}
                  onClick={formSubmit}
                >
                  提交
                </Button>
              )}
            </Col>
          </Row>
        </Spin>
      </Modal>
    </>
  )
}

export default GoodsMainList
