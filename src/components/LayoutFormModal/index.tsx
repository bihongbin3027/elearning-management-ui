/*
 * @Description 弹窗表单组件
 * @Author bihongbin
 * @Date 2020-08-01 15:13:11
 * @LastEditors bihongbin
 * @LastEditTime 2020-09-11 14:28:57
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
import { AnyObjectType, AjaxResultType } from '@/typings'

export interface PropTypes {
  visible: boolean // 打开或关闭
  disable?: boolean // 表单是否禁用
  id?: string | null | undefined
  title: string | null | undefined // 弹窗标题
  width?: number // 弹窗宽度
  topRender?: React.ReactElement // 表单弹窗头部显示的额外dom元素
  submitExtraParameters?: AnyObjectType // 需要提交表单的额外参数
  switchTransform?: string[] // 开关组件值转换成0和1
  submitApi?: (data: any, method: 'put' | 'post') => Promise<AjaxResultType> // 提交表单的接口
  onCancel: () => void // 关闭弹窗回调
  onConfirm?: (data: AnyObjectType) => void // 确定或保存回调
  formList: FormListType[] // 表单数据
  formConfig?: FormProps // 支持antd Form组件官方传参所有类型
  children?: React.ReactNode // 组件子元素插槽
}

// 导出该组件可调用的方法类型
export interface LayoutFormModalCallType {
  setFormLoading: (data: boolean) => void
  setFormFields: (fields: FieldData[]) => void
  setFormValues: (values: AnyObjectType) => void
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

const LayoutFormModal = (props: PropTypes, ref: any) => {
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
      dispatch({
        type: ActionType.SET_SAVE_LOADING,
        payload: true,
      })
      try {
        let result: AnyObjectType = {}
        let msg: string
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
        formParams = _.pickBy(formParams, _.identity)
        if (props.submitApi) {
          if (props.id) {
            formParams.id = props.id
            msg = '修改成功'
            result = await props.submitApi(formParams, 'put')
          } else {
            msg = '新增成功'
            result = await props.submitApi(formParams, 'post')
          }
          if (result.data) {
            // 确定或保存回调
            if (props.onConfirm) {
              props.onConfirm(result)
            }
            message.success(msg, 1.5)
            props.onCancel()
          }
        } else {
          // 确定或保存回调
          if (props.onConfirm) {
            props.onConfirm(formParams)
          }
        }
      } catch (error) {}
      dispatch({
        type: ActionType.SET_SAVE_LOADING,
        payload: false,
      })
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
    // 设置一组字段状态
    setFormFields: (fields) => {
      if (formRef.current) {
        formRef.current.formSetFields(fields)
      }
    },
    // 设置表单值
    setFormValues: (data) => {
      if (formRef.current) {
        formRef.current.formSetValues(data)
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
              className="form-ash-theme form-large-font14"
              formConfig={{
                size: 'large',
                labelCol: { span: 24 },
                ...props.formConfig,
              }}
              rowGridConfig={{ gutter: [40, 0] }}
              colGirdConfig={{ span: 12 }}
              list={props.formList}
            />
            {props.children && props.children}
          </div>
          <Row className="mt-10 mb-5" justify="center">
            <Col>
              <Button
                className="font-14"
                size="large"
                onClick={() => props.onCancel()}
              >
                取消
              </Button>
              {!state.disabled && (
                <Button
                  className="font-14 ml-5"
                  size="large"
                  type="primary"
                  loading={state.saveLoading}
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

export default forwardRef(LayoutFormModal)
