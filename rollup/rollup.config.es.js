import babel from '@rollup/plugin-babel';

var plugins = [
    babel({
        exclude: 'node_modules/**', // only transpile our source code
        babelHelpers: 'bundled'
    })
];

export default {
    input: "src/index.js",
    output: {
        format: "es",
        file: "dist/adaptive-html.es.js",
        name: "AdaptiveHtml"
    },
    plugins: plugins,
    watch: {
        include: [
            "src/**/*.js"
        ]
    },
    external: ['adaptivecards']
};