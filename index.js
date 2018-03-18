import TurndownService from './turndown/turndown';
import UtilityHelper from './lib/utilityHelper';
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

export default (function () {
    // check and setup globals for node.js for 
    // adaptivecards library if needed
    if (!UtilityHelper.hasAccessToBrowserGlobals()) {
        UtilityHelper.setupNodeAdaptiveCards();
    }
    return {
        toJSON,
        toHTML
    };
}());