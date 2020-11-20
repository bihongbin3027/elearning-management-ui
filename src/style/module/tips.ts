import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

type TipsType = 'primary'

interface SxyTipsType extends ThemesDefaultType {
  mode?: TipsType
}

export const SxyTips = styled.div<SxyTipsType>`
  padding: 20px;
  border-radius: ${(props) => props.theme['@border-radius-base']};
  background-color: ${(props) => {
    if (props.mode === 'primary') {
      return '#eff0ff'
    }
    return '#fff'
  }};
  border: ${(props) => {
    if (props.mode === 'primary') {
      return `2px solid #c9cbfd`
    }
  }};
  margin-bottom: 16px;
  .tips-title {
    font-size: 16px;
    color: ${(props) => props.theme['@color-text-primary']};
    margin-bottom: 5px;
  }
  .tips-text {
    color: ${(props) => props.theme['@color-text-primary']};
  }
`
