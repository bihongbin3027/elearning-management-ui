import React, { useRef, useReducer, useEffect } from 'react'
import { Modal, Row, Col, Button, Typography } from 'antd'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import Upload from '@/components/Upload'
import { GlobalConstant } from '@/config'
import { AnyObjectType } from '@/typings'
import { SxyIcon } from '@/style/module/icon'

const { Text } = Typography

interface PropType {
  visible: boolean
  id?: string
  onCancel: () => void
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
  SET_FORM_LIST = '[SetFormList Action]',
  SET_TEACHING_SWITCH = '[SetTeachingSwitch Action]',
}

const stateValue = {
  loading: false, // loading
  saveLoading: false, // 保存loading
  formList: [] as FormListType[], // 表单数据
  teachingSwitch: '0', // 授课方式切换
}

const EditClassHourView = (props: PropType) => {
  const formRef = useRef<FormCallType>(null)
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置loading
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_SAVE_LOADING: // 设置保存loading
        return {
          ...state,
          saveLoading: action.payload,
        }
      case ActionType.SET_FORM_LIST: // 设置表单数据
        return {
          ...state,
          formList: action.payload,
        }
      case ActionType.SET_TEACHING_SWITCH: // 设置授课方式切换
        return {
          ...state,
          teachingSwitch: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 字段值更新时触发回调事件
   * @Author bihongbin
   * @Date 2020-08-21 10:57:00
   */
  const onFieldsChange = (
    changedValues: AnyObjectType,
    allValues: AnyObjectType,
  ) => {
    dispatch({
      type: ActionType.SET_TEACHING_SWITCH,
      payload: allValues['d'],
    })
  }

  /**
   * @Description 设置表单数据
   * @Author bihongbin
   * @Date 2020-08-21 10:07:15
   */
  const handleFormListState = (data: StateType['formList']) => {
    dispatch({
      type: ActionType.SET_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 上传成功回调
   * @Author bihongbin
   * @Date 2020-08-21 10:49:48
   */
  const uploadSuccess = async (data: AnyObjectType[]) => {
    console.log('上传成功', data)
  }

  /**
   * @Description 表单提交
   * @Author bihongbin
   * @Date 2020-08-21 10:34:33
   */
  const formSubmit = async () => {
    let formParams = await formRef.current?.formSubmit()
    console.log('formParams', formParams)
  }

  /**
   * @Description 设置表单数据
   * @Author bihongbin
   * @Date 2020-08-21 09:57:05
   */
  useEffect(() => {
    handleFormListState([
      {
        componentName: 'Input',
        name: 'a',
        label: '章名称',
        placeholder: '请输入章名称',
        rules: [{ required: true }],
        disabled: true,
      },
      {
        componentName: 'Input',
        name: 'b',
        label: '节名称',
        placeholder: '请输入节名称',
        rules: [{ required: true }],
        disabled: true,
      },
      {
        componentName: 'Input',
        name: 'c',
        label: '课时名称',
        placeholder: '请输入课时名称',
        rules: [{ required: true, message: '请输入课时名称' }],
      },
      {
        componentName: 'Radio',
        name: 'd',
        label: '授课方式',
        selectData: [
          { label: '现场授课', value: '0' },
          { label: '直播', value: '1' },
          { label: '录课', value: '2' },
        ],
        render: () => {
          // 现场授课和录课
          if (state.teachingSwitch === '0' || state.teachingSwitch === '2') {
            return (
              <div className="ant-row ant-form-item">
                <div className="ant-col ant-col-24 ant-form-item-label">
                  <label>
                    {state.teachingSwitch === '0' ? '课件上传' : '录播文件'}
                  </label>
                </div>
                <div className="ant-col ant-form-item-control">
                  <Upload
                    action={GlobalConstant.billHdrUploadHttp}
                    uploadSuccess={uploadSuccess}
                    uploadType={['mp3', 'mp4']}
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
                      <div>
                        <Text className="font-12" type="secondary">
                          支持文件格式：.mp4、.avi，只能上传一个视频
                        </Text>
                      </div>
                    </>
                  </Upload>
                </div>
              </div>
            )
          }
          // 直播
          if (state.teachingSwitch === '1') {
            return (
              <Text className="font-12" type="danger">
                提示：直播时间请在班期课程上设置，如何进入直播可在下面说明
              </Text>
            )
          }
          return <></>
        },
      },
      {
        visible: state.teachingSwitch !== '1',
        componentName: 'TextArea',
        name: 'e',
        label: '直播说明',
        placeholder: '最多可以输入300个字',
        rows: 3,
        rules: [{ max: 300, message: '最多可以输入300个字' }],
      },
    ])
  }, [state.teachingSwitch])

  return (
    <Modal
      width={420}
      visible={props.visible}
      title="课程/课时"
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <GenerateForm
        ref={formRef}
        formConfig={{
          labelCol: { span: 24 },
          initialValues: { d: '0' },
          onValuesChange: onFieldsChange,
        }}
        rowGridConfig={{ gutter: [40, 0] }}
        colGirdConfig={{ span: 24 }}
        list={state.formList}
      />
      <Row className="mt-10 mb-5" justify="center">
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
            onClick={formSubmit}
          >
            提交
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default EditClassHourView
