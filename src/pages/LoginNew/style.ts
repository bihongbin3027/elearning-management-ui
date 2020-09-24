import styled from 'styled-components'

export const LoginView = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background: ${() =>
      'url(' + require(`../../assets/images/login_bg.png`) + ')'}
    no-repeat center center;
  background-size: contain;
  z-index: 1;
`

export const LoginCard = styled.div`
  width: 420px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -36%;
  margin-top: -320px;
  z-index: 1;
`

export const LoginMain = styled.div`
  height: 580px;
  padding: 50px 40px;
  border-radius: 8px;
  box-shadow: 0 15px 30px 0 rgba(40, 93, 168, 0.2);
  border: 1px solid ${(props) => props.theme['@color-border-base']};
  background-color: #fff;
  .login-form {
    margin-top: 50px;
    .form-item-border-bottom {
      height: 45px;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background-color: ${(props) => props.theme['@color-border-base']};
        z-index: 1;
      }
      .ant-select {
        .ant-select-selector {
          padding-left: 0;
          padding-right: 0;
        }
        .ant-select-arrow {
          right: 0;
        }
      }
    }
    .pass-word {
      position: relative;
    }
    .handle-password {
      position: absolute;
      top: 4px;
      right: 0;
      z-index: 1;
      i {
        cursor: pointer;
      }
    }
    .password-code {
      position: absolute;
      top: -10px;
      right: 0;
      z-index: 1;
      button {
        height: 40px;
      }
    }
    input {
      border-top: 0 none;
      border-left: 0 none;
      border-right: 0 none;
      border-radius: 0;
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 18px;
      &:focus {
        box-shadow: none !important;
      }
    }
  }
  .login-process {
    margin-top: 60px;
    .next-btn {
      &.ant-btn {
        height: 50px;
        font-size: 20px;
      }
    }
  }
  /* 扫码登录 */
  .scan-code {
    .rt-password {
      position: absolute;
      right: 0;
      top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 40px;
      z-index: 1;
      background-color: ${(props) => props.theme['@color-bg-primary']};
      border-radius: 100px 0 0 100px;
      cursor: pointer;
      .rt-txt {
        position: absolute;
        right: 50px;
        top: 4px;
        display: flex;
        width: 72px;
        height: 30px;
        align-items: center;
        justify-content: center;
        color: #fff;
        border-radius: 4px;
        background-color: ${(props) => props.theme['@color-bg-primary']};
        .r {
          position: absolute;
          right: -7px;
          top: 50%;
          width: 0;
          height: 0;
          border-width: 4px;
          border-style: solid;
          border-color: transparent transparent transparent
            ${(props) => props.theme['@color-bg-primary']};
          margin-top: -4px;
          z-index: 1;
        }
      }
    }
    .code-img {
      width: 170px;
      height: 170px;
      margin: 60px auto 100px;
      padding: 10px;
      border: 1px solid ${(props) => props.theme['@color-border-base']};
    }
  }
`

export const LoginTab = styled.ul`
  display: flex;
  &.text-center {
    justify-content: center;
  }
  li {
    font-size: 20px;
    color: ${(props) => props.theme['@color-text-description']};
    padding-top: 10px;
    padding-bottom: 8px;
    margin-right: 20px;
    cursor: pointer;
    position: relative;
    &.active {
      padding-top: 6px;
      font-size: 24px;
      color: inherit;
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        margin-left: -15px;
        width: 30px;
        height: 2px;
        background-color: ${(props) => props.theme['@color-bg-primary']};
      }
    }
  }
`
