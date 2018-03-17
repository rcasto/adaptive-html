var AdaptiveHtml = require('../dist/adaptive-html.cjs');

var html = AdaptiveHtml.toHTML({
	"type": "AdaptiveCard",
	"body": [
		{
			"type": "TextBlock",
			"text": "Hello",
			"wrap": true,
			"size": "extraLarge",
			"weight": "bolder"
		},
		{
			"type": "Container",
			"items": [
				{
					"type": "TextBlock",
					"text": "**hey**",
					"wrap": true
				}
			]
		},
		{
			"type": "Container",
			"items": [
				{
					"type": "TextBlock",
					"text": "hi",
					"wrap": true
				}
			]
		}
	],
	"actions": [],
	"version": "1.0"
});
var json = AdaptiveHtml.toJSON(html);

console.log(html.outerHTML);
console.log(JSON.stringify(json, null, '\t'));