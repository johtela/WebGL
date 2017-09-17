"use strict";
///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
var jsc = require("jsverify");
var FMath_1 = require("./FMath");
var Float32Vec_1 = require("./Float32Vec");
function arbNumArr(size) {
    var arr = Array(size);
    for (var i = 0; i < arr.length; i++)
        arr[i] = jsc.number;
    return jsc.tuple(arr);
}
var arbVec2 = arbNumArr(2).smap(function (a) { return Float32Vec_1.vec2(a[0], a[1]); }, function (v) { return [v.x, v.y]; }, function (v) { return v.toString(); });
var arbVec3 = arbNumArr(3).smap(function (a) { return Float32Vec_1.vec3(a[0], a[1], a[2]); }, function (v) { return [v.x, v.y, v.z]; }, function (v) { return v.toString(); });
var arbVec4 = arbNumArr(4).smap(function (a) { return Float32Vec_1.vec4(a[0], a[1], a[2], a[3]); }, function (v) { return [v.x, v.y, v.z, v.w]; }, function (v) { return v.toString(); });
function addAndSubtract(arb, zero) {
    var dim = zero.dimensions;
    jsc.property("Vec" + dim + ": v - v = " + zero, arb, function (v) { return v.sub(v).equals(zero); });
    jsc.property("Vec" + dim + ": v1 - v2 = v1 + (-v2)", arb, arb, function (v1, v2) { return v1.sub(v2).equals(v1.add(v2.inv())); });
    jsc.property("Vec" + dim + ": |v + v| = 2 * |v|", arb, function (v) { return v.add(v).len === 2 * v.len; });
}
function multiplyWithScalar(arb) {
    var dim = arb.generator(0).dimensions;
    jsc.property("Vec" + dim + ": |v * s| = |s| * |v|", arb, jsc.number, function (v, s) { return FMath_1.approxEquals((v.mul(s)).len, Math.abs(s) * v.len); });
}
describe("vector addition and subtraction", function () {
    addAndSubtract(arbVec2, Float32Vec_1.vec2(0));
    addAndSubtract(arbVec3, Float32Vec_1.vec3(0));
    addAndSubtract(arbVec4, Float32Vec_1.vec4(0));
});
describe("vector multiplication with scalar", function () {
    multiplyWithScalar(arbVec2);
    multiplyWithScalar(arbVec3);
    multiplyWithScalar(arbVec4);
});
//# sourceMappingURL=Tests.js.map