import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

export const Items = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  border: 1px solid
    ${(props: ThemesDefaultType) => props.theme['@color-border-base']};
  border-radius: ${(props: ThemesDefaultType) =>
    props.theme['@border-radius-base']};
  text-align: center;
  font-size: 12px;
  cursor: pointer;
  position: relative;
  &:hover {
    border-color: ${(props: ThemesDefaultType) =>
      props.theme['@color-border-primary']};
    .open-enable {
      display: block;
    }
  }
  .file-item-content,
  .ant-checkbox-wrapper {
    padding: 12px;
    .file-img {
      height: 100px;
      img {
        max-height: 100%;
      }
    }
  }
  .file-name {
    margin-top: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .open-enable {
    position: absolute;
    right: 3px;
    top: 0;
    z-index: 1;
    display: none;
    padding: 6px;
    background-color: #fff;
  }
  .ant-checkbox-wrapper {
    display: flex;
    flex: 1;
    height: 100%;
    font-size: inherit;
    align-items: center;
    justify-content: center;
    .ant-checkbox {
      position: absolute;
      right: 5px;
      top: 5px;
      z-index: 1;
      + span {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
`
