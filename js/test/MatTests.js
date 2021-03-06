"use strict";
///<reference types="jsverify"/>
Object.defineProperty(exports, "__esModule", { value: true });
const jsc = require("jsverify");
const FMath_1 = require("../src/Math/FMath");
const ArrayVec_1 = require("../src/Math/ArrayVec");
const ArrayMat_1 = require("../src/Math/ArrayMat");
const Arb = require("./ArbitraryTypes");
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
    let ident = newMat.identity;
    jsc.property(`Mat${d}: m * I = m`, arb, m => m.mul(ident).equals(m));
    jsc.property(`Mat${d}: (m1 * m2) * m3 = m1 * (m2 * m3)`, arb, arb, arb, (m1, m2, m3) => m1.mul(m2).mul(m3).approxEquals(m1.mul(m2.mul(m3))));
}
function translation(arb, newMat) {
    let d = newMat.rows;
    jsc.property(`Mat${d}: M(v1) = v1 + v2 where M = translate (v2)`, arb, arb, (v1, v2) => {
        let vec = v1.with(d - 1, 1);
        let off = v2.with(d - 1, 0);
        let m = newMat.translation(off.toArray());
        return m.transform(vec).equals(vec.add(off));
    });
}
function scaling(arb, newMat) {
    let d = newMat.rows;
    jsc.property(`Mat${d}: M(v1) = v1 * v2 where M = scale (v2)`, arb, arb, (v1, v2) => newMat.scaling(v2.toArray()).transform(v1).equals(v1.mul(v2)));
}
function rotationZ(arb, newMat, zero) {
    let d = newMat.rows;
    let arbnz = jsc.suchthat(arb, v => !v.equals(zero));
    jsc.property(`Mat${d}: | M(v) | = | v | where M = rotateZ (a)`, arb, jsc.number, (v, a) => FMath_1.approxEquals(newMat.rotationZ(a).transform(v).len, v.len));
    jsc.property(`Mat${d}: M(v1) . M(v2)  = v1 . v2 where M = rotateZ (a) and v1, v2 != ${zero}`, arbnz, arbnz, jsc.number, (v1, v2, a) => {
        let m = newMat.rotationZ(a);
        let vr1 = m.transform(v1);
        let vr2 = m.transform(v2);
        return FMath_1.approxEquals(v1.dot(v2), vr1.dot(vr2));
    });
}
function rotationXY(arb, newMat, zero) {
    let d = newMat.rows;
    let arbnz = jsc.suchthat(arb, v => !v.equals(zero));
    jsc.property(`Mat${d}: | M(v) | = | v | where M = rotateX (a) * rotateY (b)`, arb, jsc.number, jsc.number, (v, a, b) => FMath_1.approxEquals(newMat.rotationX(a).mul(newMat.rotationY(b)).transform(v).len, v.len));
    jsc.property(`Mat${d}: M(v1) . M(v2)  = v1 . v2 where ` +
        `M = rotateX (a) * rotateY (b) and v1, v2 != ${zero}`, arbnz, arbnz, jsc.number, jsc.number, (v1, v2, a, b) => {
        let m = newMat.rotationX(a).mul(newMat.rotationY(b));
        let vr1 = m.transform(v1);
        let vr2 = m.transform(v2);
        return FMath_1.approxEquals(v1.dot(v2), vr1.dot(vr2));
    });
}
function inverse(arb, newMat) {
    let ident = newMat.identity;
    let zero = newMat.zero;
    let d = ident.rows;
    jsc.property(`Mat${d}: m * m^-1 = I when det(m) != 0`, jsc.suchthat(arb, m => m.determinant() != 0), m => m.mul(m.invert()).approxEquals(ident));
}
describe("matrix transformation is linear", () => {
    transformationIsLinear(Arb.mat2, Arb.vec2);
    transformationIsLinear(Arb.mat3, Arb.vec3);
    transformationIsLinear(Arb.mat4, Arb.vec4);
});
describe("matrix addition and subtraction", () => {
    addAndSubtract(Arb.mat2, ArrayMat_1.newMat2.zero);
    addAndSubtract(Arb.mat3, ArrayMat_1.newMat3.zero);
    addAndSubtract(Arb.mat4, ArrayMat_1.newMat4.zero);
});
describe("matrix multiplication with scalar", () => {
    multiplyWithScalar(Arb.mat2);
    multiplyWithScalar(Arb.mat3);
    multiplyWithScalar(Arb.mat4);
});
describe("matrix transpose", () => {
    transpose(Arb.mat2);
    transpose(Arb.mat3);
    transpose(Arb.mat4);
});
describe("matrix multiplication", () => {
    matrixMultiply(Arb.mat2, ArrayMat_1.newMat2);
    matrixMultiply(Arb.mat3, ArrayMat_1.newMat3);
    matrixMultiply(Arb.mat4, ArrayMat_1.newMat4);
});
describe("translation matrix", () => {
    translation(Arb.vec2, ArrayMat_1.newMat2);
    translation(Arb.vec3, ArrayMat_1.newMat3);
    translation(Arb.vec4, ArrayMat_1.newMat4);
});
describe("scaling matrix", () => {
    scaling(Arb.vec2, ArrayMat_1.newMat2);
    scaling(Arb.vec3, ArrayMat_1.newMat3);
    scaling(Arb.vec4, ArrayMat_1.newMat4);
});
describe("rotation around Z axis", () => {
    rotationZ(Arb.vec2, ArrayMat_1.newMat2, ArrayVec_1.newVec2.zero);
    rotationZ(Arb.vec3, ArrayMat_1.newMat3, ArrayVec_1.newVec3.zero);
    rotationZ(Arb.vec4, ArrayMat_1.newMat4, ArrayVec_1.newVec4.zero);
});
describe("rotation around X and Y axis", () => {
    rotationXY(Arb.vec3, ArrayMat_1.newMat3, ArrayVec_1.newVec3.zero);
    rotationXY(Arb.vec4, ArrayMat_1.newMat4, ArrayVec_1.newVec4.zero);
});
describe("matrix inverse", () => {
    inverse(Arb.mat2, ArrayMat_1.newMat2);
    inverse(Arb.mat3, ArrayMat_1.newMat3);
    inverse(Arb.mat4, ArrayMat_1.newMat4);
});
//# sourceMappingURL=MatTests.js.map