const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: {
    static: path.join(__dirname, 'public'),
    hot: true,
    historyApiFallback: true,
    port: 3000,
  },
});
