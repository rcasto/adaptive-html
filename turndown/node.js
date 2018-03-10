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

import {
    isBlock,
    isVoid,
    hasVoid
} from './utilities'

export default function Node(node) {
    node.isBlock = isBlock(node)
    node.isCode = node.nodeName.toLowerCase() === 'code' || node.parentNode.isCode
    node.isBlank = isBlank(node)
    node.flankingWhitespace = flankingWhitespace(node)
    return node
}

function isBlank(node) {
    return (
        ['A', 'TH', 'TD'].indexOf(node.nodeName) === -1 &&
        /^\s*$/i.test(node.textContent) &&
        !isVoid(node) &&
        !hasVoid(node)
    )
}

function flankingWhitespace(node) {
    var leading = ''
    var trailing = ''

    if (!node.isBlock) {
        var hasLeading = /^[ \r\n\t]/.test(node.textContent)
        var hasTrailing = /[ \r\n\t]$/.test(node.textContent)

        if (hasLeading && !isFlankedByWhitespace('left', node)) {
            leading = ' '
        }
        if (hasTrailing && !isFlankedByWhitespace('right', node)) {
            trailing = ' '
        }
    }

    return {
        leading: leading,
        trailing: trailing
    }
}

function isFlankedByWhitespace(side, node) {
    var sibling
    var regExp
    var isFlanked

    if (side === 'left') {
        sibling = node.previousSibling
        regExp = / $/
    } else {
        sibling = node.nextSibling
        regExp = /^ /
    }

    if (sibling) {
        if (sibling.nodeType === 3) {
            isFlanked = regExp.test(sibling.nodeValue)
        } else if (sibling.nodeType === 1 && !isBlock(sibling)) {
            isFlanked = regExp.test(sibling.textContent)
        }
    }
    return isFlanked
}