'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var AdaptiveCards = _interopDefault(require('adaptivecards'));

function toArray(x) {
    if (Array.isArray(x)) {
        return x;
    }
    return x ? [x] : [];
}

function tryParseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        return null;
    }
}

// setup globals for node with adaptivecards library
// TODO: is there a better way to do this?
function setupNodeAdaptiveCards() {
    var jsdomInstance = new (require('jsdom').JSDOM)();
    global.document = jsdomInstance.window.document;
    global.window = jsdomInstance.window;
    global.HTMLElement = jsdomInstance.window.HTMLElement;
}

function hasAccessToBrowserGlobals() {
    return !!(typeof window !== 'undefined' && window.document && window.HTMLElement);
}

var UtilityHelper = {
    toArray: toArray,
    tryParseJSON: tryParseJSON,
    setupNodeAdaptiveCards: setupNodeAdaptiveCards,
    hasAccessToBrowserGlobals: hasAccessToBrowserGlobals
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var cardTypes = Object.freeze({
    textBlock: "TextBlock",
    container: "Container",
    image: "Image",
    adaptiveCard: "AdaptiveCard"
});
var supportedCardVersions = ['1.0'];

function isTextBlock(card) {
    return isCardType(card, cardTypes.textBlock);
}

function isContainer(card) {
    return isCardType(card, cardTypes.container);
}

function isImage(card) {
    return isCardType(card, cardTypes.image);
}

function isAdaptiveCard(card) {
    return isCardType(card, cardTypes.adaptiveCard);
}

function isCardElement(card) {
    return isTextBlock(card) || isImage(card) || isContainer(card);
}

function isCardType(card, type) {
    if (!card) {
        return false;
    }
    var cardType = (card.type || '').toLowerCase();
    type = (type || '').toLowerCase();
    return cardType === type;
}

function isValidAdaptiveCardJSON(json) {
    return json && (typeof json === "undefined" ? "undefined" : _typeof(json)) === 'object' && json.type === cardTypes.adaptiveCard && supportedCardVersions.indexOf(json.version) > -1;
}

function getTextBlocks(cardCollection) {
    return getBlocks(cardCollection, cardTypes.textBlock);
}

function getNonTextBlocks(cardCollection) {
    return getBlocks(cardCollection, [cardTypes.image, cardTypes.container]);
}

function getTextBlocksAsString(cardCollection) {
    return getTextBlocks(cardCollection).map(function (textBlock) {
        return textBlock.text;
    }).join(' ');
}

function getBlocks(cardCollection, types) {
    types = UtilityHelper.toArray(types);
    cardCollection = UtilityHelper.toArray(cardCollection);
    return cardCollection.filter(function (card) {
        return types.some(function (type) {
            return isCardType(card, type);
        });
    });
}

var AdaptiveCardFilter = {
    isTextBlock: isTextBlock,
    isContainer: isContainer,
    isImage: isImage,
    isAdaptiveCard: isAdaptiveCard,
    isCardElement: isCardElement,
    isValidAdaptiveCardJSON: isValidAdaptiveCardJSON,
    getTextBlocks: getTextBlocks,
    getTextBlocksAsString: getTextBlocksAsString,
    getNonTextBlocks: getNonTextBlocks,
    cardTypes: cardTypes
};

function createCard(elements) {
    var card = {
        type: AdaptiveCardFilter.cardTypes.adaptiveCard,
        body: [],
        actions: [],
        version: '1.0'
    };
    var body = UtilityHelper.toArray(elements);
    if (Array.isArray(elements) && elements.length === 1 && AdaptiveCardFilter.isContainer(elements[0])) {
        body = UtilityHelper.toArray(unwrap(elements[0]));
    }
    card.body = body;
    return card;
}

function createTextBlock(text, options) {
    var textBlock = {
        type: AdaptiveCardFilter.cardTypes.textBlock,
        text: text || '',
        wrap: true
    };
    setOptions(textBlock, options);
    return textBlock;
}

function createHeadingTextBlock(text, depth) {
    var weight = 'bolder';
    var size = 'default';
    switch (depth) {
        case 1:
            size = 'extraLarge';
            break;
        case 2:
            size = 'large';
            break;
        case 3:
            size = 'medium';
            break;
        case 4:
            size = 'medium';
            weight = 'lighter';
            break;
        case 5:
            size = 'default';
            break;
        case 6:
            size = 'small';
            break;
    }
    return createTextBlock(text, {
        size: size,
        weight: weight
    });
}

function createImage(url, options) {
    var image = {
        type: AdaptiveCardFilter.cardTypes.image,
        url: url
    };
    setOptions(image, options);
    return image;
}

// Wrap adaptive card elements in a container
function wrap(elements) {
    var container = {
        type: AdaptiveCardFilter.cardTypes.container,
        items: UtilityHelper.toArray(elements)
    };
    return container;
}

// Returns the list of elements within a container
// If the item passed in is not a container, it is simply returned
function unwrap(container) {
    if (!AdaptiveCardFilter.isContainer(container)) {
        return UtilityHelper.toArray(container);
    }
    return container.items || [];
}

function setOptions(obj, options) {
    Object.keys(options || {}).forEach(function (optionKey) {
        obj[optionKey] = options[optionKey];
    });
}

var AdaptiveCardHelper = {
    createHeadingTextBlock: createHeadingTextBlock,
    createTextBlock: createTextBlock,
    createImage: createImage,
    createCard: createCard,
    wrap: wrap,
    unwrap: unwrap
};

var rules = {};

rules.paragraph = {
    filter: 'p',

    replacement: function replacement(content) {
        return AdaptiveCardHelper.wrap(content);
    }
};

rules.lineBreak = {
    filter: 'br',

    replacement: function replacement(content, node, options) {
        return handleTextEffects(content, function (text) {
            return '\n\n';
        });
    }
};

rules.heading = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

    replacement: function replacement(content, node, options) {
        var hLevel = Number(node.nodeName.charAt(1));
        var hText = AdaptiveCardFilter.getTextBlocksAsString(content);
        return AdaptiveCardHelper.createHeadingTextBlock(hText, hLevel);
    }
};

rules.list = {
    filter: ['ul', 'ol'],
    // content = array of listitem containers
    replacement: function replacement(listItemContainers, node) {
        var isOrdered = node.nodeName === 'OL';
        var startIndex = parseInt(node.getAttribute('start'), 10) || 1; // only applicable to ordered lists
        var blocks = (listItemContainers || []).map(function (listItemContainer, listItemIndex) {
            var listItemElems = AdaptiveCardHelper.unwrap(listItemContainer);
            var firstListItemElem = listItemElems[0];
            if (firstListItemElem && AdaptiveCardFilter.isTextBlock(firstListItemElem)) {
                var firstListItemPrefix = isOrdered ? startIndex + listItemIndex + '. ' : '- ';
                firstListItemElem.text = firstListItemPrefix + firstListItemElem.text;
            }
            return listItemElems;
        }).reduce(function (prevBlocks, listItemBlocks) {
            return prevBlocks.concat(listItemBlocks);
        }, []);
        return AdaptiveCardHelper.wrap(blocks);
    }
};

rules.listItem = {
    filter: 'li',

    replacement: function replacement(content, node, options) {
        var currText = '';
        var blocks = (content || []).reduce(function (prevBlocks, currBlock) {
            var cardType = currBlock.type;
            switch (cardType) {
                case AdaptiveCardFilter.cardTypes.textBlock:
                    currText += ' ' + currBlock.text.replace(/\n\n/g, '\n\n\t').trim();
                    break;
                case AdaptiveCardFilter.cardTypes.container:
                    var nestedListElems = AdaptiveCardHelper.unwrap(currBlock);
                    nestedListElems.forEach(function (nestedListElem) {
                        if (AdaptiveCardFilter.isTextBlock(nestedListElem)) {
                            currText += '\r\t' + nestedListElem.text.replace(/\r\t/g, '\r\t\t').replace(/\n\n/g, '\n\n\t');
                        } else {
                            prevBlocks.push(nestedListElem);
                        }
                    });
                    break;
                case AdaptiveCardFilter.cardTypes.image:
                    prevBlocks.push(currBlock);
                    break;
                default:
                    console.error('Unsupported card type: ' + cardType + ' ' + currBlock);
            }
            return prevBlocks;
        }, []);

        if (currText) {
            blocks.unshift(AdaptiveCardHelper.createTextBlock(currText.trim()));
        }

        return AdaptiveCardHelper.wrap(blocks);
    }
};

rules.inlineLink = {
    filter: function filter(node, options) {
        return options.linkStyle === 'inlined' && node.nodeName === 'A' && node.getAttribute('href');
    },

    replacement: function replacement(content, node) {
        var href = node.getAttribute('href');
        return handleTextEffects(content, function (text) {
            return '[' + text + '](' + href + ')';
        });
    }
};

rules.emphasis = {
    filter: ['em', 'i'],

    replacement: function replacement(content, node, options) {
        return handleTextEffects(content, function (text) {
            return '' + options.emDelimiter + text + options.emDelimiter;
        });
    }
};

rules.strong = {
    filter: ['strong', 'b'],

    replacement: function replacement(content, node, options) {
        return handleTextEffects(content, function (text) {
            return '' + options.strongDelimiter + text + options.strongDelimiter;
        });
    }
};

rules.image = {
    filter: 'img',

    replacement: function replacement(content, node) {
        var alt = node.alt || '';
        var src = node.getAttribute('src') || '';
        return AdaptiveCardHelper.createImage(src, {
            altText: alt
        });
    }
};

function handleTextEffects(contentCollection, markdownFunc, textOptions) {
    var nonText = AdaptiveCardFilter.getNonTextBlocks(contentCollection) || [];
    var text = AdaptiveCardFilter.getTextBlocksAsString(contentCollection) || '';
    if (typeof markdownFunc === 'function') {
        text = markdownFunc(text);
    }
    return {
        text: text,
        nonText: nonText
    };
}

/**
 * Manages a collection of rules used to convert HTML to Markdown
 */

function Rules(options) {
    this.options = options;

    this.blankRule = {
        replacement: options.blankReplacement
    };

    this.defaultRule = {
        replacement: options.defaultReplacement
    };

    this.array = [];
    for (var key in options.rules) {
        this.array.push(options.rules[key]);
    }
}

Rules.prototype = {
    forNode: function forNode(node) {
        if (node.isBlank) return this.blankRule;
        var rule;

        if (rule = findRule(this.array, node, this.options)) return rule;

        return this.defaultRule;
    }
};

function findRule(rules, node, options) {
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (filterValue(rule, node, options)) return rule;
    }
    return void 0;
}

function filterValue(rule, node, options) {
    var filter = rule.filter;
    if (typeof filter === 'string') {
        if (filter === node.nodeName.toLowerCase()) return true;
    } else if (Array.isArray(filter)) {
        if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true;
    } else if (typeof filter === 'function') {
        if (filter.call(rule, node, options)) return true;
    } else {
        throw new TypeError('`filter` needs to be a string, array, or function');
    }
}

/*!
 * The collapseWhitespace function is adapted from collapse-whitespace
 * by Luc Thevenard.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Luc Thevenard <lucthevenard@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * collapseWhitespace(options) removes extraneous whitespace from an the given element.
 *
 * @param {Object} options
 */
function collapseWhitespace(options) {
    var element = options.element;
    var isBlock = options.isBlock;
    var isVoid = options.isVoid;
    var isPre = options.isPre || function (node) {
        return node.nodeName === 'PRE';
    };

    if (!element.firstChild || isPre(element)) return;

    var prevText = null;
    var prevVoid = false;

    var prev = null;
    var node = next(prev, element, isPre);

    while (node !== element) {
        if (node.nodeType === 3 || node.nodeType === 4) {
            // Node.TEXT_NODE or Node.CDATA_SECTION_NODE
            var text = node.data.replace(/[ \r\n\t]+/g, ' ');

            if ((!prevText || / $/.test(prevText.data)) && !prevVoid && text[0] === ' ') {
                text = text.substr(1);
            }

            // `text` might be empty at this point.
            if (!text) {
                node = remove(node);
                continue;
            }

            node.data = text;

            prevText = node;
        } else if (node.nodeType === 1) {
            // Node.ELEMENT_NODE
            if (isBlock(node) || node.nodeName === 'BR') {
                if (prevText) {
                    prevText.data = prevText.data.replace(/ $/, '');
                }

                prevText = null;
                prevVoid = false;
            } else if (isVoid(node)) {
                // Avoid trimming space around non-block, non-BR void elements.
                prevText = null;
                prevVoid = true;
            }
        } else {
            node = remove(node);
            continue;
        }

        var nextNode = next(prev, node, isPre);
        prev = node;
        node = nextNode;
    }

    if (prevText) {
        prevText.data = prevText.data.replace(/ $/, '');
        if (!prevText.data) {
            remove(prevText);
        }
    }
}

/**
* remove(node) removes the given node from the DOM and returns the
* next node in the sequence.
*
* @param {Node} node
* @return {Node} node
*/
function remove(node) {
    var next = node.nextSibling || node.parentNode;

    node.parentNode.removeChild(node);

    return next;
}

/**
* next(prev, current, isPre) returns the next node in the sequence, given the
* current and previous nodes.
*
* @param {Node} prev
* @param {Node} current
* @param {Function} isPre
* @return {Node}
*/
function next(prev, current, isPre) {
    if (prev && prev.parentNode === current || isPre(current)) {
        return current.nextSibling || current.parentNode;
    }

    return current.firstChild || current.nextSibling || current.parentNode;
}

/*
 * Set up window for Node.js
 */

var root = UtilityHelper.hasAccessToBrowserGlobals() ? window : {};
var parser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

/*
 * Parsing HTML strings
 */
function canParseHTMLNatively() {
    var Parser = root.DOMParser;
    var canParse = false;

    // Adapted from https://gist.github.com/1129031
    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if (new Parser().parseFromString('', 'text/html')) {
            canParse = true;
        }
    } catch (e) {}

    return canParse;
}

function createHTMLParser() {
    var Parser = function Parser() {};

    if (process.browser) {
        if (shouldUseActiveX()) {
            Parser.prototype.parseFromString = function (string) {
                var doc = new window.ActiveXObject('htmlfile');
                doc.designMode = 'on'; // disable on-page scripts
                doc.open();
                doc.write(string);
                doc.close();
                return doc;
            };
        } else {
            Parser.prototype.parseFromString = function (string) {
                var doc = document.implementation.createHTMLDocument('');
                doc.open();
                doc.write(string);
                doc.close();
                return doc;
            };
        }
    } else {
        var JSDOM = require('jsdom').JSDOM;
        Parser.prototype.parseFromString = function (string) {
            return new JSDOM(string).window.document;
        };
    }
    return Parser;
}

function shouldUseActiveX() {
    var useActiveX = false;
    try {
        document.implementation.createHTMLDocument('').open();
    } catch (e) {
        if (window.ActiveXObject) useActiveX = true;
    }
    return useActiveX;
}

function createElement(tag) {
    if (canParseHTMLNatively()) {
        return root.document.createElement(tag);
    }
    var JSDOM = require('jsdom').JSDOM;
    return new JSDOM().window.document.createElement(tag);
}

var HTMLUtil = {
    parser: parser,
    createElement: createElement
};

var blockElements = ['address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas', 'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav', 'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'];

function isBlock(node) {
    return blockElements.indexOf(node.nodeName.toLowerCase()) !== -1;
}

var voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

function isVoid(node) {
    return voidElements.indexOf(node.nodeName.toLowerCase()) !== -1;
}

var voidSelector = voidElements.join();
function hasVoid(node) {
    return node.querySelector && node.querySelector(voidSelector);
}

function RootNode(input) {
    var root;
    if (typeof input === 'string') {
        var doc = htmlParser().parseFromString(
        // DOM parsers arrange elements in the <head> and <body>.
        // Wrapping in a custom element ensures elements are reliably arranged in
        // a single element.
        '<x-turndown id="turndown-root">' + input + '</x-turndown>', 'text/html');
        root = doc.getElementById('turndown-root');
    } else {
        root = input.cloneNode(true);
    }
    collapseWhitespace({
        element: root,
        isBlock: isBlock,
        isVoid: isVoid
    });

    return root;
}

var _htmlParser;
function htmlParser() {
    _htmlParser = _htmlParser || new HTMLUtil.parser();
    return _htmlParser;
}

function Node(node) {
    node.isBlock = isBlock(node);
    node.isCode = node.nodeName.toLowerCase() === 'code' || node.parentNode.isCode;
    node.isBlank = isBlank(node);
    node.flankingWhitespace = flankingWhitespace(node);
    return node;
}

function isBlank(node) {
    return ['A', 'TH', 'TD'].indexOf(node.nodeName) === -1 && /^\s*$/i.test(node.textContent) && !isVoid(node) && !hasVoid(node);
}

function flankingWhitespace(node) {
    var leading = '';
    var trailing = '';

    if (!node.isBlock) {
        var hasLeading = /^[ \r\n\t]/.test(node.textContent);
        var hasTrailing = /[ \r\n\t]$/.test(node.textContent);

        if (hasLeading && !isFlankedByWhitespace('left', node)) {
            leading = ' ';
        }
        if (hasTrailing && !isFlankedByWhitespace('right', node)) {
            trailing = ' ';
        }
    }

    return {
        leading: leading,
        trailing: trailing
    };
}

function isFlankedByWhitespace(side, node) {
    var sibling;
    var regExp;
    var isFlanked;

    if (side === 'left') {
        sibling = node.previousSibling;
        regExp = / $/;
    } else {
        sibling = node.nextSibling;
        regExp = /^ /;
    }

    if (sibling) {
        if (sibling.nodeType === 3) {
            isFlanked = regExp.test(sibling.nodeValue);
        } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
            isFlanked = regExp.test(sibling.textContent);
        }
    }
    return isFlanked;
}

/*!
 * Code in files within the turndown folder is taken and modified from the Turndown
 * project created by Dom Christie (https://github.com/domchristie/turndown/)
 *
 * MIT License
 *
 * Original work Copyright (c) 2017 Dom Christie
 * Modified work Copyright (c) 2018 Richie Casto
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function TurndownService() {
    this.options = {
        rules: rules,
        emDelimiter: '_',
        strongDelimiter: '**',
        linkStyle: 'inlined',
        blankReplacement: function blankReplacement(content, node) {
            return null;
        },
        defaultReplacement: function defaultReplacement(content, node) {
            if (node.isBlock) {
                /*
                    If it's a block level element and the content is just a container already
                    don't wrap the container in a container
                */
                if (Array.isArray(content) && content.length === 1 && AdaptiveCardFilter.isContainer(content[0])) {
                    return content;
                }
                return AdaptiveCardHelper.wrap(content);
            }
            return content;
        }
    };
    this.rules = new Rules(this.options);
}

TurndownService.prototype = {
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */

    turndown: function turndown(input) {
        if (!canConvert(input)) {
            throw new TypeError(input + ' is not a string, or an element/document/fragment node.');
        }
        var cardElems = process$1.call(this, new RootNode(input));
        return AdaptiveCardHelper.createCard(cardElems);
    },

    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */

    escape: function escape(string) {
        return string
        // Escape backslash escapes!
        .replace(/\\(\S)/g, '\\\\$1')

        // Escape headings
        .replace(/^(#{1,6} )/gm, '\\$1')

        // Escape hr
        // .replace(/^([-*_] *){3,}$/gm, function (match, character) {
        //     return match.split(character).join('\\' + character)
        // })

        // Escape ol bullet points
        .replace(/^(\W* {0,3})(\d+)\. /gm, '$1$2\\. ')

        // Escape ul bullet points
        .replace(/^([^\\\w]*)[*+-] /gm, function (match) {
            return match.replace(/([*+-])/g, '\\$1');
        })

        // Escape blockquote indents
        .replace(/^(\W* {0,3})> /gm, '$1\\> ')

        // Escape em/strong *
        // .replace(/\*+(?![*\s\W]).+?\*+/g, function (match) {
        //     return match.replace(/\*/g, '\\*')
        // })

        // Escape em/strong _
        // .replace(/_+(?![_\s\W]).+?_+/g, function (match) {
        //     return match.replace(/_/g, '\\_')
        // })

        // Escape code _
        .replace(/`+(?![`\s\W]).+?`+/g, function (match) {
            return match.replace(/`/g, '\\`');
        })

        // Escape link brackets
        .replace(/[\[\]]/g, '\\$&') // eslint-disable-line no-useless-escape
        ;
    }

    /**
     * Reduces a DOM node down to its Markdown string equivalent
     * @private
     * @param {HTMLElement} parentNode The node to convert
     * @returns A Markdown representation of the node
     * @type String
     */

};function process$1(parentNode) {
    var _this = this;

    var currText = '';
    var blocks = Array.prototype.reduce.call(parentNode.childNodes, function (output, node) {
        var replacement = [];

        node = new Node(node);

        if (node.nodeType === 3) {
            // text node
            var text = node.isCode ? node.nodeValue : _this.escape(node.nodeValue);
            replacement = {
                text: text,
                nonText: []
            };
        } else if (node.nodeType === 1) {
            // element node
            replacement = replacementForNode.call(_this, node);
        }
        replacement = replacement || [];

        // text nodes, em, i, b, strong, a tags will hit this
        if ((typeof replacement === 'undefined' ? 'undefined' : _typeof(replacement)) === 'object' && !AdaptiveCardFilter.isCardElement(replacement) && !Array.isArray(replacement)) {
            currText += replacement.text;
            if (replacement.nonText && replacement.nonText.length || !node.nextSibling) {
                output.push(AdaptiveCardHelper.createTextBlock(currText));
            }
            replacement = replacement.nonText || [];
        } else if (currText) {
            // Collection detected, let's push this textblock first, then clear the text
            output.push(AdaptiveCardHelper.createTextBlock(currText));
            currText = '';
        }

        return output.concat(UtilityHelper.toArray(replacement));
    }, []);

    return blocks;
}

/**
 * Converts an element node to its Markdown equivalent
 * @private
 * @param {HTMLElement} node The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function replacementForNode(node) {
    var rule = this.rules.forNode(node);
    var content = process$1.call(this, node); // get's internal content of node
    return rule.replacement(content, node, this.options);
}

/**
 * Determines whether an input can be converted
 * @private
 * @param {String|HTMLElement} input Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */

function canConvert(input) {
    return input != null && (typeof input === 'string' || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
}

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

function toHTML(json, options) {
    if (typeof json === 'string') {
        json = UtilityHelper.tryParseJSON(json);
    }
    if (!AdaptiveCardFilter.isValidAdaptiveCardJSON(json)) {
        throw new TypeError(JSON.stringify(json) + ' is not valid Adaptive Card JSON.');
    }
    if (!AdaptiveCards) {
        throw new ReferenceError('AdaptiveCards is not available.  Make sure you are using the adaptivecards library if you want to utilize the toHTML(object | string) method');
    }
    if (!options || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        options = {};
    }
    if (typeof options.processMarkdown === 'function') {
        AdaptiveCards.AdaptiveCard.processMarkdown = options.processMarkdown;
    } else {
        AdaptiveCards.AdaptiveCard.processMarkdown = defaultProcessMarkdown;
    }
    if (typeof options.processNode !== 'function') {
        options.processNode = processNode;
    }
    if (!options.hostConfig || _typeof(options.hostConfig) !== 'object') {
        options.hostConfig = defaultHostConfig;
    }
    if (typeof options.reconstructHeadings === 'undefined') {
        options.reconstructHeadings = true;
    }
    var card = new AdaptiveCards.AdaptiveCard();
    card.hostConfig = new AdaptiveCards.HostConfig(options.hostConfig);
    card.parse(json);
    var adaptiveHtml = card.render();
    recurseNodeTree(adaptiveHtml, options);
    return adaptiveHtml;
}

function recurseNodeTree(node, options) {
    if (!node) {
        return;
    }
    if (typeof options.processNode === 'function') {
        options.processNode(node, options);
    }
    if (node.hasChildNodes()) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
            return recurseNodeTree(child, options);
        });
    }
}

function processNode(node, options) {
    var nodeName = node.nodeName;
    switch (nodeName) {
        case 'DIV':
            if (!node.hasChildNodes()) {
                // remove empty divs from output html
                node.remove();
            }
            if (options.reconstructHeadings) {
                var headingLevel = detectHeadingLevel(node, options.hostConfig);
                if (headingLevel) {
                    var headingNode = HTMLUtil.createElement('h' + headingLevel);
                    var paragraphs = node.querySelectorAll('p');
                    if (paragraphs.length) {
                        // Below assumes markdown-it is used to compile TextBlocks to HTML
                        paragraphs.forEach(function (pTag) {
                            var cloneHeadingNode = headingNode.cloneNode(false);
                            cloneHeadingNode.innerHTML = pTag.innerHTML;
                            node.appendChild(cloneHeadingNode);
                            pTag.remove();
                        });
                    } else {
                        headingNode.innerHTML = node.innerHTML;
                        node.innerHTML = '';
                        node.appendChild(headingNode);
                    }
                }
            }
            break;
    }
}

/*
    This currently must stay in sync with the adaptiveCardHelper.createHeadingTextBlock construction
*/
function detectHeadingLevel(node, hostConfig) {
    var fontWeight = node.style.fontWeight;
    var fontSize = node.style.fontSize;
    if (fontSize === hostConfig.fontSizes.extraLarge + 'px' && fontWeight == hostConfig.fontWeights.bolder) {
        return 1;
    }
    if (fontSize === hostConfig.fontSizes.large + 'px' && fontWeight == hostConfig.fontWeights.bolder) {
        return 2;
    }
    if (fontSize === hostConfig.fontSizes.medium + 'px' && fontWeight == hostConfig.fontWeights.bolder) {
        return 3;
    }
    if (fontSize === hostConfig.fontSizes.medium + 'px' && fontWeight == hostConfig.fontWeights.lighter) {
        return 4;
    }
    if (fontSize === hostConfig.fontSizes.default + 'px' && fontWeight == hostConfig.fontWeights.bolder) {
        return 5;
    }
    if (fontSize === hostConfig.fontSizes.small + 'px' && fontWeight == hostConfig.fontWeights.bolder) {
        return 6;
    }
    return null;
}

var AdaptiveHtmlHelper = {
    toHTML: toHTML
};

var turndownService = new TurndownService();

/**
 * @deprecated This method will be deprecated.  Use toJSON instead.
 * @param {(string | HTMLElement)} htmlStringOrElem
 * @returns {object} Adaptive Card JSON
 */
function transform(htmlStringOrElem) {
    console.warn('transform(string | HTMLElement) will be deprecated. Use toJSON(string | HTMLElement) instead.');
    return toJSON(htmlStringOrElem);
}
/**
 * @param {(string | HTMLElement)} htmlStringOrElem
 * @returns {object} Adaptive Card JSON
 */
function toJSON(htmlStringOrElem) {
    return turndownService.turndown(htmlStringOrElem);
}
/**
 * @param {(string | object)} jsonOrJsonString
 * @param {object=} options
 * @returns {HTMLElement} Adaptive Card HTMLElement
 */
function toHTML$1(jsonOrJsonString) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return AdaptiveHtmlHelper.toHTML(jsonOrJsonString, options);
}

var index = (function () {
    // check and setup globals for node.js for 
    // adaptivecards library if needed
    if (!UtilityHelper.hasAccessToBrowserGlobals()) {
        UtilityHelper.setupNodeAdaptiveCards();
    }
    return {
        transform: transform, // maintain original api signature of previous package versions
        toJSON: toJSON,
        toHTML: toHTML$1
    };
})();

module.exports = index;
