var test = require("ava");
var AdaptiveCards = require("adaptivecards");
var AdaptiveHtml = require("../dist/adaptive-html.cjs");

/*
    Shim processing of markdown to prevent console warnings:
    https://github.com/microsoft/AdaptiveCards/blob/c59079a3b2770211e3d56a51f8f524f29b0b9f44/source/nodejs/adaptivecards/src/card-elements.ts#L6341
    https://www.npmjs.com/package/adaptivecards#supporting-markdown
*/
AdaptiveCards.AdaptiveCard.onProcessMarkdown = (text, result) => {
  result.outputHtml = text;
  result.didProcess = true;
};

function doesTransformStabilize(cardJson, numCycles = 2) {
  const adaptiveCard = new AdaptiveCards.AdaptiveCard();
  let renderedAdaptiveCard;
  let renderedAdaptiveCardJson;

  for (let i = 0; i < numCycles; i++) {
    adaptiveCard.parse(cardJson);

    renderedAdaptiveCard = adaptiveCard.render();
    renderedAdaptiveCardJson = AdaptiveHtml.toJSON(
      renderedAdaptiveCard.outerHTML
    );

    if (JSON.stringify(cardJson) === JSON.stringify(renderedAdaptiveCardJson)) {
      return true;
    } else {
      // next cycle starts with this rounds card JSON
      cardJson = renderedAdaptiveCardJson;
    }
  }

  return false;
}

test("can handle simple HTML -> JSON -> HTML", (t) => {
  var html = `<div><div>Turn me into an Adaptive Card</div></div>`;
  var cardJson = AdaptiveHtml.toJSON(html);

  t.truthy(doesTransformStabilize(cardJson));
});

test("can handle simple JSON -> HTML -> JSON", (t) => {
  var cardJson = {
    type: "AdaptiveCard",
    body: [
      {
        type: "TextBlock",
        text: "Turn me into an Adaptive Card",
        wrap: true,
      },
    ],
    actions: [],
    version: "1.0",
  };

  t.truthy(doesTransformStabilize(cardJson));
});

test("can handle more complex HTML -> JSON -> HTML", (t) => {
  var html = `<div><div><h1>Good Old Fashioned Pancakes</h1></div><div><div>**Prep:** 5 minutes<br>**Cook:** 15 minutes<br>**Ready In:** 20 Minutes</div></div><div><h2>Ingredients</h2></div><div><div><div>- 1 1/2 cups all-purpose flour</div></div><div><div>- 3 1/2 teaspoons baking powder</div></div><div><div>- 1 teaspoon salt</div></div><div><div>- 1 tablespoon white sugar</div></div><div><div>- 1 1/4 cups milk</div></div><div><div>- 1 egg</div></div><div><div>- 3 tablespoons butter, melted</div></div></div><div><h2>Directions</h2></div><div><div><div>1. In a large bowl, sift together the flour, baking powder, salt and sugar. Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.</div></div><div><div>2. Heat a lightly oiled griddle or frying pan over medium high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.</div></div></div><div><div><img src="http://clipart-library.com/images/8c6o5qRqi.png" alt="pancakes"></div></div><div><div>[Go to original recipe](https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/)</div></div></div>`;
  var cardJson = AdaptiveHtml.toJSON(html);

  t.truthy(doesTransformStabilize(cardJson));
});

test("can handle more complex JSON -> HTML -> JSON", (t) => {
  var cardJson = {
    type: "AdaptiveCard",
    body: [
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "Good Old Fashioned Pancakes",
            wrap: true,
            size: "extraLarge",
            weight: "bolder",
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "**Prep:** 5 minutes  \n**Cook:** 15 minutes  \n**Ready In:** 20 Minutes",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "Ingredients",
            wrap: true,
            size: "large",
            weight: "bolder",
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "- 1 1/2 cups all-purpose flour",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "- 3 1/2 teaspoons baking powder",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "- 1 teaspoon salt",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "- 1 tablespoon white sugar",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "- 1 1/4 cups milk",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "- 1 egg",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "- 3 tablespoons butter, melted",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "Directions",
            wrap: true,
            size: "large",
            weight: "bolder",
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "1. In a large bowl, sift together the flour, baking powder, salt and sugar. Make a well in the center and pour in the milk, egg and melted butter; mix until smooth.",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "2. Heat a lightly oiled griddle or frying pan over medium high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.",
            wrap: true,
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "Image",
            url: "http://clipart-library.com/images/8c6o5qRqi.png",
            altText: "pancakes",
          },
        ],
      },
      {
        type: "Container",
        items: [
          {
            type: "TextBlock",
            text: "[Go to original recipe](https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/)",
            wrap: true,
          },
        ],
      },
    ],
    actions: [],
    version: "1.0",
  };

  t.truthy(doesTransformStabilize(cardJson));
});
