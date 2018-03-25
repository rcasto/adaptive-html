import AdaptiveCards from 'adaptivecards';
import AdaptiveCardFilter from './adaptiveCardFilter';
import HTMLUtil from '../turndown/html-util';
import UtilityHelper from './utilityHelper';
import {
    isVoid
} from '../turndown/utilities';

var attributeWhiteList = [
    'start',
    'src',
    'href',
    'alt'
];
var attributeHostConfigWhiteList = [
    'style',
    'class',
    'tabindex'
];
/*
 Setting this host config explicitly to try and protect from
 changes within the adaptivecards library for defaults +
 the adaptivecards library currently has no way to get the 
 default hostConfig programmatically
*/
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
var defaultProcessMarkdown = AdaptiveCards.AdaptiveCard.processMarkdown;
var defaultProcessNodeConfig = {
    removeEmptyNodes: true,
    reconstructHeadings: true,
    removeAttributes: true
};
var textNodeType = 3;
var elementNodeType = 1;

function toHTML(json, options) {
    var card, cardHtml;
    if (typeof json === 'string') {
        json = UtilityHelper.tryParseJSON(json);
    }
    if (!AdaptiveCardFilter.isValidAdaptiveCardJSON(json)) {
        throw new TypeError(`${JSON.stringify(json)} is not valid Adaptive Card JSON.`);
    }
    if (!AdaptiveCards) {
        throw new ReferenceError(`AdaptiveCards is not available.  Make sure you are using the adaptivecards library if you want to utilize the toHTML(object | string) method`);
    }
    options = setOptions(options, {
        processMarkdown: defaultProcessMarkdownWrapper,
        processNode: defaultProcessNodeConfig,
        hostConfig: defaultHostConfig
    });
    card = new AdaptiveCards.AdaptiveCard();
    card.hostConfig = new AdaptiveCards.HostConfig(options.hostConfig);
    card.parse(json);
    cardHtml = card.render();
    recurseNodeTree(cardHtml, options);
    return cardHtml;
}

function recurseNodeTree(node, options) {
    _recurseNodeTree(node, node, options);
}

function _recurseNodeTree(node, root, options) {
    if (!node) {
        return;
    }
    if (node.hasChildNodes()) {
        Array.prototype.slice.call(node.childNodes)
            .forEach(child => _recurseNodeTree(child, root, options));
    }
    if (typeof options.processNode === 'function') {
        options.processNode(node, root);
    } else if (options.processNode && typeof options.processNode === 'object') {
        processNode(node, root, options);
    }
}

function processNode(node, root, options) {
    var nodeName = node.nodeName;
    switch (nodeName) {
        case 'DIV':
                // Attempt to reconstruct headings / they are wrapped in a div tag
                if (options.processNode.reconstructHeadings) {
                    let headingLevel = detectHeadingLevel(node, options.hostConfig);
                    if (headingLevel) {
                        let headingNode = HTMLUtil.createElement('h' + headingLevel);
                        headingNode.innerHTML = node.innerHTML;
                        node.parentNode.replaceChild(headingNode, node);
                    }
                }
        break;
    }
    // remove empty text and element nodes
    if (options.processNode.removeEmptyNodes &&
        ((node.nodeType === textNodeType && node.textContent === '') ||
        (node.nodeType === elementNodeType && !isVoid(node) && !node.hasChildNodes()))) {
        node.remove();
        return;
    }
    // Strip non whitelisted attributes from node
    // this is done for all nodes
    if (options.processNode.removeAttributes) {
        removeAttributes(node, options.processNode.removeAttributes);
    }
}

function removeAttributes(node, whiteListedAttributes) {
    let attributes = node.attributes;
    if (attributes) {
        /* Remove all attributes from nodes */
        Array.prototype.map.call(attributes, function (attribute) {
            return attribute.name;
        })
        .filter(function (attributeName) {
            return whiteListedAttributes.indexOf(attributeName) === -1;
        })
        .forEach(function (attributeName) {
            node.removeAttribute(attributeName);
        });
    }
}

function setOptions(options, defaults) {
    options = Object.assign({}, options);
    if (typeof options.processMarkdown === 'function') {
        AdaptiveCards.AdaptiveCard.processMarkdown = options.processMarkdown;
    } else if (typeof options.processMarkdown === 'boolean' && !options.processMarkdown) {
        AdaptiveCards.AdaptiveCard.processMarkdown = text => text;
    } else {
        AdaptiveCards.AdaptiveCard.processMarkdown = defaults.processMarkdown;
    }

    if (typeof options.processNode === 'undefined' ||
        options.processNode && typeof options.processNode === 'boolean') {
        options.processNode = Object.assign({}, defaults.processNode);
    }
    if (options.processNode && typeof options.processNode === 'object') {
        if (options.processNode.removeAttributes) {
            if (!Array.isArray(options.processNode.removeAttributes)) {
                options.processNode.removeAttributes = (options.hostConfig && typeof options.hostConfig === 'object') ? 
                    attributeWhiteList.concat(attributeHostConfigWhiteList) : attributeWhiteList;
            }
        }
    }
    if (!options.hostConfig || typeof options.hostConfig !== 'object') {
        options.hostConfig = defaults.hostConfig;
    }
    return options;
}

function defaultProcessMarkdownWrapper(text) {
    var htmlString = defaultProcessMarkdown(text);
    var container = HTMLUtil.createElement('div');
    var paragraphs;
    container.innerHTML = htmlString;
    paragraphs = container.querySelectorAll('p');
    if (paragraphs.length) {
        // This is assuming markdown-it is used
        // This is the default markdown library supported by adaptivecards
        htmlString = paragraphs[0].innerHTML;
        Array.prototype.slice.call(paragraphs, 1)
            .forEach(paragraph => {
                htmlString += `<br>${paragraph.innerHTML}`;
            });
    }
    return htmlString.replace(/\n\n/g, `<br>`);
}

/*
    This currently must stay in sync with the adaptiveCardHelper.createHeadingTextBlock construction
*/
function detectHeadingLevel(node, hostConfig) {
    var fontWeight = node && node.style.fontWeight;
    var fontSize = node && node.style.fontSize;
    if (fontSize === `${hostConfig.fontSizes.extraLarge}px`  && 
        fontWeight == hostConfig.fontWeights.bolder) {
        return 1;
    }
    if (fontSize === `${hostConfig.fontSizes.large}px` && 
        fontWeight == hostConfig.fontWeights.bolder) {
        return 2;
    }
    if (fontSize === `${hostConfig.fontSizes.medium}px` && 
        fontWeight == hostConfig.fontWeights.bolder) {
        return 3;
    }
    if (fontSize === `${hostConfig.fontSizes.medium}px` && 
        fontWeight == hostConfig.fontWeights.default) {
        return 4;
    }
    if (fontSize === `${hostConfig.fontSizes.default}px` && 
        fontWeight == hostConfig.fontWeights.bolder) {
        return 5;
    }
    if (fontSize === `${hostConfig.fontSizes.small}px` && 
        fontWeight == hostConfig.fontWeights.bolder) {
        return 6;
    }
    return null;
}

export default {
    toHTML
};