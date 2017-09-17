var Float32Mat = /** @class */ (function () {
    function Float32Mat(values, rows, columns) {
        if (values.length !== rows * columns)
            throw RangeError("Array length has to be equeal rows * columns.");
        this.array = values instanceof Array ? new Float32Array(values) : values;
        this.rows = rows;
        this.cols = columns;
    }
    Float32Mat.prototype.element = function (row, column) {
        return this.array[column * this.rows + row];
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
        var n = this.rows;
        var m = this.cols;
        var q = other.rows;
        var p = other.cols;
        if (m !== q)
            throw RangeError("Cannot multiply " + n + "x" + m + " matrix with " + q + "x" + p + " matrix.");
        var res = new Float32Array(n * p);
        // Iterate through rows and columns
        for (var i = 0; i < n; i++)
            for (var j = 0; j < p; j++) {
                // Sum up rows from this with columns from other matrix.
                var val = 0;
                for (var k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k];
                res[j * n + i] = val;
            }
        return new Float32Mat(res, n, p);
    };
    Float32Mat.identity = function (rows, cols) {
        var res = new Float32Array(rows * cols);
        for (var i = 0; i < Math.min(rows, cols); i++)
            res[i * rows + i] = 1;
        return new Float32Mat(res, rows, cols);
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
            this.matrixMultiply(other) :
            this.map(function (x) { return x * other; });
    };
    Float32Mat.prototype.transpose = function () {
        var rows = this.cols;
        var cols = this.rows;
        var res = new Float32Array(this.array.length);
        var ind = 0;
        for (var i = 0; i < rows; i++)
            for (var j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++];
        return new Float32Mat(res, rows, cols);
    };
    return Float32Mat;
}());
//# sourceMappingURL=Float32Mat.js.map