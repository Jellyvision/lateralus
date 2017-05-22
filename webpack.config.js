const config = require('./webpack.common');
const path = require('path');

module.exports = Object.assign(config, {
  entry: './src/lateralus.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'lateralus.js',
    library: 'lateralus',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: ['backbone', 'lodash-compat', 'jquery', 'mustache']
});
