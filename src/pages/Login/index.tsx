import React, { useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Select,
  // Checkbox,
  Button,
  Divider,
  message,
} from 'antd'
import useSetState from '@/hooks/useSetState'
import { SxyIcon } from '@/style/module/icon'
import { SxyButton } from '@/style/module/button'
import { RootStateType } from '@/store/rootReducer'
import { GlobalConstant } from '@/config'
import auth from '@/store/module/auth'
import {
  passWordLogin,
  smsRegister,
  resetPassword,
  getPhoneCode,
  smsLogin,
  msgCodeValidate,
} from '@/api/layout'
import { LoginView, LoginCard, LoginMain, LoginTab } from '@/pages/Login/style'

const { Text } = Typography
const { Option } = Select

export interface LoginFormRelevantType {
  areaCode: string
  mobilePhone: string
  userName: string
  msgCode: string
  password: string
  confirmPassword: string
}

export type MsgCodeType = 'SMS_LOGIN' | 'SMS_REGISTER' | 'SMS_RESET_PASSWD'

interface StateType {
  submitLoading: boolean
  interfaceStatus: number
  mainCard: {
    method: number
    list: { name: string }[]
    passwordMode: boolean
    autoCheckbox: boolean
    readAgreement: boolean
  }
  retrieveCard: {
    method: number
    psBlock: boolean
    psAgainBlock: boolean
  }
  verificationText: {
    count: number
    liked: boolean
  }
}

const stateValue = {
  submitLoading: false, // 提交按钮loading
  interfaceStatus: 0, // 界面显示类型（0密码和验证码登录，1扫码登录，2找回密码，3注册）
  // 密码和验证码登录页面状态
  mainCard: {
    method: 0, // 0密码登录，1验证码登录,
    // tab
    list: [{ name: '密码登录' }, { name: '验证码登录' }],
    passwordMode: false, // 密码是否是明文
    autoCheckbox: false, // 自动登录复选框
    readAgreement: false, // 是否阅读用户使用协议
  },
  // 找回密码页面状态
  retrieveCard: {
    method: 0, // 0验证，1重设密码或注册
    psBlock: false, // 密码
    psAgainBlock: false, // 再次确认密码
  },
  // 验证码倒计时
  verificationText: {
    count: 120,
    liked: true,
  },
}

const Login = () => {
  const dispatchRedux = useDispatch()
  const { loginLoading } = useSelector((state: RootStateType) => state.auth)
  const [form] = Form.useForm()
  const verificationRef = useRef<number>() // 验证码时间戳
  // 存储注册和找回密码的手机相关信息
  const phoneAndCode = useRef({
    areaCode: '',
    mobilePhone: '',
    msgCode: '',
  })
  const [state, setState] = useSetState<StateType>({
    submitLoading: false, // 提交按钮loading
    interfaceStatus: 0, // 界面显示类型（0密码和验证码登录，1扫码登录，2找回密码，3注册）
    // 密码和验证码登录页面状态
    mainCard: {
      method: 0, // 0密码登录，1验证码登录,
      // tab
      list: [{ name: '密码登录' }, { name: '验证码登录' }],
      passwordMode: false, // 密码是否是明文
      autoCheckbox: false, // 自动登录复选框
      readAgreement: false, // 是否阅读用户使用协议
    },
    // 找回密码页面状态
    retrieveCard: {
      method: 0, // 0验证，1重设密码或注册
      psBlock: false, // 密码
      psAgainBlock: false, // 再次确认密码
    },
    // 验证码倒计时
    verificationText: {
      count: 120,
      liked: true,
    },
  })

  /**
   * @Description 重置登录状态初始值
   * @Author bihongbin
   * @Date 2020-08-27 15:50:36
   */
  const resetLoginInitState = (type: number[]) => {
    for (let item of type) {
      // 重置密码和验证码登录状态值
      if (item === 0) {
        setState((prev) => {
          prev.mainCard.method = 0
          prev.mainCard.passwordMode = false
          prev.mainCard.autoCheckbox = false
          prev.mainCard.readAgreement = false
          return prev
        })
        form.setFieldsValue({
          mobilePhone: '',
          userName: '',
          msgCode: '',
          password: '',
          confirmPassword: '',
        })
      }
      // 重置找回密码和注册状态值
      if (item === 1) {
        setState((prev) => {
          prev.retrieveCard.method = 0
          prev.retrieveCard.psBlock = false
          prev.retrieveCard.psAgainBlock = false
          return prev
        })
      }
    }
    // 重置验证码倒计时
    resetVerificationCode()
    clearInterval(verificationRef.current)
  }

  /**
   * @Description 获取验证码
   * @Author bihongbin
   * @Date 2020-08-27 17:01:36
   */
  const getVerificationCode = async () => {
    let mobilePhone = form.getFieldValue('mobilePhone')
    if (!mobilePhone) {
      message.warn('请输入您的手机号', 1.5)
      return
    }
    if (!GlobalConstant.regular.iPhone.test(mobilePhone)) {
      message.warn('请输入正确格式的手机号码', 1.5)
      return
    }
    if (state.verificationText.liked) {
      const params: {
        mobilePhone: LoginFormRelevantType['mobilePhone']
        type: MsgCodeType
      } = {
        mobilePhone,
        type: 'SMS_LOGIN',
      }
      // 验证码登录
      if (state.interfaceStatus === 0 && state.mainCard.method === 1) {
        params.type = 'SMS_LOGIN'
      }
      // 找回密码
      if (state.interfaceStatus === 2) {
        params.type = 'SMS_RESET_PASSWD'
      }
      // 注册
      if (state.interfaceStatus === 3) {
        params.type = 'SMS_REGISTER'
      }
      message.loading('请稍后..')
      try {
        const result = await getPhoneCode(params)
        message.destroy()
        message.success(result.msg, 1.5)
        setState((prev) => {
          prev.verificationText.liked = false
          return prev
        })
        setTimeout(() => {
          setState((prev) => {
            prev.verificationText.count = state.verificationText.count - 1
            return prev
          })
        }, 1000)
      } catch (error) {
        setState((prev) => {
          prev.verificationText.liked = true
          return prev
        })
      }
    }
  }

  /**
   * @Description 重置验证码倒计时
   * @Author bihongbin
   * @Date 2020-11-10 14:36:15
   */
  const resetVerificationCode = useCallback(() => {
    setState({
      verificationText: {
        count: 120,
        liked: true,
      },
    })
  }, [setState])

  /**
   * @Description 账号和密码登录、验证码登录
   * @Author bihongbin
   * @Date 2020-08-27 14:32:32
   */
  const loginSubmit = async (values: LoginFormRelevantType) => {
    try {
      let result = { data: '' }
      dispatchRedux(auth.actions.setLoginLoading(true))
      // 账号和密码和验证码登录
      if (state.interfaceStatus === 0) {
        // 账号和密码登录
        if (state.mainCard.method === 0) {
          result = await passWordLogin({
            userName: values.userName,
            password: values.password,
          })
        }
        // 手机号和验证码登录
        if (state.mainCard.method === 1) {
          result = await smsLogin({
            mobilePhone: values.mobilePhone,
            msgCode: values.msgCode,
          })
        }
        dispatchRedux(auth.actions.login(result.data))
      }
    } catch (error) {
      dispatchRedux(auth.actions.setLoginLoading(false))
    }
  }

  /**
   * @Description 找回密码、注册下一步
   * @Author bihongbin
   * @Date 2020-08-27 10:41:03
   */
  const findNextStepFinish = async (
    values: Pick<LoginFormRelevantType, 'areaCode' | 'mobilePhone' | 'msgCode'>,
  ) => {
    setState({
      submitLoading: true,
    })
    try {
      let params: {
        mobilePhone: LoginFormRelevantType['mobilePhone']
        msgCode: LoginFormRelevantType['msgCode']
        type: MsgCodeType
      } = {
        type: 'SMS_LOGIN',
        mobilePhone: values.mobilePhone,
        msgCode: values.msgCode,
      }
      // 找回密码
      if (state.interfaceStatus === 2) {
        params.type = 'SMS_RESET_PASSWD'
      }
      // 注册
      if (state.interfaceStatus === 3) {
        params.type = 'SMS_REGISTER'
      }
      // 验证短信验证码是否正确
      await msgCodeValidate(params)
      setState({
        submitLoading: false,
      })
      phoneAndCode.current = values
      setState((prev) => {
        prev.retrieveCard.method = 1
        return prev
      })
    } catch (error) {
      setState({
        submitLoading: false,
      })
    }
  }

  /**
   * @Description 找回密码-重置密码
   * @Author bihongbin
   * @Date 2020-08-27 10:57:32
   */
  const resetAndRetrieveFinish = async (
    values: Pick<LoginFormRelevantType, 'password' | 'confirmPassword'>,
  ) => {
    setState({
      submitLoading: true,
    })
    try {
      const params = {
        mobilePhone: phoneAndCode.current.mobilePhone,
        msgCode: phoneAndCode.current.msgCode,
        password: values.password,
      }
      // 重置密码
      if (state.interfaceStatus === 2) {
        await resetPassword(params)
        message.success('重置密码成功', 1.5)
      }
      // 注册
      if (state.interfaceStatus === 3) {
        await smsRegister(params)
        message.success('注册成功', 1.5)
      }
      setState({
        submitLoading: false,
      })
      resetLoginInitState([0, 1])
      // 重回账号密码登录界面
      setState({
        interfaceStatus: 0,
      })
    } catch (error) {
      setState({
        submitLoading: false,
      })
    }
  }

  /**
   * @Description 渲染登录方式
   * @Author bihongbin
   * @Date 2020-08-26 16:05:55
   */
  const renderLoginMethod = () => {
    // 手机区号
    const areaCode = (
      <Form.Item className="form-item-border-bottom" name="areaCode">
        <Select bordered={false}>
          <Option value="86">中国 +86</Option>
        </Select>
      </Form.Item>
    )
    // 手机号
    const phoneNumber = (
      <Form.Item
        name="mobilePhone"
        rules={[
          () => ({
            validator(rule, value) {
              if (!value) {
                return Promise.reject('请输入您的手机号')
              }
              if (!GlobalConstant.regular.iPhone.test(value)) {
                return Promise.reject('请输入正确格式的手机号码')
              }
              return Promise.resolve()
            },
          }),
        ]}
      >
        <Input placeholder="请输入您的手机号" maxLength={11} />
      </Form.Item>
    )
    // 账号
    const accountNumber = (
      <Form.Item
        name="userName"
        rules={[
          {
            required: true,
            message: '请输入您的账号',
          },
        ]}
      >
        <Input placeholder="请输入您的账号" maxLength={16} />
      </Form.Item>
    )
    // 验证码
    const verificationCode = (
      <>
        <Form.Item
          name="msgCode"
          rules={[
            {
              required: true,
              message: '请输入您的验证码',
            },
          ]}
        >
          <Input type="text" placeholder="请输入您的验证码" maxLength={6} />
        </Form.Item>
        <div className="password-code">
          <SxyButton
            type="button"
            mode={state.verificationText.liked ? 'primary' : 'dust'}
            border={state.verificationText.liked ? true : false}
            onClick={getVerificationCode}
          >
            {state.verificationText.liked
              ? '获取验证码'
              : `${state.verificationText.count}秒后获取`}
          </SxyButton>
        </div>
      </>
    )
    // 去登录状态页面
    const goAndLand = (
      <Button
        className="is-btn-link font-12"
        type="link"
        onClick={() => {
          resetLoginInitState([0, 1])
          setState({
            interfaceStatus: 0,
          })
        }}
      >
        去登陆
      </Button>
    )
    const register = (
      <Button
        className="is-btn-link font-12"
        type="link"
        onClick={() => {
          resetLoginInitState([0])
          setState({
            interfaceStatus: 3,
          })
        }}
      >
        免费注册
      </Button>
    )
    // 密码和验证码登录
    if (state.interfaceStatus === 0) {
      return (
        <>
          <LoginTab>
            {state.mainCard.list.map((item, index) => (
              <li
                className={state.mainCard.method === index ? 'active' : ''}
                key={index}
                onClick={() =>
                  setState((prev) => {
                    prev.mainCard.method = index
                    return prev
                  })
                }
                role="presentation"
              >
                {item.name}
              </li>
            ))}
          </LoginTab>
          <Form
            className="login-form"
            form={form}
            initialValues={{ areaCode: '86' }}
            onFinish={loginSubmit}
          >
            {state.mainCard.method === 1 ? (
              <Row gutter={20}>
                <Col span={8}>{areaCode}</Col>
                <Col span={16}>{phoneNumber}</Col>
              </Row>
            ) : (
              <Row gutter={20}>
                <Col span={24}>{accountNumber}</Col>
              </Row>
            )}
            <div className="pass-word mt-4">
              {state.mainCard.method === 0 ? (
                <>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: '请输入您的登录密码',
                      },
                    ]}
                  >
                    <Input
                      type={state.mainCard.passwordMode ? 'text' : 'password'}
                      placeholder="请输入您的登录密码"
                      maxLength={16}
                    />
                  </Form.Item>
                  <div className="handle-password">
                    {state.mainCard.passwordMode ? (
                      <SxyIcon
                        width={26}
                        height={24}
                        name="icon_login_display.png"
                        onClick={() =>
                          setState((prev) => {
                            prev.mainCard.passwordMode = false
                            return prev
                          })
                        }
                      />
                    ) : (
                      <SxyIcon
                        width={25}
                        height={24}
                        name="icon_login_hide.png"
                        onClick={() =>
                          setState((prev) => {
                            prev.mainCard.passwordMode = true
                            return prev
                          })
                        }
                      />
                    )}
                  </div>
                </>
              ) : null}
              {state.mainCard.method === 1 ? verificationCode : null}
              <div className="login-process">
                {/* <div>
              <Checkbox
                checked={state.mainCard.autoCheckbox}
                onChange={(e) =>
                  setState((prev) => {
                    prev.mainCard.autoCheckbox = e.target.checked
                    return prev
                  })
                }
              >
                <Text className="font-12" type="secondary">
                  3天内自动登录
                </Text>
              </Checkbox>
            </div> */}
                <Button
                  className="next-btn mt-2"
                  type="primary"
                  size="large"
                  block
                  loading={loginLoading}
                  htmlType="submit"
                >
                  登录
                </Button>
                <Row className="mt-2" justify="space-between">
                  <Col>
                    {/* <Checkbox
                  checked={state.mainCard.readAgreement}
                  onChange={(e) =>
                    handleMainCardState({ readAgreement: e.target.checked })
                  }
                >
                  <Text className="font-12" type="secondary">
                    我已阅读并同意
                    <Button className="font-12 is-btn-link" type="link">
                      《用户使用协议》
                    </Button>
                  </Text>
                </Checkbox> */}
                  </Col>
                  <Col>
                    <Button
                      className="font-12 is-btn-link"
                      type="link"
                      onClick={() => {
                        resetLoginInitState([0])
                        setState({
                          interfaceStatus: 2,
                        })
                      }}
                    >
                      忘记密码
                    </Button>
                    <Divider type="vertical" />
                    {register}
                  </Col>
                </Row>
                <Divider className="pointer mt-7" plain>
                  <SxyIcon
                    width={40}
                    height={40}
                    name="login_wx.png"
                    onClick={() => {
                      setState({
                        interfaceStatus: 1,
                      })
                    }}
                  />
                </Divider>
              </div>
            </div>
          </Form>
        </>
      )
    }
    // 微信登录
    if (state.interfaceStatus === 1) {
      return (
        <div className="scan-code">
          <div
            className="rt-password"
            onClick={() => {
              setState({
                interfaceStatus: 0,
              })
            }}
          >
            <div className="rt-txt">
              密码登录
              <span className="r" />
            </div>
            <SxyIcon
              className="ml-2"
              width={21}
              height={28}
              name="icon_login_password.png"
            />
          </div>
          <LoginTab className="text-center mt-3">
            <li className="active">扫码登录</li>
          </LoginTab>
          <div className="code-img"></div>
          <div className="text-center">{register}</div>
        </div>
      )
    }
    // 找回密码 | 注册
    if (state.interfaceStatus === 2 || state.interfaceStatus === 3) {
      const retrieveTitle = (
        <LoginTab>
          <li className="active">
            {state.interfaceStatus === 2 ? '找回密码' : '注册'}
          </li>
        </LoginTab>
      )
      // 验证
      if (state.retrieveCard.method === 0) {
        return (
          <>
            {retrieveTitle}
            <Form
              className="login-form"
              form={form}
              initialValues={{ areaCode: '86' }}
              onFinish={findNextStepFinish}
            >
              <Row gutter={20}>
                <Col span={8}>{areaCode}</Col>
                <Col span={16}>{phoneNumber}</Col>
              </Row>
              <div className="pass-word mt-4">{verificationCode}</div>
              <div className="login-process">
                <Button
                  className="next-btn mt-10"
                  type="primary"
                  size="large"
                  block
                  loading={state.submitLoading}
                  htmlType="submit"
                >
                  下一步
                </Button>
                <div className="text-center mt-2">{goAndLand}</div>
              </div>
            </Form>
          </>
        )
      }
      // 重设密码 | 注册密码
      if (state.retrieveCard.method === 1) {
        return (
          <>
            {retrieveTitle}
            <Form
              className="login-form"
              form={form}
              onFinish={resetAndRetrieveFinish}
            >
              <div className="pass-word mt-4">
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: '请输入您的登录密码',
                    },
                  ]}
                >
                  <Input
                    type={state.retrieveCard.psBlock ? 'text' : 'password'}
                    placeholder="请输入您的登录密码"
                    maxLength={16}
                  />
                </Form.Item>
                <div className="handle-password">
                  {state.retrieveCard.psBlock ? (
                    <SxyIcon
                      width={26}
                      height={24}
                      name="icon_login_display.png"
                      onClick={() => {
                        setState((prev) => {
                          prev.retrieveCard.psBlock = false
                          return prev
                        })
                      }}
                    />
                  ) : (
                    <SxyIcon
                      width={25}
                      height={24}
                      name="icon_login_hide.png"
                      onClick={() => {
                        setState((prev) => {
                          prev.retrieveCard.psBlock = true
                          return prev
                        })
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="pass-word mt-8">
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: '请在此输入确认密码',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject('两次输入的密码不一致')
                      },
                    }),
                  ]}
                >
                  <Input
                    type={state.retrieveCard.psAgainBlock ? 'text' : 'password'}
                    placeholder="请在此输入确认密码"
                    maxLength={16}
                  />
                </Form.Item>
                <div className="handle-password">
                  {state.retrieveCard.psAgainBlock ? (
                    <SxyIcon
                      width={26}
                      height={24}
                      name="icon_login_display.png"
                      onClick={() => {
                        setState((prev) => {
                          prev.retrieveCard.psAgainBlock = false
                          return prev
                        })
                      }}
                    />
                  ) : (
                    <SxyIcon
                      width={25}
                      height={24}
                      name="icon_login_hide.png"
                      onClick={() => {
                        setState((prev) => {
                          prev.retrieveCard.psAgainBlock = true
                          return prev
                        })
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="login-process">
                <Button
                  className="next-btn mt-10"
                  type="primary"
                  size="large"
                  loading={state.submitLoading}
                  block
                  htmlType="submit"
                >
                  {state.interfaceStatus === 2 ? '确定' : '注册'}
                </Button>
                <div className="text-center mt-2">{goAndLand}</div>
              </div>
            </Form>
          </>
        )
      }
    }
  }

  /**
   * @Description 验证码定时器
   * @Author bihongbin
   * @Date 2020-08-27 18:47:29
   */
  useEffect(() => {
    if (state.verificationText.count < stateValue.verificationText.count) {
      verificationRef.current = setInterval(() => {
        if (state.verificationText.count === 1) {
          // 重置验证码
          resetVerificationCode()
          // 清除
          clearInterval(verificationRef.current)
        } else {
          setState((prev) => {
            prev.verificationText.count = state.verificationText.count - 1
            return prev
          })
        }
      }, 1000)
    }
    return () => {
      // 清除
      clearInterval(verificationRef.current)
    }
  }, [resetVerificationCode, setState, state.verificationText.count])

  /**
   * @Description 清除恢复默认redux数据
   * @Author bihongbin
   * @Date 2020-11-02 11:00:14
   */
  useEffect(() => {
    dispatchRedux(auth.actions.logout())
  }, [dispatchRedux])

  return (
    <>
      <LoginView />
      <LoginCard>
        <LoginMain>{renderLoginMethod()}</LoginMain>
        <Row className="mt-3" justify="center">
          <Col>
            <Text className="font-12" type="secondary">
              2020©深圳市华旅云创科技有限公司
            </Text>
          </Col>
        </Row>
      </LoginCard>
    </>
  )
}

export default Login
