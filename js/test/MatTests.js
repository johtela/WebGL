"use strict";
///<reference types="jsverify"/>
Object.defineProperty(exports, "__esModule", { value: true });
var jsc = require("jsverify");
var FMath_1 = require("../src/Math/FMath");
var ArrayVec_1 = require("../src/Math/ArrayVec");
var ArrayMat_1 = require("../src/Math/ArrayMat");
var VecTests_1 = require("./VecTests");
var arbMat2 = VecTests_1.arbNumArr(4).smap(function (a) { return ArrayMat_1.newMat2.fromArray(a, 2, 2); }, function (m) { return m.toArray(); }, function (m) { return m.toString(); });
var arbMat3 = VecTests_1.arbNumArr(9).smap(function (a) { return ArrayMat_1.newMat3.fromArray(a, 3, 3); }, function (m) { return m.toArray(); }, function (m) { return m.toString(); });
var arbMat4 = VecTests_1.arbNumArr(16).smap(function (a) { return ArrayMat_1.newMat4.fromArray(a, 4, 4); }, function (m) { return m.toArray(); }, function (m) { return m.toString(); });
function transformationIsLinear(arbm, arbv) {
    var d = arbv.generator(0).dimensions;
    jsc.property("Mat" + d + ": M(v1) + M(v2) = M(v1 + v2)", arbm, arbv, arbv, function (m, v1, v2) { return m.transform(v1).add(m.transform(v2))
        .approxEquals(m.transform(v1.add(v2))); });
    jsc.property("Mat" + d + ": M(v * s) = s * M(v)", arbm, arbv, jsc.number, function (m, v, s) { return m.transform(v.mul(s)).approxEquals(m.transform(v).mul(s)); });
}
function addAndSubtract(arb, zero) {
    jsc.property("Mat" + zero.rows + ": m - m = [ 0 ... ]", arb, function (m) { return m.sub(m).equals(zero); });
    jsc.property("Mat" + zero.rows + ": m1 - m2 = m1 + (-m2)", arb, arb, function (m1, m2) { return m1.sub(m2).equals(m1.add(m2.mul(-1))); });
}
function multiplyWithScalar(arb) {
    var d = arb.generator(0).rows;
    jsc.property("Mat" + d + ": m * s * (1 / s) = m when s != 0", arb, jsc.suchthat(jsc.number, function (s) { return s != 0; }), function (m, s) { return m.mul(s).mul(1 / s).approxEquals(m); });
}
function transpose(arb) {
    var d = arb.generator(0).rows;
    jsc.property("Mat" + d + ": m.rows = m^T.cols and m.cols = m^T.rows", arb, function (m) {
        var mt = m.transpose();
        return m.rows == mt.cols && m.cols == mt.rows;
    });
    jsc.property("Mat" + d + ": m^T^T = m", arb, function (m) { return m.transpose().transpose().equals(m); });
    jsc.property("Mat" + d + ": m1^T + m2^T = (m1 + m2)^T", arb, arb, function (m1, m2) { return m1.transpose().add(m2.transpose())
        .equals(m1.add(m2).transpose()); });
}
function matrixMultiply(arb, newMat) {
    var d = newMat.rows;
    var ident = newMat.identity;
    jsc.property("Mat" + d + ": m * I = m", arb, function (m) { return m.mul(ident).equals(m); });
    jsc.property("Mat" + d + ": (m1 * m2) * m3 = m1 * (m2 * m3)", arb, arb, arb, function (m1, m2, m3) { return m1.mul(m2).mul(m3).approxEquals(m1.mul(m2.mul(m3))); });
}
function translation(arb, newMat) {
    var d = newMat.rows;
    jsc.property("Mat" + d + ": M(v1) = v1 + v2 where M = translate (v2)", arb, arb, function (v1, v2) {
        var vec = v1.with(d - 1, 1);
        var off = v2.with(d - 1, 0);
        var m = newMat.translation(off.toArray());
        return m.transform(vec).equals(vec.add(off));
    });
}
function scaling(arb, newMat) {
    var d = newMat.rows;
    jsc.property("Mat" + d + ": M(v1) = v1 * v2 where M = scale (v2)", arb, arb, function (v1, v2) { return newMat.scaling(v2).transform(v1).equals(v1.mul(v2)); });
}
function rotationZ(arb, newMat, zero) {
    var d = newMat.rows;
    var arbnz = jsc.suchthat(arb, function (v) { return !v.equals(zero); });
    jsc.property("Mat" + d + ": | M(v) | = | v | where M = rotateZ (a)", arb, jsc.number, function (v, a) { return FMath_1.approxEquals(newMat.rotationZ(a).transform(v).len, v.len); });
    jsc.property("Mat" + d + ": M(v1) . M(v2)  = v1 . v2 where M = rotateZ (a) and v1, v2 != " + zero, arbnz, arbnz, jsc.number, function (v1, v2, a) {
        var m = newMat.rotationZ(a);
        var vr1 = m.transform(v1);
        var vr2 = m.transform(v2);
        return FMath_1.approxEquals(v1.dot(v2), vr1.dot(vr2));
    });
}
function rotationXY(arb, newMat, zero) {
    var d = newMat.rows;
    var arbnz = jsc.suchthat(arb, function (v) { return !v.equals(zero); });
    jsc.property("Mat" + d + ": | M(v) | = | v | where M = rotateX (a) * rotateY (b)", arb, jsc.number, jsc.number, function (v, a, b) { return FMath_1.approxEquals(newMat.rotationX(a).mul(newMat.rotationY(b)).transform(v).len, v.len); });
    jsc.property("Mat" + d + ": M(v1) . M(v2)  = v1 . v2 where " +
        ("M = rotateX (a) * rotateY (b) and v1, v2 != " + zero), arbnz, arbnz, jsc.number, jsc.number, function (v1, v2, a, b) {
        var m = newMat.rotationX(a).mul(newMat.rotationY(b));
        var vr1 = m.transform(v1);
        var vr2 = m.transform(v2);
        return FMath_1.approxEquals(v1.dot(v2), vr1.dot(vr2));
    });
}
function inverse(arb, newMat) {
    var ident = newMat.identity;
    var zero = newMat.zero;
    var d = ident.rows;
    jsc.property("Mat" + d + ": m * m^-1 = I when det(m) != 0", jsc.suchthat(arb, function (m) { return m.determinant() != 0; }), function (m) { return m.mul(m.invert()).approxEquals(ident); });
}
describe("matrix transformation is linear", function () {
    transformationIsLinear(arbMat2, VecTests_1.arbVec2);
    transformationIsLinear(arbMat3, VecTests_1.arbVec3);
    transformationIsLinear(arbMat4, VecTests_1.arbVec4);
});
describe("matrix addition and subtraction", function () {
    addAndSubtract(arbMat2, ArrayMat_1.newMat2.zero);
    addAndSubtract(arbMat3, ArrayMat_1.newMat3.zero);
    addAndSubtract(arbMat4, ArrayMat_1.newMat4.zero);
});
describe("matrix multiplication with scalar", function () {
    multiplyWithScalar(arbMat2);
    multiplyWithScalar(arbMat3);
    multiplyWithScalar(arbMat4);
});
describe("matrix transpose", function () {
    transpose(arbMat2);
    transpose(arbMat3);
    transpose(arbMat4);
});
describe("matrix multiplication", function () {
    matrixMultiply(arbMat2, ArrayMat_1.newMat2);
    matrixMultiply(arbMat3, ArrayMat_1.newMat3);
    matrixMultiply(arbMat4, ArrayMat_1.newMat4);
});
describe("translation matrix", function () {
    translation(VecTests_1.arbVec2, ArrayMat_1.newMat2);
    translation(VecTests_1.arbVec3, ArrayMat_1.newMat3);
    translation(VecTests_1.arbVec4, ArrayMat_1.newMat4);
});
describe("scaling matrix", function () {
    scaling(VecTests_1.arbVec2, ArrayMat_1.newMat2);
    scaling(VecTests_1.arbVec3, ArrayMat_1.newMat3);
    scaling(VecTests_1.arbVec4, ArrayMat_1.newMat4);
});
describe("rotation around Z axis", function () {
    rotationZ(VecTests_1.arbVec2, ArrayMat_1.newMat2, ArrayVec_1.newVec2.zero);
    rotationZ(VecTests_1.arbVec3, ArrayMat_1.newMat3, ArrayVec_1.newVec3.zero);
    rotationZ(VecTests_1.arbVec4, ArrayMat_1.newMat4, ArrayVec_1.newVec4.zero);
});
describe("rotation around X and Y axis", function () {
    rotationXY(VecTests_1.arbVec3, ArrayMat_1.newMat3, ArrayVec_1.newVec3.zero);
    rotationXY(VecTests_1.arbVec4, ArrayMat_1.newMat4, ArrayVec_1.newVec4.zero);
});
describe("matrix inverse", function () {
    inverse(arbMat2, ArrayMat_1.newMat2);
    inverse(arbMat3, ArrayMat_1.newMat3);
    inverse(arbMat4, ArrayMat_1.newMat4);
});
//# sourceMappingURL=MatTests.js.map