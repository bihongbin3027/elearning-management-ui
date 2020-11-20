import React, { useEffect, useRef, useCallback } from 'react'
import {
  Modal,
  Row,
  Button,
  Col,
  Divider,
  Radio,
  Checkbox,
  Spin,
  message,
} from 'antd'
import useSetState from '@/hooks/useSetState'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import Empty from '@/components/Empty'
import { getDataTransformSelect } from '@/utils'
import { roleClassData } from '@/config/selectData'
import { setUserRole } from '@/api/systemManage/user'
import { getRoleList } from '@/api/systemManage/roles'

interface PropType {
  visible: boolean
  width?: number
  title: string
  id: string
  onCancel: () => void
}

interface RoleCheckType {
  id: string | number
  roleCname: string
}

interface StateType {
  loading: boolean
  formList: FormListType[]
  roleCheckList: RoleCheckType[]
  roleCheckValue: string
  roleCheckGroupValue: any[]
  saveLoading: boolean
}

const AssigningRolesView = (props: PropType) => {
  const formRef = useRef<FormCallType>()
  const [state, setState] = useSetState<StateType>({
    loading: false, // 弹窗全局显示loading
    formList: [], // 表单数据
    roleCheckList: [], // 角色数据
    roleCheckValue: 'ROLE', // 角色分类
    roleCheckGroupValue: [], // 选中的角色
    saveLoading: false, // 保存loading
  })

  /**
   * @Description 角色列表
   * @Author bihongbin
   * @Date 2020-10-13 14:49:39
   */
  const getRoleData = useCallback(async () => {
    if (formRef.current) {
      const company = formRef.current.formGetValues(['companyCode'])
      setState({
        loading: true,
      })
      try {
        const result = await getRoleList({
          cId: company.id,
          roleCategory: state.roleCheckValue,
        })
        setState({
          roleCheckList: result.data.content,
        })
      } catch (error) {}
      setState({
        loading: false,
      })
    }
  }, [setState, state.roleCheckValue])

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-05 16:29:26
   */
  const handleModalSave = async () => {
    if (state.roleCheckGroupValue.length) {
      setState({
        saveLoading: true,
      })
      try {
        await setUserRole({
          id: props.id,
          ids: state.roleCheckGroupValue,
        })
        setState({
          saveLoading: false,
        })
        message.success('分配成功', 1.5)
        props.onCancel()
      } catch (error) {}
      setState({
        saveLoading: false,
      })
    } else {
      message.warn('请选择角色', 1.5)
    }
  }

  /**
   * @Description 初始化数据
   * @Author bihongbin
   * @Date 2020-08-05 16:21:31
   */
  useEffect(() => {
    const getInit = async () => {
      setState({
        loading: true,
      })
      if (props.id) {
        try {
          const companyData = await getDataTransformSelect(
            '/rbac/user/company',
            ['companyName', 'companyCode'],
          )
          setState({
            formList: [
              {
                componentName: 'Select',
                name: 'companyCode',
                label: '公司',
                placeholder: '请选择公司',
                selectData: companyData,
                rules: [{ required: true, message: '请选择公司' }],
              },
            ],
          })
          if (formRef.current && companyData.length) {
            formRef.current.formSetValues({
              companyCode: companyData[0].value,
            })
            getRoleData()
          }
        } catch (error) {}
      }
      setState({
        loading: false,
      })
    }
    if (props.visible) {
      getInit()
    }
  }, [getRoleData, props.id, props.visible, setState])

  return (
    <Modal
      width={props.width}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Spin spinning={state.loading}>
        <Row justify="center">
          <Col span={23}>
            <GenerateForm
              ref={formRef}
              className="form-ash-theme form-large-font14"
              formConfig={{
                size: 'large',
                labelCol: { span: 24 },
                onValuesChange: (changedFields) => {
                  const filed = changedFields['companyCode']
                  if (filed) {
                    getRoleData()
                  }
                },
              }}
              rowGridConfig={{ gutter: [40, 0] }}
              colGirdConfig={{ span: 24 }}
              list={state.formList}
            />
            <Divider className="mt-2 mb-5" />
            <Row justify="space-between">
              <Col>
                <Radio.Group
                  className="sxy-radio-group"
                  value={state.roleCheckValue}
                  buttonStyle="solid"
                  onChange={(e) => {
                    setState({
                      roleCheckValue: e.target.value,
                    })
                  }}
                >
                  {roleClassData.map((item) => (
                    <Radio.Button value={item.value} key={item.value}>
                      {item.label}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Col>
              <Col>
                <Button
                  type="link"
                  onClick={() => {
                    setState({
                      roleCheckGroupValue: [],
                    })
                  }}
                >
                  清空
                </Button>
              </Col>
            </Row>
            <Checkbox.Group
              className="mt-5"
              value={state.roleCheckGroupValue}
              onChange={(value) => {
                setState({
                  roleCheckGroupValue: value,
                })
              }}
              style={{ width: '100%' }}
            >
              <Row gutter={[20, 10]}>
                {state.roleCheckList.length ? (
                  state.roleCheckList.map((item, index) => (
                    <Col span={12} key={index}>
                      <Checkbox className="sxy-checkbox-button" value={item.id}>
                        {item.roleCname}
                      </Checkbox>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <Empty outerHeight={200} />
                  </Col>
                )}
              </Row>
            </Checkbox.Group>
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
      </Spin>
    </Modal>
  )
}

export default AssigningRolesView
