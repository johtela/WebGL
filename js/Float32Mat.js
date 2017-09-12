var Float32Mat = /** @class */ (function () {
    function Float32Mat(values, c, r) {
        if (values.length !== r * c)
            throw RangeError("Array length has to be r * c.");
        this.array = values instanceof Array ? new Float32Array(values) : values;
        this.cols = c;
        this.rows = r;
    }
    Float32Mat.prototype.element = function (r, c) {
        return this.array[r * this.rows + c];
    };
    Float32Mat.prototype.map = function (oper) {
        return new Float32Mat(this.array.map(function (v, i, a) {
            return oper(v);
        }), this.cols, this.rows);
    };
    Float32Mat.prototype.map2 = function (other, oper) {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError("Matrix dimensions must match.");
        return new Float32Mat(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }), this.cols, this.rows);
    };
    Float32Mat.prototype.matrixMultiply = function (other) {
    };
    Float32Mat.prototype.add = function (other) {
        return other instanceof Float32Mat ?
            this.map2(other, function (x, y) { return x + y; }) :
            this.map(function (x) { return x + other; });
    };
    Float32Mat.prototype.sub = function (other) {
        return other instanceof Float32Mat ?
            this.map2(other, function (x, y) { return x - y; }) :
            this.map(function (x) { return x - other; });
    };
    Float32Mat.prototype.mul = function (other) {
        return other instanceof Float32Mat ?
            null :
            this.map(function (x) { return x * other; });
    };
    return Float32Mat;
}());
//# sourceMappingURL=Float32Mat.js.map