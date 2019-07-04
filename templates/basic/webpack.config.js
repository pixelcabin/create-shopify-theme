const webpack = require('webpack');
const path = require('path');

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    app: './src/js/app.js'
  },
  output: {
    path: path.resolve(__dirname, './shop/assets/'),
    filename: '[name].min.js'
  },
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components|libs)/,
        use: [
          'babel-loader',
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
              failOnWarning: true
            }
          }
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'js/utils/flags/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  externals: {},
  plugins: []
};
