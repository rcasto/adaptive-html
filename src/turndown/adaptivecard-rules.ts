import {
  wrap,
  unwrap,
  createTextBlock,
  createHeadingTextBlock,
  createImage,
} from "../lib/adaptiveCardHelper";
import {
  getTextBlocksAsString,
  getNonTextBlocks,
  isTextBlock,
  CARD_TYPES,
} from "../lib/adaptiveCardFilter";
import {
  isVoid,
  hasVoid,
  lineBreakRegex,
  carriageReturnTabRegex,
  isBlock,
} from "./utilities";
import { AdaptiveCardElement, NonTextAdaptiveCardElement } from "../interfaces";
import { IContainer, ICardElement } from "adaptivecards/lib/schema";

export interface IRule {
  filter: ((node: Element) => boolean) | string | Array<string>;
  replacement: (
    content: AdaptiveCardElement[],
    node: Node | Element
  ) => null | IBlock | ICardElement;
}

export interface IBlock {
  text: string;
  nonText: Array<NonTextAdaptiveCardElement>;
}

const rules: Record<string, IRule> = {};

rules.blank = {
  filter: function (node: Element) {
    return (
      ["A", "TH", "TD"].indexOf(node.nodeName) === -1 &&
      /^\s*$/i.test(node.textContent) &&
      !isVoid(node) &&
      !hasVoid(node)
    );
  },
  replacement: function (content, node) {
    if (node.textContent) {
      return handleTextEffects(content, function () {
        return node.textContent;
      });
    }
    return null;
  },
};

rules.text = {
  filter: function (node) {
    return node.nodeType === Node.TEXT_NODE;
  },
  replacement: function (content, node) {
    return handleTextEffects(content, function () {
      return node.nodeValue;
    });
  },
};

rules.lineBreak = {
  filter: "br",
  replacement: function (content) {
    return handleTextEffects(content, function (text) {
      return "  \n";
    });
  },
};

rules.heading = {
  filter: ['h1', "h2", "h3", "h4", "h5", "h6"],
  replacement: function (content, node) {
    const hLevel = Number(node.nodeName.charAt(1));
    const hText = getTextBlocksAsString(content);
    const hNonText = getNonTextBlocks(content);
    const hElements: ICardElement[] = [
      createHeadingTextBlock(hText, hLevel),
      ...hNonText,
    ];
    return wrap(hElements);
  },
};

rules.list = {
  filter: ["ul", "ol"],
  // content = array of listitem containers
  replacement: function (listItemContainers, node: Element) {
    var isOrdered = node.nodeName === "OL";
    var startIndex = parseInt(node.getAttribute("start"), 10) || 1; // only applicable to ordered lists
    var blocks = (listItemContainers || [])
      .map((listItemContainer, listItemIndex) => {
        var listItemElems = unwrap(listItemContainer as IContainer);
        var firstListItemElem = listItemElems[0];
        if (firstListItemElem && isTextBlock(firstListItemElem)) {
          let firstListItemPrefix = isOrdered
            ? `${startIndex + listItemIndex}. `
            : `- `;
          firstListItemElem.text = firstListItemPrefix + firstListItemElem.text;
        }
        return listItemElems;
      })
      .reduce((prevBlocks, listItemBlocks) => {
        return prevBlocks.concat(listItemBlocks);
      }, []);
    return wrap(blocks);
  },
};

rules.listItem = {
  filter: "li",
  replacement: function (content) {
    var currText = "";
    var blocks = (content || []).reduce((prevBlocks, currBlock) => {
      var cardType = currBlock.type;
      switch (cardType) {
        case CARD_TYPES.TEXT_BLOCK:
          currText += ` ${currBlock.text
            .replace(lineBreakRegex, "  \n\t")
            .trim()}`;
          break;
        case CARD_TYPES.CONTAINER:
          let nestedListElems = unwrap(currBlock as IContainer);
          nestedListElems.forEach((nestedListElem) => {
            if (isTextBlock(nestedListElem)) {
              currText += `\r\t${nestedListElem.text
                .replace(carriageReturnTabRegex, "\r\t\t")
                .replace(lineBreakRegex, "  \n\t")}`;
            } else {
              prevBlocks.push(nestedListElem);
            }
          });
          break;
        case CARD_TYPES.IMAGE:
          prevBlocks.push(currBlock);
          break;
        default:
          console.error(`Unsupported card type: ${cardType} ${currBlock}`);
      }
      return prevBlocks;
    }, []);

    if (currText) {
      blocks.unshift(createTextBlock(currText.trim()));
    }

    return wrap(blocks);
  },
};

rules.inlineLink = {
  filter: function (node) {
    return node.nodeName === "A" && !!node.getAttribute("href");
  },
  replacement: function (content, node: Element) {
    var href = node.getAttribute("href");
    return handleTextEffects(content, function (text) {
      return `[${text}](${href})`;
    });
  },
};

rules.emphasis = {
  filter: ["em", "i"],
  replacement: function (content, node) {
    return handleTextEffects(content, function (text) {
      return `_${text}_`;
    });
  },
};

rules.strong = {
  filter: ["strong", "b"],
  replacement: function (content, _node) {
    return handleTextEffects(content, function (text) {
      return `**${text}**`;
    });
  },
};

rules.image = {
  filter: "img",
  replacement: function (content, node: Element) {
    const alt = node.getAttribute("alt") || "";
    const src = node.getAttribute("src") || "";
    return createImage(src, {
      altText: alt,
    });
  },
};

/* This must be the last rule */
rules.default = {
  filter: () => true,
  replacement: function (content, node: Element) {
    if (isBlock(node)) {
      return wrap(content);
    }
    return content;
  },
};

function handleTextEffects(
  contentCollection: AdaptiveCardElement[],
  textFunc?: (text: string) => string
): IBlock {
  var nonText = getNonTextBlocks(contentCollection) || [];
  var text = getTextBlocksAsString(contentCollection) || "";
  if (typeof textFunc === "function") {
    text = textFunc(text);
  }
  return {
    text,
    nonText,
  };
}

export default rules;
