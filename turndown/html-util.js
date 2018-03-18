import UtilityHelper from '../lib/utilityHelper';

/*
 * Set up window for Node.js
 */

var root = UtilityHelper.hasAccessToBrowserGlobals() ? window : {};
var parser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();

/*
 * Parsing HTML strings
 */
function canParseHTMLNatively() {
    var Parser = root.DOMParser
    var canParse = false

    // Adapted from https://gist.github.com/1129031
    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if (new Parser().parseFromString('', 'text/html')) {
            canParse = true
        }
    } catch (e) { }

    return canParse
}

function createHTMLParser() {
    var Parser = function () { }

    if (process.browser) {
        if (shouldUseActiveX()) {
            Parser.prototype.parseFromString = function (string) {
                var doc = new window.ActiveXObject('htmlfile')
                doc.designMode = 'on' // disable on-page scripts
                doc.open()
                doc.write(string)
                doc.close()
                return doc
            }
        } else {
            Parser.prototype.parseFromString = function (string) {
                var doc = document.implementation.createHTMLDocument('')
                doc.open()
                doc.write(string)
                doc.close()
                return doc
            }
        }
    } else {
        let JSDOM = require('jsdom').JSDOM;
        Parser.prototype.parseFromString = string => new JSDOM(string).window.document;
    }
    return Parser;
}

function shouldUseActiveX() {
    var useActiveX = false
    try {
        document.implementation.createHTMLDocument('').open()
    } catch (e) {
        if (window.ActiveXObject) useActiveX = true
    }
    return useActiveX
}

function createElement(tag) {
    if (canParseHTMLNatively()) {
        return root.document.createElement(tag);
    }
    let JSDOM = require('jsdom').JSDOM;
    return (new JSDOM()).window.document.createElement(tag);
}

export default {
    parser,
    createElement
};