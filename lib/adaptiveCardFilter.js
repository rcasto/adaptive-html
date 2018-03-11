import UtilityHelper from './utilityHelper';

var cardTypes = Object.freeze({
    textBlock: "TextBlock",
    container: "Container",
    image: "Image",
    adaptiveCard: "AdaptiveCard"
});

function isTextBlock(card) {
    return isCardType(card, cardTypes.textBlock);
}

function isContainer(card) {
    return isCardType(card, cardTypes.container);
}

function isImage(card) {
    return isCardType(card, cardTypes.image);
}

function isCard(card) {
    return isCardType(card, cardTypes.adaptiveCard);
}

function isCardElement(card) {
    return isTextBlock(card) ||
           isImage(card) ||
           isContainer(card);
}

function getTextBlocks(cardCollection) {
    return getBlocks(cardCollection, cardTypes.textBlock);
}

function getNonTextBlocks(cardCollection) {
    return getBlocks(cardCollection, [cardTypes.image, cardTypes.container]);
}

function getTextBlocksAsString(cardCollection) {
    return getTextBlocks(cardCollection)
        .map(textBlock => textBlock.text)
        .join(' ');
}

function getBlocks(cardCollection, types) {
    types = UtilityHelper.toArray(types);
    cardCollection = UtilityHelper.toArray(cardCollection);
    return cardCollection.filter(card => types.some(type => isCardType(card, type)));
}

function isCardType(card, type) {
    if (!card) {
        return false;
    }
    var cardType = (card.type || '').toLowerCase();
    type = (type || '').toLowerCase();
    return cardType === type;
}

export default {
    isTextBlock,
    isContainer,
    isImage,
    isCard,
    isCardElement,
    getTextBlocks,
    getTextBlocksAsString,
    getNonTextBlocks,
    cardTypes
};