import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Input, Button, Row, Col } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import auth from '@/store/module/auth'
import { RootStateType } from '@/store/rootReducer'
import {
  LoginCanvas,
  LoginMain,
  LoginFrom,
  FormTitle,
  CodeImg,
  LoginFormStyle,
} from './style'

type CanvasType = HTMLCanvasElement | null

const Login = () => {
  const dispatchRedux = useDispatch()
  const { loginLoading, verificationCode } = useSelector(
    (state: RootStateType) => state.auth,
  )
  const canvasBgRef = useRef<CanvasType>(null)
  const canvasCircleRef = useRef<CanvasType>(null)
  const canvasErectRef = useRef<CanvasType>(null)

  /**
   * @Description 提交表单且数据验证成功后回调事件
   * @Author bihongbin
   * @Date 2020-05-27 14:10:45
   */
  const handleFinish = async (values: any) => {
    const { username, password, imgCode } = values
    const params = {
      grant_type: 'password',
      uuid: verificationCode.uuid,
      username,
      password,
      imgCode,
    }
    dispatchRedux(auth.actions.login(params))
  }

  /**
   * @Description 设置登陆页背景动画
   * @Author bihongbin
   * @Date 2020-05-27 12:00:56
   */
  useEffect(() => {
    const canvasBg = canvasBgRef.current
    const canvasCircle = canvasCircleRef.current
    const canvasErect = canvasErectRef.current
    let init: () => void
    if (canvasBg && canvasCircle && canvasErect) {
      const canvas = [canvasBg, canvasCircle, canvasErect]
      const config = {
        circle: {
          amount: 18,
          layer: 3,
          color: [157, 97, 207],
          alpha: 0.3,
        },
        line: {
          amount: 12,
          layer: 3,
          color: [255, 255, 255],
          alpha: 0.3,
        },
        speed: 0.5,
        angle: 20,
      }
      const bgTx = canvasBg.getContext('2d')
      const circleTx = canvasCircle.getContext('2d')
      const erectTx = canvasErect.getContext('2d')
      const M = window.Math
      const degree = (config.angle / 360) * M.PI * 2
      let circles: any[] = []
      let lines: any[] = []
      let wWidth: number
      let wHeight: number
      let timer: number

      /**
       * @Description 浏览器重绘之前调用指定的回调函数更新动画
       * @Author bihongbin
       * @Param {Function} callback 下一次重绘之前更新动画帧所调用的函数
       * @Date 2020-05-27 12:38:51
       */
      const requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
          setTimeout(callback, 1000 / 60)
        }

      /**
       * @Description 取消先前通过调用预定的动画帧请求
       * @Author bihongbin
       * @Param {Number} requestID 调用返回的ID值window.requestAnimationFrame()请求了回调
       * @Date 2020-05-27 12:40:38
       */
      const cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        clearTimeout

      /**
       * @Description 设置canvas宽度和高度
       * @Author bihongbin
       * @Date 2020-05-27 11:59:25
       */
      const setCanvasHeight = () => {
        wWidth =
          document.body.clientWidth || document.documentElement.clientWidth
        wHeight =
          document.body.clientHeight || document.documentElement.clientHeight
        canvas.forEach(function (item) {
          item.width = wWidth
          item.height = wHeight
        })
      }

      /**
       * @Description 动画流星
       * @Author bihongbin
       * @Date 2020-05-27 12:33:04
       */
      const drawLine = (
        x: number,
        y: number,
        width: number,
        color: string,
        alpha: number,
      ) => {
        if (erectTx) {
          const endX = x + M.sin(degree) * width,
            endY = y - M.cos(degree) * width,
            gradient = erectTx.createLinearGradient(x, y, endX, endY)
          gradient.addColorStop(
            0,
            'rgba(' +
              color[0] +
              ',' +
              color[1] +
              ',' +
              color[2] +
              ',' +
              alpha +
              ')',
          )
          gradient.addColorStop(
            1,
            'rgba(' +
              color[0] +
              ',' +
              color[1] +
              ',' +
              color[2] +
              ',' +
              (alpha - 0.1) +
              ')',
          )
          erectTx.beginPath()
          erectTx.moveTo(x, y)
          erectTx.lineTo(endX, endY)
          erectTx.lineWidth = 3
          erectTx.lineCap = 'round'
          erectTx.strokeStyle = gradient
          erectTx.stroke()
        }
      }

      /**
       * @Description 动画圆
       * @Author bihongbin
       * @Date 2020-05-27 12:32:51
       */
      const drawCircle = (
        x: number,
        y: number,
        radius: number,
        color: string,
        alpha: number,
      ) => {
        if (circleTx) {
          const gradient = circleTx.createRadialGradient(x, y, radius, x, y, 0)
          gradient.addColorStop(
            0,
            'rgba(' +
              color[0] +
              ',' +
              color[1] +
              ',' +
              color[2] +
              ',' +
              alpha +
              ')',
          )
          gradient.addColorStop(
            1,
            'rgba(' +
              color[0] +
              ',' +
              color[1] +
              ',' +
              color[2] +
              ',' +
              (alpha - 0.1) +
              ')',
          )
          circleTx.beginPath()
          circleTx.arc(x, y, radius, 0, M.PI * 2, true)
          circleTx.fillStyle = gradient
          circleTx.fill()
        }
      }

      /**
       * @Description 填充元素
       * @Author bihongbin
       * @Date 2020-05-27 12:32:03
       */
      const drawBack = () => {
        if (bgTx) {
          bgTx.clearRect(0, 0, wWidth, wHeight)
          let gradient = []
          gradient[0] = bgTx.createRadialGradient(
            wWidth * 0.3,
            wHeight * 0.1,
            0,
            wWidth * 0.3,
            wHeight * 0.1,
            wWidth * 0.9,
          )
          gradient[0].addColorStop(0, 'rgb(0, 26, 77)')
          gradient[0].addColorStop(1, 'transparent')
          bgTx.translate(wWidth, 0)
          bgTx.scale(-1, 1)
          bgTx.beginPath()
          bgTx.fillStyle = gradient[0]
          bgTx.fillRect(0, 0, wWidth, wHeight)
          gradient[1] = bgTx.createRadialGradient(
            wWidth * 0.1,
            wHeight * 0.1,
            0,
            wWidth * 0.3,
            wHeight * 0.1,
            wWidth,
          )
          gradient[1].addColorStop(0, 'rgb(0, 150, 240)')
          gradient[1].addColorStop(0.8, 'transparent')
          bgTx.translate(wWidth, 0)
          bgTx.scale(-1, 1)
          bgTx.beginPath()
          bgTx.fillStyle = gradient[1]
          bgTx.fillRect(0, 0, wWidth, wHeight)
          gradient[2] = bgTx.createRadialGradient(
            wWidth * 0.1,
            wHeight * 0.5,
            0,
            wWidth * 0.1,
            wHeight * 0.5,
            wWidth * 0.5,
          )
          gradient[2].addColorStop(0, 'rgb(40, 20, 105)')
          gradient[2].addColorStop(1, 'transparent')
          bgTx.beginPath()
          bgTx.fillStyle = gradient[2]
          bgTx.fillRect(0, 0, wWidth, wHeight)
        }
      }

      /**
       * @Description 动画运动计算
       * @Author bihongbin
       * @Date 2020-05-27 12:32:21
       */
      const animate = () => {
        const sin = M.sin(degree),
          cos = M.cos(degree)
        if (circleTx && config.circle.amount > 0 && config.circle.layer > 0) {
          circleTx.clearRect(0, 0, wWidth, wHeight)
          for (let i = 0, len = circles.length; i < len; i++) {
            let item = circles[i],
              x = item.x,
              y = item.y,
              radius = item.radius,
              speed = item.speed

            if (x > wWidth + radius) {
              x = -radius
            } else if (x < -radius) {
              x = wWidth + radius
            } else {
              x += sin * speed
            }

            if (y > wHeight + radius) {
              y = -radius
            } else if (y < -radius) {
              y = wHeight + radius
            } else {
              y -= cos * speed
            }

            item.x = x
            item.y = y
            drawCircle(x, y, radius, item.color, item.alpha)
          }
        }
        if (erectTx && config.line.amount > 0 && config.line.layer > 0) {
          erectTx.clearRect(0, 0, wWidth, wHeight)
          for (let j = 0, len = lines.length; j < len; j++) {
            let item = lines[j],
              x = item.x,
              y = item.y,
              width = item.width,
              speed = item.speed
            if (x > wWidth + width * sin) {
              x = -width * sin
            } else if (x < -width * sin) {
              x = wWidth + width * sin
            } else {
              x += sin * speed
            }
            if (y > wHeight + width * cos) {
              y = -width * cos
            } else if (y < -width * cos) {
              y = wHeight + width * cos
            } else {
              y -= cos * speed
            }
            item.x = x
            item.y = y
            drawLine(x, y, width, item.color, item.alpha)
          }
        }
        timer = requestAnimationFrame(animate)
      }

      /**
       * @Description 创建动画块元素
       * @Author bihongbin
       * @Date 2020-05-27 12:31:01
       */
      const createItem = () => {
        circles = []
        lines = []
        if (config.circle.amount > 0 && config.circle.layer > 0) {
          for (var i = 0; i < config.circle.amount / config.circle.layer; i++) {
            for (var j = 0; j < config.circle.layer; j++) {
              circles.push({
                x: M.random() * wWidth,
                y: M.random() * wHeight,
                radius: M.random() * (20 + j * 5) + (20 + j * 5),
                color: config.circle.color,
                alpha: M.random() * 0.2 + (config.circle.alpha - j * 0.1),
                speed: config.speed * (1 + j * 0.5),
              })
            }
          }
        }
        if (config.line.amount > 0 && config.line.layer > 0) {
          for (var m = 0; m < config.line.amount / config.line.layer; m++) {
            for (var n = 0; n < config.line.layer; n++) {
              lines.push({
                x: M.random() * wWidth,
                y: M.random() * wHeight,
                width: M.random() * (20 + n * 5) + (20 + n * 5),
                color: config.line.color,
                alpha: M.random() * 0.2 + (config.line.alpha - n * 0.1),
                speed: config.speed * (1 + n * 0.5),
              })
            }
          }
        }
        cancelAnimationFrame(timer)
        timer = requestAnimationFrame(animate)
        drawBack()
      }

      /**
       * @Description canvas背景动画构建
       * @Author bihongbin
       * @Date 2020-05-27 12:28:11
       */
      init = () => {
        setCanvasHeight()
        createItem()
      }

      init() // 初始化加载背景动画
      window.addEventListener('resize', init) // 窗口大小变化调用
    }
    return () => {
      window.removeEventListener('resize', init) // 卸载移除事件
    }
  }, [])

  useEffect(() => {
    dispatchRedux(auth.actions.logout()) // 重置redux存储的用户信息
    dispatchRedux(auth.actions.setVerificationCode()) // 初始化图形验证码
  }, [dispatchRedux])

  return (
    <>
      <LoginCanvas>
        <canvas ref={canvasBgRef} />
        <canvas ref={canvasCircleRef} />
        <canvas ref={canvasErectRef} />
      </LoginCanvas>
      <LoginMain>
        <LoginFrom>
          <FormTitle>登录</FormTitle>
          <LoginFormStyle>
            <Form autoComplete="off" onFinish={handleFinish}>
              <div>用户名</div>
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
              </Form.Item>
              <div>密码</div>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="请输入密码"
                />
              </Form.Item>
              <div>验证码</div>
              <Form.Item
                name="imgCode"
                rules={[
                  { required: true, message: '请输入验证码' },
                  () => ({
                    validator(rule, value) {
                      if (value && value.length !== 4) {
                        return Promise.reject('验证码长度为4位')
                      }
                      return Promise.resolve()
                    },
                  }),
                ]}
              >
                <Row gutter={10}>
                  <Col span={16}>
                    <Input
                      prefix={<CheckCircleOutlined />}
                      maxLength={4}
                      placeholder="请输入验证码"
                    />
                  </Col>
                  <Col span={8}>
                    <CodeImg
                      onClick={() =>
                        dispatchRedux(auth.actions.setVerificationCode())
                      }
                      src={verificationCode.img}
                      alt="验证码"
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loginLoading}
                block
              >
                登 录
              </Button>
            </Form>
          </LoginFormStyle>
        </LoginFrom>
      </LoginMain>
    </>
  )
}

export default Login
