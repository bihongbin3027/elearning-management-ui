import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

type ButtonType =
  | 'primary'
  | 'ghost'
  | 'dust'
  | 'white'
  | 'light-gray'
  | 'dark-grey'
  | 'light-green'
  | 'deep-green'
  | 'light-red'
  | 'deep-red'
  | 'pale-yellow'
  | 'deep-yellow'
  | 'light-blue'

interface SxyButtonType extends ThemesDefaultType {
  mode?: ButtonType
  width?: number
  border?: boolean
  font?: number
  block?: boolean
  radius?: number
  size?: 'large' | 'middle' | 'small'
}

// 按钮
export const SxyButton = styled.button<SxyButtonType>`
  line-height: 1.5715;
  position: relative;
  display: ${(props: SxyButtonType) =>
    props.block ? 'block' : 'inline-block'};
  width: ${(props: SxyButtonType) =>
    props.block ? '100%' : props.width ? `${props.width}px` : 'auto'};
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  cursor: pointer;
  transition: all 0.3s ease-out;
  user-select: none;
  touch-action: manipulation;
  height: ${(props: SxyButtonType) => {
    switch (props.size) {
      case 'large':
        return '40px'
      case 'small':
        return '26px'
      default:
        return '30px'
    }
  }};
  padding: 3px 15px;
  font-size: ${(props: SxyButtonType) =>
    props.font ? `${props.font}px` : '14px'};
  outline: none;
  border-radius: ${(props: SxyButtonType) => {
    if (props.radius) {
      return `${props.radius}px`
    } else {
      return props.theme['@border-radius-base']
    }
  }};
  border: ${(props: SxyButtonType) => {
    if (props.border === false) {
      return `0 none`
    }
    switch (props.mode) {
      case 'primary':
        return `1px solid ${
          props.theme && props.theme['@color-border-primary']
        }`
      case 'ghost':
        return `1px solid ${
          props.theme && props.theme['@color-border-primary']
        }`
      case 'dust':
        return `1px solid ${props.theme && props.theme['@color-border-base']}`
      case 'white':
        return `1px solid ${props.theme && props.theme['@color-border-base']}`
      default:
        return `0 none`
    }
  }};
  color: ${(props: SxyButtonType) => {
    switch (props.mode) {
      case 'primary':
        return '#fff'
      case 'ghost':
        return props.theme['@color-text-primary']
      case 'light-gray':
        return props.theme['@color-text-normal']
      case 'dark-grey':
        return props.theme['@color-text-description']
      case 'light-green':
        return props.theme['@color-text-finish']
      case 'deep-green':
        return '#fff'
      case 'light-red':
        return props.theme['@color-text-error']
      case 'deep-red':
        return '#fff'
      case 'pale-yellow':
        return props.theme['@color-text-warning']
      case 'deep-yellow':
        return '#fff'
      case 'light-blue':
        return props.theme['@color-text-primary']
    }
  }};
  background-color: ${(props: SxyButtonType) => {
    switch (props.mode) {
      case 'primary':
        return props.theme['@color-bg-primary']
      case 'ghost':
        return '#fff'
      case 'dust':
        return props.theme['@color-bg-grey']
      case 'white':
        return '#fff'
      case 'light-gray':
        return props.theme['@color-bg-grey']
      case 'dark-grey':
        return props.theme['@color-bg-track']
      case 'light-green':
        return props.theme['@color-bg-light-green']
      case 'deep-green':
        return props.theme['@color-bg-finish']
      case 'light-red':
        return props.theme['@color-bg-light-red']
      case 'deep-red':
        return props.theme['@color-bg-error']
      case 'pale-yellow':
        return props.theme['@color-bg-pale-yellow']
      case 'deep-yellow':
        return props.theme['@color-bg-yellow']
      case 'light-blue':
        return props.theme['@color-bg-light-blue']
    }
  }};
  &:hover {
    color: ${(props: SxyButtonType) => {
      switch (props.mode) {
        case 'ghost':
          return props.theme['@color-text-primary-hover']
        case 'white':
          return props.theme['@color-text-primary-hover']
        case 'dark-grey':
          return 'inherit'
      }
    }};
    border-color: ${(props: SxyButtonType) => {
      switch (props.mode) {
        case 'primary':
          return props.theme['@color-border-primary-hover']
        case 'ghost':
          return props.theme['@color-text-primary-hover']
      }
    }};
    background-color: ${(props: SxyButtonType) => {
      switch (props.mode) {
        case 'primary':
          return props.theme['@color-bg-primary-hover']
        case 'dust':
          return props.theme['@color-bg-track']
        case 'light-gray':
          return props.theme['@color-bg-track']
        case 'light-green':
          return props.theme['@color-bg-light-green-hover']
        case 'deep-green':
          return props.theme['@color-bg-finish-hover']
        case 'light-red':
          return props.theme['@color-bg-light-red-hover']
        case 'deep-red':
          return props.theme['@color-bg-error-hover']
        case 'pale-yellow':
          return props.theme['@color-bg-pale-yellow-hover']
        case 'deep-yellow':
          return props.theme['@color-bg-yellow-hover']
        case 'light-blue':
          return props.theme['@color-bg-light-blue-hover']
      }
    }};
  }
  /* 超小 */
  &.tiny {
    padding-left: 10px;
    padding-right: 10px;
  }
  &.btn-white-active-text {
    color: ${(props) => props.theme['@color-text-primary']};
  }
  .anticon {
    font-size: 14px;
    margin-left: 5px;
    &.anticon-close {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 18px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 10px;
      background-color: ${(props: SxyButtonType) =>
        props.theme['@color-bg-thumb']};
      border-radius: 100%;
    }
  }
`

// 图标按钮组
export const SxyButtonIconGroup = styled.div`
  display: flex;
  border-radius: ${(props: SxyButtonType) =>
    props.theme['@border-radius-base']};
  border: 1px solid
    ${(props: SxyButtonType) => props.theme['@color-border-base']};
  overflow: hidden;
  button {
    display: flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 0;
    background-color: #fff;
    border: 0 none;
    border-right: 1px solid
      ${(props: SxyButtonType) => props.theme['@color-border-base']};
    &:hover {
      background-color: ${(props: SxyButtonType) =>
        props.theme['@color-bg-grey']};
    }
    &:last-child {
      border-right: 0;
    }
  }
`
