/*
 * @Description 动态表单组件
 * @Author bihongbin
 * @Date 2020-06-23 10:46:52
 * @LastEditors bihongbin
 * @LastEditTime 2020-09-19 15:55:00
 */

import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
} from 'react'
import {
  Row,
  Col,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Spin,
  Radio,
  Checkbox,
} from 'antd'
import { RowProps } from 'antd/es/row'
import { ColProps } from 'antd/es/col'
import { FormProps, Rule } from 'antd/es/form'
import { FieldData } from 'rc-field-form/es/interface'
import { v4 as uuidV4 } from 'uuid'
import _ from 'lodash'
import { AnyObjectType, SelectType } from '@/typings'

// 下拉菜单类型
interface SelectDataType {
  label: string
  value: string | number
}
type remoteValueType = string | undefined
type remotePromiseType = (value: remoteValueType) => Promise<SelectType[]>

interface UnionType {
  componentName: 'Input' | 'Select'
  name: string // 字段名
  placeholder?: string
  selectData?: SelectDataType[]
}

// 表单参数配置
export interface FormListType {
  colProps?: ColProps // 用来控制单个表单元素宽度
  visible?: boolean // 用来控制显示隐藏
  // 组件显示类型
  componentName:
    | 'Input'
    | 'HideInput'
    | 'TextArea'
    | 'AutoComplete'
    | 'Select'
    | 'RemoteSearch'
    | 'DatePicker'
    | 'RangePicker'
    | 'Switch'
    | 'Radio'
    | 'Checkbox'
    | 'Union'
  name?: string // 字段名
  label?: string | React.ReactNode // 标题
  dependencies?: (string | number)[] // 依赖字段
  placeholder?: string
  rangePickerPlaceholder?: [string, string] // 开始时间和结束时间提示文字
  disabled?: boolean // 是否禁用
  valuePropName?: string // 子节点的值的属性，如 Switch 的是 'checked'
  inputConfig?: {
    prefix?: string | React.ReactNode // 带有前缀图标的 input
    suffix?: string | React.ReactNode // 带有后缀图标的 input
    // 对应Input组件的输入类型
    inputMode?:
      | 'text'
      | 'password'
      | 'email'
      | 'url'
      | 'number'
      | 'range'
      | 'Date pickers'
      | 'search'
      | 'color'
  }
  unionConfig?: {
    // 要显示n个表单的类型
    unionItems: UnionType[]
    divide?: string // 分隔符
  }
  remoteConfig?: {
    remoteApi: remotePromiseType // 远程搜索的api
    remoteMode?: 'multiple' | 'tags' // 远程搜索模式为多选或标签
  }
  rows?: number // TextArea高度
  rules?: Rule[] // 表单验证
  selectData?: SelectDataType[] // 下拉菜单数据
  render?: () => React.ReactElement // 动态渲染插入额外元素
}

// 导出该组件可调用的方法类型
export interface FormCallType {
  formGetValues: (data: string[]) => AnyObjectType
  formSetFields: (fields: FieldData[]) => void
  formSetValues: (values: AnyObjectType) => void
  formSubmit: () => Promise<AnyObjectType>
  formReset: () => void
}

// 组件传参配置
interface GenerateFormProp {
  className?: string
  list?: FormListType[] // 要渲染的表单元素
  formConfig?: FormProps // 支持antd Form组件官方传参所有类型
  rowGridConfig?: RowProps // 支持antd Row组件官方传参所有类型
  colGirdConfig?: ColProps // 支持antd Col组件官方传参所有类型
  render?: () => React.ReactElement // 动态渲染操作按钮或其他元素
}

const { Option } = Select
const { RangePicker } = DatePicker

const GenerateForm = (props: GenerateFormProp, ref: any) => {
  const [form] = Form.useForm()
  const {
    className,
    formConfig,
    rowGridConfig,
    colGirdConfig,
    list,
    render,
  } = props
  const [remoteFetching, setRemoteFetching] = useState(false) // 远程搜索loading
  const [remoteData, setRemoteData] = useState<SelectType[]>([]) // 远程搜索数据结果

  /**
   * @Description 缓存生成的随机id
   * @Author bihongbin
   * @Date 2020-08-29 15:36:38
   */
  const uid = useMemo(() => uuidV4(), [])

  /**
   * @Description 远程数据搜索
   * @Author bihongbin
   * @Date 2020-07-25 10:01:02
   */
  const fetchRemote = (
    value: remoteValueType,
    remoteApi?: remotePromiseType,
  ) => {
    if (remoteApi) {
      setRemoteFetching(true)
      remoteApi(value).then((res) => {
        setRemoteFetching(false)
        setRemoteData(res)
      })
    }
  }

  /**
   * @Description 渲染组件
   * @Author bihongbin
   * @Date 2020-07-06 10:12:51
   */
  const formRender = () => {
    if (!list) {
      return
    }
    // 渲染Union类型表单
    const unionRender = (item: FormListType, m: UnionType) => {
      if (m.componentName === 'Input') {
        return <Input disabled={item.disabled} placeholder={m.placeholder} />
      }
      if (m.componentName === 'Select') {
        return (
          <Select disabled={item.disabled} placeholder={m.placeholder}>
            {m.selectData
              ? m.selectData.map((s: SelectDataType, k: number) => (
                  <Option value={s.value} key={k}>
                    {s.label}
                  </Option>
                ))
              : null}
          </Select>
        )
      }
    }
    return list.map((item: FormListType, index: number) => {
      let childForm = null
      switch (item.componentName) {
        case 'Input':
          childForm = (
            <Input
              disabled={item.disabled}
              type={
                item.inputConfig?.inputMode
                  ? item.inputConfig?.inputMode
                  : 'text'
              }
              prefix={
                item.inputConfig?.prefix ? item.inputConfig?.prefix : null
              }
              suffix={
                item.inputConfig?.suffix ? item.inputConfig?.suffix : null
              }
              placeholder={item.placeholder}
            />
          )
          break
        case 'HideInput':
          childForm = (
            <Input
              style={{ display: 'none' }}
              disabled={item.disabled}
              type="text"
              placeholder={item.placeholder}
            />
          )
          break
        case 'TextArea':
          childForm = (
            <Input.TextArea
              rows={item.rows}
              disabled={item.disabled}
              placeholder={item.placeholder}
            />
          )
          break
        case 'AutoComplete':
          childForm = (
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option
                  ? option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  : false
              }
            >
              {item.selectData
                ? item.selectData.map((s, k) => (
                    <Option value={s.value} key={k}>
                      {s.label}
                    </Option>
                  ))
                : null}
            </Select>
          )
          break
        case 'Select':
          childForm = (
            <Select disabled={item.disabled} placeholder={item.placeholder}>
              {item.selectData
                ? item.selectData.map((s, k) => (
                    <Option value={s.value} key={k}>
                      {s.label}
                    </Option>
                  ))
                : null}
            </Select>
          )
          break
        case 'RemoteSearch':
          childForm = (
            <Select
              mode={item.remoteConfig?.remoteMode}
              disabled={item.disabled}
              placeholder={item.placeholder}
              notFoundContent={remoteFetching ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              // 当获取焦点查询全部
              onFocus={() =>
                fetchRemote(undefined, item.remoteConfig?.remoteApi)
              }
              onSearch={(value) =>
                fetchRemote(value, item.remoteConfig?.remoteApi)
              }
            >
              {remoteData.map((s: SelectType, k) => (
                <Option value={s.value} key={k}>
                  {s.label}
                </Option>
              ))}
            </Select>
          )
          break
        case 'DatePicker':
          childForm = (
            <DatePicker
              disabled={item.disabled}
              placeholder={item.placeholder}
            />
          )
          break
        case 'RangePicker':
          childForm = (
            <RangePicker
              disabled={item.disabled}
              placeholder={item.rangePickerPlaceholder}
            />
          )
          break
        case 'Switch':
          childForm = (
            <Switch
              defaultChecked={false}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={item.disabled}
            />
          )
          break
        case 'Radio':
          childForm = (
            <Radio.Group>
              {item.selectData
                ? item.selectData.map((s: SelectType, k) => (
                    <Radio disabled={item.disabled} value={s.value} key={k}>
                      {s.label}
                    </Radio>
                  ))
                : null}
            </Radio.Group>
          )
          break
        case 'Checkbox':
          childForm = (
            <Checkbox.Group>
              {item.selectData
                ? item.selectData.map((s: SelectType, k) => (
                    <Checkbox disabled={item.disabled} value={s.value} key={k}>
                      {s.label}
                    </Checkbox>
                  ))
                : null}
            </Checkbox.Group>
          )
          break
        case 'Union':
          let width: string
          let len = 0
          if (item.unionConfig) {
            len = item.unionConfig.unionItems.length
            width = `${100 / len}%`
          }
          childForm = (
            <Row className="form-item-divide" gutter={20}>
              {item.unionConfig?.unionItems.map((m, k) => (
                <Col
                  style={{
                    width: width,
                  }}
                  key={k}
                >
                  <Form.Item name={m.name} noStyle>
                    {unionRender(item, m)}
                  </Form.Item>
                  {k < len - 1 ? (
                    <span className="divide">
                      {item.unionConfig &&
                        (item.unionConfig.divide
                          ? item.unionConfig.divide
                          : '~')}
                    </span>
                  ) : null}
                </Col>
              ))}
            </Row>
          )
          break
        default:
          return null
      }
      let resetItem: Partial<FormListType> = {
        ...item,
      }
      // 移除Form.Item不需要的属性
      resetItem = _.omit(resetItem, [
        'colProps',
        'componentName',
        'selectData',
        'inputConfig',
        'unionConfig',
        'remoteConfig',
        'rows',
        'render',
        'rangePickerPlaceholder',
        'visible',
      ])
      // Form.Item内有多个表单（Union类型），如果有设置name移除name
      if (item.componentName === 'Union') {
        resetItem = _.omit(resetItem, ['name'])
      }
      return !item.visible ? (
        <Col {...colGirdConfig} {...item.colProps} key={index}>
          <Form.Item
            className={
              item.componentName === 'HideInput' ? 'hide-item' : undefined
            }
            {...resetItem}
          >
            {childForm}
          </Form.Item>
          {item.render && item.render()}
        </Col>
      ) : null
    })
  }

  // 暴漏给父组件调用
  useImperativeHandle<any, FormCallType>(ref, () => ({
    // 获取对应的字段值
    formGetValues: (data) => {
      return form.getFieldsValue(data)
    },
    // 设置一组字段状态
    formSetFields: (fields) => {
      form.setFields(fields)
    },
    // 设置表单值
    formSetValues: (values) => {
      form.setFieldsValue(values)
    },
    // 提交表单
    formSubmit: () => {
      return new Promise((resolve, reject) => {
        form
          .validateFields()
          .then((values) => {
            resolve(values)
          })
          .catch((err) => {
            console.log('err', err)
            message.warn('请输入或选择表单必填项', 1.5)
            reject(false)
          })
      })
    },
    // 重置表单
    formReset: () => {
      form.resetFields()
      return form.getFieldsValue()
    },
  }))

  return (
    <>
      <Form name={uid} className={className} form={form} {...formConfig}>
        <Row {...rowGridConfig}>
          {formRender()}
          {render ? (
            <Col>
              <Form.Item>{render && render()}</Form.Item>
            </Col>
          ) : null}
        </Row>
      </Form>
    </>
  )
}

export default React.memo(forwardRef(GenerateForm))
