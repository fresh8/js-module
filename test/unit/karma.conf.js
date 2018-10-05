// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

// const path = require('path');
// const merge = require('webpack-merge');
// const baseConfig = require('../../build/webpack.conf');
// const projectRoot = path.resolve(__dirname, '../../');
// const webpackConfig = merge(baseConfig, { devtool: '#inline-source-map' });

// // no need for app entry during tests
// delete webpackConfig.entry;
// // Update the target to be var
// webpackConfig.output.libraryTarget = 'var';
//
// // make sure isparta loader is applied before eslint
// webpackConfig.module.preLoaders = webpackConfig.module.preLoaders || [];
// webpackConfig.module.preLoaders.unshift({
//   test: /\.js$/,
//   loader: 'isparta',
//   include: projectRoot,
//   exclude: /test\/unit|node_modules/
// });
//
// // only apply babel for test files when using isparta
// webpackConfig.module.loaders.some(function (loader, i) {
//   if (loader.loader === 'babel') {
//     loader.include = /test\/unit/;
//     return true;
//   }
// });


const reporters = [process.env.KARMA_REPORTER || 'spec', 'coverage'];

module.exports = function (config) {
  config.set(
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    {
      browsers: ['PhantomJS'],
      frameworks: ['mocha', 'sinon-chai'],
      reporters: reporters,
      files: [
        {
          pattern: 'specs/**/*.spec.js'
        }
      ],
      preprocessors: { 'specs/**/*.spec.js': ['rollup'] },
      rollupPreprocessor: {
        /**
         * This is just a normal Rollup config object,
         * except that `input` is handled for you.
         */
        plugins: [require('rollup-plugin-buble')(), require('rollup-plugin-commonjs')()],
        output: {
          format: 'iife',            // Helps prevent naming collisions.
          name: 'jsmodule',    // Required for 'iife' format.
          sourcemap: 'inline'        // Sensible for testing.
        }
      },
      client: { mocha: { timeout: '5000' } },
      specReporter: { },
      coverageReporter:
      { dir: '../coverage',
        reporters: [
          { type: 'lcov', subdir: '.' },
          { type: 'text', subdir: '.', file: 'coverage.txt' },
          { type: 'text-summary' }
        ],
        check: {
          global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
          },
          each: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
          }
        }
      }
    });
};
