import AdaptiveCardRules from './adaptivecard-rules';
import AdaptiveCardHelper from '../lib/adaptiveCardHelper';
import AdaptiveCardFilter from '../lib/adaptiveCardFilter';
import UtilityHelper from '../lib/utilityHelper';
import Rules from './rules';
import RootNode from './root-node';
import Node from './node';

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

export default function TurndownService() {
    this.options = {
        rules: AdaptiveCardRules,
        emDelimiter: '_',
        strongDelimiter: '**',
        linkStyle: 'inlined',
        blankReplacement: function (content, node) {
            return null;
        },
        defaultReplacement: function (content, node) {
            if (node.isBlock) {
                /*
                    If it's a block level element and the content is just a container already
                    don't wrap the container in a container
                */
                if (Array.isArray(content) &&
                    content.length === 1 &&
                    AdaptiveCardFilter.isContainer(content[0])) {
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

    turndown: function (input) {
        if (!canConvert(input)) {
            throw new TypeError(`${input} is not a string, or an element/document/fragment node.`);
        }
        var cardElems = process.call(this, new RootNode(input));
        return AdaptiveCardHelper.createCard(cardElems);
    },

    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */

    escape: function (string) {
        return (
            string
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
                    return match.replace(/([*+-])/g, '\\$1')
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
                    return match.replace(/`/g, '\\`')
                })

                // Escape link brackets
                .replace(/[\[\]]/g, '\\$&') // eslint-disable-line no-useless-escape
        )
    }
}

/**
 * Reduces a DOM node down to its Markdown string equivalent
 * @private
 * @param {HTMLElement} parentNode The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function process(parentNode) {
    var currText = '';
    var blocks = Array.prototype.reduce.call(parentNode.childNodes, (output, node) => {
        var replacement = [];

        node = new Node(node);

        if (node.nodeType === 3) { // text node
            let text = node.isCode ? node.nodeValue : this.escape(node.nodeValue);
            replacement = {
                text,
                nonText: []
            };
        } else if (node.nodeType === 1) { // element node
            replacement = replacementForNode.call(this, node);
        }
        replacement = replacement || [];

        // text nodes, em, i, b, strong, a tags will hit this
        if (typeof replacement === 'object' &&
            !AdaptiveCardFilter.isCardElement(replacement) &&
            !Array.isArray(replacement)) {
            currText += replacement.text;
            if ((replacement.nonText &&
                replacement.nonText.length) || 
                !node.nextSibling) {
                output.push(AdaptiveCardHelper.createTextBlock(currText));
            }
            replacement = replacement.nonText || [];
        } else if (currText) { // Collection detected, let's push this textblock first, then clear the text
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
    var content = process.call(this, node); // get's internal content of node
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
    return (
        input != null && (
            typeof input === 'string' ||
            (input.nodeType && (
                input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
            ))
        )
    )
}