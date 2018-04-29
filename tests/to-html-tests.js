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
    var html = `<div><div>testing</div></div>`;
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
    var html = `<div><div>testing</div></div>`;
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
    var html = `<div><h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6></div>`;
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
    var html = `<div><div><div>testing</div></div><div><div>testing</div></div></div>`;
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
    var html = `<div><div>fake-markdown-processing</div></div>`;
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
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><h1>hey</h1></div>`;
    t.is(result.outerHTML, html);
});

test('can preserve start attribute for ordered lists', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "1. hey",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "1. blah",
                        "wrap": true
                    }
                ]
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processMarkdown: text => `<ol start="2"><li>${text}</li></ol>`
    });
    var html = `<div><div><div><ol start="2"><li>1. hey</li></ol></div></div><div><div><ol start="2"><li>1. blah</li></ol></div></div></div>`;
    t.is(result.outerHTML, html);
});

test('can preserve href for a tag', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "test",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processMarkdown: text => `<a href="https://fake-site.com">${text}</a>`
    });
    var html = `<div><div><a href="https://fake-site.com">test</a></div></div>`;
    t.is(result.outerHTML, html);
});

test('can preserve src and alt for img tag', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Image",
                "url": "https://fake-image.com",
                "altText": "Some alt text"
            }
        ],
        "actions": [],
        "version": "1.0"
    });
    var html = `<div><div><img src="https://fake-image.com" alt="Some alt text"></div></div>`;
    t.is(result.outerHTML, html);
});

test('can handle container with only one element and text nodes', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "This is a <strong>test</strong> how did we do"
                    }
                ]
            }
        ],
        "actions": [],
        "version": "1.0"
    });
    var html = `<div><div><div>This is a <strong>test</strong> how did we do</div></div></div>`;
    t.is(result.outerHTML, html);
});

test('can handle line breaks in TextBlock', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Give me a break  \nI'm so  \nfunny hahaha"
            }
        ],
        "actions": [],
        "version": "1.0"
    });
    var html = `<div><div>Give me a break<br>I'm so<br>funny hahaha</div></div>`;
    t.is(result.outerHTML, html);
});

test('can not processMarkdown', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "**test**",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processMarkdown: false
    });
    var html = `<div><div>**test**</div></div>`;
    t.is(result.outerHTML, html);
});

test('can not processNode', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "**test**",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processNode: false
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">**test**</div></div>`;
    t.is(result.outerHTML, html);
});

test('can processNode, dont remove empty nodes', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "First block of text",
                "wrap": true
            },
            {
                "type": "TextBlock",
                "text": "Second block of text",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processNode: {
            removeEmptyNodes: false
        }
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">First block of text</div><div style="height: 8px; overflow: hidden;"></div><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">Second block of text</div></div>`;
    t.is(result.outerHTML, html);
});

test('can processNode, dont reconstruct headings', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Don't reconstruct me",
                "wrap": true,
                "size": "extraLarge",
                "weight": "bolder"
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processNode: {
            reconstructHeadings: false
        }
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 26px; line-height: 34.58px; color: rgb(0, 0, 0); font-weight: 600; word-wrap: break-word; box-sizing: border-box;">Don't reconstruct me</div></div>`;
    t.is(result.outerHTML, html);
});

test('can processNode, dont remove attributes', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Don't remove my attributes",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processNode: {
            removeAttributes: false
        }
    });
    var html = `<div class="ac-container" style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;" tabindex="0"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">Don't remove my attributes</div></div>`;
    t.is(result.outerHTML, html);
});

test('can processNode, use custom remove attributes whitelist', t => {
    var result = AdaptiveHtml.toHTML({
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "TextBlock",
                "text": "Only keep my style",
                "wrap": true
            }
        ],
        "actions": [],
        "version": "1.0"
    }, {
        processNode: {
            removeAttributes: ['style']
        }
    });
    var html = `<div style="display: flex; box-sizing: border-box; padding: 15px 15px 15px 15px;"><div style="overflow: hidden; font-family: Segoe UI,Segoe,Segoe WP,Helvetica Neue,Helvetica,sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box;">Only keep my style</div></div>`;
    t.is(result.outerHTML, html);
});