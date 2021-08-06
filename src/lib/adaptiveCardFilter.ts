import {
    toArray
} from './utilityHelper';
import { ICardElement, IContainer, IImage, ITextBlock } from 'adaptivecards/lib/schema';
import { AdaptiveCardElement, NonTextAdaptiveCardElement } from '../interfaces';

function getBlocks(cardCollection: AdaptiveCardElement | AdaptiveCardElement[], types: CARD_TYPES | CARD_TYPES[]): AdaptiveCardElement[] {
    const typesArray: CARD_TYPES[] = toArray(types);
    const cardCollectionArray: AdaptiveCardElement[] = toArray(cardCollection);
    return cardCollectionArray.filter(card => typesArray.some(type => isCardType(card, type)));
}

function isCardType(card: ICardElement, type: string): boolean {
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

export function isTextBlock(card: ICardElement): card is ITextBlock {
    return isCardType(card, CARD_TYPES.TEXT_BLOCK);
}

export function isContainer(card: ICardElement): card is IContainer {
    return isCardType(card, CARD_TYPES.CONTAINER);
}

export function isImage(card: ICardElement): card is IImage {
    return isCardType(card, CARD_TYPES.IMAGE);
}

export function isCardElement(card: ICardElement): card is ICardElement {
    return isTextBlock(card) ||
           isImage(card) ||
           isContainer(card);
}

export function getTextBlocks(cardCollection: AdaptiveCardElement[]): ITextBlock[] {
    return getBlocks(cardCollection, CARD_TYPES.TEXT_BLOCK) as ITextBlock[];
}

export function getNonTextBlocks(cardCollection): Array<NonTextAdaptiveCardElement> {
    return getBlocks(cardCollection, [CARD_TYPES.IMAGE, CARD_TYPES.CONTAINER]) as Array<NonTextAdaptiveCardElement>;
}

export function getTextBlocksAsString(cardCollection: AdaptiveCardElement[]): string {
    return getTextBlocks(cardCollection)
        .map(textBlock => textBlock.text)
        .join(' ')
        .replace(/ +/g, ' ')
        .trim();
}