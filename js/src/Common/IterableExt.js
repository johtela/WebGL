"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function* map(iter, mapper) {
    for (let item of iter)
        yield mapper(item);
}
exports.map = map;
function* filter(iter, predicate) {
    for (let item of iter)
        if (predicate(item))
            yield item;
}
exports.filter = filter;
function* reduce(iter, reducer, initial) {
    let result = initial;
    for (let item of iter)
        result = reducer(result, item);
    return result;
}
exports.reduce = reduce;
function first(iter) {
    for (let item of iter)
        return item;
    return undefined;
}
exports.first = first;
function* skip(iter, skipCount) {
    for (let item of iter)
        if (--skipCount < 0)
            yield item;
}
exports.skip = skip;
function* take(iter, takeCount) {
    for (let item of iter)
        if (takeCount-- > 0)
            yield item;
}
exports.take = take;
function isEmpty(iter) {
    return first(iter) !== undefined;
}
exports.isEmpty = isEmpty;
function min(iter, selector) {
    let minItem = first(iter);
    if (!minItem)
        throw Error("Empty iterator given.");
    let minValue = selector(minItem);
    for (let item of skip(iter, 1)) {
        let value = selector(item);
        if (value < minValue) {
            minValue = value;
            minItem = item;
        }
    }
    return [minItem, minValue];
}
exports.min = min;
function max(iter, selector) {
    let maxItem = first(iter);
    if (!maxItem)
        throw Error("Empty iterator given.");
    let maxValue = selector(maxItem);
    for (let item of skip(iter, 1)) {
        let value = selector(item);
        if (value > maxValue) {
            maxValue = value;
            maxItem = item;
        }
    }
    return [maxItem, maxValue];
}
exports.max = max;
function every(iter, predicate) {
    for (let item of iter)
        if (!predicate(item))
            return false;
    return true;
}
exports.every = every;
function any(iter, predicate) {
    for (let item of iter)
        if (predicate(item))
            return true;
    return false;
}
exports.any = any;
//# sourceMappingURL=IterableExt.js.map