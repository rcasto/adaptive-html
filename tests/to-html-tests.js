var test = require('ava');
var JSDOM = require('jsdom').JSDOM;
var AdaptiveHtml = require('../dist/adaptive-html.cjs');

test.skip('can handle non JSON string', t => {
    var error = t.throws(() => AdaptiveHtml.toHTML('This is not json'), TypeError);
    t.is(error.message, 'null is not valid Adaptive Card JSON.');
});

test.skip('can handle invalid Adaptive Card JSON', t => {
    var fakeCardJson = {
        blah: 'This is not an adaptive card'
    };
    var error = t.throws(() => AdaptiveHtml.toHTML(fakeCardJson), TypeError);
    t.is(error.message, `${JSON.stringify(fakeCardJson)} is not valid Adaptive Card JSON.`);
});

test.skip('can handle JSON string', t => {
    var result = toJsdomFragment(AdaptiveHtml.toHTML(`{
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "testing",
                        "wrap": true
                    }
                ]
            }
        ],
        "actions": [],
        "version": "1.0"
    }`));
    var elem = toJsdomFragment(`
        <div class="ac-container" tabindex="0" style="display: flex; flex-direction: column; justify-content: flex-start; background-color: rgb(255, 255, 255); box-sizing: border-box; flex: 0 0 auto; padding: 20px;">
            <div class="ac-container" style="display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex: 0 0 auto;">
                <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(51, 51, 51); font-weight: 400; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                    <p style="margin-top: 0px; width: 100%; margin-bottom: 0px;">testing</p>
                </div>
            </div>
        </div>
    `);
    t.deepEqual(result, elem);
});

test.skip('can handle JSON', t => {
    var result = toJsdomFragment(AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "testing",
                        "wrap": true
                    }
                ]
            }
        ],
        "actions": [],
        "version": "1.0"
    }));
    var elem = toJsdomFragment(`
        <div class="ac-container" tabindex="0" style="display: flex; flex-direction: column; justify-content: flex-start; background-color: rgb(255, 255, 255); box-sizing: border-box; flex: 0 0 auto; padding: 20px;">
            <div class="ac-container" style="display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex: 0 0 auto;">
                <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(51, 51, 51); font-weight: 400; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                    <p style="margin-top: 0px; width: 100%; margin-bottom: 0px;">testing</p>
                </div>
            </div>
        </div>
    `);
    t.deepEqual(result, elem);
});

test.skip('can detect and replace p tags representing headings', t => {
    var result = toJsdomFragment(AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Heading 1",
                "wrap": true,
                "size": "extraLarge",
                "weight": "bolder"
            },
            {
                "type": "TextBlock",
                "text": "Heading 2",
                "wrap": true,
                "size": "large",
                "weight": "bolder"
            },
            {
                "type": "TextBlock",
                "text": "Heading 3",
                "wrap": true,
                "size": "medium",
                "weight": "bolder"
            },
            {
                "type": "TextBlock",
                "text": "Heading 4",
                "wrap": true,
                "size": "medium",
                "weight": "lighter"
            },
            {
                "type": "TextBlock",
                "text": "Heading 5",
                "wrap": true,
                "size": "default",
                "weight": "bolder"
            },
            {
                "type": "TextBlock",
                "text": "Heading 6",
                "wrap": true,
                "size": "small",
                "weight": "bolder"
            }
        ],
        "actions": [],
        "version": "1.0"
    }));
    var elem = toJsdomFragment(`
        <div class="ac-container" tabindex="0" style="display: flex; flex-direction: column; justify-content: flex-start; background-color: rgb(255, 255, 255); box-sizing: border-box; flex: 0 0 auto; padding: 20px;">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
        </div>
    `);
    t.deepEqual(result, elem);
});

test.skip('can remove empty divs from output', t => {
    var result = toJsdomFragment(AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "testing",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "testing",
                        "wrap": true
                    }
                ]
            }
        ],
        "actions": [],
        "version": "1.0"
    }));
    var elem = toJsdomFragment(`
        <div class="ac-container" tabindex="0" style="display: flex; flex-direction: column; justify-content: flex-start; background-color: rgb(255, 255, 255); box-sizing: border-box; flex: 0 0 auto; padding: 20px;">
            <div class="ac-container" style="display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex: 0 0 auto;">
                <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(51, 51, 51); font-weight: 400; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                    <p style="margin-top: 0px; width: 100%; margin-bottom: 0px;">testing</p>
                </div>
            </div>
            <div class="ac-container" style="display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex: 0 0 auto;">
                <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(51, 51, 51); font-weight: 400; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                    <p style="margin-top: 0px; width: 100%; margin-bottom: 0px;">testing</p>
                </div>
            </div>
        </div>
    `);
    t.deepEqual(result, elem);
});

function toJsdomFragment(htmlString) {
    return JSDOM.fragment(htmlString);
}