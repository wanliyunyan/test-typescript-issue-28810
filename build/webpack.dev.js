/*
 * @ author wanliyunyan
 * @ github  https://github.com/wanliyunyan
 * @ use 开发环境webpack构建
 */
// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const commonConfig = require('./webpack.base.js');

function getIPAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === 'IPv4'
        && alias.address !== '127.0.0.1'
        && !alias.internal
      ) {
        return alias.address;
      }
    }
  }
}

module.exports = function (env) {
  return merge(commonConfig, {
    mode: env,
    cache: true,
    devtool: 'cheap-module-eval-source-map',
    entry: {
      bundle: './src/index.tsx',
    },
    output: {
      filename: 'assets/js/[name].js',
      sourceMapFilename: '[name].map',
    },
    devServer: {
      historyApiFallback: true,
      noInfo: false,
      hot: true,
      // open: true,
      stats: 'normal',
      contentBase: './src/',
      compress: true,
      // host: getIPAddress(),
      port: 8003,
      proxy: [
        {
          context: ['/api/v1', '/pdfs', '/images'],
          target: 'http://10.23.13.207:8001',
          // target: 'http://10.99.1.72:9001', // wangweisuo
          // target: 'http://10.99.1.49:9000', // cuimingliang
          // target: 'http://10.99.1.124:9000', // gaohongliang
          // target: 'http://10.99.1.95:80', // panchunyang
          secure: false,
          changeOrigin: true,
        },
      ],
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 3000,
          proxy: 'http://localhost:8003/',
        },
        {
          reload: false,
        },
      ),
    ],
  });
};
