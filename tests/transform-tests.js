var test = require('ava');
var AdaptiveHtml = require('./adaptive-html');

test('can transform text node', t => {
    var result = AdaptiveHtml.transform('This is some text');
    t.pass();
});