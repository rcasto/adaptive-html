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

function getTextBlocks(cardCollection) {
    return getBlocks(cardCollection, cardTypes.textBlock);
}

function getTextBlocksAsString(cardCollection) {
    return getTextBlocks(cardCollection)
        .reduce((prevStr, currTextBlock) => {
            return prevStr + currTextBlock.text;
        }, '');
}

function getBlocks(cardCollection, type) {
    cardCollection = UtilityHelper.toArray(cardCollection);
    return cardCollection.filter(card => isCardType(card, type));
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
    getTextBlocks,
    getTextBlocksAsString,
    cardTypes
};