var test = require('ava');
var JSDOM = require('jsdom').JSDOM;
var AdaptiveHtml = require('../dist/adaptive-html.cjs');

var jsdomInstance = new JSDOM();

// Setup globals for adaptivecards
global.document = jsdomInstance.window.document;
global.window = jsdomInstance.window;
global.HTMLElement = jsdomInstance.window.HTMLElement;

test('can handle non JSON string', t => {
    var error = t.throws(() => AdaptiveHtml.toHTML('This is not json'), TypeError);
    t.is(error.message, 'null is not valid Adaptive Card JSON.');
});

test('can handle invalid Adaptive Card JSON', t => {
    var fakeCardJson = {
        blah: 'This is not an adaptive card'
    };
    var error = t.throws(() => AdaptiveHtml.toHTML(fakeCardJson), TypeError);
    t.is(error.message, `${JSON.stringify(fakeCardJson)} is not valid Adaptive Card JSON.`);
});

test('can handle JSON string', t => {
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

test('can detect and replace p tags representing headings', t => {
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
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 26px; line-height: 34.58px; color: rgb(51, 51, 51); font-weight: 600; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                <h1>Heading 1</h1>
            </div>
            <div style="height: 20px; overflow: hidden; flex: 0 0 auto;"></div>
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 21px; line-height: 27.93px; color: rgb(51, 51, 51); font-weight: 600; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                <h2>Heading 2</h2>
            </div>
            <div style="height: 20px; overflow: hidden; flex: 0 0 auto;"></div>
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 17px; line-height: 22.61px; color: rgb(51, 51, 51); font-weight: 600; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                <h3>Heading 3</h3>
            </div>
            <div style="height: 20px; overflow: hidden; flex: 0 0 auto;"></div>
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 17px; line-height: 22.61px; color: rgb(51, 51, 51); font-weight: 200; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                <h4>Heading 4</h4>
            </div>
            <div style="height: 20px; overflow: hidden; flex: 0 0 auto;"></div>
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(51, 51, 51); font-weight: 600; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                <h5>Heading 5</h5>
            </div>
            <div style="height: 20px; overflow: hidden; flex: 0 0 auto;"></div>
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 12px; line-height: 15.96px; color: rgb(51, 51, 51); font-weight: 600; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                <h6>Heading 6</h6>
            </div>
        </div>
    `);
    t.deepEqual(result, elem);
});

function toJsdomFragment(htmlString) {
    return JSDOM.fragment(htmlString);
}