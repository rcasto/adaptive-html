import { input, plugins, watch, external } from './rollup.config.common';
import { terser } from 'rollup-plugin-terser';

var buildMinifiedLibrary = shouldMinify(process.argv);

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
    input,
    output: {
        format: "iife",
        file: buildMinifiedLibrary ? "dist/adaptive-html.iife.min.js" : "dist/adaptive-html.iife.js",
        name: "AdaptiveHtml",
        globals: {
            adaptivecards: 'window.AdaptiveCards'
        }
    },
    plugins,
    watch,
    external,
};