"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FMath = require("./FMath");
var Vectors_1 = require("./Vectors");
function vec(values) {
    var len = values.length;
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
var Float32Vec = /** @class */ (function () {
    function Float32Vec(values) {
        this.array = values instanceof Array ? new Float32Array(values) : values;
    }
    Object.defineProperty(Float32Vec.prototype, "dimensions", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Float32Vec.prototype, "x", {
        get: function () { return this.array[Vectors_1.Dim.x]; },
        set: function (value) { this.array[Vectors_1.Dim.x] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Float32Vec.prototype, "y", {
        get: function () { return this.array[Vectors_1.Dim.y]; },
        set: function (value) { this.array[Vectors_1.Dim.y] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Float32Vec.prototype, "z", {
        get: function () { return this.array[Vectors_1.Dim.z]; },
        set: function (value) { this.array[Vectors_1.Dim.z] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Float32Vec.prototype, "w", {
        get: function () { return this.array[Vectors_1.Dim.w]; },
        set: function (value) { this.array[Vectors_1.Dim.w] = value; },
        enumerable: true,
        configurable: true
    });
    Float32Vec.prototype.swizzle = function (coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
        return res;
    };
    Float32Vec.prototype.map = function (oper) {
        return new Float32Vec(this.array.map(function (v, i, a) {
            return oper(v);
        }));
    };
    Float32Vec.prototype.map2 = function (other, oper) {
        return new Float32Vec(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }));
    };
    Float32Vec.prototype.reduce = function (oper) {
        return this.array.reduce(function (c, v, i, a) {
            return oper(c, v);
        }, 0);
    };
    Object.defineProperty(Float32Vec.prototype, "lenSqr", {
        get: function () {
            return this.reduce(function (a, x) { return a + (x * x); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Float32Vec.prototype, "len", {
        get: function () {
            return Math.sqrt(this.lenSqr);
        },
        enumerable: true,
        configurable: true
    });
    Float32Vec.prototype.inv = function () {
        return this.map(function (x) { return -x; });
    };
    Float32Vec.prototype.add = function (other) {
        return other instanceof Float32Vec ?
            this.map2(other, function (x, y) { return x + y; }) :
            this.map(function (x) { return x + other; });
    };
    Float32Vec.prototype.sub = function (other) {
        return other instanceof Float32Vec ?
            this.map2(other, function (x, y) { return x - y; }) :
            this.map(function (x) { return x - other; });
    };
    Float32Vec.prototype.mul = function (other) {
        return other instanceof Float32Vec ?
            this.map2(other, function (x, y) { return x * y; }) :
            this.map(function (x) { return x * other; });
    };
    Float32Vec.prototype.div = function (other) {
        return other instanceof Float32Vec ?
            this.map2(other, function (x, y) { return x / y; }) :
            this.map(function (x) { return x / other; });
    };
    Float32Vec.prototype.norm = function () {
        var l = this.len;
        return this.map(function (x) { return x / l; });
    };
    Float32Vec.prototype.equals = function (other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    };
    Float32Vec.prototype.approxEquals = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = 0.000001; }
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    };
    Float32Vec.prototype.dot = function (other) {
        return this.array.reduce(function (c, v, i, a) {
            return c + (v * other.array[i]);
        }, 0);
    };
    Float32Vec.prototype.cross = function (other) {
        return new Float32Vec([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ]);
    };
    Float32Vec.prototype.abs = function () {
        return this.map(Math.abs);
    };
    Float32Vec.prototype.floor = function () {
        return this.map(Math.floor);
    };
    Float32Vec.prototype.ceil = function () {
        return this.map(Math.ceil);
    };
    Float32Vec.prototype.round = function () {
        return this.map(Math.round);
    };
    Float32Vec.prototype.fract = function () {
        return this.map(FMath.fract);
    };
    Float32Vec.prototype.clamp = function (min, max) {
        return this.map(function (x) { return FMath.clamp(x, min, max); });
    };
    Float32Vec.prototype.mix = function (other, interPos) {
        return this.map2(other, function (x, y) { return FMath.mix(x, y, interPos); });
    };
    Float32Vec.prototype.step = function (edge) {
        return this.map(function (x) { return FMath.step(edge, x); });
    };
    Float32Vec.prototype.smoothStep = function (edgeLower, edgeUpper) {
        return this.map(function (x) { return FMath.smoothStep(edgeLower, edgeUpper, x); });
    };
    Float32Vec.prototype.toString = function () {
        return "[" + this.array.join(" ") + "]";
    };
    return Float32Vec;
}());
//# sourceMappingURL=Float32Vec.js.map