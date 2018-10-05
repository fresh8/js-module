const path = require('path');
const webpack = require('webpack');
const projectRoot = path.resolve(__dirname, '../');
const entry = path.join(projectRoot, './src/browser.js');
const cloneDeep = require('lodash.clonedeep');
const baseWebpackConfig = require('./webpack.conf');
const webpackConfig = cloneDeep(baseWebpackConfig);

webpackConfig.entry = [entry];
webpackConfig.output.filename = 'browser.js';
delete webpackConfig.output.library;

const minimized = cloneDeep(webpackConfig);

minimized.plugins.push(new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }));
minimized.output.filename = 'browser.min.js';

module.exports = { default: webpackConfig, minimized };
