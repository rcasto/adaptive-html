var test = require('ava');
var AdaptiveHtml = require('../dist/adaptive-html.cjs');

test('can handle HTML -> JSON -> HTML', t => {
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">Turn me into an Adaptive Card</div></div>`;
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