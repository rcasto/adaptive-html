import babel from 'rollup-plugin-babel';

export default {
    input: "index.js",
    output: {
        format: "iife",
        file: "dist/adaptive-html.js",
        name: "AdaptiveHtml"
    },
    plugins: [
        babel()
    ],
    watch: {
        include: [
            "lib/*.js",
            "index.js",
            "turndown/*.js"
        ]
    }
};