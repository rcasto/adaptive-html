import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

var buildMinifiedLibrary = shouldMinify(process.argv);
var plugins = [
    babel({
        exclude: 'node_modules/**', // only transpile our source code
        babelHelpers: 'bundled'
    })
];

if (buildMinifiedLibrary) {
    plugins.unshift(terser({
        format: {
            // https://github.com/TrySound/rollup-plugin-terser#comments
            comments: function (node, comment) {
                var text = comment.value;
                var type = comment.type;
                if (type == "comment2") {
                    // regular expressions used to
                    // detect licent comments
                    return /^!/gi.test(text);
                }
            },
        },
    }));
}

function shouldMinify(args) {
    return (args || []).indexOf('--minify') > -1;
}

export default {
    input: "src/index.js",
    output: {
        format: "iife",
        file: buildMinifiedLibrary ? "dist/adaptive-html.iife.min.js" : "dist/adaptive-html.iife.js",
        name: "AdaptiveHtml",
        globals: {
            adaptivecards: 'window.AdaptiveCards'
        }
    },
    plugins: plugins,
    watch: {
        include: [
            "src/**/*.js"
        ]
    },
    external: ['adaptivecards']
};