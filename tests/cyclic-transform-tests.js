var test = require('ava');
var AdaptiveHtml = require('../dist/adaptive-html.cjs');

test('can handle HTML -> JSON -> HTML', t => {
    var html = `<div><div>Turn me into an Adaptive Card</div></div>`;
    var htmlResult = AdaptiveHtml.toHTML(AdaptiveHtml.toJSON(html));
    t.is(htmlResult.outerHTML, html);
});

test('can handle JSON -> HTML -> JSON', t => {
    var json = {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Turn me into an Adaptive Card",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    };
    var jsonResult = AdaptiveHtml.toJSON(AdaptiveHtml.toHTML(json));
    t.deepEqual(jsonResult, json);
});