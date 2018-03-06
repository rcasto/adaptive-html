# AdaptiveHtml
Convert HTML --> Adaptive Card JSON

The goal of this project is to fit into existing WYSIWYG editors such as [CKEditor](https://ckeditor.com/) and convert their native HTML output to an [Adaptive Card](http://adaptivecards.io/)

## Getting Started
[Within the repository](https://github.com/rcasto/adaptive-html/tree/master/dist) there is already a pre-built version of the library for the browser

To use this, simply include the script within your web application
```html
<script src="adaptive-html.js"></script>
```

This will then add **AdaptiveHtml** as a global window object

There is only one function within the library:
- transform(string | [Node](http://devdocs.io/dom/node))

The output of this function is a JSON object representing an Adaptive Card

## Building it yourself
If you wish to build the library yourself then you can follow these steps:  
1. Clone or [download](https://github.com/rcasto/adaptive-html/archive/master.zip) this repository
2. `cd` to the repository directory via the command line/terminal
3. Run `npm install` to install the necessary dependencies (make sure you have [Node.js](https://nodejs.org/en/) installed)
4. Next execute the command `npm run build`
5. You should now see an **adaptive-html.js** file under the dist/ folder within your copy of the repository directory