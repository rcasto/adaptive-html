import UtilityHelper from './utilityHelper';
import AdaptiveCardFilter from './adaptiveCardFilter';

function createCard(elements) {
    var card = {
        type: AdaptiveCardFilter.cardTypes.adaptiveCard,
        body: [],
        actions: [],
        version: '1.0'
    };
    var body = UtilityHelper.toArray(elements);
    if (Array.isArray(elements) &&
        elements.length === 1 &&
        AdaptiveCardFilter.isContainer(elements[0])) {
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
            weight = 'default';
            break;
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
        type: AdaptiveCardFilter.cardTypes.image,
        url: url
    };
    setOptions(image, options);
    return image;
}

// Wrap adaptive card elements in a container
function wrap(elements, options) {
    elements = UtilityHelper.toArray(elements);
    /* Don't wrap only a container in a container */
    if (elements.length === 1 &&
        AdaptiveCardFilter.isContainer(elements[0])) {
        return elements[0];
    }
    let container = {
        type: AdaptiveCardFilter.cardTypes.container,
        items: elements
    };
    setOptions(container, options);
    return container;
}

// Returns the list of elements within a container
// If the item passed in is not a container, it is simply returned
function unwrap(container) {
    if (!AdaptiveCardFilter.isContainer(container)) {
        return UtilityHelper.toArray(container);
    }
    return (container.items || []); 
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
    unwrap
};