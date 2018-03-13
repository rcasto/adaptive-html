import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

var buildMinifiedLibrary = shouldMinify(process.argv);
var plugins = [
    babel()
];

if (buildMinifiedLibrary) {
    plugins.unshift(uglify({
        output: {
            // regular expressions used to 
            // detect licent comments
            comments: /^!/g
        }
    }));
}

function shouldMinify(args) {
    return (args || []).indexOf('--minify') > -1;
}

export default {
    input: "index.js",
    output: {
        format: "iife",
        file:  buildMinifiedLibrary ? "dist/adaptive-html.iife.min.js" : "dist/adaptive-html.iife.js",
        name: "AdaptiveHtml",
        globals: {
            adaptivecards: 'AdaptiveCards'
        }
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