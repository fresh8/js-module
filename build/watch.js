const webpack = require('webpack');
const webpackConfig = require('./webpack.conf');
const handleOutPut = require('./util');
const webpackBrowserConfig = require('./webpack.browser.conf');

webpack(webpackConfig, handleOutPut);
webpack(webpackBrowserConfig.default, handleOutPut);
webpack(webpackBrowserConfig.minimized, handleOutPut);
