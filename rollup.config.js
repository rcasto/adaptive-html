import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import path from 'path';

var buildMinifiedLibrary = shouldMinify(process.argv);
var plugins = [
    babel(),
    license({
        banner: {
            file: path.join(__dirname, 'turndown', 'LICENSE.txt'),
            encoding: 'utf-8'
        }
    })
];

if (buildMinifiedLibrary) {
    plugins.unshift(uglify());
}

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