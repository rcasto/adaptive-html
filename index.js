import TurndownService from './turndown/turndown';
import UtilityHelper from './lib/utilityHelper';
import AdaptiveHtmlHelper from './lib/adaptiveHtmlHelper';

var turndownService = new TurndownService();

/**
 * @deprecated This method will be deprecated.  Use toJSON instead.
 */
function transform(htmlStringOrNode) {
    console.warn('transform(string | Node) will be deprecated. Use toJSON(string | Node) instead.');
    return toJSON(htmlStringOrNode);
}

function toJSON(htmlStringOrNode) {
    return turndownService.turndown(htmlStringOrNode);
}

function toHTML(json) {
    return AdaptiveHtmlHelper.toHTML(json);
}

export default {
    transform, // maintain original api signature of previous package versions
    toJSON,
    toHTML
};