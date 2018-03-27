import TurndownService from './turndown/turndown';
import AdaptiveHtmlHelper from './lib/adaptiveHtmlHelper';

var turndownService = new TurndownService();

/**
 * @param {(string | HTMLElement)} htmlStringOrElem
 * @returns {object} Adaptive Card JSON
 */
function toJSON(htmlStringOrElem) {
    return turndownService.turndown(htmlStringOrElem);
}
/**
 * @param {(string | object)} jsonOrJsonString
 * @param {object=} options
 * @returns {HTMLElement} Adaptive Card HTMLElement
 */
function toHTML(jsonOrJsonString, options = {}) {
    return AdaptiveHtmlHelper.toHTML(jsonOrJsonString, options);
}

export default {
    toJSON,
    toHTML
};