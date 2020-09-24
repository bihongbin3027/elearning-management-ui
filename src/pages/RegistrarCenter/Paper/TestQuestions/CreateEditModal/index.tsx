import React, { useReducer, useEffect, useMemo } from 'react'
import {
  Modal,
  Row,
  Col,
  Button,
  Tabs,
  Form,
  Radio,
  Input,
  Checkbox,
  Select,
  Space,
  Typography,
  Card,
} from 'antd'
import { RadioChangeEvent } from 'antd/es/radio'
import { AnyObjectType } from '@/typings'
import { SxyIcon } from '@/style/module/icon'
import InputExampleModal from '@/pages/RegistrarCenter/Paper/TestQuestions/InputExampleModal'
import InputSpecificationModal from '@/pages/RegistrarCenter/Paper/TestQuestions/InputSpecificationModal'
import Upload from '@/components/Upload'
import { GlobalConstant } from '@/config'

const { TabPane } = Tabs
const { Option } = Select
const { Title, Text } = Typography

interface PropType {
  visible: boolean
  id?: string
  title: string
  type: 'add' | 'look'
  onCancel: () => void
  onConfirm?: () => void
}

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
  SET_TAB_KEY = '[SetTabKey Action]',
  SET_QUESTION_TYPE = '[SetQuestionType Action]',
  SET_QUESTION_INDEXES = '[SetQuestionIndexed Action]',
  SET_QUESTION_OPTIONS_LIST = '[SetQuestionOptionsList Action]',
  SET_INPUT_EXAMPLE_VISIBLE = '[SetInputExampleVisible Action]',
  SET_INPUT_SPECIFICATION_VISIBLE = '[SetInputSpecificationVisible Action]',
  SET_BATCH_IMPORT = '[SetBatchImport Action]',
}

const stateValue = {
  loading: false, // loading
  saveLoading: false, // 保存loading
  tabKey: '1', // tab切换的key
  questionType: '1', // 试题类型
  questionIndexes: [], // 试题字母
  questionOptionsList: ['', ''], // 试题选项的数据
  inputExampleVisible: false, // 输入范例弹窗
  inputSpecificationVisible: false, // 输入规范
  // 批量导入数据
  batchImport: {
    inputArea: '', // 输入区
    inspectionArea: '', // 检查区
    degreeOfDifficulty: '0', // 难易程度
  },
}

const CreateEditView = (props: PropType) => {
  const [form] = Form.useForm()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // loading
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_SAVE_LOADING: // 保存loading
        return {
          ...state,
          saveLoading: action.payload,
        }
      case ActionType.SET_TAB_KEY: // 设置tab的key
        return {
          ...state,
          tabKey: action.payload,
        }
      case ActionType.SET_QUESTION_TYPE: // 设置试题类型
        return {
          ...state,
          questionType: action.payload,
        }
      case ActionType.SET_QUESTION_INDEXES: // 设置26英文字母
        return {
          ...state,
          questionIndexes: action.payload,
        }
      case ActionType.SET_QUESTION_OPTIONS_LIST: // 设置试题选项数据
        return {
          ...state,
          questionOptionsList: action.payload,
        }
      case ActionType.SET_INPUT_EXAMPLE_VISIBLE: // 设置输入范例弹窗
        return {
          ...state,
          inputExampleVisible: action.payload,
        }
      case ActionType.SET_INPUT_SPECIFICATION_VISIBLE: // 设置输入规范弹窗
        return {
          ...state,
          inputSpecificationVisible: action.payload,
        }
      case ActionType.SET_BATCH_IMPORT: // 设置批量导入数据
        return {
          ...state,
          batchImport: {
            ...state.batchImport,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置批量导入数据
   * @Author bihongbin
   * @Date 2020-08-25 15:05:55
   */
  const handleBatchImportState = (data: Partial<StateType['batchImport']>) => {
    dispatch({
      type: ActionType.SET_BATCH_IMPORT,
      payload: data,
    })
  }

  /**
   * @Description tab切换
   * @Author bihongbin
   * @Date 2020-08-24 14:11:53
   */
  const handleTabClick = (key: string) => {
    dispatch({
      type: ActionType.SET_TAB_KEY,
      payload: key,
    })
  }

  /**
   * @Description 字段值更新时触发回调事件
   * @Author bihongbin
   * @Date 2020-08-24 17:19:10
   */
  const formValuesChange = (
    changedValues: AnyObjectType,
    allValues: AnyObjectType,
  ) => {
    // 设置试题选项数据
    dispatch({
      type: ActionType.SET_QUESTION_OPTIONS_LIST,
      payload: allValues['c'],
    })
  }

  /**
   * @Description 试题类型切换
   * @Author bihongbin
   * @Date 2020-08-24 14:38:15
   */
  const questionTypesChange = (e: RadioChangeEvent) => {
    dispatch({
      type: ActionType.SET_QUESTION_TYPE,
      payload: e.target.value,
    })
  }

  /**
   * @Description 上传成功回调
   * @Author bihongbin
   * @Date 2020-08-25 17:12:15
   */
  const uploadSuccess = async (data: AnyObjectType[]) => {
    console.log('上传成功', data)
  }

  /**
   * @Description 输入范例和输入规范
   * @Author bihongbin
   * @Date 2020-08-25 14:36:05
   */
  const exampleLink = useMemo(
    () => (
      <Space>
        <Button
          className="is-btn-link font-12"
          type="link"
          onClick={() =>
            dispatch({
              type: ActionType.SET_INPUT_EXAMPLE_VISIBLE,
              payload: true,
            })
          }
        >
          输入范例
        </Button>
        <Button
          className="is-btn-link font-12"
          type="link"
          onClick={() =>
            dispatch({
              type: ActionType.SET_INPUT_SPECIFICATION_VISIBLE,
              payload: true,
            })
          }
        >
          输入规范
        </Button>
      </Space>
    ),
    [],
  )

  /**
   * @Description 试题答案
   * @Author bihongbin
   * @Date 2020-08-24 17:05:09
   */
  const answersQuestionsNode = () => {
    // 试题类型
    const questionType = parseInt(state.questionType)
    // 难易程度
    const degreeSelect = (
      <Form.Item name="g" label="难易程度" style={{ width: '220px' }}>
        <Select>
          <Option value="0">普通</Option>
          <Option value="1">困难</Option>
        </Select>
      </Form.Item>
    )
    // 解析
    const analysisTxtArea = (
      <Form.Item name="jx" label="解析">
        <Input.TextArea rows={3} placeholder="若无解析本行可不填" />
      </Form.Item>
    )
    let questionParams = {
      domTxt: <div />,
      message: '请选择试题答案',
    }
    // 单选题
    if (questionType === 1) {
      questionParams.domTxt = (
        <Radio.Group>
          {state.questionOptionsList.map((item, index) => (
            <Radio value={state.questionIndexes[index]} key={index}>
              {state.questionIndexes[index]}
            </Radio>
          ))}
        </Radio.Group>
      )
    }
    // 多选题
    if (questionType === 2) {
      questionParams.domTxt = (
        <Checkbox.Group>
          {state.questionOptionsList.map((item, index) => (
            <Checkbox value={state.questionIndexes[index]} key={index}>
              {state.questionIndexes[index]}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )
    }
    // 判断题
    if (questionType === 3) {
      questionParams.domTxt = (
        <Radio.Group>
          <Radio value="0">正确</Radio>
          <Radio value="1">错误</Radio>
        </Radio.Group>
      )
    }
    // 简答题
    if (questionType === 5) {
      questionParams.message = '请输入试题答案'
      questionParams.domTxt = <Input placeholder={questionParams.message} />
    }
    if (
      questionType === 1 ||
      questionType === 2 ||
      questionType === 3 ||
      questionType === 5
    ) {
      return (
        <>
          <Form.Item
            name="d"
            label="试题答案"
            rules={[
              {
                required: true,
                message: questionParams.message,
              },
            ]}
          >
            {questionParams.domTxt}
          </Form.Item>
          {analysisTxtArea}
          {degreeSelect}
        </>
      )
    }
    // 填空题
    if (questionType === 4) {
      return (
        <>
          <Form.List name="e">
            {(fields, { add, remove }) => {
              return (
                <div className="questions-list">
                  {fields.map((field, index) => (
                    <Form.Item
                      label={index === 0 ? '试题答案' : null}
                      key={field.key}
                      required={true}
                      labelCol={{
                        xs: { span: 24 },
                      }}
                    >
                      <Row align="middle" gutter={10}>
                        <Col span={fields.length > 1 ? 23 : 24}>
                          <Form.Item
                            {...field}
                            validateTrigger={['onChange', 'onBlur']}
                            rules={[
                              {
                                required: true,
                                message: '请输入试题答案',
                              },
                            ]}
                            noStyle
                          >
                            <Input placeholder="请输入试题答案" />
                          </Form.Item>
                        </Col>
                        <Col span={1}>
                          {fields.length > 1 ? (
                            <SxyIcon
                              className="pointer"
                              width={20}
                              height={20}
                              name="btn_radius_close.png"
                              onClick={() => remove(field.name)}
                            />
                          ) : null}
                        </Col>
                      </Row>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        if (fields.length >= 8) {
                          return
                        }
                        add()
                      }}
                    >
                      添加答案
                    </Button>
                  </Form.Item>
                </div>
              )
            }}
          </Form.List>
          {analysisTxtArea}
          {degreeSelect}
        </>
      )
    }
    // 组合题
    if (questionType === 6) {
      return (
        <>
          {degreeSelect}
          <div className="item-label-right">
            {exampleLink}
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="m"
                  label="输入区"
                  rules={[
                    {
                      required: true,
                      message: '请输入内容',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input.TextArea
                    rows={12}
                    placeholder="题库录入前请先查看右上角的输入范例及输入规范，请将题库内容按范例格式要求编辑好，复制在此处即可自动识别、批量导入"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="n" label="检查区" style={{ marginBottom: 0 }}>
                  <Input.TextArea rows={12} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </>
      )
    }
  }

  /**
   * @Description 渲染tab
   * @Author bihongbin
   * @Date 2020-08-24 14:16:22
   */
  const tabRender = () => {
    const tabKey = parseInt(state.tabKey)
    const questionType = parseInt(state.questionType)
    // 手动导入
    if (tabKey === 1) {
      return (
        <Form
          className="form-ash-theme form-large-font14 form-questions-vertical"
          initialValues={{
            a: '1',
            c: state.questionOptionsList,
            e: [''],
            g: '0',
          }}
          form={form}
          labelCol={{
            span: 24,
          }}
          size="large"
          labelAlign="left"
          onValuesChange={formValuesChange}
          onFinish={handleFinish}
        >
          <Form.Item
            name="a"
            label="试题类型"
            rules={[
              {
                required: true,
                message: '请选择试题类型',
              },
            ]}
          >
            <Radio.Group onChange={questionTypesChange}>
              <Radio value="1">单选题</Radio>
              <Radio value="2">多选题</Radio>
              <Radio value="3">判断题</Radio>
              <Radio value="4">填空题</Radio>
              <Radio value="5">简答题</Radio>
              <Radio value="6">组合题</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="b"
            label="试题题目"
            rules={[
              {
                required: true,
                message: '请输入试题题目',
              },
            ]}
          >
            <Input placeholder="请输入试题题目" />
          </Form.Item>
          {questionType === 1 || questionType === 2 ? (
            <Form.List name="c">
              {(fields, { add, remove }) => {
                return (
                  <div className="questions-list">
                    {fields.map((field, index) => (
                      <Form.Item
                        label={index === 0 ? '试题选项' : null}
                        key={field.key}
                        required={true}
                        labelCol={{
                          xs: { span: 24 },
                        }}
                      >
                        <Row align="middle" gutter={10}>
                          <Col className="text-right" span={1}>
                            {state.questionIndexes[index]}.
                          </Col>
                          <Col span={fields.length > 1 ? 22 : 23}>
                            <Form.Item
                              {...field}
                              validateTrigger={['onChange', 'onBlur']}
                              rules={[
                                {
                                  required: true,
                                  message: '请输入试题选项内容',
                                },
                              ]}
                              noStyle
                            >
                              <Input placeholder="请输入试题选项内容" />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            {fields.length > 1 ? (
                              <SxyIcon
                                className="pointer"
                                width={20}
                                height={20}
                                name="btn_radius_close.png"
                                onClick={() => remove(field.name)}
                              />
                            ) : null}
                          </Col>
                        </Row>
                      </Form.Item>
                    ))}
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={() => {
                          if (fields.length >= 8) {
                            return
                          }
                          add()
                        }}
                      >
                        添加选项
                      </Button>
                    </Form.Item>
                  </div>
                )
              }}
            </Form.List>
          ) : null}
          {answersQuestionsNode()}
        </Form>
      )
    }
    // 批量导入
    if (tabKey === 2) {
      return (
        <div>
          <div>使用说明：</div>
          <div>
            1. 先查看 输入范例 和
            输入规范，按照规范编辑，可以同时批量录入50~100道试题。
          </div>
          <div>
            2. 输入错误时，右侧检查区将出现红色框提示，说明需要修改试题格式。
          </div>
          <Row className="mt-5" gutter={20}>
            <Col className="ant-card theme-grey" span={12}>
              <Row className="card-header" justify="space-between">
                <Col>输入区</Col>
                <Col>{exampleLink}</Col>
              </Row>
              <div className="card-body">
                <Input.TextArea
                  value={state.batchImport.inputArea}
                  rows={15}
                  placeholder="题库录入前请先查看右上角的输入范例及输入规范，请将题库内容按范例格式要求编辑好，复制在此处即可自动识别、批量导入"
                  onChange={(e) =>
                    handleBatchImportState({ inputArea: e.target.value })
                  }
                />
              </div>
            </Col>
            <Col className="ant-card theme-grey" span={12}>
              <div className="card-header">检查区</div>
              <div className="card-body">
                <Input.TextArea
                  value={state.batchImport.inspectionArea}
                  rows={15}
                  disabled
                />
              </div>
            </Col>
          </Row>
          <div className="mt-5">
            <div>难易程度</div>
            <Select
              className="mt-1"
              defaultValue={state.batchImport.degreeOfDifficulty}
              value={state.batchImport.degreeOfDifficulty}
              style={{ width: 220 }}
              onChange={(value) =>
                handleBatchImportState({ degreeOfDifficulty: value })
              }
            >
              <Option value="0">普通</Option>
              <Option value="1">困难</Option>
            </Select>
          </div>
        </div>
      )
    }
    // 模板导入
    if (tabKey === 3) {
      return (
        <>
          <Title className="text-center mt-3" level={5}>
            模板导入试题
          </Title>
          <Text type="secondary">
            请先下载模板，参考模板格式，修改试题格式后，再进行上传，查看
            <Button className="is-btn-link" type="link">
              《上传题库-模板导入教程》
            </Button>
          </Text>
          <Row className="mt-5" gutter={20}>
            <Col span={12}>
              <Card style={{ height: '100%' }}>
                <div className="text-center">
                  <SxyIcon width={80} height={80} name="file_doc.png" />
                  <div className="bold mt-4 mb-3">Word模板导入</div>
                </div>
                <Text type="secondary">1、请使用Office软件，不要使用WPS</Text>
                <br />
                <Text type="secondary">
                  2、请使用.docx的文档格式，
                  <Button className="is-btn-link" type="link">
                    查看教程
                  </Button>
                </Text>
                <br />
                <Text type="secondary">3、支持公式/图片导入</Text>
                <br />
                <Text type="secondary">
                  4、不能使用文档的自动编号功能，编辑试题序号，
                  <Button className="is-btn-link" type="link">
                    如何取消自动编号
                  </Button>
                </Text>
                <br />
                <Text type="secondary">5、按照模板格式，编辑输入试题文档</Text>
                <br />
                <div className="text-center mt-5">
                  <button
                    className="btn btn-large btn-blue"
                    style={{ width: '180px' }}
                  >
                    Word模板下载
                  </button>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{ height: '100%' }}>
                <div className="text-center">
                  <SxyIcon width={80} height={80} name="file_xls.png" />
                  <div className="bold mt-4 mb-3">Excel模板导入</div>
                </div>
                <Text type="secondary">1、不支持含有公式/图片的试题导入</Text>
                <br />
                <Text type="secondary">2、支持章节的编辑导入</Text>
                <br />
                <Text type="secondary">3、按照模板格式，编辑输入试题文档</Text>
                <br />
                <div className="text-center mt-5">
                  <button className="btn btn-large btn-green">
                    Excel模板下载（有案例）
                  </button>
                </div>
                <div className="text-center mt-2">
                  <button className="btn btn-large btn-green">
                    Excel模板下载（无案例）
                  </button>
                </div>
              </Card>
            </Col>
          </Row>
          <div className="text-center mt-8">
            <Upload
              action={GlobalConstant.billHdrUploadHttp}
              uploadSuccess={uploadSuccess}
              uploadType={['docx', 'xlsx', 'xls']}
              multiple
            >
              <>
                <div>
                  <SxyIcon
                    className="pointer"
                    width={48}
                    height={48}
                    name="curriculum_upload.png"
                  />
                </div>
                <div className="font-12 mt-2">上传题库</div>
                <div className="mt-1">
                  <Text className="font-12" type="secondary">
                    点击按钮选择试题文件
                  </Text>
                </div>
              </>
            </Upload>
          </div>
        </>
      )
    }
  }

  /**
   * @Description 提交
   * @Author bihongbin
   * @Date 2020-08-24 14:24:35
   */
  const handleFinish = (values: AnyObjectType) => {
    console.log(values)
  }

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-24 11:45:40
   */
  const handleIconSave = () => {
    form.submit()
  }

  /**
   * @Description 设置26英文字母
   * @Author bihongbin
   * @Date 2020-08-24 16:29:49
   */
  useEffect(() => {
    let z = []
    for (var i = 0; i < 26; i++) {
      z.push(String.fromCharCode(65 + i))
    }
    dispatch({
      type: ActionType.SET_QUESTION_INDEXES,
      payload: z,
    })
  }, [])

  return (
    <>
      <Modal
        width={700}
        visible={props.visible}
        title={props.title ? props.title : '新增'}
        onCancel={props.onCancel}
        destroyOnClose
        maskClosable={false}
        footer={null}
      >
        {props.type === 'add' ? (
          <Tabs
            type="card"
            tabBarGutter={10}
            activeKey={state.tabKey}
            onTabClick={handleTabClick}
          >
            <TabPane tab="手动导入" key="1" />
            <TabPane tab="批量导入" key="2" />
            <TabPane tab="模板导入" key="3" />
          </Tabs>
        ) : null}
        <Row className="modal-form-height" gutter={20}>
          <Col span={24}>{tabRender()}</Col>
        </Row>
        <Row className="mt-10 mb-5" justify="center">
          <Col>
            <Button className="font-14" size="large" onClick={props.onCancel}>
              取消
            </Button>
            <Button
              className="font-14 ml-5"
              size="large"
              type="primary"
              onClick={handleIconSave}
            >
              提交
            </Button>
          </Col>
        </Row>
      </Modal>
      <InputExampleModal
        visible={state.inputExampleVisible}
        onCancel={() =>
          dispatch({
            type: ActionType.SET_INPUT_EXAMPLE_VISIBLE,
            payload: false,
          })
        }
      />
      <InputSpecificationModal
        visible={state.inputSpecificationVisible}
        onCancel={() =>
          dispatch({
            type: ActionType.SET_INPUT_SPECIFICATION_VISIBLE,
            payload: false,
          })
        }
      />
    </>
  )
}

export default CreateEditView
