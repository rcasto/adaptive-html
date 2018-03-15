# AdaptiveHtml
Convert HTML --> Adaptive Card JSON ([Demo](https://adaptive-editor.azurewebsites.net/))

The goal of this project is to allow integration with existing WYSIWYG editors such as [CKEditor](https://ckeditor.com/) and convert their HTML output to an [Adaptive Card](https://adaptivecards.io/).

Under the hood, this project has taken the [Turndown](https://github.com/domchristie/turndown/) code and repurposed it.

## Getting started
You can either install the npm package or directly use a pre-built version of the library.

### Via npm
`npm install adaptive-html`
```javascript
var AdaptiveHtml = require('adaptive-html');

var adaptiveCardJson = AdaptiveHtml.transform(`
    <p>Turn me into an Adaptive Card</p>
`);
console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
```

### Using pre-built libraries
There are [pre-built versions of the library](https://github.com/rcasto/adaptive-html/tree/master/dist) for:
- Browser (iife)
- CommonJS module environments (cjs)
- ES module environments (es)

#### Browser
The browser version is available in both minified and unminified formats.
```html
<script src="/adaptive-html/dist/adaptive-html.iife.min.js"></script>
<script>
    var adaptiveCardJson = AdaptiveHtml.transform(`
        <p>Turn me into an Adaptive Card</p>
    `);
    console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
</script>
```

#### CommonJS
```javascript
var AdaptiveHtml = require('./adaptive-html/dist/adaptive-html.cjs');

var adaptiveCardJson = AdaptiveHtml.transform(`
    <p>Turn me into an Adaptive Card</p>
`);
console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
```

#### ES
```javascript
import AdaptiveHtml from './adaptive-html/dist/adaptive-html.es';

var adaptiveCardJson = AdaptiveHtml.transform(`
    <p>Turn me into an Adaptive Card</p>
`);
console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
```

## API
- transform(string | [Node](https://devdocs.io/dom/node))
    - Will be **deprecated**, use toJSON(string | Node) instead
- toJSON(string | [Node](https://devdocs.io/dom/node))
    - Returns a JSON object representing an Adaptive Card
    ```json
    {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "Turn me into an Adaptive Card",
                        "wrap": true
                    }
                ]
            }
        ],
        "actions": [],
        "version": "1.0"
    }
    ```
- toHTML(object | string)
    - Returns an HTML representation of the passed in Adaptive Card JSON object
        - Will mainly reconstruct headings (h1 - h6) and remove empty nodes over the standard JSON -> HTML conversion done by the adaptivecards library
    - **Note**: If you want to use this method in the browser, you must also include the [AdaptiveCards for Javascript library](https://docs.microsoft.com/en-us/adaptive-cards/display/libraries/htmlclient)
    ```html
    <div class="ac-container" tabindex="0" style="display: flex; flex-direction: column; justify-content: flex-start; background-color: rgb(255, 255, 255); box-sizing: border-box; flex: 0 0 auto; padding: 20px;">
        <div class="ac-container" style="display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; flex: 0 0 auto;">
            <div style="overflow: hidden; font-family: &quot;Segoe UI&quot;; text-align: left; font-size: 14px; line-height: 18.62px; color: rgb(51, 51, 51); font-weight: 400; word-wrap: break-word; box-sizing: border-box; flex: 0 0 auto;">
                <p style="margin-top: 0px; width: 100%; margin-bottom: 0px;">Turn me into an Adaptive Card</p>
            </div>
        </div>
    </div>
    ```

## Known caveats
- Images in list steps and nested steps are pushed to the bottom of the corresponding list step
- Headings cannot contain images
- Lists cannot contain headings

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