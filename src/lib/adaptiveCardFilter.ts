import {
    toArray
} from './utilityHelper';
import { IAdaptiveCard } from 'adaptivecards';

function getBlocks(cardCollection, types) {
    types = toArray(types);
    cardCollection = toArray(cardCollection);
    return cardCollection.filter(card => types.some(type => isCardType(card, type)));
}

function isCardType(card: IAdaptiveCard, type: string): boolean {
    if (!card) {
        return false;
    }
    var cardType = (card.type || '').toLowerCase();
    type = (type || '').toLowerCase();
    return cardType === type;
}

export enum CARD_TYPES {
    TEXT_BLOCK = "TextBlock",
    CONTAINER = "Container",
    IMAGE = "Image",
    ADAPTIVE_CARD = "AdaptiveCard",
}

export function isTextBlock(card: IAdaptiveCard): boolean {
    return isCardType(card, CARD_TYPES.TEXT_BLOCK);
}

export function isContainer(card: IAdaptiveCard): boolean {
    return isCardType(card, CARD_TYPES.CONTAINER);
}

export function isImage(card: IAdaptiveCard): boolean {
    return isCardType(card, CARD_TYPES.IMAGE);
}

export function isAdaptiveCard(card: IAdaptiveCard): boolean {
    return isCardType(card, CARD_TYPES.ADAPTIVE_CARD);
}

export function isCardElement(card: IAdaptiveCard): boolean {
    return isTextBlock(card) ||
           isImage(card) ||
           isContainer(card);
}

export function getTextBlocks(cardCollection) {
    return getBlocks(cardCollection, CARD_TYPES.TEXT_BLOCK);
}

export function getNonTextBlocks(cardCollection) {
    return getBlocks(cardCollection, [CARD_TYPES.IMAGE, CARD_TYPES.CONTAINER]);
}

export function getTextBlocksAsString(cardCollection) {
    return getTextBlocks(cardCollection)
        .map(textBlock => textBlock.text)
        .join(' ')
        .replace(/ +/g, ' ')
        .trim();
}