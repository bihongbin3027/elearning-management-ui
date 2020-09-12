import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

export const SxyHandleBtn = styled.button`
  width: 30px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0 none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props: ThemesDefaultType) =>
    props.theme['@color-bg-grey']};
  &:hover {
    background-color: ${(props: ThemesDefaultType) =>
      props.theme['@color-bg-track']};
  }
`
