import React from 'react'
import { Modal, Row, Col, Button, Typography } from 'antd'

const { Title, Text } = Typography

interface PropType {
  visible: boolean
  onCancel: () => void
}

const InputExampleView = (props: PropType) => {
  return (
    <Modal
      width={650}
      visible={props.visible}
      title="输入范例"
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <div className="modal-form-height">
        <dl>
          <dt>
            <Title level={5}>单选题</Title>
          </dt>
          <dd>
            <Text type="secondary">1.驾驶人有下列哪种违法行为一次记6分</Text>
            <br />
            <Text type="secondary">A、使用其他车辆行驶证</Text>
            <br />
            <Text type="secondary">B、饮酒后驾驶机动车</Text>
            <br />
            <Text type="secondary">C、车速超过规定时速50%以上</Text>
            <br />
            <Text type="secondary">D、违法占用应急车道行驶</Text>
            <br />
            <Text type="secondary">答案:D</Text>
            <br />
            <Text type="secondary">
              解析:请仔细阅读交规<Text type="danger">(若无解析本行可不填)</Text>
            </Text>
          </dd>
        </dl>
        <dl className="mt-6">
          <dt>
            <Title level={5}>多选题</Title>
          </dt>
          <dd>
            <Text type="secondary">1.驾驶人有下列哪种违法行为一次记6分</Text>
            <br />
            <Text type="secondary">A、使用其他车辆行驶证</Text>
            <br />
            <Text type="secondary">B、饮酒后驾驶机动车</Text>
            <br />
            <Text type="secondary">C、车速超过规定时速50%以上</Text>
            <br />
            <Text type="secondary">D、违法占用应急车道行驶</Text>
            <br />
            <Text type="secondary">答案:ABCD</Text>
            <br />
            <Text type="secondary">
              解析:请仔细阅读交规<Text type="danger">(若无解析本行可不填)</Text>
            </Text>
          </dd>
        </dl>
        <dl className="mt-6">
          <dt>
            <Title level={5}>判断题</Title>
          </dt>
          <dd>
            <Text type="secondary">1.国际象棋起源于英国吗</Text>
            <br />
            <Text type="secondary">答案:对</Text>
            <br />
            <Text type="secondary">
              解析:请仔细阅读交规<Text type="danger">(若无解析本行可不填)</Text>
            </Text>
          </dd>
        </dl>
        <dl className="mt-6">
          <dt>
            <Title level={5}>填空题</Title>
          </dt>
          <dd>
            <Text type="secondary">1.我国古典四大名著是（）（）（）（）</Text>
            <br />
            <Text type="secondary">答案:红楼梦|水浒传|三国演义|西游记</Text>
            <br />
            <Text type="secondary">
              解析:请仔细阅读交规<Text type="danger">(若无解析本行可不填)</Text>
            </Text>
          </dd>
        </dl>
        <dl className="mt-6">
          <dt>
            <Title level={5}>问答题</Title>
          </dt>
          <dd>
            <Text type="secondary">
              1.请论述全球化对国家政治产生了哪些深刻的影响？
            </Text>
            <br />
            <Text type="secondary">
              答案:全球化使国家主权受到一定的制约；全球化对政府的治理提出了更高的要求。
            </Text>
            <br />
            <Text type="secondary">
              解析:请仔细阅读交规<Text type="danger">(若无解析本行可不填)</Text>
            </Text>
          </dd>
        </dl>
      </div>
      <Row className="mt-10 mb-5" justify="center">
        <Col>
          <Button className="font-14" size="large" onClick={props.onCancel}>
            关闭
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default InputExampleView
