import styled from 'styled-components'

export const HomeStyle = styled.div`
  .card-body-style {
    .ant-card-body {
      padding-top: 12px;
      padding-bottom: 20px;
    }
  }
  .card-body-common-style {
    .ant-card-body {
      padding-top: 5px;
      padding-bottom: 22px;
    }
  }
  .empty-wrap {
    min-height: 180px !important;
  }
  .step-stretch {
    .ant-card-body {
      display: none;
      height: 0;
    }
  }
`

export const CardTitle = styled.div`
  position: relative;
  &:after {
    content: '';
    position: absolute;
    left: -24px;
    top: 50%;
    width: 4px;
    height: 14px;
    margin-top: -7px;
    z-index: 1;
    border-radius: 0 2px 2px 0;
    background-color: ${(props) => props.theme['@color-bg-primary']};
  }
`

export const StepsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  overflow: hidden;
`

export const StepsBox = styled.div`
  width: 115px;
  flex: 0 0 115px;
  text-align: center;
  &:last-child {
    .step-avatar {
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 100%;
        right: -9999px;
        display: block;
        height: 2px;
        margin-top: -1px;
        z-index: 1;
        background-color: #fff;
      }
    }
  }
  .step-avatar-wrap {
    display: inline-block;
    background-color: #fff;
    position: relative;
    z-index: 2;
    padding: 8px;
  }
  .step-avatar {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    border: 4px solid #eeeffe;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 100%;
      right: -9999px;
      display: block;
      height: 2px;
      margin-top: -1px;
      z-index: 1;
      background-color: ${(props) => props.theme['@color-border-base']};
    }
  }
  .step-title {
    font-size: 16px;
    margin-top: 10px;
  }
  .step-foot {
    margin-top: 5px;
  }
`

export const CommonItemBlock = styled.div`
  cursor: pointer;
  position: relative;
  &:hover {
    .common-head {
      i {
        width: 36px;
        height: 36px;
      }
    }
  }
  .common-delete {
    position: absolute;
    right: -9px;
    top: -9px;
    z-index: 1;
  }
  .common-head {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f9;
    border: 1px solid #d8d9f9;
    border-radius: 8px;
    i {
      transition: all 0.2s;
    }
  }
  .common-title {
    text-align: center;
    margin-top: 8px;
  }
`
