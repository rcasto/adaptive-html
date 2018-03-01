import TurndownService from './turndown';

var AdaptiveHtml = (function () {
    var parser = new DOMParser();

    TurndownService.prototype.turndown = function (input) {
        if (!canConvert(input)) {
            throw new TypeError(
                input + ' is not a string, or an element/document/fragment node.'
            )
        }

        if (input === '') return ''

        var output = process.call(this, new RootNode(input));
        return postProcess.call(this, output)
    };

}());