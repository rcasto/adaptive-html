import babel from '@rollup/plugin-babel';

var plugins = [
    babel({
        exclude: 'node_modules/**', // only transpile our source code
        babelHelpers: 'bundled'
    })
];

export default {
    input: "index.js",
    output: {
        format: "cjs",
        file: "dist/adaptive-html.cjs.js",
        name: "AdaptiveHtml"
    },
    plugins: plugins,
    watch: {
        include: [
            "lib/*.js",
            "index.js",
            "turndown/*.js"
        ]
    },
    external: ['adaptivecards']
};