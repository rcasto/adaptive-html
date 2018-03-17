# AdaptiveHtml
Convert HTML --> Adaptive Card JSON ([Demo](https://adaptive-editor.azurewebsites.net/))

The goal of this project is to allow integration with existing WYSIWYG editors such as [CKEditor](https://ckeditor.com/) and convert their HTML output to an [Adaptive Card](https://adaptivecards.io/).

Under the hood, this project has taken the [Turndown](https://github.com/domchristie/turndown/) code and repurposed it.

## Table of contents
- [Getting started](#getting-started)
- [API](#api)
- [Currently supported HTML tags](#currently-supported-html-tags)
- [Known caveats](#known-caveats)
- [Integrating with CKEditor](#integrating-with-ckeditor)
- [Building it yourself](#building-it-yourself)

## Getting started
You can either install the npm package or directly use a pre-built version of the library.

### Via npm
`npm install adaptive-html`

### Using pre-built libraries
There are [pre-built versions of the library](https://github.com/rcasto/adaptive-html/tree/master/dist) for:
- Browser (iife)
- CommonJS module environments (cjs)
- ES module environments (es)

#### Browser
The browser version is available in both minified and unminified formats.
```html
<script src="/adaptive-html/dist/adaptive-html.iife.min.js"></script>
```

#### CommonJS
```javascript
var AdaptiveHtml = require('./adaptive-html/dist/adaptive-html.cjs');
```

#### ES
```javascript
import AdaptiveHtml from './adaptive-html/dist/adaptive-html.es';
```

## API
- transform(string | [HTMLElement](https://devdocs.io/dom/htmlelement)) => Adaptive Card JSON
    - Will be **deprecated**, use [toJSON(string | HTMLElement)](#to-json) instead
- <a name="to-json"></a>toJSON(string | [HTMLElement](https://devdocs.io/dom/htmlelement)) => Adaptive Card JSON
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
- toHTML(object | string, function: (string) => string) => [HTMLElement](https://devdocs.io/dom/htmlelement)
    - Reconstructs headings (h1 - h6) and removes empty nodes on top of the standard JSON to HTML conversion done by the adaptivecards library
    - The second parameter is optional, but allows you to pass in a function to process markdown within TextBlocks.  The function is passed one parameter.  The text which it should process markdown for and is expected to a return a string.
    - **Note**: If you want to use this method in the browser, you must also include the [AdaptiveCards for Javascript library](https://docs.microsoft.com/en-us/adaptive-cards/display/libraries/htmlclient)
    ```javascript
    var adaptiveCardHtml = AdaptiveHtml.toHTML({
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
        });
    console.log(adaptiveCardHtml.outerHTML);
    /*
        HTML returned

        <div class="ac-container" tabindex="0" style="display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex: 0 0 auto; padding: 15px;">
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;, Segoe, &quot;Segoe WP&quot;, &quot;Helvetica Neue&quot;, Helvetica, sans-serif; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(0, 0, 0); font-weight: 400; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                Turn me into an Adaptive Card
            </div>
        </div>
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
- Headings cannot contain images
- Lists cannot contain headings

## Integrating with CKEditor
If you wish to integrate this with CKEditor it should for the most part work out of the box.  However, if you are utilizing the toHTML(object | string) function to take an Adaptive Card JSON and prepopulate the CKEditor instance then you will need [one extra configuration setting](https://docs.ckeditor.com/ckeditor4/latest/api/CKEDITOR_config.html#cfg-extraAllowedContent).
```javascript
var editorConfig = {
    ...,
    extraAllowedContent: 'ol[start]'
}
```
The reason this is necessary is such that ordered lists are reconstructed with the correct starting index.

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