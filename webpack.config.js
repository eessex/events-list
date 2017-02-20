var path = require('path');
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'public', 'build');
var mainPath = path.resolve(__dirname, 'app', 'index.js');

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-dev-server/client?http://localhost:8080');
    sources.push('webpack/hot/only-dev-server');
  }

  return sources;
}

function getPath() {
  let root;
  if (process.env.NODE_ENV !== 'production') {
    root = 'public/build'
  } else {
    root = 'public'
  }
  return root
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
    publicPath: '/public/',
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
        loaders: ['react-hot-loader', 'babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css')
  ]
};

module.exports = config;

resolveLoader: { root: path.join(__dirname, "node_modules") }
