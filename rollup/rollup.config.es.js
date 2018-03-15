import babel from 'rollup-plugin-babel';

var plugins = [
    babel({
        exclude: 'node_modules/**' // only transpile our source code
    })
];

export default {
    input: "index.js",
    output: {
        format: "es",
        file: "dist/adaptive-html.es.js",
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