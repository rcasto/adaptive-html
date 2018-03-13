import AdaptiveCards from 'adaptivecards';
import AdaptiveCardFilter from './adaptiveCardFilter';

var card = new AdaptiveCards.AdaptiveCard();

function toHTML(json) {
    if (!AdaptiveCardFilter.isValidAdaptiveCardJSON(json)) {
        throw new TypeError(`${json} is not valid Adaptive Card JSON.`);
    }
    card.parse(json);
    let adaptiveHtml = card.render();
    recurseNodeTree(adaptiveHtml);
}

// Implementing later, stubbing for now...
function recurseNodeTree(node, processNodeFunc) {
    if (!node) {
        return;
    }
    if (typeof processNodeFunc === 'function') {
        processNodeFunc(node);
    }
    console.log(node);
    if (node.hasChildNodes()) {
        Array.prototype.slice.call(node.childNodes).forEach(child => recurseNodeTree(child));
    }
}

// This is actually more applicable to the html to json case...will revist
// function collapseContainers(cardJson) {
//     if (!cardJson) {
//         return null;
//     }
//     if (!cardJson.body) {
//         return cardJson;
//     }

// }

export default {
    toHTML
};