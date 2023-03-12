export const blockElements = [
  "address",
  "article",
  "aside",
  "audio",
  "blockquote",
  "body",
  "canvas",
  "center",
  "dd",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "html",
  "isindex",
  "li",
  "main",
  "menu",
  "nav",
  "noframes",
  "noscript",
  "ol",
  "output",
  "p",
  "pre",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
];

export function isBlock(node: Element): boolean {
  return blockElements.includes(node.nodeName.toLowerCase());
}

export const voidElements = [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
];

export function isVoid(node: Element): boolean {
  return voidElements.includes(node.nodeName.toLowerCase());
}

export const lineBreakRegex = /  \n/g;
export const carriageReturnTabRegex = /\r\t/g;

const voidSelector = voidElements.join();
export function hasVoid(node: Element): boolean {
  return !!(node.querySelector && node.querySelector(voidSelector));
}
