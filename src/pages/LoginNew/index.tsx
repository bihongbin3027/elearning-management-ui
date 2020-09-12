import React, { useReducer, useRef, useEffect } from 'react'
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Divider,
  message,
} from 'antd'
import { SxyIcon } from '@/style/module/icon'
import { SxyButton } from '@/style/module/button'
import {
  LoginView,
  LoginCard,
  LoginMain,
  LoginTab,
} from '@/pages/LoginNew/style'

const { Text } = Typography
const { Option } = Select

interface LoginFormRelevantType {
  areaCode: string
  userName: string
  verificationCode: string
  passWord: string
  confirmPassword: string
}

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload?: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_INTERFACE_STATUS = '[SetInterfaceStatus Action]',
  SET_MAIN_CARD = '[SetMainCard Action]',
  SET_RETRIEVE_CARD = '[SetRetrieveCard Action]',
  SET_VERIFICATION_TEXT = '[SetVerificationText Action]',
  SET_IS_BTN_LOADING = '[SetIsBtnLoading Action]',
}

const stateValue = {
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
    count: 60,
    liked: true,
  },
  isBtnLoading: false, // 按钮loading
}

const Login = () => {
  const [form] = Form.useForm()
  const verificationRef = useRef<number>() // 验证码
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_INTERFACE_STATUS: // 设置界面显示类型
        return {
          ...state,
          interfaceStatus: action.payload,
        }
      case ActionType.SET_MAIN_CARD: // 设置密码和验证码登录页面状态值
        return {
          ...state,
          mainCard: {
            ...state.mainCard,
            ...action.payload,
          },
        }
      case ActionType.SET_RETRIEVE_CARD: // 设置找回密码页面状态值
        return {
          ...state,
          retrieveCard: {
            ...state.retrieveCard,
            ...action.payload,
          },
        }
      case ActionType.SET_VERIFICATION_TEXT: // 设置验证码按钮文本
        const count = state.verificationText.count - 1
        if (action.payload) {
          return {
            ...state,
            verificationText: {
              ...state.verificationText,
              ...action.payload,
            },
          }
        } else {
          return {
            ...state,
            verificationText: {
              count: count,
              liked: count <= 0 ? true : false,
            },
          }
        }
      case ActionType.SET_IS_BTN_LOADING: // 设置按钮loading状态
        return {
          ...state,
          isBtnLoading: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 设置密码和验证码登录页面状态值
   * @Author bihongbin
   * @Date 2020-08-26 15:49:00
   */
  const handleMainCardState = (data: Partial<StateType['mainCard']>) => {
    dispatch({
      type: ActionType.SET_MAIN_CARD,
      payload: data,
    })
  }

  /**
   * @Description 设置找回密码页面状态值
   * @Author bihongbin
   * @Date 2020-08-27 09:24:09
   */
  const handleRetrieveCardState = (
    data: Partial<StateType['retrieveCard']>,
  ) => {
    dispatch({
      type: ActionType.SET_RETRIEVE_CARD,
      payload: data,
    })
  }

  /**
   * @Description 设置验证码倒计时状态值
   * @Author bihongbin
   * @Date 2020-08-27 17:29:07
   */
  const handleVerificationTextState = (
    data: Partial<StateType['verificationText']>,
  ) => {
    dispatch({
      type: ActionType.SET_VERIFICATION_TEXT,
      payload: data,
    })
  }

  /**
   * @Description 重置登录状态初始值
   * @Author bihongbin
   * @Date 2020-08-27 15:50:36
   */
  const resetLoginInitState = (type: number[]) => {
    for (let item of type) {
      // 重置密码和验证码登录状态值
      if (item === 0) {
        handleMainCardState({
          method: 0,
          passwordMode: false,
          autoCheckbox: false,
          readAgreement: false,
        })
        form.setFieldsValue({
          userName: '',
          password: '',
          confirmPassword: '',
          verificationCode: '',
        })
      }
      // 重置找回密码和注册状态值
      if (item === 1) {
        handleRetrieveCardState({
          method: 0,
          psBlock: false,
          psAgainBlock: false,
        })
      }
    }
    // 重置验证码倒计时
    clearInterval(verificationRef.current)
    handleVerificationTextState({
      count: 60,
      liked: true,
    })
  }

  /**
   * @Description 获取验证码
   * @Author bihongbin
   * @Date 2020-08-27 17:01:36
   */
  const getVerificationCode = () => {
    if (state.verificationText.liked) {
      handleVerificationTextState({
        liked: false,
      })
      verificationRef.current = setInterval(() => {
        dispatch({
          type: ActionType.SET_VERIFICATION_TEXT,
        })
      }, 1000)
    }
  }

  /**
   * @Description 账号密码登录和验证码登录
   * @Author bihongbin
   * @Date 2020-08-27 14:32:32
   */
  const loginSubmit = (values: LoginFormRelevantType) => {
    console.log('表单值', values)
  }

  /**
   * @Description 找回密码-下一步
   * @Author bihongbin
   * @Date 2020-08-27 10:41:03
   */
  const findNextStepFinish = (
    values: Pick<
      LoginFormRelevantType,
      'areaCode' | 'userName' | 'verificationCode'
    >,
  ) => {
    console.log('表单值', values)
    handleRetrieveCardState({ method: 1 })
  }

  /**
   * @Description 找回密码-重置密码
   * @Author bihongbin
   * @Date 2020-08-27 10:57:32
   */
  const resetAndRetrieveFinish = (
    values: Pick<LoginFormRelevantType, 'passWord' | 'confirmPassword'>,
  ) => {
    console.log('表单值', values)
    // 重置密码
    if (state.interfaceStatus === 2) {
      message.success('重置密码成功，请重新登录', 1.5)
    }
    // 注册
    if (state.interfaceStatus === 3) {
      message.success('注册成功', 1.5)
    }
    resetLoginInitState([0, 1])
    // 重回账号密码登录界面
    dispatch({
      type: ActionType.SET_INTERFACE_STATUS,
      payload: 0,
    })
  }

  /**
   * @Description 渲染登录方式
   * @Author bihongbin
   * @Date 2020-08-26 16:05:55
   */
  const renderLoginMethod = () => {
    // 账号
    const accountNumber = (
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item className="form-item-border-bottom" name="areaCode">
            <Select bordered={false}>
              <Option value="86">中国 +86</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={16}>
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
        </Col>
      </Row>
    )
    // 验证码
    const verificationCode = (
      <>
        <Form.Item
          name="verificationCode"
          rules={[
            {
              required: true,
              message: '请输入您的验证码',
            },
          ]}
        >
          <Input type="text" placeholder="请输入您的验证码" maxLength={4} />
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
          dispatch({
            type: ActionType.SET_INTERFACE_STATUS,
            payload: 0,
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
          dispatch({
            type: ActionType.SET_INTERFACE_STATUS,
            payload: 3,
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
                  handleMainCardState({
                    method: index,
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
            {accountNumber}
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
                          handleMainCardState({
                            passwordMode: false,
                          })
                        }
                      />
                    ) : (
                      <SxyIcon
                        width={25}
                        height={24}
                        name="icon_login_hide.png"
                        onClick={() =>
                          handleMainCardState({
                            passwordMode: true,
                          })
                        }
                      />
                    )}
                  </div>
                </>
              ) : null}
              {state.mainCard.method === 1 ? verificationCode : null}
            </div>
          </Form>
          <div className="login-process">
            <div>
              <Checkbox
                checked={state.mainCard.autoCheckbox}
                onChange={(e) =>
                  handleMainCardState({ autoCheckbox: e.target.checked })
                }
              >
                <Text className="font-12" type="secondary">
                  3天内自动登录
                </Text>
              </Checkbox>
            </div>
            <Button
              className="next-btn mt-2"
              type="primary"
              size="large"
              block
              onClick={form.submit}
            >
              登录
            </Button>
            <Row className="mt-2" justify="space-between">
              <Col>
                <Checkbox
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
                </Checkbox>
              </Col>
              <Col>
                <Button
                  className="font-12 is-btn-link"
                  type="link"
                  onClick={() => {
                    resetLoginInitState([0])
                    dispatch({
                      type: ActionType.SET_INTERFACE_STATUS,
                      payload: 2,
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
                onClick={() =>
                  dispatch({
                    type: ActionType.SET_INTERFACE_STATUS,
                    payload: 1,
                  })
                }
              />
            </Divider>
          </div>
        </>
      )
    }
    // 微信登录
    if (state.interfaceStatus === 1) {
      return (
        <div className="scan-code">
          <div
            className="rt-password"
            onClick={() =>
              dispatch({
                type: ActionType.SET_INTERFACE_STATUS,
                payload: 0,
              })
            }
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
              {accountNumber}
              <div className="pass-word mt-4">{verificationCode}</div>
            </Form>
            <div className="login-process">
              <Button
                className="next-btn mt-10"
                type="primary"
                size="large"
                block
                onClick={form.submit}
              >
                下一步
              </Button>
              <div className="text-center mt-2">{goAndLand}</div>
            </div>
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
                      onClick={() =>
                        handleRetrieveCardState({ psBlock: false })
                      }
                    />
                  ) : (
                    <SxyIcon
                      width={25}
                      height={24}
                      name="icon_login_hide.png"
                      onClick={() => handleRetrieveCardState({ psBlock: true })}
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
                      onClick={() =>
                        handleRetrieveCardState({ psAgainBlock: false })
                      }
                    />
                  ) : (
                    <SxyIcon
                      width={25}
                      height={24}
                      name="icon_login_hide.png"
                      onClick={() =>
                        handleRetrieveCardState({ psAgainBlock: true })
                      }
                    />
                  )}
                </div>
              </div>
            </Form>
            <div className="login-process">
              <Button
                className="next-btn mt-10"
                type="primary"
                size="large"
                loading={state.isBtnLoading}
                block
                onClick={form.submit}
              >
                {state.interfaceStatus === 2 ? '确定' : '注册'}
              </Button>
              <div className="text-center mt-2">{goAndLand}</div>
            </div>
          </>
        )
      }
    }
  }

  /**
   * @Description 清除验证码定时器
   * @Author bihongbin
   * @Date 2020-08-27 18:47:29
   */
  useEffect(() => {
    if (state.verificationText.count === 0) {
      handleVerificationTextState({
        count: 60,
        liked: true,
      })
      clearInterval(verificationRef.current)
    }
  }, [state.verificationText.count])

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
