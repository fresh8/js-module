const path = require('path');
const webpack = require('webpack');
const projectRoot = path.resolve(__dirname, '../');
const entry = path.join(projectRoot, './src/index.js');

module.exports = {
  entry: [entry],
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: './',
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'Fresh8'
  },
  resolve: {
    extensions: ['', '.js'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: { 'src': path.resolve(__dirname, '../src') }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise'
    })
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter'),
    fix: true
  }
};
