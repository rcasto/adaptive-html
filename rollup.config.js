import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

var buildMinifiedLibrary = shouldMinify(process.argv);
var plugins = buildMinifiedLibrary ? [
    babel(),
    uglify()
] : [
    babel()
];

function shouldMinify(args) {
    return (args || []).indexOf('--minify') > -1;
}

export default {
    input: "index.js",
    output: {
        format: "iife",
        file:  buildMinifiedLibrary ? "dist/adaptive-html.iife.min.js" : "dist/adaptive-html.iife.js",
        name: "AdaptiveHtml"
    },
    plugins: plugins,
    watch: {
        include: [
            "lib/*.js",
            "index.js",
            "turndown/*.js"
        ]
    }
};