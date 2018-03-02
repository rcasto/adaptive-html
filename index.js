import TurndownService from './turndown';
import UtilityHelper from './utilityHelper';

var turndownService = new TurndownService();

function transform(input) {
    var transform = turndownService.turndown(input);
    UtilityHelper.prettyPrint(transform);
    return transform;
}

export default {
    transform
};