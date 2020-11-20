import React, { useEffect, useRef } from 'react'
import { Modal, Row, Button, Col, message } from 'antd'
import useSetState from '@/hooks/useSetState'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import { AnyObjectType, SubmitApiType } from '@/typings'

interface PropType {
  visible: boolean
  width?: number
  title: string
  submitExtraParameters?: AnyObjectType // 需要提交表单的额外参数
  submitApi?: SubmitApiType // 提交表单的接口
  onConfirm?: () => void
  onCancel: () => void
}

interface StateType {
  formList: FormListType[]
  saveLoading: boolean
}

const ResetPasswordView = (props: PropType) => {
  const formRef = useRef<FormCallType>()
  const [state, setState] = useSetState<StateType>({
    formList: [], // 表单数据
    saveLoading: false, // 保存loading
  })

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-05 16:29:26
   */
  const handleModalSave = async () => {
    if (formRef.current) {
      let formParams = await formRef.current.formSubmit()
      if (formParams) {
        // 合并父组件传过来的额外参数
        formParams = {
          ...formParams,
          ...props.submitExtraParameters,
        }
        if (props.submitApi) {
          setState({
            saveLoading: true,
          })
          try {
            await props.submitApi(formParams, 'put')
            message.success(`${props.title}成功`, 1.5)
            if (props.onConfirm) {
              props.onConfirm()
            }
          } catch (error) {
            message.warn(`${props.title}失败`, 1.5)
          }
          setState({
            saveLoading: false,
          })
        }
      }
    }
  }

  /**
   * @Description 设置表单数据
   * @Author bihongbin
   * @Date 2020-08-05 16:21:31
   */
  useEffect(() => {
    setState({
      formList: [
        {
          componentName: 'Input',
          name: 'password',
          label: '密码',
          inputConfig: {
            inputMode: 'password',
          },
          placeholder: '请输入密码',
          rules: [
            {
              required: true,
              message: '请输入密码',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'password_confirm',
          label: '确认密码',
          inputConfig: {
            inputMode: 'password',
          },
          dependencies: ['password'],
          placeholder: '请输入确认密码',
          rules: [
            {
              required: true,
              message: '请输入确认密码',
            },
            ({ getFieldValue }: any) => ({
              validator(rule: any, value: any) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('两次输入的密码不一致')
              },
            }),
          ],
        },
      ],
    })
  }, [setState])

  return (
    <Modal
      width={props.width || 420}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Row justify="center">
        <Col span={23}>
          <GenerateForm
            ref={formRef}
            className="form-ash-theme form-large-font14"
            formConfig={{
              size: 'large',
              labelCol: { span: 24 },
            }}
            rowGridConfig={{ gutter: [40, 0] }}
            colGirdConfig={{ span: 24 }}
            list={state.formList}
          />
        </Col>
      </Row>
      <Row className="mt-10 mb-5" justify="center">
        <Col>
          <Button
            className="font-14"
            size="large"
            onClick={() => props.onCancel()}
          >
            返回
          </Button>
          <Button
            className="font-14 ml-5"
            size="large"
            type="primary"
            loading={state.saveLoading}
            onClick={handleModalSave}
          >
            确定
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default React.memo(ResetPasswordView)
