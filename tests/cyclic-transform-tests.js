var test = require('ava');
var AdaptiveHtml = require('../dist/adaptive-html.cjs');

test('can handle simple HTML -> JSON -> HTML', t => {
    var html = `<div><div>Turn me into an Adaptive Card</div></div>`;
    var htmlResult = AdaptiveHtml.toHTML(AdaptiveHtml.toJSON(html));
    t.is(htmlResult.outerHTML, html);
});

test('can handle simple JSON -> HTML -> JSON', t => {
    var json = {
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
    };
    var jsonResult = AdaptiveHtml.toJSON(AdaptiveHtml.toHTML(json));
    t.deepEqual(jsonResult, json);
});

test('can handle more complex HTML -> JSON -> HTML', t => {
    var html = `<div><div><h1>Good Old Fashioned Pancakes</h1></div><div><div>**Prep:** 5 minutes<br>**Cook:** 15 minutes<br>**Ready In:** 20 Minutes</div></div><div><h2>Ingredients</h2></div><div><div><div>- 1 1/2 cups all-purpose flour</div></div><div><div>- 3 1/2 teaspoons baking powder</div></div><div><div>- 1 teaspoon salt</div></div><div><div>- 1 tablespoon white sugar</div></div><div><div>- 1 1/4 cups milk</div></div><div><div>- 1 egg</div></div><div><div>- 3 tablespoons butter, melted</div></div></div><div><h2>Directions</h2></div><div><div><div>1. In a large bowl, sift together the flour, baking powder, salt and sugar. Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.</div></div><div><div>2. Heat a lightly oiled griddle or frying pan over medium high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.</div></div></div><div><div><img src="http://clipart-library.com/images/8c6o5qRqi.png" alt="pancakes"></div></div><div><div>[Go to original recipe](https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/)</div></div></div>`;
    var htmlResult = AdaptiveHtml.toHTML(AdaptiveHtml.toJSON(html));
    t.is(htmlResult.outerHTML, html);
});

test('can handle more complex JSON -> HTML -> JSON', t => {
    var json = {
        "type": "AdaptiveCard",
        "body": [
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "Good Old Fashioned Pancakes",
                        "wrap": true,
                        "size": "extraLarge",
                        "weight": "bolder"
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "**Prep:** 5 minutes\n\n**Cook:** 15 minutes\n\n**Ready In:** 20 Minutes",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "Ingredients",
                        "wrap": true,
                        "size": "large",
                        "weight": "bolder"
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "- 1 1/2 cups all-purpose flour",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "- 3 1/2 teaspoons baking powder",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "- 1 teaspoon salt",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "- 1 tablespoon white sugar",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "- 1 1/4 cups milk",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "- 1 egg",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "- 3 tablespoons butter, melted",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "Directions",
                        "wrap": true,
                        "size": "large",
                        "weight": "bolder"
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "1. In a large bowl, sift together the flour, baking powder, salt and sugar. Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "2. Heat a lightly oiled griddle or frying pan over medium high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.",
                        "wrap": true
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "Image",
                        "url": "http://clipart-library.com/images/8c6o5qRqi.png",
                        "altText": "pancakes"
                    }
                ]
            },
            {
                "type": "Container",
                "items": [
                    {
                        "type": "TextBlock",
                        "text": "[Go to original recipe](https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/)",
                        "wrap": true
                    }
                ]
            }
        ],
        "actions": [],
        "version": "1.0"
    };
    var jsonResult = AdaptiveHtml.toJSON(AdaptiveHtml.toHTML(json));
    t.deepEqual(jsonResult, json);
});