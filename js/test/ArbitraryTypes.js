"use strict";
///<reference types="jsverify"/>
Object.defineProperty(exports, "__esModule", { value: true });
const jsc = require("jsverify");
const ArrayHelper = require("../src/Common/ArrayHelper");
const ArrayVec_1 = require("../src/Math/ArrayVec");
const ArrayMat_1 = require("../src/Math/ArrayMat");
function arbNumArr(size) {
    return jsc.tuple(ArrayHelper.fill(Array(size), jsc.number));
}
exports.arbNumArr = arbNumArr;
exports.arbVec2 = arbNumArr(2).smap(a => ArrayVec_1.newVec2.fromArray(a), v => [v.x, v.y], v => v.toString());
exports.arbVec3 = arbNumArr(3).smap(a => ArrayVec_1.newVec3.fromArray(a), v => [v.x, v.y, v.z], v => v.toString());
exports.arbVec4 = arbNumArr(4).smap(a => ArrayVec_1.newVec4.fromArray(a), v => [v.x, v.y, v.z, v.w], v => v.toString());
exports.arbMat2 = arbNumArr(4).smap(a => ArrayMat_1.newMat2.fromArray(a, 2, 2), m => m.toArray(), m => m.toString());
exports.arbMat3 = arbNumArr(9).smap(a => ArrayMat_1.newMat3.fromArray(a, 3, 3), m => m.toArray(), m => m.toString());
exports.arbMat4 = arbNumArr(16).smap(a => ArrayMat_1.newMat4.fromArray(a, 4, 4), m => m.toArray(), m => m.toString());
//# sourceMappingURL=ArbitraryTypes.js.map