import TurndownService from './turndown/turndown';

var turndownService = new TurndownService();

/**
 * @param {(string | HTMLElement)} htmlStringOrElem
 * @returns {object} Adaptive Card JSON
 */
function toJSON(htmlStringOrElem) {
    return turndownService.turndown(htmlStringOrElem);
}

export default {
    toJSON
};