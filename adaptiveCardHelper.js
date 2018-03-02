import UtilityHelper from './utilityHelper';

var adaptiveCardTypes = {
    textBlock: "TextBlock",
    container: "Container",
    image: "Image",
    adaptiveCard: "AdaptiveCard"
};

function createCard(elements) {
    var card = {
        type: adaptiveCardTypes.adaptiveCard,
        body: UtilityHelper.toArray(elements),
        actions: [],
        version: '1.0'
    };
    return card;
}

function createTextBlock(text, options) {
    var textBlock = {
        type: adaptiveCardTypes.textBlock,
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
        case 5:
            size = 'default';
            break;
        case 6:
            size = 'small';
            break;
    }
    return createTextBlock(text, {
        size,
        weight
    });
}

function createImage(url, options) {
    var image = {
        type: adaptiveCardTypes.image,
        url: url
    };
    setOptions(image, options);
    return image;
}

// Wrap adaptive card elements in a container
function wrap(elements) {
    var container = {
        type: adaptiveCardTypes.container,
        items: UtilityHelper.toArray(elements)
    };
    return container;
}

// Returns the list of elements within a container
// If the item passed in is not a container, it is simply returned
function unwrap(container) {
    if (!isCardType(container, adaptiveCardTypes.container)) {
        return container;
    }
    return (container.items || []); 
}

function isCardType(card, type) {
    if (!card) {
        return false;
    }
    var cardType = (card.type || '').toLowerCase();
    type = (type || '').toLowerCase();
    return cardType === type;
}

function setOptions(obj, options) {
    Object.keys(options || {})
        .forEach(optionKey => {
            obj[optionKey] = options[optionKey];
        });
}

export default {
    createHeadingTextBlock,
    createTextBlock,
    createImage,
    createCard,
    wrap,
    unwrap,
    types: adaptiveCardTypes,
    isCardType
};