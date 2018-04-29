import AdaptiveCardHelper from '../lib/adaptiveCardHelper';
import AdaptiveCardFilter from '../lib/adaptiveCardFilter';
import {
    isVoid,
    hasVoid,
    lineBreakRegex,
    carriageReturnTabRegex
} from './utilities';

const rules = {};

rules.blank = {
    filter: function (node) {
        return (
            ['A', 'TH', 'TD'].indexOf(node.nodeName) === -1 &&
            /^\s*$/i.test(node.textContent) &&
            !isVoid(node) &&
            !hasVoid(node)
        );
    },
    replacement: function (content, node) {
        if (node.textContent) {
            return handleTextEffects(content, function () {
                return node.textContent;
            });
        }
        return null;
    }
};

rules.text = {
    filter: function (node) {
        return node.nodeType === 3;
    },
    replacement: function (content, node) {
        return handleTextEffects(content, function () {
            return node.nodeValue;
        });
    }
};

rules.lineBreak = {
    filter: 'br',
    replacement: function (content) {
        return handleTextEffects(content, function (text) {
            return '  \n';
        });
    }
};

rules.heading = {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: function (content, node) {
        var hLevel = Number(node.nodeName.charAt(1));
        var hText = AdaptiveCardFilter.getTextBlocksAsString(content);
        var hNonText = AdaptiveCardFilter.getNonTextBlocks(content);
        return AdaptiveCardHelper.wrap([
            AdaptiveCardHelper.createHeadingTextBlock(hText, hLevel)
        ].concat(hNonText));
    }
};

rules.list = {
    filter: ['ul', 'ol'],
    // content = array of listitem containers
    replacement: function (listItemContainers, node) {
        var isOrdered = node.nodeName === 'OL';
        var startIndex = parseInt(node.getAttribute('start'), 10) || 1; // only applicable to ordered lists
        var blocks = (listItemContainers || []).map((listItemContainer, listItemIndex) => {
            var listItemElems = AdaptiveCardHelper.unwrap(listItemContainer);
            var firstListItemElem = listItemElems[0];
            if (firstListItemElem && AdaptiveCardFilter.isTextBlock(firstListItemElem)) {
                let firstListItemPrefix = isOrdered ? `${startIndex + listItemIndex}. ` : `- `;
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
    replacement: function (content) {
        var currText = '';
        var blocks = (content || []).reduce((prevBlocks, currBlock) => {
            var cardType = currBlock.type;
            switch (cardType) {
                case AdaptiveCardFilter.cardTypes.textBlock:
                    currText += ` ${currBlock.text
                        .replace(lineBreakRegex, '  \n\t')
                        .trim()}`;
                    break;
                case AdaptiveCardFilter.cardTypes.container:
                    let nestedListElems = AdaptiveCardHelper.unwrap(currBlock);
                    nestedListElems
                        .forEach(nestedListElem => {
                            if (AdaptiveCardFilter.isTextBlock(nestedListElem)) {
                                currText += `\r\t${nestedListElem.text
                                    .replace(carriageReturnTabRegex, '\r\t\t')
                                    .replace(lineBreakRegex, '  \n\t')}`;
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
    filter: function (node) {
        return (
            node.nodeName === 'A' &&
            node.getAttribute('href')
        );
    },
    replacement: function (content, node) {
        var href = node.getAttribute('href');
        return handleTextEffects(content, function (text) {
            return `[${text}](${href})`;
        });
    }
};

rules.emphasis = {
    filter: ['em', 'i'],
    replacement: function (content, node) {
        return handleTextEffects(content, function (text) {
            return `_${text}_`;
        });
    }
};

rules.strong = {
    filter: ['strong', 'b'],
    replacement: function (content, node) {
        return handleTextEffects(content, function (text) {
            return `**${text}**`;
        });
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

/* This must be the last rule */
rules.default = {
    filter: () => true,
    replacement: function (content, node) {
        if (node.isBlock) {
            return AdaptiveCardHelper.wrap(content);
        }
        return content;
    }
};

function handleTextEffects(contentCollection, textFunc) {
    var nonText = AdaptiveCardFilter.getNonTextBlocks(contentCollection) || [];
    var text = AdaptiveCardFilter.getTextBlocksAsString(contentCollection) || '';
    if (typeof textFunc === 'function') {
        text = textFunc(text);
    }
    return {
        text,
        nonText
    };
}

export default rules;