"use strict";
///<reference types="jsverify"/>
Object.defineProperty(exports, "__esModule", { value: true });
const jsc = require("jsverify");
const Arb = require("./ArbitraryTypes");
const Vertex_1 = require("../src/Geometry/Vertex");
const ArrayVec_1 = require("../src/Math/ArrayVec");
function testExtents(arb, zero) {
    let dim = zero.dimensions;
    jsc.property(`Positional<Vec${dim}>[]: all positionals are between extents`, jsc.suchthat(arb, ps => ps.length > 0), positionals => {
        let [min, max] = Vertex_1.extents(positionals);
        return positionals.every(p => p.position.min(min).equals(min) && p.position.max(max).equals(max));
    });
}
function testCenter(arb, zero) {
    let dim = zero.dimensions;
    jsc.property(`Positional<Vec${dim}>[]: center is inside extents`, jsc.suchthat(arb, ps => ps.length > 0), positionals => {
        let [min, max] = Vertex_1.extents(positionals);
        let cent = Vertex_1.center(positionals);
        return cent.min(min).equals(min) && cent.max(max).equals(max) &&
            cent.equals(min.add(max).div(2));
    });
}
function testFurthest(arbPos, arbDir) {
    let dim = arbDir.generator(0).dimensions;
    jsc.property(`Positional<Vec${dim}>[]: furthest positionals are found`, arbDir, jsc.suchthat(arbPos, ps => ps.length > 0), (dir, positionals) => {
        let furth = Vertex_1.furthest(positionals, dir);
        return positionals.every(p => furth.every(f => f.position.dot(dir) >= p.position.dot(dir)));
    });
}
describe("extents of positionals", () => {
    testExtents(Arb.positionals2, ArrayVec_1.newVec2.zero);
    testExtents(Arb.positionals3, ArrayVec_1.newVec3.zero);
});
describe("center location of positionals", () => {
    testCenter(Arb.positionals2, ArrayVec_1.newVec2.zero);
    testCenter(Arb.positionals3, ArrayVec_1.newVec3.zero);
});
describe("find furthest positionals in a direction", () => {
    testFurthest(Arb.positionals2, Arb.vec2);
    testFurthest(Arb.positionals3, Arb.vec3);
});
//# sourceMappingURL=VertexTests.js.map