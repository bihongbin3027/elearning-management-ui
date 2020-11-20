import styled from 'styled-components'

export const AdmissionsFormWrapper = styled.div`
  .card-hover {
    &:hover {
      .card-foot-text {
        visibility: hidden;
      }
      .card-foot-button {
        display: block;
      }
    }
  }
`

export const CardContents = styled.div`
  height: 90px;
`

export const CardFooters = styled.div`
  display: none;
  position: absolute;
  width: 100%;
  bottom: 0;
  margin-left: -24px;
  margin-right: -24px;
  padding: 8px;
  z-index: 1;
  background-color: ${(props) => props.theme['@color-bg-grey']};
  border-bottom-left-radius: ${(props) => props.theme['@border-radius-base']};
  border-bottom-right-radius: ${(props) => props.theme['@border-radius-base']};
`
