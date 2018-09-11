const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  entry: {
    main: './dev/index.js',
    vendor: ['react', 'react-dom', 'antd']
  },
  output: {
    filename: 'js/[name]-[chunkhash].js',
    path: path.join(__dirname, "dist")
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env','es2015'],
          plugins: [
            ["transform-class-properties", {"spec": true}]
          ]
        }
      }
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "js/lib/vender.bundle.js"
    }),
    new HtmlWebpackPlugin({
      title: 'hollow',
      filename: 'index.html',
      template: path.join(__dirname, 'dev/templates/index.html'),
      hash: true,
      chunks: ['vendor', 'main'],
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    })
  ]
}