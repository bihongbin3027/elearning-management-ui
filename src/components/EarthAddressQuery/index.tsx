/*
 * @Description 地区查询组件-只有选择地区一个表单才使用这个，其他情况下，建议使用GenerateForm组件里面的RegionSelection类型
 * @Author bihongbin
 * @Date 2020-12-08 15:44:16
 * @LastEditors bihongbin
 * @LastEditTime 2021-02-04 17:48:36
 */

import React, {
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react'
import { v4 as uuidV4 } from 'uuid'
import _ from 'lodash'
import { Cascader, Form, Row, Col, message } from 'antd'
import {
  CascaderProps,
  CascaderOption,
  CascaderValueType,
} from 'rc-cascader/es/Cascader'
import { getRegionDetailList } from '@/api/layout'
import useSetState from '@/hooks/useSetState'
import { AnyObjectType } from '@/typings'
import { getRegionList } from '@/api/layout'
import { getBaseRegionCountry } from '@/api/basicServices'

export interface AddressCallType {
  formSetValues: (values: AnyObjectType) => void
  formSubmit: () => Promise<AnyObjectType>
}

interface PropType extends CascaderProps {
  isDomestic?: boolean // true 全球 false 国内
  addressTitle?: string // 省市区label
}

interface stateType {
  addressValue: CascaderValueType
  addressData: CascaderOption[]
}

const EarthAddressQuery = (props: PropType, ref: any) => {
  const [form] = Form.useForm()
  const [state, setState] = useSetState<stateType>({
    addressValue: [],
    addressData: [],
  })

  const addressTitleProps = props.addressTitle || '地址'

  /**
   * @Description 缓存生成的随机id
   * @Author bihongbin
   * @Date 2020-08-29 15:36:38
   */
  const uid = useMemo(() => uuidV4(), [])

  /**
   * @Description 查询地址接口
   * @Author bihongbin
   * @Date 2020-12-08 16:13:27
   */
  const getApi = async (params: AnyObjectType) => {
    params.size = 200 // 默认查询200条
    params.status = 1
    return await getRegionList(params)
  }

  /**
   * @Description 格式化数据
   * @Author bihongbin
   * @Date 2020-12-08 16:34:10
   */
  const formatList = useCallback(
    (data: AnyObjectType[], bool: boolean = false) => {
      return data.map((item) => ({
        label: item.cName,
        value: item.regionCode,
        id: item.id,
        isLeaf: bool,
      }))
    },
    [],
  )

  /**
   * @Description 查询数据
   * @Author bihongbin
   * @Date 2020-12-08 16:07:21
   */
  const loadData = async (selectedOptions: CascaderOption[] | undefined) => {
    if (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      const result = await getApi({
        parentId: targetOption.id,
      })
      targetOption.loading = false
      if (_.isArray(result.data.content)) {
        if (result.data.content.length) {
          targetOption.children = formatList(
            result.data.content,
            selectedOptions.length < 3 ? false : true, // 默认只查到区
          )
        } else {
          targetOption.isLeaf = true
        }
      }
      setState({
        addressData: [...state.addressData],
      })
    }
  }

  /**
   * @Description 设置默认地区数据（国内还是全球）
   * @Author bihongbin
   * @Date 2020-12-08 16:07:55
   */
  useEffect(() => {
    if (props.isDomestic) {
      getBaseRegionCountry().then((res) => {
        let content = res.data.content
        if (_.isArray(content)) {
          // 过滤掉国内
          // content = content.filter((item) => item.regionCode !== '1')
          setState({
            addressData: formatList(content),
          })
        }
      })
    } else {
      // 国内数据
      let params = {
        subsetLevel: 1,
        parentId: 1,
        status: 1,
      }
      getApi(params).then((res) => {
        let content = res.data.content
        if (_.isArray(content)) {
          setState({
            addressData: formatList(content),
          })
        }
      })
    }
  }, [formatList, props.isDomestic, setState])

  /**
   * @Description 暴漏给父组件调用
   * @Author bihongbin
   * @Date 2020-12-09 11:11:46
   */
  useImperativeHandle<any, AddressCallType>(ref, () => ({
    // 设置表单值
    formSetValues: async (values) => {
      if (values.addressValue.length) {
        let valStr = values.addressValue.join(',')
        let regionList = await getRegionDetailList(valStr ? valStr : '0')
        setState({
          addressData: regionList.data,
        })
      }
      form.setFieldsValue(values)
    },
    // 提交表单
    formSubmit: () => {
      return new Promise((resolve, reject) => {
        form
          .validateFields()
          .then((values) => {
            // 国家
            if (values.addressValue[0]) {
              values.country = values.addressValue[0]
            }
            // 省
            if (values.addressValue[1]) {
              values.province = values.addressValue[1]
            }
            // 市
            if (values.addressValue[2]) {
              values.city = values.addressValue[2]
            }
            // 区
            if (values.addressValue[3]) {
              values.area = values.addressValue[3]
            }
            resolve(values)
          })
          .catch((err) => {
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
    <Form
      className="form-ash-theme"
      name={uid}
      form={form}
      labelCol={{ span: 24 }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label={addressTitleProps}
            name="addressValue"
            rules={[{ required: true, message: `请选择${addressTitleProps}` }]}
          >
            <Cascader
              options={state.addressData}
              loadData={loadData}
              changeOnSelect
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default React.memo(forwardRef(EarthAddressQuery))
