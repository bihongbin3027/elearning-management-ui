import styled from 'styled-components'
import { Layout } from 'antd'

export const ContentStyle = styled(Layout)`
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 200px;
  margin-top: 136px;
  margin-bottom: 20px;
  transition: margin-left 0.2s;
  .bread-crumb {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  .site-layout-background {
    min-height: calc(100vh - 156px);
  }
`
