const webpack = require('webpack');
const webpackConfig = require('./webpack.conf');
const webpackBrowserConfig = require('./webpack.browser.conf');
const handleOutPut = require('./util');

webpack(webpackConfig, handleOutPut);
webpack(webpackBrowserConfig.default, handleOutPut);
webpack(webpackBrowserConfig.minimized, handleOutPut);
