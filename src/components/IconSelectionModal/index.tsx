import React from 'react'
import useSetState from '@/hooks/useSetState'
import { Modal, Row, Col, Button, message } from 'antd'

interface PropType {
  visible: boolean
  width?: number
  title?: string
  onCancel: () => void
  onConfirm?: (item: string) => void
}

interface StateType {
  iconModal: {
    selected: number
    list: string[]
  }
}

const IconSelectionView = (props: PropType) => {
  const [state, setState] = useSetState<StateType>({
    iconModal: {
      selected: -1,
      list: [
        'iconmove',
        'iconmap',
        'iconnotice',
        'iconpassword',
        'iconNotvisible1',
        'iconphone',
        'iconpic1',
        'iconpin',
        'iconproduct',
        'iconQRcode1',
        'iconreeor',
        'iconreduce',
        'iconresonserate',
        'iconremind',
        'iconrising1',
        'iconRightarrow',
        'iconrmb1',
        'iconsave',
        'iconscanning',
        'iconseleted',
        'iconsearchcart',
        'iconshare',
        'iconRightbutton',
        'iconsorting',
        'iconsound-Mute',
        'iconsound-filling',
        'iconsuggest',
        'iconsuccess',
        'iconsupplier-features',
        'iconswitch',
        'iconsuspended',
        'iconTop',
        'iconsmile',
        'icontradealert',
        'icontopsales',
        'icontradingvolume',
        'iconupload',
        'iconviewlarger',
        'iconwarning',
        'iconset',
        'iconDaytimemode',
        'iconunlock',
        'iconexchangerate',
        'iconall',
        'iconbussiness-man',
        'iconcomponent',
        'iconcode',
        'iconcopy',
        'icondollar',
        'iconhistory',
        'iconeditor',
        'icondata',
        'icongift',
        'iconintegral',
        'iconnav-list',
        'iconpic',
        'iconNotvisible',
        'iconplay',
        'iconQRcode',
        'iconrmb',
        'iconsimilar-product',
        'iconExportservices',
        'iconsendinquiry',
        'iconcolumn',
        'iconadd-account',
        'iconcolumn1',
        'iconadd',
        'iconadd-cart',
        'iconarrow-right',
        'iconarrow-left',
        'iconall1',
        'iconarrow-up',
        'iconashbin',
        'iconatm',
        'iconbad',
        'iconattachent',
        'iconbrowse',
        'iconcalendar',
        'iconcart-full',
        'iconcalculator',
        'iconcameraswitching',
        'iconcecurity-protection',
        'iconcategory',
        'iconclose',
        'iconcertified-supplier',
        'iconcart-Empty',
        'iconcode1',
        'iconcopy1',
        'iconcoupons',
        'iconconnections',
        'iconcry',
        'iconclock',
        'iconCurrencyConverter',
        'iconcut',
        'icondata1',
        'iconCustomermanagement',
        'icondouble-arro-right',
        'iconcustomization',
        'icondouble-arrow-left',
        'icondiscount',
        'icondownload',
        'icondollar1',
        'icondefault-template',
        'iconeditor1',
        'iconetrical-equipm',
        'iconellipsis',
        'iconemail',
        'iconfalling',
        'iconfilter',
        'iconfolder',
        'iconhelp',
        'icongood',
        'icongift1',
        'iconhot',
        'iconinspection',
        'iconleftbutton',
        'iconleftarrow',
        'iconlink',
        'iconloading',
        'iconphone1',
      ],
    },
  })

  const iconStyle: React.CSSProperties = {
    height: 34,
    fontSize: 22,
  }

  /**
   * @Description 确定
   * @Author bihongbin
   * @Date 2020-08-18 17:34:47
   */
  const handleIconSave = () => {
    if (state.iconModal.selected === -1) {
      message.warn('请选择图标', 1.5)
      return
    }
    const item = state.iconModal.list[state.iconModal.selected]
    if (props.onConfirm) {
      props.onConfirm(item)
    }
  }

  return (
    <Modal
      width={props.width ? props.width : 580}
      visible={props.visible}
      title={props.title ? props.title : '图标选择'}
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Row className="ml-3 mr-3" gutter={[10, 10]}>
        {state.iconModal.list.map((item, index) => (
          <Col key={index}>
            <div
              className={`avatar-selected ${
                index === state.iconModal.selected ? 'avatar-selected-bg' : null
              }`}
              onClick={() => {
                setState((prev) => {
                  prev.iconModal.selected = index
                  return prev
                })
              }}
            >
              <i className={`iconfont ${item}`} style={iconStyle} />
            </div>
          </Col>
        ))}
      </Row>
      <Row className="mt-5 mb-2" justify="center">
        <Col>
          <Button onClick={props.onCancel}>关闭</Button>
          <Button className="ml-5" type="primary" onClick={handleIconSave}>
            确定
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default IconSelectionView
