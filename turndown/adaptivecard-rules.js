// MIT License

// Original work Copyright (c) 2017 Dom Christie
// Modified work Copyright (c) 2018 Richie Casto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import {
    repeat
} from './utilities';
import AdaptiveCardHelper from '../lib/adaptiveCardHelper';
import AdaptiveCardFilter from '../lib/adaptiveCardFilter';

var rules = {};

rules.paragraph = {
    filter: 'p',

    replacement: function (content) {
        return AdaptiveCardHelper.wrap(content);
    }
};

rules.lineBreak = {
    filter: 'br',

    replacement: function (content, node, options) {
        return '\n\n';
    }
};

rules.heading = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

    replacement: function (content, node, options) {
        var hLevel = Number(node.nodeName.charAt(1));
        var hText = AdaptiveCardFilter.getTextBlocksAsString(content);
        return AdaptiveCardHelper.createHeadingTextBlock(hText, hLevel);
    }
};

rules.list = {
    filter: ['ul', 'ol'],
    // content = array of listitem containers
    replacement: function (listItemContainers, node) {
        var isOrdered = node.nodeName === 'OL';
        var blocks = (listItemContainers || []).map((listItemContainer, listItemIndex) => {
            var listItemElems = AdaptiveCardHelper.unwrap(listItemContainer);
            var firstListItemElem = listItemElems[0];
            if (firstListItemElem && AdaptiveCardFilter.isTextBlock(firstListItemElem)) {
                let firstListItemPrefix = isOrdered ? `${listItemIndex + 1}. ` : `- `;
                firstListItemElem.text = firstListItemPrefix + firstListItemElem.text;
            }
            return listItemElems;
        }).reduce((prevBlocks, listItemBlocks) => {
            return prevBlocks.concat(listItemBlocks);
        }, []);
        return AdaptiveCardHelper.wrap(blocks);
    }
};

rules.listItem = {
    filter: 'li',

    replacement: function (content, node, options) {
        var currText = '';
        var blocks = (content || []).reduce((prevBlocks, currBlock) => {
            var cardType = currBlock.type;
            switch (cardType) {
                case AdaptiveCardFilter.cardTypes.textBlock:
                        currText += ` ${currBlock.text.replace(/\n\n/g, '\n\n\t').trim()}`;
                    break;
                case AdaptiveCardFilter.cardTypes.container:
                    let nestedListElems = AdaptiveCardHelper.unwrap(currBlock);
                    nestedListElems
                        .forEach(nestedListElem => {
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
                    console.error(`Unsupported card type: ${cardType} ${currBlock}`);
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
    filter: function (node, options) {
        return (
            options.linkStyle === 'inlined' &&
            node.nodeName === 'A' &&
            node.getAttribute('href')
        )
    },

    replacement: function (content, node) {
        var href = node.getAttribute('href');
        var title = node.title ? ' "' + node.title + '"' : '';
        var linkText = AdaptiveCardFilter.getTextBlocksAsString(content);
        return `[${linkText}](${href})`;
    }
};

rules.emphasis = {
    filter: ['em', 'i'],
    // TODO: what elements are valid inside of these elements?
    replacement: function (content, node, options) {
        var emText = AdaptiveCardFilter.getTextBlocksAsString(content);
        return `${options.emDelimiter}${emText}${options.emDelimiter}`;
    }
};

rules.strong = {
    filter: ['strong', 'b'],

    replacement: function (content, node, options) {
        var strongText = AdaptiveCardFilter.getTextBlocksAsString(content);
        return `${options.strongDelimiter}${strongText}${options.strongDelimiter}`;
    }
};

rules.image = {
    filter: 'img',

    replacement: function (content, node) {
        var alt = node.alt || '';
        var src = node.getAttribute('src') || '';
        return AdaptiveCardHelper.createImage(src, {
            altText: alt
        });
    }
};

export default rules;