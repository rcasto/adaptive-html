function toArray(x) {
    if (Array.isArray(x)) {
        return x;
    }
    return x ? [x] : [];
}

function beautify(obj) {
    return JSON.stringify(obj, null, '\t');
}

function prettyPrint(obj) {
    return console.log(beautify(obj));
}

export default {
    toArray,
    beautify,
    prettyPrint
};