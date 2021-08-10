import { input, plugins, watch, external } from './rollup.config.common';

export default {
    input,
    output: {
        format: "es",
        file: "dist/adaptive-html.es.js",
        name: "AdaptiveHtml"
    },
    plugins,
    watch,
    external,
};