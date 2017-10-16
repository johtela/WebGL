"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEmpty(iterable) {
    let iter = iterable[Symbol.iterator]();
    return !(iter.return ? iter.return().done : iter.next().done);
}
exports.isEmpty = isEmpty;
function first(iterable) {
    let iter = iterable[Symbol.iterator]();
    let res = iter.return ? iter.return() : iter.next();
    return res.done ? undefined : res.value;
}
exports.first = first;
function* take(iterable, count) {
    for (let item of iterable)
        if (count-- > 0)
            yield item;
        else
            break;
}
exports.take = take;
function* skip(iterable, count) {
    for (let item of iterable)
        if (count-- > 0)
            continue;
        else
            yield item;
}
exports.skip = skip;
//# sourceMappingURL=IterableExt.js.map