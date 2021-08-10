import { input, plugins, watch, external } from './rollup.config.common';

export default {
    input,
    output: {
        format: "cjs",
        file: "dist/adaptive-html.cjs.js",
        name: "AdaptiveHtml"
    },
    plugins,
    watch,
    external,
};