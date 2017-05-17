const path = require('path');
const Webpack = require('webpack');

const { version } = require('./package.json');

const modulePaths = [
  path.join(__dirname, 'node_modules')
];

module.exports = {
  entry: './scripts/lateralus.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'lateralus.js',
    library: 'lateralus',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  externals: ['backbone', 'underscore', 'jquery', 'mustache'],
  resolve: {
    modules: [
      'node_modules'
    ]
  }
};
