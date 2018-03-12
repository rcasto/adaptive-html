export function repeat(character, count) {
    return Array(count + 1).join(character)
}

export var blockElements = [
    'address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas',
    'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption',
    'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav',
    'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table',
    'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'
]

export function isBlock(node) {
    return blockElements.indexOf(node.nodeName.toLowerCase()) !== -1
}

export var voidElements = [
    'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
    'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]

export function isVoid(node) {
    return voidElements.indexOf(node.nodeName.toLowerCase()) !== -1
}

var voidSelector = voidElements.join()
export function hasVoid(node) {
    return node.querySelector && node.querySelector(voidSelector)
}

export function isNestedListItem(node) {
    if (!node || 
        node.nodeName !== 'LI' &&
        (node.parentNode !== 'UL' ||
        node.parentNode !== 'OL')) {
        return false;
    }
    var currNode = node.parentNode.parentNode;
    while (currNode) {
        if (currNode.nodeName === 'OL' ||
            currNode.nodeName === 'UL') {
            return true;
        }
        currNode = currNode.parentNode;
    }
    return false;
}