"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Dim;
(function (Dim) {
    Dim[Dim["x"] = 0] = "x";
    Dim[Dim["y"] = 1] = "y";
    Dim[Dim["z"] = 2] = "z";
    Dim[Dim["w"] = 3] = "w";
})(Dim = exports.Dim || (exports.Dim = {}));
var Vec = (function () {
    function Vec(value) {
        this.array = value instanceof Array ?
            new Float32Array(value) :
            new Float32Array(value);
    }
    Object.defineProperty(Vec.prototype, "dimensions", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "x", {
        get: function () { return this.array[Dim.x]; },
        set: function (value) { this.array[Dim.x] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "y", {
        get: function () { return this.array[Dim.y]; },
        set: function (value) { this.array[Dim.y] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "z", {
        get: function () { return this.array[Dim.z]; },
        set: function (value) { this.array[Dim.z] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vec.prototype, "w", {
        get: function () { return this.array[Dim.w]; },
        set: function (value) { this.array[Dim.w] = value; },
        enumerable: true,
        configurable: true
    });
    Vec.prototype.swizzle = function (coords) {
        var res = new Array(coords.length);
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]];
    };
    Vec.prototype.add = function (other, result) {
        if (result === void 0) { result = this; }
        for (var i = 0; i < result.array.length; i++)
            result.array[i] = result.array[i] + (other instanceof Vec ? other.array[i] : other);
        return result;
    };
    return Vec;
}());
exports.Vec = Vec;
//# sourceMappingURL=LinAlg.js.map