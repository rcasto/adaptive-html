import { turndown } from './turndown/turndown';

/**
 * @param {(string | HTMLElement)} htmlStringOrElem
 * @returns {object} Adaptive Card JSON
 */
function toJSON(htmlStringOrElem: string | HTMLElement) {
    return turndown(htmlStringOrElem);
}

export { toJSON }