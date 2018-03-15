import AdaptiveCards from 'adaptivecards';
import AdaptiveCardFilter from './adaptiveCardFilter';
import HTMLUtil from '../turndown/html-util';

function toHTML(json) {
    if (!AdaptiveCardFilter.isValidAdaptiveCardJSON(json)) {
        throw new TypeError(`${JSON.stringify(json)} is not valid Adaptive Card JSON.`);
    }
    let card = new AdaptiveCards.AdaptiveCard();
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
                // remove empty divs from output html
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
                });
                node.parentNode.replaceChild(headingFragment, node);
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
    var bolderFontWeight = '600';
    var lighterFontWeight = '200';
    var extraLargeFontSize = '26px';
    var largeFontSize = '21px';
    var mediumFontSize = '17px';
    var defaultFontSize = '14px';
    var smallFontSize = '12px';
    if (fontSize === extraLargeFontSize && fontWeight === bolderFontWeight) {
        return 1;
    }
    if (fontSize === largeFontSize && fontWeight === bolderFontWeight) {
        return 2;
    }
    if (fontSize === mediumFontSize && fontWeight === bolderFontWeight) {
        return 3;
    }
    if (fontSize === mediumFontSize && fontWeight === lighterFontWeight) {
        return 4;
    }
    if (fontSize === defaultFontSize && fontWeight === bolderFontWeight) {
        return 5;
    }
    if (fontSize === smallFontSize && fontWeight === bolderFontWeight) {
        return 6;
    }
    return null;
}

export default {
    toHTML
};