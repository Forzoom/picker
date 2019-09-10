const babel = require('rollup-plugin-babel');
const vue = require('rollup-plugin-vue');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const replace = require('rollup-plugin-replace');

module.exports = exports = [
    {
        input: './src/index.js',
        output: {
            file: './dist/picker.esm.js',
            format: 'es',
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            commonjs(),
            resolve(),
            vue(),
            babel(),
        ],
    },
    {
        input: './src/index.js',
        output: {
            file: './dist/picker.cjs.js',
            format: 'cjs',
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            commonjs(),
            resolve(),
            vue(),
            babel(),
        ],
    },
    {
        input: './src/index.js',
        output: {
            file: './dist/picker.umd.js',
            format: 'umd',
            name: 'formatInput',
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
            commonjs(),
            resolve(),
            vue(),
            babel(),
        ],
    },
];
