import TurndownService from './turndown/turndown';
import UtilityHelper from './lib/utilityHelper';

var turndownService = new TurndownService();

function toJSON(htmlStringOrNode) {
    return turndownService.turndown(htmlStringOrNode);
}

function toHTML(json) {
    console.log('This is a stub for now');
}

export default {
    // maintain original api signature of previous package versions
    transform: toJSON,
    toJSON,
    toHTML
};