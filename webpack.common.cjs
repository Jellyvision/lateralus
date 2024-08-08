const path = require('path');
const webpack = require('webpack');

module.exports = {
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
  },
  plugins: [
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        '$': 'jquery',
        'window.jQuery': 'jquery',
    }),
  ]
};
