var test = require('ava');
var AdaptiveHtml = require('./adaptive-html');

test('can transform text node', t => {
    var result = AdaptiveHtml.transform('This is some text');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "TextBlock",
            text: "This is some text",
            wrap: true
        }],
        actions: [],
        version: "1.0"
    });
});

test('can transform text node with breaks in it', t => {
    var result = AdaptiveHtml.transform('This is some text<br />with a break in it');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "TextBlock",
            text: "This is some text",
            wrap: true
        }, {
            type: "TextBlock",
            text: "with a break in it",
            wrap: true
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle strong/b tags', t => {
    var result = AdaptiveHtml.transform('This is some <strong>strong</strong> text you <b>know</b>');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "TextBlock",
            text: "This is some **strong** text you **know**",
            wrap: true
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle em/i tags', t => {
    var result = AdaptiveHtml.transform('This is some <em>emphasized</em> text you <i>know</i>');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "TextBlock",
            text: "This is some _emphasized_ text you _know_",
            wrap: true
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle p tags', t => {
    var result = AdaptiveHtml.transform('<p>This is a paragraph</p>');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "This is a paragraph",
                wrap: true
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle p tag with breaks in it', t => {
    var result = AdaptiveHtml.transform('<p>This paragraph is<br />breaking up<br />what is happening?</p>');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "This paragraph is",
                wrap: true
            }, {
                type: "TextBlock",
                text: "breaking up",
                wrap: true
            }, {
                type: "TextBlock",
                text: "what is happening?",
                wrap: true
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle heading tags', t => {
    var result = AdaptiveHtml.transform(`
        <h1>Heading level 1</h1>
        <h2>Heading level 2</h2>
        <h3>Heading level 3</h3>
        <h4>Heading level 4</h4>
        <h5>Heading level 5</h5>
        <h6>Heading level 6</h6>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "TextBlock",
            text: "Heading level 1",
            weight: "bolder",
            size: "extraLarge",
            wrap: true
        }, {
            type: "TextBlock",
            text: "Heading level 2",
            weight: "bolder",
            size: "large",
            wrap: true
        }, {
            type: "TextBlock",
            text: "Heading level 3",
            weight: "bolder",
            size: "medium",
            wrap: true
        }, {
            type: "TextBlock",
            text: "Heading level 4",
            weight: "bolder",
            size: "default",
            wrap: true
        }, {
            type: "TextBlock",
            text: "Heading level 5",
            weight: "bolder",
            size: "default",
            wrap: true
        }, {
            type: "TextBlock",
            text: "Heading level 6",
            weight: "bolder",
            size: "small",
            wrap: true
        }],
        actions: [],
        version: "1.0"
    });
});