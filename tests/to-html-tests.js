var test = require('ava');
var AdaptiveHtml = require('../dist/adaptive-html.cjs');

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
    var result = AdaptiveHtml.toHTML(`{
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "testing",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }`);
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">testing</div></div>`;
    t.is(result.outerHTML, html);
});

test('can handle JSON', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "testing",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">testing</div></div>`;
    t.is(result.outerHTML, html);
});

test('can detect and replace p tags representing headings', t => {
    var result = AdaptiveHtml.toHTML({
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
                "weight": "default"
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
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 26px; line-height: 34.58px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;"><h1>Heading 1</h1></div><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 21px; line-height: 27.93px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;"><h2>Heading 2</h2></div><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 17px; line-height: 22.61px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;"><h3>Heading 3</h3></div><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 17px; line-height: 22.61px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;"><h4>Heading 4</h4></div><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;"><h5>Heading 5</h5></div><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 12px; line-height: 15.96px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;"><h6>Heading 6</h6></div></div>`;
    t.is(result.outerHTML, html);
});

test('can remove empty divs from output', t => {
    var result = AdaptiveHtml.toHTML({
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
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div class="ac-container" style="display: flex; box-sizing: border-box;"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">testing</div></div><div class="ac-container" style="display: flex; box-sizing: border-box;"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">testing</div></div></div>`;
    t.is(result.outerHTML, html);
});

test('can utilize passed in processMarkdown function in options object', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "testing",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processMarkdown: (text) => 'fake-markdown-processing'
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">fake-markdown-processing</div></div>`;
    t.is(result.outerHTML, html);
});

test('can utilize processNode override through options object', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "hey",
                "wrap": true,
                "size": "extraLarge",
                "weight": "bolder"
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        // doesn't do anything, should result in default adaptivecards library output
        processNode: (node) => undefined
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 26px; line-height: 34.58px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;">hey</div></div>`;
    t.is(result.outerHTML, html);
});

test('can utilize custom host config pass through options object', t => {
    var customHostConfig = {
        fontSizes: {
            small: 12,
            default: 15,
            medium: 17,
            large: 21,
            extraLarge: 22
        },
        fontWeights: {
            lighter: 100,
            default: 300,
            bolder: 700
        }
    };
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "hey",
                "wrap": true,
                "size": "extraLarge",
                "weight": "bolder"
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        hostConfig: customHostConfig
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 22px; line-height: 29.26px; color: rgb(0, 0, 0); font-weight: 700; word-wrap: break-word; box-sizing: border-box;"><h1>hey</h1></div></div>`;
    t.is(result.outerHTML, html);
});

test('can indicate whether headings should be reconstructed or not through options object', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "hey",
                "wrap": true,
                "size": "extraLarge",
                "weight": "bolder"
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        reconstructHeadings: false
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 26px; line-height: 34.58px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;">hey</div></div>`;
    t.is(result.outerHTML, html);
});