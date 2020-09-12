const CracoLessPlugin = require('craco-less')
const CracoAlias = require('craco-alias')
const { when } = require('@craco/craco')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') //分析打包后的文件体积
const CompressionWebpackPlugin = require('compression-webpack-plugin') //build生成gizp压缩文件

module.exports = {
  webpack: {
    plugins: [
      ...when(
        Boolean(process.env.ANALYZE),
        () => [new BundleAnalyzerPlugin()],
        [],
      ),
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
        threshold: 1024,
        minRatio: 0.8,
      }),
    ],
  },
  babel: {
    plugins: [['import', { libraryName: 'antd', style: true }]],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@text-color': '#6a717f',
              '@primary-color': '#5860f8',
              '@border-color-base': '#e3e5e6',
              '@border-radius-base': '8px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        aliases: {
          '@': './src', // 设置路径别名
        },
      },
    },
  ],
}
