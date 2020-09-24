import styled from 'styled-components'
import { ThemesDefaultType } from '@/style/theme'

export const FilePreview = styled.div`
  .preview-header {
    position: relative;
    .preview-close-icon {
      position: absolute;
      right: 12px;
      top: 12px;
      z-index: 11;
      font-size: 0;
      cursor: pointer;
      text-indent: -9999px;
    }
  }
  .preview-detail-img {
    &:hover {
      .preview-nav {
        .file-nav-icon {
          opacity: 1;
          &.prev-nav-icon {
            left: 40px;
          }
          &.next-nav-icon {
            right: 40px;
          }
        }
      }
    }
  }
  .preview-content {
    text-align: center;
    padding: 20px;
    .preview-detail-img {
      display: flex;
      min-height: 500px;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .preview-file-name {
      font-weight: bold;
      font-size: 18px;
      margin-top: 12px;
    }
    .preview-file-us {
      color: ${(props: ThemesDefaultType) =>
        props.theme['@color-text-description']};
      margin-top: 10px;
      .preview-file-size {
        margin-left: 12px;
      }
    }
  }
  .preview-nav {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    .preview-left,
    .preview-right {
      width: 20%;
      height: 70%;
      position: absolute;
      top: 15%;
      z-index: 10;
      outline: 0;
      cursor: pointer;
      &:hover {
        .file-nav-icon {
          background-color: rgba(207, 210, 255, 1);
        }
      }
      .file-nav-icon {
        position: absolute;
        top: 50%;
        margin-top: -20px;
        z-index: 1;
        background-color: rgba(207, 210, 255, 0.4);
        border-radius: 100%;
        font-size: 0;
        text-indent: -9999px;
        transition: all 0.5s ease-out;
        opacity: 0;
        &.prev-nav-icon {
          left: -20px;
        }
        &.next-nav-icon {
          right: -20px;
        }
      }
    }
    .preview-left {
      left: 0;
    }
    .preview-right {
      right: 0;
    }
  }
  .preview-file-foot {
    margin-top: 15px;
  }
`
