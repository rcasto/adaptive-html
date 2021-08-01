/**
 * Manages a collection of rules used to convert HTML to Adaptive Card JSON
 */
export function findRule(rules, node) {
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
    const filter = rule.filter;
    if (typeof filter === 'string') {
        return filter === node.nodeName.toLowerCase();
    } else if (Array.isArray(filter)) {
        return filter.includes(node.nodeName.toLowerCase());
    } else if (typeof filter === 'function') {
        return filter.call(rule, node);
    }
    throw new TypeError('`filter` needs to be a string, array, or function');
}