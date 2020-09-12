import styled from 'styled-components'

export const LoginCanvas = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme['@color-bg-primary']};
  z-index: -1;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

export const LoginMain = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoginFrom = styled.div`
  width: 398px;
  border-radius: 10px;
  margin: 0 3.5vw;
  padding: 1.5vw 2vw 2vw;
  background-color: #fff;
`

export const FormTitle = styled.div`
  line-height: 1.2;
  font-size: 30px;
  padding-bottom: 30px;
  color: ${(props) => props.theme['@color-text']};
  text-align: center;
`

export const CodeImg = styled.img`
  width: 100%;
  height: 40px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme['@color-border-base']};
`

export const LoginFormStyle = styled.div`
  .ant-form-item-control {
    .ant-input-affix-wrapper {
      border-top: 0 none;
      border-left: 0 none;
      border-right: 0 none;
      border-bottom-width: 2px;
      border-color: ${(props) => props.theme['@color-border-base']};
      border-radius: 0;
      box-shadow: none;
      &:after {
        content: '';
        display: block;
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: #7f7f7f;
        transition: all 0.4s;
      }
      &:focus {
        outline: none;
      }
      &:hover {
        &:after {
          width: 100%;
        }
      }
      .ant-input {
        height: 30px;
      }
    }
  }
`
