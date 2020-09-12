import React from 'react'
import { Modal, Row, Col, Button, Typography } from 'antd'

const { Text } = Typography

interface PropType {
  visible: boolean
  onCancel: () => void
}

const InputSpecificationView = (props: PropType) => {
  return (
    <Modal
      width={650}
      visible={props.visible}
      title="输入规范"
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <div className="modal-form-height">
        <Text type="secondary">
          1、所有题型标号支持1.或1、或（1）三种格式。
        </Text>
        <br />
        <Text type="secondary">
          2、所有题型必须含有 “ 答案：”字段，且不能为空。
        </Text>
        <br />
        <Text type="secondary">
          3、所有题型 “ 解析：” 字段非必需，没有可不填。
        </Text>
        <br />
        <Text type="secondary">
          4、所有题型题目中包含图片，则将图片插入到指定位置即可。
        </Text>
        <br />
        <Text type="secondary">
          5、选择题最少支持2个选项A,B，最多支持8个选项A,B,C,D,E,F,G,H且按照顺序使用。
        </Text>
        <br />
        <Text type="secondary">
          6、选择题A-H这些选项号与内容之间要用、或 . 分开。
        </Text>
        <br />
        <Text type="secondary">7、选择题答案中请勿加分隔符或者空格。</Text>
        <br />
        <Text type="secondary">
          8、判断题答案支持 “错误”，“正确” 或者 “错”，“对”。
        </Text>
        <br />
        <Text type="secondary">9、填空题仅支持题目中出现括号。</Text>
        <br />
        <Text type="secondary">
          10、填空题目里的多个填空答案要用 | 分割，单个答案不用添加。
        </Text>
        <br />
        <Text type="secondary">
          11、问答题中如有小标题，如（1）时，请不要分段，将一整段答案录入完成。
        </Text>
        <br />
        <Text type="secondary">
          12、组合题，不支持批量导入，请点击【手动导入】进行上传。
        </Text>
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

export default InputSpecificationView
