import AdaptiveCards from 'adaptivecards';
import AdaptiveCardFilter from './adaptiveCardFilter';
import HTMLUtil from '../turndown/html-util';

var card = new AdaptiveCards.AdaptiveCard();

function toHTML(json) {
    if (!AdaptiveCardFilter.isValidAdaptiveCardJSON(json)) {
        throw new TypeError(`${JSON.stringify(json)} is not valid Adaptive Card JSON.`);
    } 
    card.parse(json);
    let adaptiveHtml = card.render();
    recurseNodeTree(adaptiveHtml, processNode);
    return adaptiveHtml;
}

function recurseNodeTree(node, processNodeFunc) {
    if (!node) {
        return node;
    }
    _recurseNodeTree(node, processNodeFunc);
    return node;
}

function _recurseNodeTree(node, processNodeFunc) {
    if (typeof processNodeFunc === 'function') {
        processNodeFunc(node);
    }
    if (node.hasChildNodes()) {
        Array.prototype.slice.call(node.childNodes).forEach(child => recurseNodeTree(child, processNodeFunc));
    }
}

function processNode(node) {
    var nodeName = node.nodeName;
    switch (nodeName) {
        case 'DIV':
            if (!node.hasChildNodes()) {
                // remove empty divs
                node.remove();
            }
            let headingLevel = detectHeadingLevel(node);
            if (headingLevel) {
                let headingFragment = HTMLUtil.createDocumentFragment();
                let headingNode = HTMLUtil.createElement('h' + headingLevel);
                node.querySelectorAll('p').forEach(pTag => {
                    var cloneHeadingNode = headingNode.cloneNode(false);
                    cloneHeadingNode.innerHTML = pTag.innerHTML;
                    headingFragment.appendChild(cloneHeadingNode);
                    pTag.remove();
                });
                node.appendChild(headingFragment);
            }
        break;
    }
}

/*
    This detection assumes default host config
    Of course this code is currently in charge of utilizing the adaptivecards layer
    so this shouldn't be an issue currently

    This currently must stay in sync with the adaptiveCardHelper.createHeadingTextBlock construction
*/
function detectHeadingLevel(node) {
    var fontWeight = node.style.fontWeight;
    var fontSize = node.style.fontSize;
    if (fontSize === '26px' && fontWeight === '600') {
        return 1;
    }
    if (fontSize === '21px' && fontWeight === '600') {
        return 2;
    }
    if (fontSize === '17px' && fontWeight === '600') {
        return 3;
    }
    if (fontSize === '17px' && fontWeight === '200') {
        return 4;
    }
    if (fontSize === '14px' && fontWeight === '600') {
        return 5;
    }
    if (fontSize === '12px' && fontWeight === '600') {
        return 6;
    }
    return null;
}

export default {
    toHTML
};