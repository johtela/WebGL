"use strict";
///<reference types="jsverify"/>
Object.defineProperty(exports, "__esModule", { value: true });
const jsc = require("jsverify");
const ArrayExt = require("../src/Common/ArrayExt");
const ArrayVec_1 = require("../src/Math/ArrayVec");
const ArrayMat_1 = require("../src/Math/ArrayMat");
function numArr(size) {
    return jsc.tuple(ArrayExt.fill(Array(size), jsc.number));
}
exports.numArr = numArr;
exports.vec2 = numArr(2).smap(a => ArrayVec_1.newVec2.fromArray(a), v => [v.x, v.y], v => v.toString());
exports.vec3 = numArr(3).smap(a => ArrayVec_1.newVec3.fromArray(a), v => [v.x, v.y, v.z], v => v.toString());
exports.vec4 = numArr(4).smap(a => ArrayVec_1.newVec4.fromArray(a), v => [v.x, v.y, v.z, v.w], v => v.toString());
exports.mat2 = numArr(4).smap(a => ArrayMat_1.newMat2.fromArray(a, 2, 2), m => m.toArray(), m => m.toString());
exports.mat3 = numArr(9).smap(a => ArrayMat_1.newMat3.fromArray(a, 3, 3), m => m.toArray(), m => m.toString());
exports.mat4 = numArr(16).smap(a => ArrayMat_1.newMat4.fromArray(a, 4, 4), m => m.toArray(), m => m.toString());
class ArbPositional {
    constructor(position) {
        this.position = position;
    }
}
exports.ArbPositional = ArbPositional;
exports.positional2 = exports.vec2.smap(v => new ArbPositional(v), p => p.position, p => `{ position: ${p.position} }`);
exports.positional3 = exports.vec3.smap(v => new ArbPositional(v), p => p.position, p => `{ position: ${p.position} }`);
class ArbPlanar {
    constructor(normal) {
        this.normal = normal;
    }
}
exports.ArbPlanar = ArbPlanar;
exports.planar = exports.vec3.smap(v => new ArbPlanar(v.norm()), p => p.normal, p => `{ normal: ${p.normal} }`);
//# sourceMappingURL=ArbitraryTypes.js.map