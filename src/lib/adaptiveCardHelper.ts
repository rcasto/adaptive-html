import { toArray } from "./utilityHelper";
import { CARD_TYPES, isContainer } from "./adaptiveCardFilter";
import { IAdaptiveCard } from "adaptivecards";
import {
  ICardElement,
  IContainer,
  IImage,
  ITextBlock,
} from "adaptivecards/lib/schema";
import { IToJSONOptions } from "../interfaces";

function setOptions(obj, options = {}) {
  Object.keys(options).forEach((optionKey) => {
    obj[optionKey] = options[optionKey];
  });
}

export function createCard(
  elements,
  options: IToJSONOptions = {}
): IAdaptiveCard {
  var card: IAdaptiveCard = {
    type: CARD_TYPES.ADAPTIVE_CARD,
    body: [],
    actions: [],
    version: options.version || "1.0",
  };
  var body = toArray(elements);
  if (
    Array.isArray(elements) &&
    elements.length === 1 &&
    isContainer(elements[0])
  ) {
    body = toArray(unwrap(elements[0]));
  }
  card.body = body;
  return card;
}

export function createTextBlock(text: string, options = {}): ITextBlock {
  const textBlock: ITextBlock = {
    type: CARD_TYPES.TEXT_BLOCK,
    text: text || "",
    wrap: true,
  };
  setOptions(textBlock, options);
  return textBlock;
}

export function createHeadingTextBlock(
  text: string,
  depth: number
): ITextBlock {
  var weight = "bolder";
  var size = "default";
  switch (depth) {
    case 1:
      size = "extraLarge";
      break;
    case 2:
      size = "large";
      break;
    case 3:
      size = "medium";
      break;
    case 4:
      size = "medium";
      weight = "default";
      break;
    case 5:
      size = "default";
      break;
    case 6:
      size = "small";
      break;
  }
  return createTextBlock(text, {
    size,
    weight,
  });
}

export function createImage(url: string, options = {}): IImage {
  const image: IImage = {
    type: CARD_TYPES.IMAGE,
    url: url,
  };
  setOptions(image, options);
  return image;
}

// Wrap adaptive card elements in a container
export function wrap(
  elements: ICardElement | ICardElement[],
  options = {}
): IContainer {
  const elementsArray: ICardElement[] = toArray(elements);
  /* Don't wrap only a container in a container */
  if (elements.length === 1 && isContainer(elements[0])) {
    return elements[0];
  }
  let container: IContainer = {
    type: CARD_TYPES.CONTAINER,
    items: elementsArray,
  };
  setOptions(container, options);
  return container;
}

// Returns the list of elements within a container
// If the item passed in is not a container, it is simply returned
export function unwrap(container: IContainer): ICardElement[] {
  if (!isContainer(container)) {
    return toArray(container);
  }
  return container.items || [];
}
