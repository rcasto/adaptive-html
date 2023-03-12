import { IAdaptiveCard } from "adaptivecards";
import { IToJSONOptions } from "./interfaces";
import { turndown } from "./turndown/turndown";

/**
 * @param {(string | HTMLElement)} htmlStringOrElem
 * @returns {object} Adaptive Card JSON
 */
export function toJSON(
  htmlStringOrElem: string | Node,
  options: IToJSONOptions = {}
): IAdaptiveCard {
  return turndown(htmlStringOrElem, options);
}
