"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FMath = require("./FMath");
var Vectors_1 = require("./Vectors");
function vec2(x, y) {
    return new Vec([x, y]);
}
exports.vec2 = vec2;
function vec3(x, y, z) {
    return new Vec([x, y, z]);
}
exports.vec3 = vec3;
function vec4(x, y, z, w) {
    return new Vec([x, y, z, w]);
}
exports.vec4 = vec4;
var Vec = /** @class */ (function () {
    function Vec(value) {
        this.array = value instanceof Array ? new Float32Array(value) : value;
    }
    Object.defineProperty(Vec.prototype, "dimensions", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "x", {
        get: function () { return this.array[Vectors_1.Dim.x]; },
        set: function (value) { this.array[Vectors_1.Dim.x] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "y", {
        get: function () { return this.array[Vectors_1.Dim.y]; },
        set: function (value) { this.array[Vectors_1.Dim.y] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "z", {
        get: function () { return this.array[Vectors_1.Dim.z]; },
        set: function (value) { this.array[Vectors_1.Dim.z] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "w", {
        get: function () { return this.array[Vectors_1.Dim.w]; },
        set: function (value) { this.array[Vectors_1.Dim.w] = value; },
        enumerable: true,
        configurable: true
    });
    Vec.prototype.swizzle = function (coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
        return res;
    };
    Vec.prototype.map = function (oper) {
        return new Vec(this.array.map(function (v, i, a) {
            return oper(v);
        }));
    };
    Vec.prototype.map2 = function (other, oper) {
        return new Vec(this.array.map(function (v, i, a) {
            return oper(v, other instanceof Vec ? other.array[i] : other);
        }));
    };
    Vec.prototype.reduce = function (oper) {
        return this.array.reduce(function (c, v, i, a) {
            return oper(c, v);
        }, 0);
    };
    Object.defineProperty(Vec.prototype, "lenSqr", {
        get: function () {
            return this.reduce(function (a, x) { return a + (x * x); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "len", {
        get: function () {
            return Math.sqrt(this.lenSqr);
        },
        enumerable: true,
        configurable: true
    });
    Vec.prototype.inv = function () {
        return this.map(function (x) { return -x; });
    };
    Vec.prototype.add = function (other) {
        return this.map2(other, function (x, y) { return x + y; });
    };
    Vec.prototype.sub = function (other) {
        return this.map2(other, function (x, y) { return x - y; });
    };
    Vec.prototype.mul = function (other) {
        return this.map2(other, function (x, y) { return x * y; });
    };
    Vec.prototype.div = function (other) {
        return this.map2(other, function (x, y) { return x / y; });
    };
    Vec.prototype.norm = function () {
        var l = this.len;
        return this.map(function (x) { return x / l; });
    };
    Vec.prototype.equals = function (other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    };
    Vec.prototype.approxEquals = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = 0.000001; }
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    };
    Vec.prototype.dot = function (other) {
        return this.array.reduce(function (c, v, i, a) {
            return c + (v * other.array[i]);
        }, 0);
    };
    Vec.prototype.cross = function (other) {
        return new Vec([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ]);
    };
    Vec.prototype.abs = function () {
        return this.map(Math.abs);
    };
    Vec.prototype.floor = function () {
        return this.map(Math.floor);
    };
    Vec.prototype.ceil = function () {
        return this.map(Math.ceil);
    };
    Vec.prototype.round = function () {
        return this.map(Math.round);
    };
    Vec.prototype.fract = function () {
        return this.map(FMath.fract);
    };
    Vec.prototype.clamp = function (min, max) {
        return this.map(function (x) { return FMath.clamp(x, min, max); });
    };
    Vec.prototype.mix = function (other, interPos) {
        return this.map2(other, function (x, y) { return FMath.mix(x, y, interPos); });
    };
    Vec.prototype.step = function (edge) {
        return this.map(function (x) { return FMath.step(edge, x); });
    };
    Vec.prototype.smoothStep = function (edgeLower, edgeUpper) {
        return this.map(function (x) { return FMath.smoothStep(edgeLower, edgeUpper, x); });
    };
    Vec.prototype.toString = function () {
        return "[" + this.array.join(" ") + "]";
    };
    return Vec;
}());
//# sourceMappingURL=Vec.js.map