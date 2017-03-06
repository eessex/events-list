var path = require('path');
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public');
var mainPath = path.resolve(__dirname, 'app', 'index.js');

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-dev-server/client?http://localhost:8080');
    // sources.push('webpack/hot/only-dev-server');
  }
  return sources;
}

const config = {
  devtool: 'cheap-module-source-map',
  entry: {
    index: getEntrySources([
      mainPath,
    ])
  },
  output: {
    filename: 'bundle.js',
    path: buildPath,
    publicPath: '/',
  },
  watch: true,
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.js?$/,
        exclude: [nodeModulesPath],
        loaders: ['babel-loader'] //'react-hot-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Events List'
    }),
    new ExtractTextPlugin('style.css')
  ]
};

module.exports = config;
