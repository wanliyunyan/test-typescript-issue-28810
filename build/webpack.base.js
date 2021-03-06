const path = require('path');
const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const env = process.argv.slice(-1)[0];



module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
        include: [path.join(__dirname, '../src')],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          env === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              namedExport: true,
              camelCase: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /src/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(pdf|png|jpe?g|gif|eot|otf|ttf|woff|woff2)$/,
        loader:
          'url-loader?limit=8192&name=[hash:8].[name].[ext]&outputPath=assets/images/&publicPath=assets/images',
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[name].[chunkhash:8].css',
    }),
    new HtmlWebpackPlugin({
      title: '银税服务平台',
      favicon: 'src/favicon.ico',
      template: 'src/index.ejs',
      filename: 'index.html',
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    alias: {
      src: path.resolve(__dirname, '../src/'),
    },
  },
};
