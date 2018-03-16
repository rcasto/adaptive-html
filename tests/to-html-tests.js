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
    t.deepEqual(result.outerHTML, html);
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
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6></div>`;
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