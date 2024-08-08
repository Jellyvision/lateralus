const config = require('./webpack.common');
const path = require('path');
const { merge } = require('webpack-merge');


module.exports = merge(config, {
  entry: './src/lateralus.js',
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'lateralus.js',
    library: 'lateralus',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  externals: ['backbone', 'lodash-compat', 'jquery', 'mustache']
});
