var test = require('ava');
var AdaptiveHtml = require('../dist/adaptive-html.cjs');
var jsdomHelper = require('./util/jsdomHelper');

test('can handle HTML -> JSON -> HTML', t => {
    var html = jsdomHelper.toFragment(`
        <div class="ac-container" tabindex="0" style="display: flex; flex-direction: column; justify-content: flex-start; background-color: rgb(255, 255, 255); box-sizing: border-box; flex: 0 0 auto; padding: 20px;">
            <div class="ac-container" style="display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex: 0 0 auto;">
                <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(51, 51, 51); font-weight: 400; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                    <p style="margin-top: 0px; width: 100%; margin-bottom: 0px;">Turn me into an Adaptive Card</p>
                </div>
            </div>
        </div>
    `);
    var htmlResult = jsdomHelper.toFragment(AdaptiveHtml.toHTML(AdaptiveHtml.toJSON(html)));
    t.deepEqual(htmlResult, html);
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