import {
  repeat
} from './utilities';
import AdaptiveCardHelper from '../lib/adaptiveCardHelper';
import AdaptiveCardFilter from '../lib/adaptiveCardFilter';

var rules = {};

rules.paragraph = {
  filter: 'p',

  replacement: function(content) {
      return AdaptiveCardHelper.wrap(content);
  }
};

rules.lineBreak = {
  filter: 'br',

  replacement: function(content, node, options) {
      return '\n';
  }
};

rules.heading = {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

  replacement: function(content, node, options) {
      var hLevel = Number(node.nodeName.charAt(1));
      var hText = AdaptiveCardFilter.getTextBlocksAsString(content);
      return AdaptiveCardHelper.createHeadingTextBlock(hText, hLevel);
  }
};

// rules.blockquote = {
//   filter: 'blockquote',

//   replacement: function (content) {
//     content = content.replace(/^\n+|\n+$/g, '');
//     content = content.replace(/^/gm, '> ');
//     return '\n\n' + content + '\n\n'
//   }
// };

rules.list = {
  filter: ['ul', 'ol'],
  // content = array of listitem containers
  replacement: function(content, node) {
      var isOrdered = node.nodeName === 'OL';

      console.log(content);

      // Want to take the list item unwrap it to get to the contents
      // Go through contents and add indentation or tab to nested lists
      // push images to bottom so as to show continuous list
      // All of list must be part of the same text block

      var blocks = (content || []).reduce(listItemContainer => {
          var listItemContents = AdaptiveCardHelper.unwrap(listItemContainer);
          (listItemContents || []).forEach(listItemContentItem => {
              console.log(listItemContentItem);
          });
      }, []);

      return AdaptiveCardHelper.wrap(content);
  }
};

rules.listItem = {
  filter: 'li',
  // list items will simply wrap their content in a container
  replacement: function(content, node, options) {
      var currText = '';
      var blocks = (content || []).reduce((prevBlocks, currBlock) => {
          var cardType = currBlock.type;
          switch (cardType) {
              case AdaptiveCardFilter.cardTypes.textBlock:
                  currText += currBlock.text;
                  break;
              case AdaptiveCardFilter.cardTypes.container:
                  let nestedListElems = AdaptiveCardHelper.unwrap(currBlock);
                  nestedListElems
                      .forEach(nestedListElem => {
                          if (AdaptiveCardFilter.isTextBlock(nestedListElem)) {
                              currText += '\r\t' + nestedListElem.text;
                          } else {
                              prevBlocks.push(nestedListElem);
                          }
                      });
                  break;
              case AdaptiveCardFilter.cardTypes.image:
                  prevBlocks.push(currBlock);
                  break;
              default:
                  console.error(`Unsupported card type: ${cardType} ${currBlock}`);
          }
          return prevBlocks;
      }, []);

      if (currText) {
          blocks.unshift(AdaptiveCardHelper.createTextBlock(currText));
      }

      return AdaptiveCardHelper.wrap(blocks);
  }
};

// rules.indentedCodeBlock = {
//   filter: function (node, options) {
//     return (
//       options.codeBlockStyle === 'indented' &&
//       node.nodeName === 'PRE' &&
//       node.firstChild &&
//       node.firstChild.nodeName === 'CODE'
//     )
//   },

//   replacement: function (content, node, options) {
//     return (
//       '\n\n    ' +
//       node.firstChild.textContent.replace(/\n/g, '\n    ') +
//       '\n\n'
//     )
//   }
// };

// rules.fencedCodeBlock = {
//   filter: function (node, options) {
//     return (
//       options.codeBlockStyle === 'fenced' &&
//       node.nodeName === 'PRE' &&
//       node.firstChild &&
//       node.firstChild.nodeName === 'CODE'
//     )
//   },

//   replacement: function (content, node, options) {
//     var className = node.firstChild.className || '';
//     var language = (className.match(/language-(\S+)/) || [null, ''])[1];

//     return (
//       '\n\n' + options.fence + language + '\n' +
//       node.firstChild.textContent +
//       '\n' + options.fence + '\n\n'
//     )
//   }
// };

// rules.horizontalRule = {
//   filter: 'hr',

//   replacement: function (content, node, options) {
//     return '\n\n' + options.hr + '\n\n'
//   }
// };

rules.inlineLink = {
  filter: function(node, options) {
      return (
          options.linkStyle === 'inlined' &&
          node.nodeName === 'A' &&
          node.getAttribute('href')
      )
  },

  replacement: function(content, node) {
      var href = node.getAttribute('href');
      var title = node.title ? ' "' + node.title + '"' : '';
      var linkText = AdaptiveCardFilter.getTextBlocksAsString(content);
      return `[${linkText}](${href})`;
  }
};

// rules.referenceLink = {
//   filter: function (node, options) {
//     return (
//       options.linkStyle === 'referenced' &&
//       node.nodeName === 'A' &&
//       node.getAttribute('href')
//     )
//   },

//   replacement: function (content, node, options) {
//     var href = node.getAttribute('href');
//     var title = node.title ? ' "' + node.title + '"' : '';
//     var replacement;
//     var reference;

//     switch (options.linkReferenceStyle) {
//       case 'collapsed':
//         replacement = '[' + content + '][]';
//         reference = '[' + content + ']: ' + href + title;
//         break
//       case 'shortcut':
//         replacement = '[' + content + ']';
//         reference = '[' + content + ']: ' + href + title;
//         break
//       default:
//         var id = this.references.length + 1;
//         replacement = '[' + content + '][' + id + ']';
//         reference = '[' + id + ']: ' + href + title;
//     }

//     this.references.push(reference);
//     return replacement
//   },

//   references: [],

//   append: function (options) {
//     var references = '';
//     if (this.references.length) {
//       references = '\n\n' + this.references.join('\n') + '\n\n';
//       this.references = []; // Reset references
//     }
//     return references
//   }
// };

rules.emphasis = {
  filter: ['em', 'i'],
  // TODO: what elements are valid inside of these elements?
  replacement: function(content, node, options) {
      var emText = AdaptiveCardFilter.getTextBlocksAsString(content);
      return `${options.emDelimiter}${emText}${options.emDelimiter}`;
  }
};

rules.strong = {
  filter: ['strong', 'b'],

  replacement: function(content, node, options) {
      var strongText = AdaptiveCardFilter.getTextBlocksAsString(content);
      return `${options.strongDelimiter}${strongText}${options.strongDelimiter}`;
  }
};

// rules.code = {
//   filter: function (node) {
//     var hasSiblings = node.previousSibling || node.nextSibling;
//     var isCodeBlock = node.parentNode.nodeName === 'PRE' && !hasSiblings;

//     return node.nodeName === 'CODE' && !isCodeBlock
//   },

//   replacement: function (content) {
//     if (!content.trim()) return ''

//     var delimiter = '`';
//     var leadingSpace = '';
//     var trailingSpace = '';
//     var matches = content.match(/`+/gm);
//     if (matches) {
//       if (/^`/.test(content)) leadingSpace = ' ';
//       if (/`$/.test(content)) trailingSpace = ' ';
//       while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`';
//     }

//     return delimiter + leadingSpace + content + trailingSpace + delimiter
//   }
// };

rules.image = {
  filter: 'img',

  replacement: function(content, node) {
      var alt = node.alt || '';
      var src = node.getAttribute('src') || '';
      return AdaptiveCardHelper.createImage(src, {
          altText: alt
      });
  }
};

export default rules;