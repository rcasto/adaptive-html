import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

export const input = "src/index.ts";

export const plugins = [
    babel({
        exclude: 'node_modules/**', // only transpile our source code
        babelHelpers: 'bundled'
    }),
    typescript(),
];

export const watch = {
    include: [
        "src/**/*.ts"
    ]
};

export const external = [
    'adaptivecards'
];