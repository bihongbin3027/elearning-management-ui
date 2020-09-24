import styled from 'styled-components'

export const EditorBox = styled.div`
  border: 1px solid ${(props) => props.theme['@color-border-base']};
  border-radius: ${(props) => props.theme['@border-radius-base']};
  .bf-controlbar {
    box-shadow: inset 0 -1px 0 0 ${(props) => props.theme['@color-border-base']};
  }
`
