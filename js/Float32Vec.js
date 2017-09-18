"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FMath = require("./FMath");
const Vectors_1 = require("./Vectors");
function vec(values) {
    let len = values.length;
    if (len < 2 || len > 4)
        throw RangeError("Number of components must be 2-4.");
    return new Float32Vec(values);
}
exports.vec = vec;
function vec2(x, y) {
    return y ? new Float32Vec([x, y]) :
        new Float32Vec([x, x]);
}
exports.vec2 = vec2;
function vec3(x, y, z) {
    return y && z ? new Float32Vec([x, y, z]) :
        new Float32Vec([x, x, x]);
}
exports.vec3 = vec3;
function vec4(x, y, z, w) {
    return y && z && w ? new Float32Vec([x, y, z, w]) :
        new Float32Vec([x, x, x, x]);
}
exports.vec4 = vec4;
class Float32Vec {
    constructor(values) {
        this.array = values instanceof Array ? new Float32Array(values) : values;
    }
    get dimensions() {
        return this.array.length;
    }
    get x() { return this.array[Vectors_1.Dim.x]; }
    set x(value) { this.array[Vectors_1.Dim.x] = value; }
    get y() { return this.array[Vectors_1.Dim.y]; }
    set y(value) { this.array[Vectors_1.Dim.y] = value; }
    get z() { return this.array[Vectors_1.Dim.z]; }
    set z(value) { this.array[Vectors_1.Dim.z] = value; }
    get w() { return this.array[Vectors_1.Dim.w]; }
    set w(value) { this.array[Vectors_1.Dim.w] = value; }
    swizzle(coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
        return res;
    }
    map(oper) {
        return new Float32Vec(this.array.map(function (v, i, a) {
            return oper(v);
        }));
    }
    map2(other, oper) {
        return new Float32Vec(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }));
    }
    reduce(oper) {
        return this.array.reduce(function (c, v, i, a) {
            return oper(c, v);
        }, 0);
    }
    get lenSqr() {
        return this.reduce((a, x) => a + (x * x));
    }
    get len() {
        return Math.sqrt(this.lenSqr);
    }
    inv() {
        return this.map(x => -x);
    }
    add(other) {
        return other instanceof Float32Vec ?
            this.map2(other, (x, y) => x + y) :
            this.map(x => x + other);
    }
    sub(other) {
        return other instanceof Float32Vec ?
            this.map2(other, (x, y) => x - y) :
            this.map(x => x - other);
    }
    mul(other) {
        return other instanceof Float32Vec ?
            this.map2(other, (x, y) => x * y) :
            this.map(x => x * other);
    }
    div(other) {
        return other instanceof Float32Vec ?
            this.map2(other, (x, y) => x / y) :
            this.map(x => x / other);
    }
    norm() {
        let l = this.len;
        if (l == 0)
            throw RangeError("Cannot normalize zero vector");
        return this.map(x => x / l);
    }
    equals(other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    }
    approxEquals(other, epsilon = 0.000001) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    }
    dot(other) {
        return this.array.reduce(function (c, v, i, a) {
            return c + (v * other.array[i]);
        }, 0);
    }
    cross(other) {
        return new Float32Vec([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ]);
    }
    abs() {
        return this.map(Math.abs);
    }
    floor() {
        return this.map(Math.floor);
    }
    ceil() {
        return this.map(Math.ceil);
    }
    round() {
        return this.map(Math.round);
    }
    fract() {
        return this.map(FMath.fract);
    }
    clamp(min, max) {
        return this.map(x => FMath.clamp(x, min, max));
    }
    mix(other, interPos) {
        return this.map2(other, (x, y) => FMath.mix(x, y, interPos));
    }
    step(edge) {
        return this.map(x => FMath.step(edge, x));
    }
    smoothStep(edgeLower, edgeUpper) {
        return this.map(x => FMath.smoothStep(edgeLower, edgeUpper, x));
    }
    toString() {
        return "[" + this.array.join(" ") + "]";
    }
}
//# sourceMappingURL=Float32Vec.js.map