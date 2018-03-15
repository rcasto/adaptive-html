var JSDOM = require('jsdom').JSDOM;

function toFragment(htmlString) {
    return JSDOM.fragment(htmlString);
}

module.exports =  {
    toFragment
};