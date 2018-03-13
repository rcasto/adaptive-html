# Converting HTML output from [AdaptiveCards for Javascript library](https://docs.microsoft.com/en-us/adaptive-cards/display/libraries/htmlclient)

## TextBlocks
- TextBlocks are equivalent to a div wrapping a p tag
    - The div is styled and those style properties are inherited by the p tag
- Must use styles on div wrapping p tag for TextBlock to detect heading level (h1 - h6)
- If there is a line break then there are multiple p tags within the container div

## Lists
- Each list item is actually represented as a div.  In this div is actually a separate list and in this is the individual list item
- Each list in the individual list items has a **'start'** attribute dictating which index it should start at if the list is _ordered_

## Images
- Images as well are wrapped within a div
