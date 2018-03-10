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

import collapseWhitespace from './collapse-whitespace'
import HTMLParser from './html-parser'
import {
    isBlock,
    isVoid
} from './utilities'

export default function RootNode(input) {
    var root
    if (typeof input === 'string') {
        var doc = htmlParser().parseFromString(
            // DOM parsers arrange elements in the <head> and <body>.
            // Wrapping in a custom element ensures elements are reliably arranged in
            // a single element.
            '<x-turndown id="turndown-root">' + input + '</x-turndown>',
            'text/html'
        )
        root = doc.getElementById('turndown-root')
    } else {
        root = input.cloneNode(true)
    }
    collapseWhitespace({
        element: root,
        isBlock: isBlock,
        isVoid: isVoid
    })

    return root
}

var _htmlParser

function htmlParser() {
    _htmlParser = _htmlParser || new HTMLParser()
    return _htmlParser
}