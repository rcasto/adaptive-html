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
        return handleTextEffects(content, function (text) {
            return '\n\n';
        });
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
        return handleTextEffects(content, function (text) {
            return `[${text}](${href})`;
        });
    }
};

rules.emphasis = {
    filter: ['em', 'i'],

    replacement: function (content, node, options) {
        return handleTextEffects(content, function (text) {
            return `${options.emDelimiter}${text}${options.emDelimiter}`;
        });
    }
};

rules.strong = {
    filter: ['strong', 'b'],

    replacement: function (content, node, options) {
        return handleTextEffects(content, function (text) {
            return `${options.strongDelimiter}${text}${options.strongDelimiter}`;
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

function handleTextEffects(contentCollection, markdownFunc, textOptions) {
    var nonText = AdaptiveCardFilter.getNonTextBlocks(contentCollection) || [];
    var text = AdaptiveCardFilter.getTextBlocksAsString(contentCollection) || '';
    if (typeof markdownFunc === 'function') {
        text = markdownFunc(text);
    }
    return {
        text,
        nonText
    };
}

export default rules;