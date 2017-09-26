"use strict";
///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const jsc = require("jsverify");
const ArrayMat_1 = require("./ArrayMat");
const VecTests_1 = require("./VecTests");
const arbMat2 = VecTests_1.arbNumArr(4).smap(a => ArrayMat_1.newMat2.fromArray(a, 2, 2), m => m.toArray(), m => m.toString());
const arbMat3 = VecTests_1.arbNumArr(9).smap(a => ArrayMat_1.newMat3.fromArray(a, 3, 3), m => m.toArray(), m => m.toString());
const arbMat4 = VecTests_1.arbNumArr(16).smap(a => ArrayMat_1.newMat4.fromArray(a, 4, 4), m => m.toArray(), m => m.toString());
function transformationIsLinear(arbm, arbv) {
    let d = arbv.generator(0).dimensions;
    jsc.property(`Mat${d}: M(v1) + M(v2) = M(v1 + v2)`, arbm, arbv, arbv, (m, v1, v2) => m.transform(v1).add(m.transform(v2))
        .approxEquals(m.transform(v1.add(v2))));
    jsc.property(`Mat${d}: M(v * s) = s * M(v)`, arbm, arbv, jsc.number, (m, v, s) => m.transform(v.mul(s)).approxEquals(m.transform(v).mul(s)));
}
function addAndSubtract(arb, zero) {
    jsc.property(`Mat${zero.rows}: m - m = [ 0 ... ]`, arb, m => m.sub(m).equals(zero));
    jsc.property(`Mat${zero.rows}: m1 - m2 = m1 + (-m2)`, arb, arb, (m1, m2) => m1.sub(m2).equals(m1.add(m2.mul(-1))));
}
function multiplyWithScalar(arb) {
    let d = arb.generator(0).rows;
    jsc.property(`Mat${d}: m * s * (1 / s) = m when s != 0`, arb, jsc.suchthat(jsc.number, s => s != 0), (m, s) => m.mul(s).mul(1 / s).approxEquals(m));
}
function transpose(arb) {
    let d = arb.generator(0).rows;
    jsc.property(`Mat${d}: m.rows = m^T.cols and m.cols = m^T.rows`, arb, m => {
        let mt = m.transpose();
        return m.rows == mt.cols && m.cols == mt.rows;
    });
    jsc.property(`Mat${d}: m^T^T = m`, arb, m => m.transpose().transpose().equals(m));
    jsc.property(`Mat${d}: m1^T + m2^T = (m1 + m2)^T`, arb, arb, (m1, m2) => m1.transpose().add(m2.transpose())
        .equals(m1.add(m2).transpose()));
}
function matrixMultiply(arb, newMat) {
    let d = newMat.rows;
    let ident = newMat.identity();
    jsc.property(`Mat${d}: m * I = m`, arb, m => m.mul(ident).equals(m));
    jsc.property(`Mat${d}: (m1 * m2) * m3 = m1 * (m2 * m3)`, arb, arb, arb, (m1, m2, m3) => m1.mul(m2).mul(m3).approxEquals(m1.mul(m2.mul(m3))));
}
function translation(arb, newMat) {
    let d = arb.generator(0).dimensions;
    jsc.property(`Mat${d}: M(v1) = v2 + v2 where M = translate (v2)`, arb, arb, (v1, v2) => {
        let vec = v1.with(d - 1, 1);
        let off = v2.with(d - 1, 0);
        let m = newMat.translation(off.toArray());
        return m.transform(vec).equals(vec.add(off));
    });
}
describe("matrix transformation is linear", () => {
    transformationIsLinear(arbMat2, VecTests_1.arbVec2);
    transformationIsLinear(arbMat3, VecTests_1.arbVec3);
    transformationIsLinear(arbMat4, VecTests_1.arbVec4);
});
describe("matrix addition and subtraction", () => {
    addAndSubtract(arbMat2, ArrayMat_1.newMat2.zero());
    addAndSubtract(arbMat3, ArrayMat_1.newMat3.zero());
    addAndSubtract(arbMat4, ArrayMat_1.newMat4.zero());
});
describe("matrix multiplication with scalar", () => {
    multiplyWithScalar(arbMat2);
    multiplyWithScalar(arbMat3);
    multiplyWithScalar(arbMat4);
});
describe("matrix transpose", () => {
    transpose(arbMat2);
    transpose(arbMat3);
    transpose(arbMat4);
});
describe("matrix multiplication", () => {
    matrixMultiply(arbMat2, ArrayMat_1.newMat2);
    matrixMultiply(arbMat3, ArrayMat_1.newMat3);
    matrixMultiply(arbMat4, ArrayMat_1.newMat4);
});
describe("translation matrix", () => {
    translation(VecTests_1.arbVec2, ArrayMat_1.newMat2);
    translation(VecTests_1.arbVec3, ArrayMat_1.newMat3);
    translation(VecTests_1.arbVec4, ArrayMat_1.newMat4);
});
//# sourceMappingURL=MatTests.js.map