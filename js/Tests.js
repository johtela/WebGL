"use strict";
///<reference path="./node_modules/jsverify/lib/jsverify.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
const jsc = require("jsverify");
const FMath_1 = require("./FMath");
const Float32Vec_1 = require("./Float32Vec");
function arbNumArr(size) {
    return jsc.tuple(Array(size).fill(jsc.number));
}
const arbVec2 = arbNumArr(2).smap(a => Float32Vec_1.vec2(a[0], a[1]), v => [v.x, v.y], v => v.toString());
const arbVec3 = arbNumArr(3).smap(a => Float32Vec_1.vec3(a[0], a[1], a[2]), v => [v.x, v.y, v.z], v => v.toString());
const arbVec4 = arbNumArr(4).smap(a => Float32Vec_1.vec4(a[0], a[1], a[2], a[3]), v => [v.x, v.y, v.z, v.w], v => v.toString());
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
    jsc.property(`Vec${dim}: v * s = v * v.${'s'.repeat(dim)}`, arb, jsc.number, (v, s) => v.mul(s).approxEquals(v.mul(newVec(s))));
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
    jsc.property(`Vec${dim}: v1 . v2 == (v1 . norm(v2)) * |v2| when v2 != ${zero}`, arb, nonzero, (v1, v2) => FMath_1.approxEquals(v1.dot(v2), v1.dot(v2.norm()) * v2.len, 0.0001));
    jsc.property(`Vec${dim}: v1 . v2 == (v2 . norm(v1)) * |v1| when v1 != ${zero}`, nonzero, arb, (v1, v2) => FMath_1.approxEquals(v1.dot(v2), v2.dot(v1.norm()) * v1.len, 0.0001));
}
describe("vector addition and subtraction", () => {
    addAndSubtract(arbVec2, Float32Vec_1.vec2(0));
    addAndSubtract(arbVec3, Float32Vec_1.vec3(0));
    addAndSubtract(arbVec4, Float32Vec_1.vec4(0));
});
describe("vector multiplication with scalar", () => {
    multiplyWithScalar(arbVec2);
    multiplyWithScalar(arbVec3);
    multiplyWithScalar(arbVec4);
});
describe("vector multiplication with vector", () => {
    multiplyWithVector(arbVec2, Float32Vec_1.vec2);
    multiplyWithVector(arbVec3, Float32Vec_1.vec3);
    multiplyWithVector(arbVec4, Float32Vec_1.vec4);
});
describe("vector division with scalar", () => {
    divideWithScalar(arbVec2);
    divideWithScalar(arbVec3);
    divideWithScalar(arbVec4);
});
describe("vector normalization", () => {
    normalize(arbVec2, Float32Vec_1.vec2(0));
    normalize(arbVec3, Float32Vec_1.vec3(0));
    normalize(arbVec4, Float32Vec_1.vec4(0));
});
describe("vector dot product", () => {
    dotProduct(arbVec2, Float32Vec_1.vec2(0));
    dotProduct(arbVec3, Float32Vec_1.vec3(0));
    dotProduct(arbVec4, Float32Vec_1.vec4(0));
});
//# sourceMappingURL=Tests.js.map