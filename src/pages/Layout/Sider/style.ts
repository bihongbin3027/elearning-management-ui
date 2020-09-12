import styled from 'styled-components'
import { Layout } from 'antd'

const { Sider } = Layout

export const SiderStyle = styled(Sider)`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  &.ant-layout-sider-collapsed {
    .logo-wrap {
      .sider-open-btn {
        top: 0;
        right: 50%;
        margin-right: -8px;
        margin-top: 0;
      }
    }
  }
  .logo-wrap {
    display: flex;
    height: 110px;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    h1 {
      color: #fff;
      font-size: 12px;
      opacity: 0.6;
      margin-top: 2px;
      margin-bottom: 0;
    }
    .logo-icon {
      cursor: pointer;
    }
    .sider-open-btn {
      position: absolute;
      top: 50%;
      right: 20px;
      margin-top: -23px;
    }
  }
  .ant-layout-sider-children {
    .slider-menu-scroll {
      height: calc(100vh - 110px);
      overflow-y: auto;
    }
    /* 侧边栏菜单 */
    .ant-menu {
      .ant-menu-item {
        background-color: transparent;
        &.ant-menu-item-selected {
          color: ${(props) => props.theme['@color-text-primary']};
          .anticon {
            color: ${(props) => props.theme['@color-text-primary']};
            + span {
              color: ${(props) => props.theme['@color-text-primary']};
            }
          }
        }
      }
    }
  }
`
