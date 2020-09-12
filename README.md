#### 项目技术栈描述

1. 项目核心技术使用 react hooks+redux+typescript+react-router-dom 完成开发
2. http 请求二次封装了 axios
3. ui 框架使用 ant.design [官方文档](https://ant.design/index-cn)
4. 安装 yarn 用来代替 npm
5. 在 git 上面拉取代码之前，要在命令行运行 "git config --global core.autocrlf false" 命令
6. 从 git 上面拉取到代码下来以后，使用 yarn 命令安装项目所需模块
7. yarn start 启动本地代码
8. yarn build:stage 打包测试环境
9. yarn build:prod 打包生产环境
10. yarn format 统一美化格式化所有代码

#### Visual Studio Code 插件介绍，开发之前建议安装以下插件

- Bracket Pair Colorizer
  - 匹配代码当中的{}，方便查找有时候写代码漏掉大括号
- Code Spell Checker
  - 会帮你检查出你拼写错误或不规范的单词
- Color Highlight
  - 显示 16 进制 css 颜色
- EditorConfig for VS Code
  - 帮助在不同编辑器或 IDE 之间保持一致的编码格式
- ESLint
  - ESlint 静态分析您的代码以快速发现问题
- Git Emoji Commit
  - 使用 git 提交代码的时候，可以选择你本次提交的功能类型图标
- koroFileHeader
  - 在 vscode 中用于生成文件头部注释和函数注释的插件
  - 函数注释使用 Ctrl + Alt + T 用来给函数设置注释
  - 函数注释使用 Ctrl + Alt + I 用来给文件头设置注释
  - 在 vscode 设置当中加入以下代码
  ```js
    "files.eol": "\n",
    "fileheader.customMade": {
      "Author": "bihongbin",
      "Date": "Do not edit",
      "LastEditors": "bihongbin",
      "LastEditTime": "Do not edit"
    }, // 头部注释
    "fileheader.cursorMode": {
      "Description": "",
      "Author": "bihongbin",
      "Param": "",
      "Return": "",
      "Date": ""
    }, // 函数注释
    "fileheader.configObj": {
      "createHeader": false, // 新建文件自动添加头部注释
      "commitHooks": {
        "allowHooks": false // 默认允许进行hooks，设为false即可关闭
      },
      "autoAdd": false, // 关闭保存自动添加文件注释
      "colon": " " // 所有注释的冒号改为一个空格，默认为": "
    },
  ```
- Prettier - Code formatter
  - 这是一款自动格式化代码的插件，必须安装，来实现多个同事之间代码风格统一
  - 在 vscode 设置当中加入以下代码
  ```js
    "editor.rulers": [80],
    "editor.formatOnSave": true, // 保存自动格式化代码
    "editor.tabSize": 2,
  ```
- React Hooks Snippets
  - react hooks 语法提示
- vscode-styled-components
  - styled-components 开发代码提示

#### 目录结构描述

```
├── public // 公共 index.html 配置
│ ├── index.html // index.html
├── src
│ ├── api // http 请求目录
│ ├── api // http 请求目录
│ ├── assets // 资源模块（图片和图标字体等）
│ ├── components // 公用组件
│ ├── hooks // 自定义 hooks 钩子
│ ├── pages // 视图模块
│ ├── routes // 路由模块
│ ├── config // 全局js环境变量配置
│ ├── store // redux状态管理
│ ├── typings // ts规则
│ ├── utils // 全局工具类方法
│ ├── index.tsx // 渲染根组件
│ ├── react-app-env.d.ts // 声明文件
├── .editorconfig // 编辑器配置
├── .env.development // 开发环境变量配置
├── .env.production // 生产环境变量配置
├── .env.staging // 测试环境变量配置
├── .eslintrc.json // eslint 语法规则配置
├── .gitignore // git 文件忽略
├── .prettierrc.js // prettier 代码格式化配置
├── craco.config // 覆盖webpack配置
├── package.json // nodejs 模块描述文件
├── paths.json // 路径别名
├── tsconfig.json // typescript 语法规则配置
├── README.md // 使用文档
├── yarn.lock // yarn 使用日志
```
