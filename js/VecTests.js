"use strict";
///<reference types="jsverify"/>
Object.defineProperty(exports, "__esModule", { value: true });
var jsc = require("jsverify");
var FMath_1 = require("./FMath");
var ArrayVec_1 = require("./ArrayVec");
var ArrayHelper = require("./ArrayHelper");
function arbNumArr(size) {
    return jsc.tuple(ArrayHelper.fill(Array(size), jsc.number));
}
exports.arbNumArr = arbNumArr;
exports.arbVec2 = arbNumArr(2).smap(function (a) { return ArrayVec_1.newVec2.fromArray(a); }, function (v) { return [v.x, v.y]; }, function (v) { return v.toString(); });
exports.arbVec3 = arbNumArr(3).smap(function (a) { return ArrayVec_1.newVec3.fromArray(a); }, function (v) { return [v.x, v.y, v.z]; }, function (v) { return v.toString(); });
exports.arbVec4 = arbNumArr(4).smap(function (a) { return ArrayVec_1.newVec4.fromArray(a); }, function (v) { return [v.x, v.y, v.z, v.w]; }, function (v) { return v.toString(); });
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
function multiplyWithVector(arb, newVec) {
    var dim = arb.generator(0).dimensions;
    jsc.property("Vec" + dim + ": v * s = v * v." + ArrayHelper.repeat('s', dim), arb, jsc.number, function (v, s) { return v.mul(s).approxEquals(v.mul(newVec.unif(s))); });
}
function divideWithScalar(arb) {
    var dim = arb.generator(0).dimensions;
    jsc.property("Vec" + dim + ": v / s = v * (1 / s) when s != 0", arb, jsc.suchthat(jsc.number, function (s) { return s != 0; }), function (v, s) { return v.div(s).approxEquals(v.mul(1 / s)); });
}
function normalize(arb, zero) {
    var dim = arb.generator(0).dimensions;
    jsc.property("Vec" + dim + ": |norm (v)| = 1 when v != " + zero, jsc.suchthat(arb, function (v) { return !v.equals(zero); }), function (v) { return FMath_1.approxEquals(v.norm().len, 1); });
}
function dotProduct(arb, zero) {
    var dim = arb.generator(0).dimensions;
    var nonzero = jsc.suchthat(arb, function (v) { return !v.equals(zero); });
    jsc.property("Vec" + dim + ": -1 <= norm(v1) . norm(v2) <= 1 when v1, v2 != " + zero, nonzero, nonzero, function (v1, v2) {
        var dp = v1.norm().dot(v2.norm());
        return -1 <= dp && dp <= 1;
    });
    jsc.property("Vec" + dim + ": v1 . v2 == (v1 . norm(v2)) * |v2| when v2 != " + zero, arb, nonzero, function (v1, v2) { return FMath_1.approxEquals(v1.dot(v2), v1.dot(v2.norm()) * v2.len); });
    jsc.property("Vec" + dim + ": v1 . v2 == (v2 . norm(v1)) * |v1| when v1 != " + zero, nonzero, arb, function (v1, v2) { return FMath_1.approxEquals(v1.dot(v2), v2.dot(v1.norm()) * v1.len); });
}
describe("vector addition and subtraction", function () {
    addAndSubtract(exports.arbVec2, ArrayVec_1.newVec2.zero);
    addAndSubtract(exports.arbVec3, ArrayVec_1.newVec3.zero);
    addAndSubtract(exports.arbVec4, ArrayVec_1.newVec4.zero);
});
describe("vector multiplication with scalar", function () {
    multiplyWithScalar(exports.arbVec2);
    multiplyWithScalar(exports.arbVec3);
    multiplyWithScalar(exports.arbVec4);
});
describe("vector multiplication with vector", function () {
    multiplyWithVector(exports.arbVec2, ArrayVec_1.newVec2);
    multiplyWithVector(exports.arbVec3, ArrayVec_1.newVec3);
    multiplyWithVector(exports.arbVec4, ArrayVec_1.newVec4);
});
describe("vector division with scalar", function () {
    divideWithScalar(exports.arbVec2);
    divideWithScalar(exports.arbVec3);
    divideWithScalar(exports.arbVec4);
});
describe("vector normalization", function () {
    normalize(exports.arbVec2, ArrayVec_1.newVec2.zero);
    normalize(exports.arbVec3, ArrayVec_1.newVec3.zero);
    normalize(exports.arbVec4, ArrayVec_1.newVec4.zero);
});
describe("vector dot product", function () {
    dotProduct(exports.arbVec2, ArrayVec_1.newVec2.zero);
    dotProduct(exports.arbVec3, ArrayVec_1.newVec3.zero);
    dotProduct(exports.arbVec4, ArrayVec_1.newVec4.zero);
});
describe("vec3 cross product", function () {
    var nonzero = jsc.suchthat(exports.arbVec3, function (v) { return !v.equals(ArrayVec_1.newVec3.zero); });
    jsc.property("Vec3: norm(v1) x norm(v2) . norm(v1|v2) = 1 when v1, v2 != [0 0 0]", nonzero, nonzero, function (v1, v2) {
        var v1n = v1.norm();
        var v2n = v2.norm();
        var cr = v1n.cross(v2n);
        var dt1 = cr.dot(v1n);
        var dt2 = cr.dot(v2n);
        return FMath_1.approxEquals(dt1, 0) && FMath_1.approxEquals(dt2, 0);
    });
});
//# sourceMappingURL=VecTests.js.map