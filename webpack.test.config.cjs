const config = require('./webpack.common');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(config, {
  entry: './test/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'index.js',
    library: 'index',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  mode: 'development',
  devServer: {
    static: './dist',
  }
});
