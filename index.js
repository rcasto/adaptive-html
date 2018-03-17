import TurndownService from './turndown/turndown';
import UtilityHelper from './lib/utilityHelper';
import AdaptiveHtmlHelper from './lib/adaptiveHtmlHelper';

var turndownService = new TurndownService();

/**
 * @deprecated This method will be deprecated.  Use toJSON instead.
 * @param {(string | HTMLElement)} htmlStringOrNode
 * @returns {object} Adaptive Card JSON
 */
function transform(htmlStringOrNode) {
    console.warn('transform(string | Node) will be deprecated. Use toJSON(string | Node) instead.');
    return toJSON(htmlStringOrNode);
}
/**
 * @param {(string | HTMLElement)} htmlStringOrNode
 * @returns {object} Adaptive Card JSON
 */
function toJSON(htmlStringOrNode) {
    return turndownService.turndown(htmlStringOrNode);
}
/**
 * @param {(string | object)} jsonOrJsonString
 * @param {function(string): string=} processMarkdown
 * @returns {HTMLElement} Adaptive Card HTMLElement
 */
function toHTML(jsonOrJsonString, processMarkdown) {
    if (typeof jsonOrJsonString === 'string') {
        jsonOrJsonString = UtilityHelper.tryParseJSON(jsonOrJsonString);
    }
    return AdaptiveHtmlHelper.toHTML(jsonOrJsonString, processMarkdown);
}

export default (function () {
    // check and setup globals for node for 
    // adaptivecards library if needed
    if (!UtilityHelper.hasAccessToBrowserGlobals()) {
        UtilityHelper.setupNodeAdaptiveCards();
    }
    return {
        transform, // maintain original api signature of previous package versions
        toJSON,
        toHTML
    };
}());