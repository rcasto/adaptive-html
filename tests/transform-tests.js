var test = require('ava');
var AdaptiveHtml = require('../dist/adaptive-html.cjs');

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
            text: "This is some text\n\nwith a break in it",
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

test('can handle p tag with line breaks in it', t => {
    var result = AdaptiveHtml.transform('<p>This paragraph is<br />breaking up<br />what is happening?</p>');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "This paragraph is\n\nbreaking up\n\nwhat is happening?",
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

test('can handle inline links (a tags)', t => {
    var result = AdaptiveHtml.transform('This is an <a href="https://support.microsoft.com/">inline link</a>');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "TextBlock",
            text: "This is an [inline link](https://support.microsoft.com/)",
            wrap: true
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle img tags', t => {
    var result = AdaptiveHtml.transform('<img alt="This is some alt text" src="https://images.unsplash.com/photo-1505245208761-ba872912fac0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=608629c5a6a368d239d44bf9e84956b8&auto=format&fit=crop&w=1500&q=80" />');
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Image",
            url: "https://images.unsplash.com/photo-1505245208761-ba872912fac0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=608629c5a6a368d239d44bf9e84956b8&auto=format&fit=crop&w=1500&q=80",
            altText: "This is some alt text"
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle unsupported block tag', t => {
    var result = AdaptiveHtml.transform(`<div>Testing div</div>`);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "Testing div",
                wrap: true
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle unsupported inline tag', t => {
    var result = AdaptiveHtml.transform(`<span>Testing span</span>`);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "TextBlock",
            text: "Testing span",
            wrap: true
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle simple ordered list', t => {
    var result = AdaptiveHtml.transform(`
        <ol>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
        </ol>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "1. List item 1",
                wrap: true
            }, {
                type: "TextBlock",
                text: "2. List item 2",
                wrap: true,
                spacing: "small"
            }, {
                type: "TextBlock",
                text: "3. List item 3",
                wrap: true,
                spacing: "small"
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle simple unordered list', t => {
    var result = AdaptiveHtml.transform(`
        <ul>
            <li>List item 1</li>
            <li>List item 2</li>
            <li>List item 3</li>
        </ul>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "- List item 1",
                wrap: true
            }, {
                type: "TextBlock",
                text: "- List item 2",
                wrap: true,
                spacing: "small"
            }, {
                type: "TextBlock",
                text: "- List item 3",
                wrap: true,
                spacing: "small"
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle ordered list with nested list', t => {
    var result = AdaptiveHtml.transform(`
        <ol>
            <li>
                List item 1
                <ol>
                    <li>Nested list item 1</li>
                    <li>Nested list item 2</li>
                </ol>
            </li>
            <li>List item 2</li>
            <li>List item 3</li>
        </ol>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "1. List item 1\r\t1. Nested list item 1\r\t2. Nested list item 2",
                wrap: true
            }, {
                type: "TextBlock",
                text: "2. List item 2",
                wrap: true,
                spacing: "small"
            }, {
                type: "TextBlock",
                text: "3. List item 3",
                wrap: true,
                spacing: "small"
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle unordered list with nested list', t => {
    var result = AdaptiveHtml.transform(`
        <ul>
            <li>
                List item 1
                <ul>
                    <li>Nested list item 1</li>
                    <li>Nested list item 2</li>
                </ul>
            </li>
            <li>List item 2</li>
            <li>List item 3</li>
        </ul>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "- List item 1\r\t- Nested list item 1\r\t- Nested list item 2",
                wrap: true
            }, {
                type: "TextBlock",
                text: "- List item 2",
                wrap: true,
                spacing: "small"
            }, {
                type: "TextBlock",
                text: "- List item 3",
                wrap: true,
                spacing: "small"
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle nested nested list', t => {
    var result = AdaptiveHtml.transform(`
        <ul>
            <li>
                List item 1
                <ul>
                    <li>
                        Nested list item 1
                        <ul>
                            <li>Nested nested list item 1</li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "- List item 1\r\t- Nested list item 1\r\t\t- Nested nested list item 1",
                wrap: true
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle images in list', t => {
    var result = AdaptiveHtml.transform(`
        <ul>
            <li>
                List item 1
                <img src="https://fake-image.com" alt="fake-alt-text" />
            </li>
            <li>
                List item 2
            </li>
        </ul>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "- List item 1",
                wrap: true
            }, {
                type: "Image",
                url: "https://fake-image.com",
                altText: "fake-alt-text"
            }, {
                type: "TextBlock",
                text: "- List item 2",
                wrap: true,
                spacing: "small"
            }]
        }],
        actions: [],
        version: "1.0"
    });
});

test('can handle line break in list', t => {
    var result = AdaptiveHtml.transform(`
        <ul>
            <li>
                List item 1<br />
                List item 1 continues
            </li>
            <li>
                List item 2
            </li>
        </ul>
    `);
    t.deepEqual(result, {
        type: "AdaptiveCard",
        body: [{
            type: "Container",
            items: [{
                type: "TextBlock",
                text: "- List item 1\n\n\tList item 1 continues",
                wrap: true
            }, {
                type: "TextBlock",
                text: "- List item 2",
                wrap: true,
                spacing: "small"
            }]
        }],
        actions: [],
        version: "1.0"
    });
});