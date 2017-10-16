"use strict";
///<reference types="jsverify"/>
Object.defineProperty(exports, "__esModule", { value: true });
const jsc = require("jsverify");
const FMath_1 = require("../src/Math/FMath");
const ArrayVec_1 = require("../src/Math/ArrayVec");
const Arb = require("./ArbitraryTypes");
const ArrayExt = require("../src/Common/ArrayExt");
function addAndSubtract(arb, zero) {
    let dim = zero.dimensions;
    jsc.property(`Vec${dim}: v - v = ${zero}`, arb, v => v.sub(v).equals(zero));
    jsc.property(`Vec${dim}: v1 - v2 = v1 + (-v2)`, arb, arb, (v1, v2) => v1.sub(v2).equals(v1.add(v2.inv())));
    jsc.property(`Vec${dim}: |v + v| = 2 * |v|`, arb, v => v.add(v).len === 2 * v.len);
}
function multiplyWithScalar(arb) {
    let dim = arb.generator(0).dimensions;
    jsc.property(`Vec${dim}: |v * s| = |s| * |v|`, arb, jsc.number, (v, s) => FMath_1.approxEquals((v.mul(s)).len, Math.abs(s) * v.len));
}
function multiplyWithVector(arb, newVec) {
    let dim = arb.generator(0).dimensions;
    jsc.property(`Vec${dim}: v * s = v * v.${ArrayExt.repeat('s', dim)}`, arb, jsc.number, (v, s) => v.mul(s).approxEquals(v.mul(newVec.unif(s))));
}
function divideWithScalar(arb) {
    let dim = arb.generator(0).dimensions;
    jsc.property(`Vec${dim}: v / s = v * (1 / s) when s != 0`, arb, jsc.suchthat(jsc.number, s => s != 0), (v, s) => v.div(s).approxEquals(v.mul(1 / s)));
}
function normalize(arb, zero) {
    let dim = arb.generator(0).dimensions;
    jsc.property(`Vec${dim}: |norm (v)| = 1 when v != ${zero}`, jsc.suchthat(arb, v => !v.equals(zero)), v => FMath_1.approxEquals(v.norm().len, 1));
}
function dotProduct(arb, zero) {
    let dim = arb.generator(0).dimensions;
    var nonzero = jsc.suchthat(arb, v => !v.equals(zero));
    jsc.property(`Vec${dim}: -1 <= norm(v1) . norm(v2) <= 1 when v1, v2 != ${zero}`, nonzero, nonzero, (v1, v2) => {
        let dp = v1.norm().dot(v2.norm());
        return -1 <= dp && dp <= 1;
    });
    jsc.property(`Vec${dim}: v1 . v2 == (v1 . norm(v2)) * |v2| when v2 != ${zero}`, arb, nonzero, (v1, v2) => FMath_1.approxEquals(v1.dot(v2), v1.dot(v2.norm()) * v2.len));
    jsc.property(`Vec${dim}: v1 . v2 == (v2 . norm(v1)) * |v1| when v1 != ${zero}`, nonzero, arb, (v1, v2) => FMath_1.approxEquals(v1.dot(v2), v2.dot(v1.norm()) * v1.len));
}
describe("vector addition and subtraction", () => {
    addAndSubtract(Arb.vec2, ArrayVec_1.newVec2.zero);
    addAndSubtract(Arb.vec3, ArrayVec_1.newVec3.zero);
    addAndSubtract(Arb.vec4, ArrayVec_1.newVec4.zero);
});
describe("vector multiplication with scalar", () => {
    multiplyWithScalar(Arb.vec2);
    multiplyWithScalar(Arb.vec3);
    multiplyWithScalar(Arb.vec4);
});
describe("vector multiplication with vector", () => {
    multiplyWithVector(Arb.vec2, ArrayVec_1.newVec2);
    multiplyWithVector(Arb.vec3, ArrayVec_1.newVec3);
    multiplyWithVector(Arb.vec4, ArrayVec_1.newVec4);
});
describe("vector division with scalar", () => {
    divideWithScalar(Arb.vec2);
    divideWithScalar(Arb.vec3);
    divideWithScalar(Arb.vec4);
});
describe("vector normalization", () => {
    normalize(Arb.vec2, ArrayVec_1.newVec2.zero);
    normalize(Arb.vec3, ArrayVec_1.newVec3.zero);
    normalize(Arb.vec4, ArrayVec_1.newVec4.zero);
});
describe("vector dot product", () => {
    dotProduct(Arb.vec2, ArrayVec_1.newVec2.zero);
    dotProduct(Arb.vec3, ArrayVec_1.newVec3.zero);
    dotProduct(Arb.vec4, ArrayVec_1.newVec4.zero);
});
describe("vec3 cross product", () => {
    var nonzero = jsc.suchthat(Arb.vec3, v => !v.equals(ArrayVec_1.newVec3.zero));
    jsc.property(`Vec3: norm(v1) x norm(v2) . norm(v1|v2) = 1 when v1, v2 != [0 0 0]`, nonzero, nonzero, (v1, v2) => {
        let v1n = v1.norm();
        let v2n = v2.norm();
        let cr = v1n.cross(v2n);
        let dt1 = cr.dot(v1n);
        let dt2 = cr.dot(v2n);
        return FMath_1.approxEquals(dt1, 0) && FMath_1.approxEquals(dt2, 0);
    });
});
//# sourceMappingURL=VecTests.js.map