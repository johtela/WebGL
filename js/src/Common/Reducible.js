"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function foreach(reducible, action) {
    reducible.reduce(null, (_, curr) => { action(curr); return null; });
}
exports.foreach = foreach;
function filter(predicate, reducer) {
    return (acc, curr) => predicate(curr) ? reducer(acc, curr) : acc;
}
exports.filter = filter;
function every(reducible, predicate) {
    return reducible.reduce(false, (acc, curr) => predicate(curr) ? acc : false);
}
exports.every = every;
function min(selector) {
    return (min, curr) => {
        let minValue = selector(min);
        let currValue = selector(curr);
        return currValue < minValue ? curr : min;
    };
}
exports.min = min;
function max(selector) {
    return (max, curr) => {
        let maxValue = selector(max);
        let currValue = selector(curr);
        return currValue > maxValue ? curr : max;
    };
}
exports.max = max;
//# sourceMappingURL=Reducible.js.map