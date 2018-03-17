import AdaptiveCards from 'adaptivecards';
import AdaptiveCardFilter from './adaptiveCardFilter';
import HTMLUtil from '../turndown/html-util';

// Setting this host config explicitly to try and protect from
// changes within the adaptivecards library for defaults
var defaultHostConfig = {
	fontSizes: {
		small: 12,
		default: 14,
		medium: 17,
		large: 21,
		extraLarge: 26
    },
    fontWeights: {
		lighter: 200,
		default: 400,
		bolder: 600
	}
};

function toHTML(json, processMarkdown) {
    if (!AdaptiveCardFilter.isValidAdaptiveCardJSON(json)) {
        throw new TypeError(`${JSON.stringify(json)} is not valid Adaptive Card JSON.`);
    }
    if (!AdaptiveCards) {
        throw new ReferenceError(`AdaptiveCards is not available.  Make sure you are using the adaptivecards library if you want to utilize the toHTML(object | string) method`);
    }
    if (typeof processMarkdown === 'function') {
        AdaptiveCards.AdaptiveCard.processMarkdown = processMarkdown;
    }
    let card = new AdaptiveCards.AdaptiveCard();
    card.hostConfig = new AdaptiveCards.HostConfig(defaultHostConfig);
    card.parse(json);
    let adaptiveHtml = card.render();
    recurseNodeTree(adaptiveHtml, processNode);
    return adaptiveHtml;
}

function recurseNodeTree(node, processNodeFunc) {
    if (!node) {
        return;
    }
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
                let headingNode = HTMLUtil.createElement('h' + headingLevel);
                let paragraphs = node.querySelectorAll('p');
                if (paragraphs.length) {
                    // Below assumes markdown-it is used to compile TextBlocks to HTML
                    let headingFragment = HTMLUtil.createDocumentFragment();
                    paragraphs.forEach(pTag => {
                        var cloneHeadingNode = headingNode.cloneNode(false);
                        cloneHeadingNode.innerHTML = pTag.innerHTML;
                        headingFragment.appendChild(cloneHeadingNode);
                    });
                    node.parentNode.replaceChild(headingFragment, node);
                } else {
                    headingNode.innerHTML = node.innerHTML;
                    node.parentNode.replaceChild(headingNode, node);
                }
            }
        break;
    }
}

/*
    This currently must stay in sync with the adaptiveCardHelper.createHeadingTextBlock construction
*/
function detectHeadingLevel(node) {
    var fontWeight = node.style.fontWeight;
    var fontSize = node.style.fontSize;
    if (fontSize === `${defaultHostConfig.fontSizes.extraLarge}px`  && 
        fontWeight == defaultHostConfig.fontWeights.bolder) {
        return 1;
    }
    if (fontSize === `${defaultHostConfig.fontSizes.large}px` && 
        fontWeight == defaultHostConfig.fontWeights.bolder) {
        return 2;
    }
    if (fontSize === `${defaultHostConfig.fontSizes.medium}px` && 
        fontWeight == defaultHostConfig.fontWeights.bolder) {
        return 3;
    }
    if (fontSize === `${defaultHostConfig.fontSizes.medium}px` && 
        fontWeight == defaultHostConfig.fontWeights.lighter) {
        return 4;
    }
    if (fontSize === `${defaultHostConfig.fontSizes.default}px` && 
        fontWeight == defaultHostConfig.fontWeights.bolder) {
        return 5;
    }
    if (fontSize === `${defaultHostConfig.fontSizes.small}px` && 
        fontWeight == defaultHostConfig.fontWeights.bolder) {
        return 6;
    }
    return null;
}

export default {
    toHTML
};