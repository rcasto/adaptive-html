import AdaptiveCardRules from './adaptivecard-rules';
import AdaptiveCardHelper from '../lib/adaptiveCardHelper';
import AdaptiveCardFilter from '../lib/adaptiveCardFilter';
import UtilityHelper from '../lib/utilityHelper';
import Rules from './rules'
import {
    extend
} from './utilities'
import RootNode from './root-node'
import Node from './node'

var reduce = Array.prototype.reduce
var leadingNewLinesRegExp = /^\n*/
var trailingNewLinesRegExp = /\n*$/

export default function TurndownService(options) {
    if (!(this instanceof TurndownService)) return new TurndownService(options)

    var defaults = {
        rules: AdaptiveCardRules,
        headingStyle: 'setext',
        hr: '* * *',
        bulletListMarker: '*',
        codeBlockStyle: 'indented',
        fence: '```',
        emDelimiter: '_',
        strongDelimiter: '**',
        linkStyle: 'inlined',
        linkReferenceStyle: 'full',
        br: '  ',
        blankReplacement: function(content, node) {
            console.log('Blanking replacement');
            // return node.isBlock ? AdaptiveCardHelper.wrap() : AdaptiveCardHelper.createTextBlock();
        },
        keepReplacement: function(content, node) {
            console.log('Keeping replacement');
            // return node.isBlock ? AdaptiveCardHelper.wrap(node.outerHTML) + '\n\n' : node.outerHTML
        },
        defaultReplacement: function(content, node) {
            console.log('Default replacement');
            return node.isBlock ?
                AdaptiveCardHelper.wrap(content) : AdaptiveCardHelper.createTextBlock(content);
        }
    }
    this.options = extend({}, defaults, options)
    this.rules = new Rules(this.options)
}

TurndownService.prototype = {
    /**
     * The entry point for converting a string or DOM node to Markdown
     * @public
     * @param {String|HTMLElement} input The string or DOM node to convert
     * @returns A Markdown representation of the input
     * @type String
     */

    turndown: function(input) {
        if (!canConvert(input)) {
            throw new TypeError(
                input + ' is not a string, or an element/document/fragment node.'
            )
        }

        if (input === '') return ''

        var cardElems = process.call(this, new RootNode(input));
        return AdaptiveCardHelper.createCard(cardElems);
    },

    /**
     * Add one or more plugins
     * @public
     * @param {Function|Array} plugin The plugin or array of plugins to add
     * @returns The Turndown instance for chaining
     * @type Object
     */

    use: function(plugin) {
        if (Array.isArray(plugin)) {
            for (var i = 0; i < plugin.length; i++) this.use(plugin[i])
        } else if (typeof plugin === 'function') {
            plugin(this)
        } else {
            throw new TypeError('plugin must be a Function or an Array of Functions')
        }
        return this
    },

    /**
     * Adds a rule
     * @public
     * @param {String} key The unique key of the rule
     * @param {Object} rule The rule
     * @returns The Turndown instance for chaining
     * @type Object
     */

    addRule: function(key, rule) {
        this.rules.add(key, rule)
        return this
    },

    /**
     * Keep a node (as HTML) that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */

    keep: function(filter) {
        this.rules.keep(filter)
        return this
    },

    /**
     * Remove a node that matches the filter
     * @public
     * @param {String|Array|Function} filter The unique key of the rule
     * @returns The Turndown instance for chaining
     * @type Object
     */

    remove: function(filter) {
        this.rules.remove(filter)
        return this
    },

    /**
     * Escapes Markdown syntax
     * @public
     * @param {String} string The string to escape
     * @returns A string with Markdown syntax escaped
     * @type String
     */

    escape: function(string) {
        return (
            string
            // Escape backslash escapes!
            .replace(/\\(\S)/g, '\\\\$1')

            // Escape headings
            .replace(/^(#{1,6} )/gm, '\\$1')

            // Escape hr
            .replace(/^([-*_] *){3,}$/gm, function(match, character) {
                return match.split(character).join('\\' + character)
            })

            // Escape ol bullet points
            .replace(/^(\W* {0,3})(\d+)\. /gm, '$1$2\\. ')

            // Escape ul bullet points
            .replace(/^([^\\\w]*)[*+-] /gm, function(match) {
                return match.replace(/([*+-])/g, '\\$1')
            })

            // Escape blockquote indents
            .replace(/^(\W* {0,3})> /gm, '$1\\> ')

            // Escape em/strong *
            .replace(/\*+(?![*\s\W]).+?\*+/g, function(match) {
                return match.replace(/\*/g, '\\*')
            })

            // Escape em/strong _
            .replace(/_+(?![_\s\W]).+?_+/g, function(match) {
                return match.replace(/_/g, '\\_')
            })

            // Escape code _
            .replace(/`+(?![`\s\W]).+?`+/g, function(match) {
                return match.replace(/`/g, '\\`')
            })

            // Escape link brackets
            .replace(/[\[\]]/g, '\\$&') // eslint-disable-line no-useless-escape
        )
    }
}

/**
 * Reduces a DOM node down to its Markdown string equivalent
 * @private
 * @param {HTMLElement} parentNode The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function process(parentNode) {
    var self = this;
    var currText = '';
    var blocks = reduce.call(parentNode.childNodes, function(output, node) {
        node = new Node(node);

        var replacement = [];
        if (node.nodeType === 3) { // text node
            replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
        } else if (node.nodeType === 1) { // element node
            replacement = replacementForNode.call(self, node);
        }

        console.log(node.nodeName, replacement);

        if (typeof replacement === 'string') {
            // '\n' is output by br tag replacement and is used to indicate
            // separation or a new text block should be constructed
            if (replacement === '\n') {
                output.push(AdaptiveCardHelper.createTextBlock(currText));
                currText = '';
            } else { // We're still constructing text for same text block, simply add it
                currText += replacement;
            }
            return output;
        }

        // Make sure to add any leftover text as an additional textblock to the block list
        if (currText) {
            output.push(AdaptiveCardHelper.createTextBlock(currText));
            currText = '';
        }

        return output.concat(UtilityHelper.toArray(replacement));
    }, []);

    // Make sure to add any leftover text as an additional textblock to the block list
    if (currText) {
        blocks.push(AdaptiveCardHelper.createTextBlock(currText));
    }

    return blocks;
}

/**
 * Converts an element node to its Markdown equivalent
 * @private
 * @param {HTMLElement} node The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function replacementForNode(node) {
    var rule = this.rules.forNode(node);
    var content = process.call(this, node); // get's internal content of node
    return rule.replacement(content, node, this.options);
}

/**
 * Determines whether an input can be converted
 * @private
 * @param {String|HTMLElement} input Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */

function canConvert(input) {
    return (
        input != null && (
            typeof input === 'string' ||
            (input.nodeType && (
                input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
            ))
        )
    )
}