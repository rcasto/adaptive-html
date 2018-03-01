var AdaptiveHtml = (function () {
    var parser = new DOMParser();

    function transform(html) {
        var htmlDoc = parser.parseFromString(html, 'text/html');
        var parsedHtml = htmlDoc.body;
        Array.prototype.slice.call(parsedHtml.children)
            .forEach(function (child) {
                replace(child);
            });
    }

    function replace(node) {
        var nodeName = (node.nodeName || '').toLowerCase();
        switch (nodeName) {
            case 'div':
                console.log('found a div!') 
                break;
            default:
                console.error('Unhandled node replacement:', nodeName, node);
        }
    }

    return {
        transform: transform
    };
}());