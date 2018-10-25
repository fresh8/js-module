import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import inject from 'rollup-plugin-inject';

export default [
  // browser-friendly UMD build
  {
    input: 'src/browser.js',
    output: {
      name: 'js-module',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
    moduleContext: {
      [require.resolve('whatwg-fetch')]: 'window'
    },
    plugins: [
      inject({
        Promise: 'es6-promise'
      }),
      commonjs(), // so Rollup can convert `ms` to an ES module
      resolve(),
      // uglify(),
      buble({  // transpile ES2015+ to ES5
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true }
    ],
    moduleContext: {
      [require.resolve('whatwg-fetch')]: 'window'
    },
    plugins: [
      buble({  // transpile ES2015+ to ES5
        exclude: ['node_modules/**']
      }),
      resolve(),
      uglify()
    ]
  },
  {
    input: 'src/index.js',
    output: [
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    moduleContext: {
      [require.resolve('whatwg-fetch')]: 'window'
    },
    plugins: [
      buble({  // transpile ES2015+ to ES5
        exclude: ['node_modules/**']
      }),
      resolve(),
      terser()
    ]
  }
];
