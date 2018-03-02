import AdaptiveCardRules from './adaptivecard-rules';
import AdaptiveCardHelper from '../lib/adaptiveCardHelper';
import AdaptiveCardFilter from '../lib/adaptiveCardFilter';
import UtilityHelper from '../lib/utilityHelper';
import Rules from './rules'
import { extend } from './utilities'
import RootNode from './root-node'
import Node from './node'
import adaptiveCardFilter from '../lib/adaptiveCardFilter';

var reduce = Array.prototype.reduce
var leadingNewLinesRegExp = /^\n*/
var trailingNewLinesRegExp = /\n*$/

export default function TurndownService (options) {
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
    blankReplacement: function (content, node) {
      console.log('Blanking replacement');
      // return node.isBlock ? AdaptiveCardHelper.wrap() : AdaptiveCardHelper.createTextBlock();
    },
    keepReplacement: function (content, node) {
      console.log('Keeping replacement');
      // return node.isBlock ? AdaptiveCardHelper.wrap(node.outerHTML) + '\n\n' : node.outerHTML
    },
    defaultReplacement: function (content, node) {
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

  turndown: function (input) {
    if (!canConvert(input)) {
      throw new TypeError(
        input + ' is not a string, or an element/document/fragment node.'
      )
    }

    if (input === '') return ''

    var cardElems = process.call(this, new RootNode(input));
    cardElems = AdaptiveCardHelper.combineTextBlocks(cardElems);
    return AdaptiveCardHelper.createCard(cardElems);
  },

  /**
   * Add one or more plugins
   * @public
   * @param {Function|Array} plugin The plugin or array of plugins to add
   * @returns The Turndown instance for chaining
   * @type Object
   */

  use: function (plugin) {
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

  addRule: function (key, rule) {
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

  keep: function (filter) {
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

  remove: function (filter) {
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

  escape: function (string) {
    return (
      string
        // Escape backslash escapes!
        .replace(/\\(\S)/g, '\\\\$1')

        // Escape headings
        .replace(/^(#{1,6} )/gm, '\\$1')

        // Escape hr
        .replace(/^([-*_] *){3,}$/gm, function (match, character) {
          return match.split(character).join('\\' + character)
        })

        // Escape ol bullet points
        .replace(/^(\W* {0,3})(\d+)\. /gm, '$1$2\\. ')

        // Escape ul bullet points
        .replace(/^([^\\\w]*)[*+-] /gm, function (match) {
          return match.replace(/([*+-])/g, '\\$1')
        })

        // Escape blockquote indents
        .replace(/^(\W* {0,3})> /gm, '$1\\> ')

        // Escape em/strong *
        .replace(/\*+(?![*\s\W]).+?\*+/g, function (match) {
          return match.replace(/\*/g, '\\*')
        })

        // Escape em/strong _
        .replace(/_+(?![_\s\W]).+?_+/g, function (match) {
          return match.replace(/_/g, '\\_')
        })

        // Escape code _
        .replace(/`+(?![`\s\W]).+?`+/g, function (match) {
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

function process (parentNode) {
  var self = this;
  return reduce.call(parentNode.childNodes, function (output, node) {
    node = new Node(node);

    var replacement = [];
    if (node.nodeType === 3) { // text node
      replacement = node.isCode ? node.nodeValue : AdaptiveCardHelper.createTextBlock(self.escape(node.nodeValue));
    } else if (node.nodeType === 1) { // element node
      replacement = replacementForNode.call(self, node);
    }

    console.log(node.nodeName, replacement);

    //  on <br /> tag wrap previous textblock in a container so it is
    // not combined, this is pretty hacky will need a cleaner solution
    if (node.nodeName === 'BR' && output.length > 0) {
      let prevOutput = output[output.length - 1];
      if (AdaptiveCardFilter.isTextBlock(prevOutput)) {
        output[output.length - 1] = AdaptiveCardHelper.wrap(prevOutput);
      }
    }

    // combine textblocks within a container
    if (AdaptiveCardFilter.isContainer(replacement)) {
      let replacementContents = AdaptiveCardHelper.unwrap(replacement);
      replacementContents = AdaptiveCardHelper.combineTextBlocks(replacementContents);
      replacement = AdaptiveCardHelper.wrap(replacementContents);
    }

    return join(output, replacement);
  }, []);
}

/**
 * Converts an element node to its Markdown equivalent
 * @private
 * @param {HTMLElement} node The node to convert
 * @returns A Markdown representation of the node
 * @type String
 */

function replacementForNode (node) {
  var rule = this.rules.forNode(node);
  var content = process.call(this, node);
  return rule.replacement(content, node, this.options);
}

function join (blocks1, blocks2) {
  blocks1 = UtilityHelper.toArray(blocks1);
  blocks2 = UtilityHelper.toArray(blocks2);
  return blocks1.concat(blocks2);
}

/**
 * Determines whether an input can be converted
 * @private
 * @param {String|HTMLElement} input Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */

function canConvert (input) {
  return (
    input != null && (
      typeof input === 'string' ||
      (input.nodeType && (
        input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11
      ))
    )
  )
}
