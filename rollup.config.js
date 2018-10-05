import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import buble from 'rollup-plugin-buble';

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
    plugins: [
      commonjs(), // so Rollup can convert `ms` to an ES module
      buble({  // transpile ES2015+ to ES5
        exclude: ['node_modules/**']
      })
    ]
  },
  {
    input: 'src/index.js',
    external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins: [
      buble({  // transpile ES2015+ to ES5
        exclude: ['node_modules/**']
      })
    ]
  }
];
