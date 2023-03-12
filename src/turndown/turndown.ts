import AdaptiveCardRules from './adaptivecard-rules';
import {
    createCard,
    createTextBlock
} from '../lib/adaptiveCardHelper';
import {
    isCardElement
} from '../lib/adaptiveCardFilter';
import {
    toArray
} from '../lib/utilityHelper';
import { findRule } from './rules';
import RootNode from './root-node';
import { IToJSONOptions } from '../interfaces';

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

/**
 * The entry point for converting a string or DOM node to JSON
 * @public
 * @param {String|HTMLElement} input The string or DOM node to convert
 * @returns A Markdown representation of the input
 * @type String
 */
export function turndown(input: string | Node, options: IToJSONOptions = {}) {
    if (!canConvert(input)) {
        throw new TypeError(`${input} is not a string, or an element/document/fragment node.`);
    }
    const cardElems = process(RootNode(input));
    return createCard(cardElems);
}

/**
 * Reduces a DOM node down to its Adaptive Card equivalent
 * @private
 * @param {HTMLElement} parentNode The node to convert
 * @returns An Adaptive Card representation of the node
 * @type String
 */
function process(parentNode: Node) {
    let currText = '';
    const blocks = Array.prototype.reduce.call(parentNode.childNodes || [], (output, node: Node) => {
        let replacement: any = [];

        if (isValidNodetype(node)) {
            replacement = replacementForNode(node);
        }
        replacement = replacement || [];

        // text nodes, em, i, b, strong, a tags will hit this
        if (typeof replacement === 'object' &&
            !isCardElement(replacement) &&
            !Array.isArray(replacement)) {
            currText += replacement.text;
            if ((replacement.nonText &&
                replacement.nonText.length) ||
                !node.nextSibling) {
                output.push(createTextBlock(currText));
                currText = '';
            }
            replacement = replacement.nonText || [];
        } else if (currText) { // Collection detected, let's push this textblock first, then clear the text
            output.push(createTextBlock(currText));
            currText = '';
        }

        return output.concat(toArray(replacement));
    }, []);

    return blocks;
}

/**
 * Converts an element node to its Adaptive Card equivalent
 * @private
 * @param {HTMLElement} node The node to convert
 * @returns An Adaptive Card representation of the node
 * @type String
 */
function replacementForNode(node: Node) {
    const rule = findRule(AdaptiveCardRules, node);
    const content = process(node); // get's internal content of node
    return rule.replacement(content, node);
}

/**
 * Determines whether an input can be converted
 * @private
 * @param {String|HTMLElement} input Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */
function canConvert(input: string | Node): boolean {
    return (
        input != null && (
            typeof input === 'string' ||
            (
                input.nodeType === Node.ELEMENT_NODE || input.nodeType === Node.DOCUMENT_NODE || input.nodeType === Node.DOCUMENT_FRAGMENT_NODE
            )
        )
    )
}

function isValidNodetype(node: Node): boolean {
    return !!(node && (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE));
}