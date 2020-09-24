import { createGlobalStyle } from 'styled-components'
import { ThemesDefault } from '@/style/theme'

const confirmModalIcon = require('../assets/icon/popup_abnorma.png')

export const GlobalStyle = createGlobalStyle`

  img {
    max-width: 100%;
  }

  ul, ol {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }

  /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
  ::-webkit-scrollbar
  {
    width: 5px;
    height: 5px;
  }

  /* 滚动条里面的轨道 */
  ::-webkit-scrollbar-track
  {
    border-radius: ${ThemesDefault['@border-radius-base']};
    background-color: ${ThemesDefault['@color-bg-track']};
  }

  /* 滚动条中的滚动块 */
  ::-webkit-scrollbar-thumb
  {
    border-radius: ${ThemesDefault['@border-radius-base']};
    background: rgba(135, 141, 153, 0.5);
  }

  /* 滚动条hover样式 */
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(135, 141, 153, 1);
  }

  .ml-1  {
    margin-left: 0.25rem !important;
  }

  .ml-2 {
    margin-left: 0.5rem !important;
  }

  .ml-3 {
    margin-left: 0.75rem !important;
  }

  .ml-4 {
    margin-left: 1rem !important;
  }

  .ml-5 {
    margin-left: 1.25rem !important;
  }

  .ml-6  {
    margin-left: 1.5rem !important;
  }

  .ml-7 {
    margin-left: 1.75rem !important;
  }

  .ml-8 {
    margin-left: 2rem !important;
  }

  .ml-9 {
    margin-left: 2.25rem !important;
  }

  .ml-10 {
    margin-left: 2.5rem !important;
  }

  .mr-1  {
    margin-right: 0.25rem !important;
  }

  .mr-2 {
    margin-right: 0.5rem !important;
  }

  .mr-3 {
    margin-right: 0.75rem !important;
  }

  .mr-4 {
    margin-right: 1rem !important;
  }

  .mr-5 {
    margin-right: 1.25rem !important;
  }

  .mr-6  {
    margin-right: 1.5rem !important;
  }

  .mr-7 {
    margin-right: 1.75rem !important;
  }

  .mr-8 {
    margin-right: 2rem !important;
  }

  .mr-9 {
    margin-right: 2.25rem !important;
  }

  .mr-10 {
    margin-right: 2.5rem !important;
  }

  .mt-1  {
    margin-top: 0.25rem !important;
  }

  .mt-2 {
    margin-top: 0.5rem !important;
  }

  .mt-3 {
    margin-top: 0.75rem !important;
  }

  .mt-4 {
    margin-top: 1rem !important;
  }

  .mt-5 {
    margin-top: 1.25rem !important;
  }

  .mt-6  {
    margin-top: 1.5rem !important;
  }

  .mt-7 {
    margin-top: 1.75rem !important;
  }

  .mt-8 {
    margin-top: 2rem !important;
  }

  .mt-9 {
    margin-top: 2.25rem !important;
  }

  .mt-10 {
    margin-top: 2.5rem !important;
  }

  .mb-1  {
    margin-bottom: 0.25rem !important;
  }

  .mb-2 {
    margin-bottom: 0.5rem !important;
  }

  .mb-3 {
    margin-bottom: 0.75rem !important;
  }

  .mb-4 {
    margin-bottom: 1rem !important;
  }

  .mb-5 {
    margin-bottom: 1.25rem !important;
  }

  .mb-6  {
    margin-bottom: 1.5rem !important;
  }

  .mb-7 {
    margin-bottom: 1.75rem !important;
  }

  .mb-8 {
    margin-bottom: 2rem !important;
  }

  .mb-9 {
    margin-bottom: 2.25rem !important;
  }

  .mb-10 {
    margin-bottom: 2.5rem !important;
  }

  /* 普通文本hover变主题色 */
  .link-text-hover {
    cursor: pointer;
    color: ${ThemesDefault['@color-text']};
    &:hover {
      color: ${ThemesDefault['@color-text-primary-hover']};
    }
  }

  /* 文本超出显示省略号 */
  .text-overstep-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .text-desc {
    color: ${ThemesDefault['@color-text-description']};
  }

  .font-12 {
    font-size: 12px;
  }

  .font-14 {
    font-size: 14px;
  }

  .font-16 {
    font-size: 16px;
  }

  .bold {
    font-weight: 600;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .align-middle {
    vertical-align: middle;
  }

  /* 手形 */
  .pointer {
    cursor: pointer;
    position: relative;
  }

  /* 文字hover显示图标 */
  .text-icon-hover {
    &:hover {
      .anticon {
        display: inline-block;
      }
    }
    .anticon {
      display: none;
      margin-top: 4px;
      vertical-align: top;
      color: ${ThemesDefault['@color-text-primary']};
    }
  }

  /* 卡片 */
  .ant-card {
    &.card-body-small {
      .ant-card-body {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    &.table-card {
      .ant-card-body {
        padding-top: 1px;
        padding-bottom: 0;
      }
    }
    /* 隐藏表格头部 */
    &.table-header-hidden {
      .ant-table {
        .ant-table-content {
          .ant-table-thead {
            display: none;
          }
        }
      }
    }
    /* 隐藏卡片头部 */
    &.card-header-none {
      .ant-card-head {
        display: none;
      }
    }
    /* 深灰色卡片 */
    &.theme-grey {
      .card-header {
        display: flex;
        height: 40px;
        padding-left: 20px;
        padding-right: 20px;
        align-items: center;
        background-color: ${ThemesDefault['@color-bg-dark-grey']};
      }
      .card-body {
        background-color: ${ThemesDefault['@color-bg-grey']};
        textarea {
          border: 0 none;
          background-color: ${ThemesDefault['@color-bg-grey']};
          &:focus {
            box-shadow: none;
          }
        }
      }
    }
    &.card-header-tabs {
      border-radius: 0;
      margin-left: -20px;
      margin-right: -20px;
      .ant-card-body {
        height: 50px;
        padding: 0 20px;
        .ant-tabs {
          .ant-tabs-nav {
            margin-bottom: 0;
            .ant-tabs-tab {
              font-size: 16px;
              padding-top: 11px;
              padding-bottom: 14px;
              &.ant-tabs-tab-active {
                .ant-tabs-tab-btn {
                  color: inherit;
                }
              }
              .ant-tabs-tab-btn {
                color: ${ThemesDefault['@color-text-normal']};
              }
            }
          }
        }
      }
    }
    /* 隐藏卡片头底部边框 */
    &.card-head-border-none {
      .ant-card-head {
        border-bottom: 0 none;
      }
    }
    /* 卡片里面的警告提示 */
    .sxy-alert-box {
      border-bottom: 1px solid ${ThemesDefault['@color-border-base']};
      margin-left: -24px;
      margin-right: -24px;
    }
    /* 隐藏卡片标题是select的左内边距 */
    .ant-card-head {
      position: relative;
      .ant-card-head-title {
        overflow: visible;
        .ant-select {
          .ant-select-selector {
            padding-left: 0;
          }
        }
      }
    }
  }

  /* 分割线 */
  .ant-divider {
    &.ant-divider-vertical {
      border-left: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  /* 描述列表 */
  .card-descriptions {
    &.card-desc-center {
      .ant-descriptions-item-label {
        text-align: center;
      }
    }
    &.card-desc-average {
      .ant-descriptions-row {
        .ant-descriptions-item-label {
          width: 33.3%;
        }
      }
    }
  }

  /* 折叠面板 */
  .ant-collapse {
    &.collapse-text-primary {
      .ant-collapse-header {
        color: ${ThemesDefault['@color-text-primary']};
      }
    }
  }


  /* 标签页 */
  .ant-tag {
    border-radius: 4px;
    vertical-align: middle;
    &.tag-blue {
      color: ${ThemesDefault['@color-text-primary']};
      border: 0 none;
      background-color: #eff0ff;
    }
  }

  /* 表单 */
  .ant-form {
    /* 无边框白底表单 */
    &.search-form {
      .ant-select .ant-select-selector,
      .ant-picker,
      .ant-input {
        border-color: transparent;
      }
      .ant-select {
        &.ant-select-disabled {
          .ant-select-selector {
            background-color: ${ThemesDefault['@color-bg-disabled']};
          }
        }
      }
      .ant-btn {
        border-color: #fff;
        &.ant-btn-primary {
          border-color: ${ThemesDefault['@color-border-primary']};
          &:hover,
          &:focus {
            border-color: ${ThemesDefault['@color-border-primary-hover']};
          }
        }
      }
      .ant-form-item {
        margin-bottom: 16px;
      }
    }
    /* 大号表单显示14px字体 */
    &.form-large-font14 {
      .ant-input-lg,
      .ant-select-lg,
      .ant-btn-lg,
      .ant-picker-large .ant-picker-input > input {
        font-size: 14px;
        &.font-12 {
          font-size: 12px;
        }
      }
    }
    /* 灰色背景的表单 */
    &.form-ash-theme {
      .ant-form-item-control {
        .ant-input,
        .ant-select-selector,
        .ant-picker,
        .ant-input-affix-wrapper,
        .ant-input-group-wrapper .ant-input-group-addon {
          border-color: ${ThemesDefault['@color-border-grey']};
          background-color: ${ThemesDefault['@color-bg-grey']};
        }
        .ant-input-affix-wrapper {
          padding-top: 0;
          padding-bottom: 0;
          .ant-input {
            box-shadow: none !important;
            border: 0 none;
            &.ant-input-lg {
              height: 38px;
            }
          }
        }
      }
    }
    /* 表单focus */
    .ant-form-item-control {
      .ant-select.ant-select-focused .ant-select-selector,
      .ant-picker.ant-picker-focused,
      .ant-input:focus,
      .ant-input-affix-wrapper.ant-input-affix-wrapper-focused {
        border-color: ${ThemesDefault['@color-border-primary']};
        box-shadow: 0 0 0 2px rgba(88, 96, 248, 0.2);
      }
    }
    /* 表单验证错误提示和focus */
    .ant-form-item-has-error {
      .ant-form-item-control {
        .ant-input,
        .ant-select-selector,
        .ant-picker,
        .ant-input-affix-wrapper {
          border-color: ${ThemesDefault['@color-text-error']};
        }
        .ant-select.ant-select-focused .ant-select-selector,
        .ant-picker.ant-picker-focused,
        .ant-input:focus,
        .ant-input-affix-wrapper.ant-input-affix-wrapper-focused {
          box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
        }
      }
    }
    /* 去掉表单最后一列的下边距 */
    &.form-margin-bottom-none {
      margin-bottom: -20px;
    }
    /* 搜索的input */
    .search-input {
      width: 240px;
      height: 30px;
      .anticon-search {
        color: ${ThemesDefault['@color-text-description']}
      }
    }
    /* 表单分隔符 */
    .form-item-divide {
      .ant-form-item {
        margin-bottom: 0;
      }
      .divide {
        position: absolute;
        right: -5px;
        top: 5px;
        color: ${ThemesDefault['@color-text-description']};
        z-index: 1;
      }
    }
    /* ant-picker宽度显示100% */
    .ant-row {
      .ant-col {
        &.ant-form-item-label {
          padding-bottom: 0;
        }
        .ant-picker {
          width: 100%;
        }
      }
    }
    .ant-input-affix-wrapper-lg {
      font-size: 14px;
    }
    .ant-input-lg,
    .ant-picker-large {
      height: 40px;
    }
    /* 隐藏input去掉高度 */
    .hide-item {
      + * {
        margin-top: -8px;
      }
      .ant-form-item-control-input {
        display: none;
      }
    }
    /* 表单下边距 */
    &.form-item-mb-small {
      .ant-form-item {
        margin-bottom: 10px;
      }
    }
    &.form-item-label-des {
      .ant-form-item-label label {
        color: ${ThemesDefault['@color-text']};
      }
    }
    /* 隐藏*号 */
    .hide-star {
      .ant-form-item-label {
        .ant-form-item-required {
          &:before {
            display: none;
          }
        }
      }
    }
    /* 自定义宽度 */
    .ant-input {
      &.w140 {
        width: 140px;
      }
    }
    /* .ant-form-item-label {
      > label {
        vertical-align: top;
      }
    }
    .ant-select {
      .ant-select-clear {
        .anticon {
          vertical-align: middle;
        }
      }
    }
    .ant-picker {
      .ant-picker-range-separator,
      .ant-picker-suffix {
        .anticon {
          vertical-align: middle;
        }
      }
    } */
  }

  /* 表格 */
  .ant-table-wrapper {
    /* 浅黑色表头 */
    &.table-header-blank {
      .ant-table-thead {
        tr {
          th, td {
            background-color: #ced1d7;
            &:first-child {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
            &:last-child {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          }
        }
      }
    }
    /* 灰色表头 */
    &.table-header-grey {
      .ant-table-thead {
        tr {
          th, td {
            background-color: ${ThemesDefault['@color-bg-grey']};
            &:first-child {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }
            &:last-child {
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            }
          }
        }
      }
    }
    /* 边框表格 */
    &.table-border-single {
      padding: 0 10px;
      border: 1px solid ${ThemesDefault['@color-border-base']};
      border-radius: ${ThemesDefault['@border-radius-base']};
      .ant-table-thead th {
        padding-top: 15px;
        padding-bottom: 15px;
      }
    }
    .ant-table-thead {
      th {
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: #fff;
      }
    }
    .ant-table-thead {
      > tr > td,
      > tr > th {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .ant-table-tbody {
      > tr > td {
        padding: 12px;
      }
      .btn-operate {
        width: 26px;
        height: 26px;
      }
    }
    .ant-table-pagination {
      &.ant-pagination {
        padding-top: 20px;
        padding-bottom: 20px;
      }
    }
    .react-resizable {
      position: relative;
      background-clip: padding-box;
    }
    .react-resizable-handle {
      position: absolute;
      width: 10px;
      height: 100%;
      bottom: 0;
      right: -5px;
      cursor: col-resize;
      z-index: 1;
    }
  }
  /* 带边框的搜索表单 */
  .form-solid-line {
    .ant-form {
      &.search-form {
        .ant-select .ant-select-selector,
        .ant-picker,
        .ant-input {
          border-color: ${ThemesDefault['@color-border-base']};
          &:focus {
            border-color: ${ThemesDefault['@color-border-primary']};
          }
        }
      }
      .btn-reset {
        background-color: ${ThemesDefault['@color-bg-track']};
        border-color: ${ThemesDefault['@color-bg-track']};
      }
    }
  }

  /* 弹出框 */
  .ant-modal {
    top: 66px;
    /* confirm类型 */
    &.confirm-modal {
      .ant-modal-content {
        .ant-modal-body {
          padding-top: 40px;
          padding-bottom: 40px;
          .ant-modal-confirm-body {
            text-align: center;
            > .anticon {
              float: none;
              width: 60px;
              height: 60px;
              margin-right: 0;
              background-image: ${() => 'url(' + confirmModalIcon + ')'};
              background-repeat: no-repeat;
              background-position: 0 0;
              background-size: contain;
              svg {
                display: none;
              }
            }
            .ant-modal-confirm-title {
              margin-top: 16px;
            }
            .ant-modal-confirm-content {
              margin-left: 0;
            }
          }
          .ant-modal-confirm-btns {
            float: none;
            margin-top: 20px;
            text-align: center;
          }
        }
      }
    }
    .ant-modal-content {
      .ant-modal-close {
        .ant-modal-close-x {
          .anticon {
            background-color: ${ThemesDefault['@color-bg-thumb']};
            border-radius: 100%;
            padding: 5px;
            font-size: 10px;
            color: #fff;
            &:hover {
              background-color: rgba(135, 141, 153, 0.8);
            }
          }
        }
      }
      .ant-modal-header {
        border-bottom: 0 none;
        padding-bottom: 0;
        .ant-modal-title {
          text-align: center;
          margin-top: 10px;
        }
      }
      .ant-modal-body {
        padding-left: 30px;
        padding-right: 30px;
        .modal-form-height {
          max-height: 580px;
          padding-right: 5px;
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
      /* 弹窗表单下间距 */
      .ant-form {
        &.form-questions-vertical {
          .ant-row {
            &.ant-form-item {
              margin-bottom: 25px;
            }
          }
          .item-label-right {
            position: relative;
            >.ant-space {
              position: absolute;
              left: 50%;
              top: 9px;
              z-index: 1;
              margin-left: -115px;
            }
          }
          .questions-list {
            margin-bottom: 25px;
            .ant-form-item {
              margin-bottom: 10px;
              .ant-form-item-label > label::after {
                display: none;
              }
            }
          }
        }
        /* 弹窗表单下边距（大） */
        &.form-large-margin {
          .ant-row {
            &.ant-form-item {
              margin-bottom: 20px;
            }
          }
        }
        /* 弹窗表单下边距（默认小） */
        .ant-row {
          &.ant-form-item {
            margin-bottom: 8px;
          }
        }
      }
      /* 头像选中 */
      .avatar-selected {
        border: 2px solid #fff;
        border-radius: ${ThemesDefault['@border-radius-base']};
        cursor: pointer;
        overflow: hidden;
        &.avatar-selected-bg {
          border-color: ${ThemesDefault['@color-border-primary']};
        }
      }
      /* 隐藏card */
      .card-disappear {
        .ant-card{
          border: 0 none;
          .ant-card-body {
            padding-left: 0;
            padding-right: 0;
          }
        }
      }
    }
  }

  /* 标签 */
  .ant-tag {
    &.tag-size-middle {
      line-height: 28px;
      font-size: 14px;
    }
    &.tag-info {
      color: #fff;
      border: 1px solid ${ThemesDefault['@color-border-primary']};
      background-color: ${ThemesDefault['@color-bg-primary']};
    }
    &.tag-warning {
      color: #fff;
      border: 1px solid ${ThemesDefault['@color-border-warning']};
      background-color: ${ThemesDefault['@color-bg-warning']};
    }
    &.tag-finish {
      color: #fff;
      border: 1px solid ${ThemesDefault['@color-border-finish']};
      background-color: ${ThemesDefault['@color-bg-finish']};
    }
  }

  /* 复选框 */
  .ant-checkbox-wrapper {
    .ant-checkbox-inner {
      border-radius: 2px;
    }
  }

  /* 按钮 */
  .ant-btn {
    &.button-color-normal {
      color: inherit;
    }
    /* 文本按钮 */
    &.is-btn-link {
      height: auto;
      padding: 0;
      border: 0 none;
    }
    /* 文本按钮图标 */
    &.btn-text-icon {
      display: inline-flex;
      align-items: center;
      i {
        margin-right: 8px;
      }
    }
  }
  /* 自定义button */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 0 none;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 8px;
    transition: all 0.3s ease-out;
    font-size: 14px;
    cursor: pointer;
    outline: none;
    &.btn-default {
      height: 30px;
    }
    &.btn-large {
      font-size: 16px;
      height: 40px;
    }
    &.btn-blue {
      color: ${ThemesDefault['@color-text-primary']};
      background-color: ${ThemesDefault['@color-bg-light-blue']};
      &:hover {
        background-color: ${ThemesDefault['@color-bg-light-blue-hover']};
      }
      &.btn-round {
        width: 24px;
        height: 24px;
        border-radius: 100%;
        border: 1px solid ${ThemesDefault['@color-border-primary']};
      }
    }
    &.btn-green {
      color: ${ThemesDefault['@color-text-finish']};
      background-color: ${ThemesDefault['@color-bg-light-green']};
      &:hover {
        background-color: ${ThemesDefault['@color-bg-light-green-hover']};
      }
    }
  }

  /* 树 */
  .ant-tree {
    .ant-tree-checkbox-inner,
    .ant-tree-node-content-wrapper {
      border-radius: 2px;
    }
    .tree-handle-box {
      visibility: hidden;
    }
    .ant-tree-node-content-wrapper {
      &:hover {
        .tree-handle-box {
          visibility: visible;
        }
      }
    }
  }

  /* 有的复选框按钮 */
  .sxy-checkbox-button {
    display: block;
    position: relative;
    .ant-checkbox {
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -8px;
      margin-left: -8px;
      z-index: 1;
      + span {
        display: block;
        height: 40px;
        line-height: 40px;
        background-color: ${ThemesDefault['@color-bg-grey']};
        border-radius: ${ThemesDefault['@border-radius-base']};
        text-align: center;
        &:hover {
          background-color: ${ThemesDefault['@color-bg-track']};
        }
      }
    }
  }

  /* 警告提示 */
  .sxy-alert-box {
    padding: 10px 24px;
    background: rgba(88, 96, 248, 0.05);
  }
`
