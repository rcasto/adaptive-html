import { IAdaptiveCard } from 'adaptivecards';
import { turndown } from './turndown/turndown';

/**
 * @param {(string | HTMLElement)} htmlStringOrElem
 * @returns {object} Adaptive Card JSON
 */
export function toJSON(htmlStringOrElem: string | HTMLElement): IAdaptiveCard {
    return turndown(htmlStringOrElem);
}