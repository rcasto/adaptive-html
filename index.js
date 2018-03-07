import TurndownService from './turndown/turndown';
import UtilityHelper from './lib/utilityHelper';

var turndownService = new TurndownService();

function transform(input) {
    var transform = turndownService.turndown(input);
    return transform;
}

export default {
    transform
};