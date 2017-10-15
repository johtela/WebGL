"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FMath = require("./FMath");
var Vectors_1 = require("./Vectors");
var ArrayHelper = require("../Common/ArrayHelper");
var NewArrayVec = (function () {
    function NewArrayVec(dimensions) {
        this.dimensions = dimensions;
    }
    Object.defineProperty(NewArrayVec.prototype, "zero", {
        get: function () {
            return new ArrayVec(ArrayHelper.fill(Array(this.dimensions), 0));
        },
        enumerable: true,
        configurable: true
    });
    NewArrayVec.prototype.unif = function (x) {
        return new ArrayVec(ArrayHelper.fill(Array(this.dimensions), x));
    };
    NewArrayVec.prototype.init = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        if (values.length != this.dimensions)
            throw RangeError("Expected " + this.dimensions + " components.");
        return new ArrayVec(values);
    };
    NewArrayVec.prototype.fromArray = function (array) {
        if (array.length != this.dimensions)
            throw RangeError("Expected " + this.dimensions + " components.");
        return new ArrayVec(array);
    };
    return NewArrayVec;
}());
exports.newVec2 = new NewArrayVec(2);
exports.newVec3 = new NewArrayVec(3);
exports.newVec4 = new NewArrayVec(4);
var ArrayVec = (function () {
    function ArrayVec(array) {
        this.array = array;
    }
    Object.defineProperty(ArrayVec.prototype, "dimensions", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    ArrayVec.prototype.component = function (index) {
        return this.array[index];
    };
    ArrayVec.prototype.with = function (index, value) {
        return new ArrayVec(this.array.map(function (v, i, a) { return i == index ? value : v; }));
    };
    Object.defineProperty(ArrayVec.prototype, "x", {
        get: function () { return this.array[Vectors_1.Dim.x]; },
        set: function (value) { this.array[Vectors_1.Dim.x] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "y", {
        get: function () { return this.array[Vectors_1.Dim.y]; },
        set: function (value) { this.array[Vectors_1.Dim.y] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "z", {
        get: function () { return this.array[Vectors_1.Dim.z]; },
        set: function (value) { this.array[Vectors_1.Dim.z] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "w", {
        get: function () { return this.array[Vectors_1.Dim.w]; },
        set: function (value) { this.array[Vectors_1.Dim.w] = value; },
        enumerable: true,
        configurable: true
    });
    ArrayVec.prototype.swizzle = function (coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
        return res;
    };
    ArrayVec.prototype.map = function (oper) {
        return new ArrayVec(this.array.map(function (v, i, a) {
            return oper(v);
        }));
    };
    ArrayVec.prototype.map2 = function (other, oper) {
        return new ArrayVec(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }));
    };
    ArrayVec.prototype.reduce = function (oper) {
        return this.array.reduce(function (c, v, i, a) {
            return oper(c, v);
        }, 0);
    };
    Object.defineProperty(ArrayVec.prototype, "lenSqr", {
        get: function () {
            return this.reduce(function (a, x) { return a + (x * x); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayVec.prototype, "len", {
        get: function () {
            return Math.sqrt(this.lenSqr);
        },
        enumerable: true,
        configurable: true
    });
    ArrayVec.prototype.inv = function () {
        return this.map(function (x) { return -x; });
    };
    ArrayVec.prototype.add = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x + y; }) :
            this.map(function (x) { return x + other; });
    };
    ArrayVec.prototype.sub = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x - y; }) :
            this.map(function (x) { return x - other; });
    };
    ArrayVec.prototype.mul = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x * y; }) :
            this.map(function (x) { return x * other; });
    };
    ArrayVec.prototype.div = function (other) {
        return other instanceof ArrayVec ?
            this.map2(other, function (x, y) { return x / y; }) :
            this.map(function (x) { return x / other; });
    };
    ArrayVec.prototype.norm = function () {
        var l = this.len;
        if (l == 0)
            throw RangeError("Cannot normalize zero vector");
        return this.map(function (x) { return x / l; });
    };
    ArrayVec.prototype.equals = function (other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    };
    ArrayVec.prototype.approxEquals = function (other, epsilon) {
        if (epsilon === void 0) { epsilon = 0.000001; }
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    };
    ArrayVec.prototype.dot = function (other) {
        return this.array.reduce(function (c, v, i, a) {
            return c + (v * other.array[i]);
        }, 0);
    };
    ArrayVec.prototype.cross = function (other) {
        return new ArrayVec([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        ]);
    };
    ArrayVec.prototype.abs = function () {
        return this.map(Math.abs);
    };
    ArrayVec.prototype.floor = function () {
        return this.map(Math.floor);
    };
    ArrayVec.prototype.ceil = function () {
        return this.map(Math.ceil);
    };
    ArrayVec.prototype.round = function () {
        return this.map(Math.round);
    };
    ArrayVec.prototype.fract = function () {
        return this.map(FMath.fract);
    };
    ArrayVec.prototype.min = function (other) {
        return this.map2(other, Math.min);
    };
    ArrayVec.prototype.max = function (other) {
        return this.map2(other, Math.max);
    };
    ArrayVec.prototype.clamp = function (min, max) {
        return this.map(function (x) { return FMath.clamp(x, min, max); });
    };
    ArrayVec.prototype.mix = function (other, interPos) {
        return this.map2(other, function (x, y) { return FMath.mix(x, y, interPos); });
    };
    ArrayVec.prototype.step = function (edge) {
        return this.map(function (x) { return FMath.step(edge, x); });
    };
    ArrayVec.prototype.smoothStep = function (edgeLower, edgeUpper) {
        return this.map(function (x) { return FMath.smoothStep(edgeLower, edgeUpper, x); });
    };
    ArrayVec.prototype.toString = function () {
        return "[" + this.array.join(" ") + "]";
    };
    ArrayVec.prototype.toArray = function () {
        return this.array;
    };
    ArrayVec.prototype.toFloat32Array = function () {
        return new Float32Array(this.array);
    };
    ArrayVec.prototype.newVec = function () {
        return new NewArrayVec(this.dimensions);
    };
    return ArrayVec;
}());
//# sourceMappingURL=ArrayVec.js.map