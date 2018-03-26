function toArray(x) {
    if (Array.isArray(x)) {
        return x;
    }
    return x ? [x] : [];
}

function tryParseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (err) {
        return null;
    }
}

// setup globals for node with adaptivecards library
// TODO: is there a better way to do this?
function setupNodeAdaptiveCards() {
    var jsdomInstance = new (require('jsdom')).JSDOM();
    global.document = jsdomInstance.window.document;
    global.window = jsdomInstance.window;
    global.HTMLElement = jsdomInstance.window.HTMLElement;
}

function hasAccessToBrowserGlobals() {
    return !!(typeof window !== 'undefined' &&
              window.document && 
              window.HTMLElement);
}

export default {
    toArray,
    tryParseJSON,
    setupNodeAdaptiveCards,
    hasAccessToBrowserGlobals
};