const path = require('path')
const autoprefixer = require('autoprefixer')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const uglify = require('uglifyjs-webpack-plugin')

const isProductionMode = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  devtool: isProductionMode ? 'none' : 'source-map',
  optimization: {
    minimize: false,
  },
  entry: {
    index: path.resolve(__dirname, 'src/js/index.js'),
    detail: path.resolve(__dirname, 'src/js/detail.js'),
    collections: path.resolve(__dirname, 'src/js/collections.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
        query: {
          presets: ['latest'],
          plugins: [
            [
              'babel-plugin-transform-runtime',
              {
                absoluteRuntime: false,
                corejs: true,
                helpers: true,
                useESModules: false,
              },
            ],
          ],
        },
      },
      {
        test: /\.tpl$/,
        loader: 'ejs-loader',
        options: {
          variable: 'data',
          esModule: false
        }
      },
      {
        test: /\.css$/,
        use: [
          isProductionMode ? miniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer('last 5 versions')]
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isProductionMode ? miniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [autoprefixer('last 5 versions')]
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit:1024 * 8, // 8k
              name:"img/[name]-[hash:16].[ext]",
              esModule: false,
            }
          },
          'image-webpack-loader',
        ],
      },
      {
        // ????????????: font??????
        test: /\.(woff|woff2|eot|ttf)$/i,
        loader: 'url-loader',
        options: {
          name:"font/[name].[ext]",
        }
      },
    ],
  },
  plugins: [
    new uglify(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/index.html'),
      title: '????????????',
      chunks: ['index'],
      chunksSortMode: 'manual',
      excludeChunks: ['node_modules'],
      hash: true,
      minify: {
        removeComments: true, // ????????????
        collapseWhitespace: true, // ?????????????????????
      },
    }),
    new htmlWebpackPlugin({
      filename: 'detail.html',
      template: path.resolve(__dirname, 'src/detail.html'),
      title: '??????-??????',
      chunks: ['detail'],
      chunksSortMode: 'manual',
      excludeChunks: ['node_modules'],
      hash: true,
      minify: {
        removeComments: true, // ????????????
        collapseWhitespace: true, // ????????????/??????
      },
    }),
    new htmlWebpackPlugin({
      filename: 'collections.html',
      template: path.resolve(__dirname, 'src/collections.html'),
      title: '??????-??????',
      chunks: ['collections'],
      chunksSortMode: 'manual',
      excludeChunks: ['node_modules'],
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new miniCssExtractPlugin({
      filename: isProductionMode
        ? 'css/[name]-[hash:16].css'
        : 'css/[name].css',
    }),
  ],
  // ??????webpack???????????????
  devServer: {
    // inline: false,
    watchOptions: {
      ignored: /node_modules/,
    },
    open: true,
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://v.juhe.cn/toutiao',
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
}
