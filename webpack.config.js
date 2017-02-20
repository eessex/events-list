var path = require('path');
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
    root = 'static/tmp'
  } else {
    root = 'static'
  }
  return root
}

module.exports = {
  entry: {
    index: getEntrySources([
      './app/index.js',
    ])
  },
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, getPath())
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
        exclude: /node_modules/,
        loaders: ['react-hot-loader', 'babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css')
  ]
};

resolveLoader: { root: path.join(__dirname, "node_modules") }
