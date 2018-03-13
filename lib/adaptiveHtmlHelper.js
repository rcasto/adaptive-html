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
    console.log(adaptiveHtml);
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
            let headingLevel = detectHeadingLevel(node);
            if (headingLevel) {
                let headingFragment = HTMLUtil.createDocumentFragment();
                let headingNode = HTMLUtil.createElement('h' + headingLevel);
                node.querySelectorAll('p').forEach(pTag => {
                    var cloneHeadingNode = headingNode.cloneNode(false);
                    cloneHeadingNode.innerHTML = pTag.innerHTML;
                    headingFragment.appendChild(cloneHeadingNode);
                });
                node.parentNode.replaceChild(headingFragment, node);
            }
        break;
        case 'OL':
            // This technique will not work properly (CKEditor needs to understand the start attribute)
            // let listStartNum = node.getAttribute('start') || 1;
            // let listItem = node.querySelector('li');
            // listItem.innerHTML = `${listStartNum}. ${listItem.innerHTML}`;
        break;
    }
}

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
    if (fontSize === '14px' && fontWeight === '600') {
        return 4;
    }
    if (fontSize === '14px' && fontWeight === '200') {
        return 5;
    }
    if (fontSize === '12px' && fontWeight === '600') {
        return 6;
    }
    return null;
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