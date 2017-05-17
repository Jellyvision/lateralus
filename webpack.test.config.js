const path = require('path');
const Webpack = require('webpack');

const { version } = require('./package.json');

const modulePaths = [
  path.join(__dirname, 'node_modules')
];

module.exports = {
  entry: './test/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'index.js',
    library: 'index',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    alias: {
      underscore: path.resolve(__dirname, 'node_modules/lodash-compat/index')
    }
  }
};
