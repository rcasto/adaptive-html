/**
 * Manages a collection of rules used to convert HTML to Adaptive Card JSON
 */
function Rules(rules) {
    this.rules = Object.assign({}, rules);
}

Rules.prototype.forNode = function (node) {
    return findRule(this.rules, node);
};

function findRule(rules, node) {
    var foundRule = null;
    (Object.keys(rules) || []).some(ruleKey => {
        if (filterValue(rules[ruleKey], node)) {
            foundRule = rules[ruleKey];
            return true;
        }
        return false;
    });
    return foundRule;
}

function filterValue(rule, node) {
    var filter = rule.filter;
    if (typeof filter === 'string') {
        return filter === node.nodeName.toLowerCase();
    } else if (Array.isArray(filter)) {
        return filter.indexOf(node.nodeName.toLowerCase()) > -1;
    } else if (typeof filter === 'function') {
        return filter.call(rule, node);
    }
    throw new TypeError('`filter` needs to be a string, array, or function');
}

export default Rules;