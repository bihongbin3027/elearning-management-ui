import styled from 'styled-components'
import { Layout } from 'antd'

const { Header } = Layout

export const HeaderStyle = styled(Header)`
  position: fixed;
  top: 0%;
  left: 200px;
  right: 0;
  height: 120px;
  line-height: inherit;
  z-index: 99;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.03);
  transition: left 0.2s;
  .header-top {
    height: 60px;
    h2 {
      line-height: 1;
      font-size: 20px;
      margin-bottom: 0;
    }
  }
  .header-nav {
    height: 50px;
    margin-bottom: 10px;
    .header-tab {
      display: flex;
      height: 100%;
      align-items: center;
      position: relative;
      .header-tab-scroll {
        height: 100%;
        width: 100%;
        flex: 1;
        padding-left: 10px;
        padding-right: 10px;
        background-color: ${(props) => props.theme['@color-bg-grey']};
        overflow-x: auto;
        .ant-space-item {
          &:last-child {
            margin-right: 10px;
          }
        }
      }
    }
    .tabs-handle {
      text-align: right;
      .ant-dropdown {
        .ant-dropdown-menu-item {
          font-size: 12px;
        }
      }
    }
    .tab-cur-left,
    .tab-cur-right {
      position: absolute;
      top: 50%;
      margin-top: -7px;
      color: ${(props) => props.theme['@color-text-description']};
      z-index: 1;
    }
    .tab-cur-left {
      left: -10px;
    }
    .tab-cur-right {
      right: -10px;
    }
  }
  .header-right-link {
    button {
      vertical-align: top;
    }
  }
  .dropdown-quit {
    height: auto;
    margin-left: 30px;
  }
  .user-avatar {
    border-radius: 6px;
  }
`
