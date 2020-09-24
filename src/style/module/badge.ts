import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

interface SxyBadgeType extends ThemesDefaultType {
  size?: number
  bg: string
  radius?: number
}

export const SxyBadge = styled.i`
  display: inline-flex;
  width: ${(props: SxyBadgeType) => (props.size ? `${props.size}px` : '10px')};
  height: ${(props: SxyBadgeType) => (props.size ? `${props.size}px` : '10px')};
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.bg};
  border-radius: ${(props: SxyBadgeType) =>
    props.radius ? `${props.radius}px` : '2px'};
`
