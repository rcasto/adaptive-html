# AdaptiveHtml
Convert HTML --> Adaptive Card JSON

The goal of this project is to fit into existing WYSIWYG editors such as [CKEditor](https://ckeditor.com/) and convert their native HTML output to an [Adaptive Card](http://adaptivecards.io/)

## Getting Started
You can either install the npm package or directly use a pre-built version of the library.

### Via Npm
`npm install adaptive-html`

### Using pre-built libraries
There are [pre-built versions of the library](https://github.com/rcasto/adaptive-html/tree/master/dist) for:
- Browser ([iife](https://developer.mozilla.org/en-US/docs/Glossary/IIFE))
- CommonJs module environments (cjs)
- ES module environments (es)

#### Browser
```html
<script src="adaptive-html.iife.min.js"></script>
<script>
    var adaptiveCardJson = AdaptiveHtml.transform(`
        <p>Turn me into an Adaptive Card</p>
    `);
    console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
</script>
```

#### CommonJs
```javascript
var AdaptiveHtml = require('adaptive-html');

var adaptiveCardJson = AdaptiveHtml.transform(`
    <p>Turn me into an Adaptive Card</p>
`);
console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
```

#### ES
```javascript
import AdaptiveHtml from 'adaptive-html';

var adaptiveCardJson = AdaptiveHtml.transform(`
    <p>Turn me into an Adaptive Card</p>
`);
console.log(JSON.stringify(adaptiveCardJson, null, '\t'));
```

## API
- transform(string | [Node](http://devdocs.io/dom/node))
    - Returns a JSON object representing an Adaptive Card

## Building it yourself
If you wish to build the library yourself then you can follow these steps:  
1. Clone or [download](https://github.com/rcasto/adaptive-html/archive/master.zip) this repository
2. `cd` to the repository directory via the command line/terminal
3. Run `npm install` to install the necessary dependencies (make sure you have [Node.js](https://nodejs.org/en/) installed)
4. Hack away
5. Next execute the command `npm run build`
6. You should now be able to view the built libraries under the `dist/` folder within your copy of the repository