import UtilityHelper from './utilityHelper';

var cardTypes = Object.freeze({
    textBlock: "TextBlock",
    container: "Container",
    image: "Image",
    adaptiveCard: "AdaptiveCard"
});
var supportedCardVersions = [
    '1.0'
];

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
    return isTextBlock(card) ||
           isImage(card) ||
           isContainer(card);
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
    return json &&
           typeof json === 'object' &&
           json.type === cardTypes.adaptiveCard &&
           supportedCardVersions.indexOf(json.version) > -1;           
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

export default {
    isTextBlock,
    isContainer,
    isImage,
    isAdaptiveCard,
    isCardElement,
    isValidAdaptiveCardJSON,
    getTextBlocks,
    getTextBlocksAsString,
    getNonTextBlocks,
    cardTypes
};