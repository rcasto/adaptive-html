# AdaptiveHtml
HTML to Adaptive Card JSON converter library ([Demo editor](https://adaptive-editor.appspot.com))

The goal of this project is to allow integration with existing WYSIWYG editors such as [CKEditor](https://ckeditor.com/) and convert their HTML output to an [Adaptive Card](https://adaptivecards.io/).

Under the hood, this project has taken the [Turndown](https://github.com/domchristie/turndown/) code and repurposed it.

## Table of contents
- [Getting started](#getting-started)
- [API](#api)
- [Currently supported HTML tags](#currently-supported-html-tags)
- [Known caveats](#known-caveats)
- [Building it yourself](#building-it-yourself)

## Getting started
You can either install the npm package, directly use a pre-built version of the library, or use a CDN.

### Via npm
`npm install adaptive-html`

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/adaptive-html/dist/adaptive-html.iife.min.js"></script>
```

## API
- toJSON(string | [HTMLElement](https://devdocs.io/dom/htmlelement)) => Adaptive Card JSON
    ```javascript
    var adaptiveCardJson = AdaptiveHtml.toJSON(`
        <p>Turn me into an Adaptive Card</p>
    `);
    console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
    /*
        JSON returned

        {
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
        }
    */
    ```

## Currently supported HTML tags
- p
- br
- h1, h2, h3, h4, h5, h6
- ul, ol
- li
- a
- em, i
- strong, b
- img

The default replacement for tags not listed above depends on whether the tag refers to a [block](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements#Elements) or [inline](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#Elements) level HTML element.

For block level elements, its contents are processed, and wrapped in a [Container](https://adaptivecards.io/explorer/Container.html).  
For inline level elements, its contents are processed and simply returned.

## Known caveats
- Images in list steps and nested steps are pushed to the bottom of the corresponding list step
- Lists cannot contain headings

## Building it yourself
If you wish to build the library yourself then you can follow these steps:  
1. Clone or download the [repository](https://github.com/rcasto/adaptive-html)
2. `cd` to the repository directory via the command line/terminal
3. Run `npm install` to install the necessary dependencies 
    - Note: Make sure you have [Node.js](https://nodejs.org/en/) installed
4. Hack away
5. Execute the command `npm run build`
6. You should now be able to view the built libraries under the `dist/` folder within your copy of the repository

### Test Client
To demonstrate the transformation there is a test client within the repository. To launch it follow these steps:
1. Execute the command `cd client && npm install && cd ..`
    - This will install the test client dependencies and return to repository root
2. Execute the command `npm start`
3. Navigate to http://localhost:3000

### Running tests
You can run tests by executing the command `npm test`.

If you want to generate a code coverage report execute the command `npm run test:report`.  Launch `coverage/index.html` in the browser to view the report.