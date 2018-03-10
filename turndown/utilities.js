// MIT License

// Original work Copyright (c) 2017 Dom Christie
// Modified work Copyright (c) 2018 Richie Casto

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export function extend(destination) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        for (var key in source) {
            if (source.hasOwnProperty(key)) destination[key] = source[key]
        }
    }
    return destination
}

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