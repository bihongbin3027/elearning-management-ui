import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

interface SxyIconType extends ThemesDefaultType {
  width: number
  height: number
  name: string
  radius?: number
}

export const SxyIcon = styled.i<SxyIconType>`
  display: inline-block;
  width: ${(props: SxyIconType) => `${props.width}px`};
  height: ${(props: SxyIconType) => `${props.height}px`};
  background-image: ${(props: SxyIconType) =>
    'url(' + require(`../../assets/icon/${props.name}`) + ')'};
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: contain;
  border-radius: ${(props: SxyIconType) =>
    props.radius ? `${props.radius}px` : ''};
  vertical-align: middle;
`
