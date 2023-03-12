import collapseWhitespace from "./collapse-whitespace";
import { isBlock, isVoid } from "./utilities";

var _htmlParser: DOMParser;

function RootNode(input: string | Node): Node {
  var root: Node;
  if (typeof input === "string") {
    var doc = htmlParser().parseFromString(
      // DOM parsers arrange elements in the <head> and <body>.
      // Wrapping in a custom element ensures elements are reliably arranged in
      // a single element.
      `<x-turndown id="turndown-root">${input}</x-turndown>`,
      "text/html"
    );
    root = doc.getElementById("turndown-root");
  } else {
    root = input.cloneNode(true);
  }
  collapseWhitespace({
    element: root,
    isBlock: isBlock,
    isVoid: isVoid,
  });
  return root;
}

function htmlParser(): DOMParser {
  _htmlParser = _htmlParser || new DOMParser();
  return _htmlParser;
}

export default RootNode;
