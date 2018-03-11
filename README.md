# AdaptiveHtml
Convert HTML --> Adaptive Card JSON

The goal of this project is to allow integration with existing WYSIWYG editors such as [CKEditor](https://ckeditor.com/) and convert their HTML output to an [Adaptive Card](https://adaptivecards.io/).

Under the hood, this project has taken the [Turndown](https://github.com/domchristie/turndown/) code and repurposed it.

## Getting Started
You can either install the npm package or directly use a pre-built version of the library.

### Via Npm
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
- Browser ([iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE))
- CommonJs module environments (cjs)
- ES module environments (es)

#### Browser
```html
<script src="/adaptive-html/dist/adaptive-html.iife.min.js"></script>
<script>
    var adaptiveCardJson = AdaptiveHtml.transform(`
        <p>Turn me into an Adaptive Card</p>
    `);
    console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
</script>
```

#### CommonJs
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
    - Returns a JSON object representing an Adaptive Card

## Known Caveats
- Images in list steps and nested steps are pushed to the bottom of that list step

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
2. Execute the command `npm run dev`
3. Navigate to http://localhost:3000

### Running tests
You can run tests by executing the command `npm test`.

If you want to generate a code coverage report execute the command `npm run test:report`.  Launch `coverage/index.html` in the browser to view the report.