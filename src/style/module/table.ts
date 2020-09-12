import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

export const SxyTable = styled.table`
  width: 100%;
  text-align: left;
  border-radius: ${(props: ThemesDefaultType) =>
    props.theme['@border-radius-base']};
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid
    ${(props: ThemesDefaultType) => props.theme['@color-border-base']};
  thead {
    tr {
      th,
      td {
        padding: 12px;
        color: inherit;
        font-weight: 500;
        text-align: left;
        border-bottom: 1px solid
          ${(props: ThemesDefaultType) => props.theme['@color-border-base']};
        -webkit-transition: background 0.3s ease;
        transition: background 0.3s ease;
      }
    }
  }
  tbody {
    tr {
      &:last-child {
        td {
          border-bottom: 0 none;
        }
      }
      td {
        padding: 12px;
        border-bottom: 1px solid
          ${(props: ThemesDefaultType) => props.theme['@color-border-base']};
        -webkit-transition: background 0.3s;
        transition: background 0.3s;
      }
    }
  }
`
