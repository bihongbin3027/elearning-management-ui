import styled from 'styled-components'

export const SxyTips = styled.div`
  padding: 20px;
  border-radius: ${(props) => props.theme['@border-radius-base']};
  background-color: #fff;
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
