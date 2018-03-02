import TurndownService from './turndown';

var turndownService = new TurndownService();

function transform(input) {
    var transform = turndownService.turndown(input);
    console.log(input, transform);
    return transform;
}

export default {
    transform
};