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

/**
 * Manages a collection of rules used to convert HTML to Markdown
 */

export default function Rules(options) {
    this.options = options

    this.blankRule = {
        replacement: options.blankReplacement
    }

    this.defaultRule = {
        replacement: options.defaultReplacement
    }

    this.array = []
    for (var key in options.rules) this.array.push(options.rules[key])
}

Rules.prototype = {
    forNode: function (node) {
        if (node.isBlank) return this.blankRule
        var rule;

        if ((rule = findRule(this.array, node, this.options))) return rule

        return this.defaultRule
    }
}

function findRule(rules, node, options) {
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i]
        if (filterValue(rule, node, options)) return rule
    }
    return void 0
}

function filterValue(rule, node, options) {
    var filter = rule.filter
    if (typeof filter === 'string') {
        if (filter === node.nodeName.toLowerCase()) return true
    } else if (Array.isArray(filter)) {
        if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true
    } else if (typeof filter === 'function') {
        if (filter.call(rule, node, options)) return true
    } else {
        throw new TypeError('`filter` needs to be a string, array, or function')
    }
}