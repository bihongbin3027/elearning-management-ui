/*
 * @Description 弹窗表单组件
 * @Author bihongbin
 * @Date 2020-08-01 15:13:11
 * @LastEditors bihongbin
 * @LastEditTime 2021-02-25 14:45:20
 */

import React, {
  useRef,
  useReducer,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Modal, Spin, Row, Col, Button, message } from 'antd'
import moment from 'moment'
import _ from 'lodash'
import { FieldData } from 'rc-field-form/es/interface'
import { FormProps } from 'antd/es/form'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import { AnyObjectType, SubmitApiType } from '@/typings'

export interface LayoutFormPropTypes {
  visible: boolean // 打开或关闭
  disable?: boolean // 表单是否禁用
  id?: string | null | undefined
  title: string | React.ReactNode | null | undefined // 弹窗标题
  width?: number // 弹窗宽度
  topRender?: React.ReactElement // 表单弹窗头部显示的额外dom元素
  submitRemoveField?: string[] // 提交表单需要移除的参数
  submitExtraParameters?: AnyObjectType // 需要提交表单的额外参数
  switchTransform?: string[] // 开关组件值转换成0和1
  submitApi?: SubmitApiType // 提交表单的接口
  onCancel?: () => void // 关闭弹窗回调
  onConfirm?: (data: AnyObjectType) => void // 确定或保存回调
  formList: FormListType[] // 表单数据
  formConfig?: FormProps // 支持antd Form组件官方传参所有类型
  children?: React.ReactNode // 组件子元素插槽
  footer?: React.ReactNode // 底部操作按钮自定义
}

// 导出该组件可调用的方法类型
export interface LayoutFormModalCallType {
  setFormLoading: (data: boolean) => void
  setFormSaveLoading: (data: boolean) => void
  setFormFields: (fields: FieldData[]) => void
  getFormValues: (data: string[]) => AnyObjectType | undefined
  setFormValues: (values: AnyObjectType) => void
  getFormSubmitValues: () => Promise<AnyObjectType | undefined>
}

export type LayoutFormModalListType = FormListType

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
  SET_DISABLED = '[SetDisabled Action]',
}

const stateValue = {
  loading: false, // loading
  saveLoading: false, // 保存按钮loading
  disabled: false, // 表单是否可编辑，当不可编辑不能显示保存按钮
}

const LayoutFormModal = (props: LayoutFormPropTypes, ref: any) => {
  const formRef = useRef<FormCallType>() // 表单实例
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置loading状态
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_SAVE_LOADING: // 设置保存按钮loading状态
        return {
          ...state,
          saveLoading: action.payload,
        }
      case ActionType.SET_DISABLED: // 设置表单是否可编辑
        return {
          ...state,
          disabled: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 设置保存loading
   * @Author bihongbin
   * @Date 2020-10-22 11:22:49
   */
  const handleSaveLoadingState = (data: StateType['saveLoading']) => {
    dispatch({
      type: ActionType.SET_SAVE_LOADING,
      payload: data,
    })
  }

  /**
   * @Description 提交表单
   * @Author bihongbin
   * @Date 2020-08-01 15:38:26
   */
  const formSubmit = async () => {
    let formParams = await formRef.current?.formSubmit()
    if (formParams) {
      if (
        formParams.endTime &&
        formParams.startTime &&
        moment(formParams.endTime).isBefore(formParams.startTime)
      ) {
        message.warn('生效日期不能大于失效日期', 1.5)
        return
      }
      handleSaveLoadingState(true)
      try {
        let result: AnyObjectType = {}
        // 合并父组件传过来的额外参数
        formParams = {
          ...formParams,
          ...props.submitExtraParameters,
        }
        // 转换开关组件的值是0或1
        if (props.switchTransform) {
          for (let i = 0; i < props.switchTransform.length; i++) {
            if (formParams[props.switchTransform[i]]) {
              formParams[props.switchTransform[i]] = '1'
            } else {
              formParams[props.switchTransform[i]] = '0'
            }
          }
        }
        // 额外指定参数移除
        if (props.submitRemoveField) {
          for (let i = 0; i < props.submitRemoveField.length; i++) {
            if (formParams[props.submitRemoveField[i]]) {
              delete formParams[props.submitRemoveField[i]]
            }
          }
        }
        formParams = _.omitBy(formParams, _.isNil)
        // 时间格式转换
        for (let o in formParams) {
          const formatStr = 'YYYY-MM-DD HH:mm:ss'
          if (moment(formParams[o], formatStr, true).isValid()) {
            formParams[o] = moment(formParams[o]).format(formatStr)
          }
        }
        if (props.submitApi) {
          if (props.id) {
            formParams.id = props.id
            result = await props.submitApi(formParams, 'put')
          } else {
            result = await props.submitApi(formParams, 'post')
          }
          if (result.code === 1) {
            // 确定或保存回调
            if (props.onConfirm) {
              props.onConfirm(result)
            }
            message.success('操作成功', 1.5)
            props.onCancel && props.onCancel()
          }
          handleSaveLoadingState(false)
        } else {
          // 确定或保存回调
          if (props.onConfirm) {
            props.onConfirm(formParams)
          }
        }
      } catch (error) {
        handleSaveLoadingState(false)
      }
    }
  }

  /**
   * @Description 表单是否是禁用状态
   * @Author bihongbin
   * @Date 2020-08-05 11:37:06
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_DISABLED,
      payload: props.disable,
    })
  }, [props.disable])

  /**
   * @Description 暴漏给父组件调用
   * @Author bihongbin
   * @Date 2020-08-01 15:59:36
   */
  useImperativeHandle<any, LayoutFormModalCallType>(ref, () => ({
    // 设置loading
    setFormLoading: (data) => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: data,
      })
    },
    // 设置保存loading
    setFormSaveLoading: (data) => {
      handleSaveLoadingState(data)
    },
    // 设置一组字段状态
    setFormFields: (fields) => {
      if (formRef.current) {
        formRef.current.formSetFields(fields)
      }
    },
    // 读取表单值
    getFormValues: (data) => {
      return formRef.current?.formGetValues(data)
    },
    // 设置表单值
    setFormValues: (data) => {
      if (formRef.current) {
        formRef.current.formSetValues(data)
      }
    },
    // 获取表单提交的值
    getFormSubmitValues: async () => {
      if (formRef.current) {
        return await formRef.current?.formSubmit()
      }
    },
  }))

  return (
    <>
      <Modal
        width={props.width ? props.width : 600}
        visible={props.visible}
        title={props.title}
        onCancel={props.onCancel}
        destroyOnClose
        maskClosable={false}
        footer={null}
      >
        <Spin spinning={state.loading}>
          <div className="modal-form-height">
            {props.topRender ? props.topRender : null}
            <GenerateForm
              ref={formRef}
              className="form-ash-theme"
              formConfig={{
                labelCol: { span: 24 },
                ...props.formConfig,
              }}
              rowGridConfig={{ gutter: [20, 0] }}
              colGirdConfig={{ span: 12 }}
              list={props.formList}
            />
            {props.children && props.children}
          </div>
          {props.footer ? (
            props.footer
          ) : (
            <Row className="mt-5 mb-2" justify="center">
              <Col>
                <Button onClick={() => props.onCancel && props.onCancel()}>
                  关闭
                </Button>
                {!state.disabled && (
                  <Button
                    className="ml-5"
                    type="primary"
                    loading={state.saveLoading}
                    onClick={formSubmit}
                  >
                    提交
                  </Button>
                )}
              </Col>
            </Row>
          )}
        </Spin>
      </Modal>
    </>
  )
}

export default React.memo(forwardRef(LayoutFormModal))
