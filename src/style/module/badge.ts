import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

interface SxyBadgeType extends ThemesDefaultType {
  size?: number
  bg: string
}

export const SxyBadge = styled.i`
  display: inline-block;
  width: ${(props: SxyBadgeType) => (props.size ? `${props.size}px` : '10px')};
  height: ${(props: SxyBadgeType) => (props.size ? `${props.size}px` : '10px')};
  background-color: ${(props) => props.bg};
  border-radius: 2px;
`
