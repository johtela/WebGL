"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clone(array) {
    var rows = array.length;
    var res = Array(rows);
    for (var r = 0; r < rows; r++)
        res[r] = array[r].slice();
    return res;
}
exports.clone = clone;
function fill(array, value) {
    for (var i = 0; i < array.length; i++)
        array[i] = value;
    return array;
}
exports.fill = fill;
function repeat(value, count) {
    var res = Array(count);
    for (var i = 0; i < count; i++)
        res[i] = value;
    return res;
}
exports.repeat = repeat;
//# sourceMappingURL=ArrayHelper.js.map