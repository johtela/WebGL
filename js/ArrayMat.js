"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FMath = require("./FMath");
var ArrayHelper = require("./ArrayHelper");
var NewArrayMat = /** @class */ (function () {
    function NewArrayMat(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    NewArrayMat.prototype.identityArray = function () {
        var _a = this, r = _a.rows, c = _a.cols;
        var arr = ArrayHelper.fill(Array(r * c), 0);
        for (var i = 0; i < Math.min(r, c); i++)
            arr[i * r + i] = 1;
        return arr;
    };
    Object.defineProperty(NewArrayMat.prototype, "zero", {
        get: function () {
            var _a = this, r = _a.rows, c = _a.cols;
            return new ArrayMat(ArrayHelper.fill(Array(r * c), 0), r, c);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NewArrayMat.prototype, "identity", {
        get: function () {
            return new ArrayMat(this.identityArray(), this.rows, this.cols);
        },
        enumerable: true,
        configurable: true
    });
    NewArrayMat.prototype.translation = function (offsets) {
        var _a = this, r = _a.rows, c = _a.cols;
        var offs = offsets instanceof Array ? offsets : offsets.toArray();
        if (offs.length > r)
            throw RangeError("Too many offsets for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        var lastCol = c - 1;
        for (var i = 0; i < Math.min(offs.length, r - 1); i++)
            res[lastCol * r + i] = offs[i];
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.scaling = function (factors) {
        var _a = this, r = _a.rows, c = _a.cols;
        var facs = factors instanceof Array ? factors : factors.toArray();
        if (facs.length > r)
            throw RangeError("Too many factors for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        for (var i = 0; i < Math.min(facs.length, r, c); i++)
            res[i * r + i] = facs[i];
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.rotationX = function (angle) {
        var _a = this, r = _a.rows, c = _a.cols;
        if (r < 3 || c < 3)
            throw RangeError("Rotation around X-axis not defined for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        res[r + 1] = cosa;
        res[r + 2] = sina;
        res[2 * r + 1] = -sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.rotationY = function (angle) {
        var _a = this, r = _a.rows, c = _a.cols;
        if (r < 3 || c < 3)
            throw RangeError("Rotation around Y-axis not defined for " + r + "x" + c + " matrix.");
        var res = this.identityArray();
        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        res[0] = cosa;
        res[2] = -sina;
        res[2 * r] = sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.rotationZ = function (angle) {
        var _a = this, r = _a.rows, c = _a.cols;
        var res = this.identityArray();
        var sina = Math.sin(angle);
        var cosa = Math.cos(angle);
        res[0] = cosa;
        res[1] = sina;
        res[r] = -sina;
        res[r + 1] = cosa;
        return new ArrayMat(res, r, c);
    };
    NewArrayMat.prototype.perspective = function (left, right, bottom, top, zNear, zFar) {
        if (zNear <= 0 || zNear >= zFar)
            throw RangeError("zNear needs to be positive and smaller thatn zFar");
        var width = right - left;
        var height = top - bottom;
        var depth = zFar - zNear;
        return new ArrayMat([(2.0 * zNear) / width, 0, 0, 0,
            0, (2.0 * zNear) / height, 0, 0,
            (right + left) / width, (top + bottom) / height, -(zFar + zNear) / depth, -1,
            0, 0, -(2.0 * zFar * zNear) / depth, 0], 4, 4);
    };
    NewArrayMat.prototype.orthographic = function (left, right, bottom, top, zNear, zFar) {
        var invWidth = 1.0 / (right - left);
        var invHeight = 1.0 / (top - bottom);
        var invDepth = 1.0 / (zFar - zNear);
        return new ArrayMat([2 * invWidth, 0, 0, 0,
            0, 2 * invHeight, 0, 0,
            0, 0, -2 * invDepth, 0,
            -(right + left) * invWidth, -(top + bottom) * invHeight, -(zFar + zNear) * invDepth, 1], 4, 4);
    };
    NewArrayMat.prototype.lookAt = function (direction, up) {
        var zaxis = direction.inv().norm();
        var xaxis = up.cross(zaxis).norm();
        var yaxis = zaxis.cross(xaxis);
        return new ArrayMat([xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1], 4, 4);
    };
    NewArrayMat.prototype.fromArray = function (array, rows, cols) {
        return new ArrayMat(array, rows, cols);
    };
    return NewArrayMat;
}());
exports.newMat2 = new NewArrayMat(2, 2);
exports.newMat3 = new NewArrayMat(3, 3);
exports.newMat4 = new NewArrayMat(4, 4);
var ArrayMat = /** @class */ (function () {
    function ArrayMat(values, rows, columns) {
        if (values.length !== rows * columns)
            throw RangeError("Array length has to be equeal rows * columns.");
        this.array = values;
        this.rows = rows;
        this.cols = columns;
    }
    ArrayMat.prototype.element = function (row, column) {
        return this.array[column * this.rows + row];
    };
    ArrayMat.prototype.map = function (oper) {
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v);
        }), this.cols, this.rows);
    };
    ArrayMat.prototype.map2 = function (other, oper) {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError("Matrix dimensions must match.");
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }), this.cols, this.rows);
    };
    ArrayMat.prototype.matrixMultiply = function (other) {
        var n = this.rows;
        var m = this.cols;
        var q = other.rows;
        var p = other.cols;
        if (m !== q)
            throw RangeError("Cannot multiply " + n + "x" + m + " matrix with " + q + "x" + p + " matrix.");
        var res = Array(n * p);
        // Iterate through rows and columns
        for (var i = 0; i < n; i++)
            for (var j = 0; j < p; j++) {
                // Sum up rows from this with columns from other matrix.
                var val = 0;
                for (var k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k];
                res[j * n + i] = val;
            }
        return new ArrayMat(res, n, p);
    };
    ArrayMat.prototype.add = function (other) {
        return other instanceof ArrayMat ?
            this.map2(other, function (x, y) { return x + y; }) :
            this.map(function (x) { return x + other; });
    };
    ArrayMat.prototype.sub = function (other) {
        return other instanceof ArrayMat ?
            this.map2(other, function (x, y) { return x - y; }) :
            this.map(function (x) { return x - other; });
    };
    ArrayMat.prototype.mul = function (other) {
        return other instanceof ArrayMat ?
            this.matrixMultiply(other) :
            this.map(function (x) { return x * other; });
    };
    ArrayMat.prototype.transform = function (other) {
        var vecm = new ArrayMat(other.toArray(), this.cols, 1);
        return other.newVec().fromArray(this.matrixMultiply(vecm).array);
    };
    ArrayMat.prototype.transpose = function () {
        var rows = this.cols;
        var cols = this.rows;
        var res = Array(this.array.length);
        var ind = 0;
        for (var i = 0; i < rows; i++)
            for (var j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++];
        return new ArrayMat(res, rows, cols);
    };
    ArrayMat.prototype.determinant = function () {
        return this.determinantFA();
    };
    ArrayMat.prototype.invert = function () {
        return ArrayMat.fromJaggedArray(this.inverseFA());
    };
    ArrayMat.prototype.toJaggedArray = function () {
        var _a = this, rows = _a.rows, cols = _a.cols, array = _a.array;
        var res = Array(rows);
        for (var r = 0; r < rows; r++) {
            res[r] = Array(cols);
            for (var c = 0; c < cols; c++)
                res[r][c] = array[c * rows + r];
        }
        return res;
    };
    ArrayMat.fromJaggedArray = function (matrix) {
        var rows = matrix.length;
        var cols = matrix[0].length;
        var arr = Array(cols * rows);
        var i = 0;
        for (var c = 0; c < cols; c++)
            for (var r = 0; r < rows; r++)
                arr[i++] = matrix[r][c];
        return new ArrayMat(arr, rows, cols);
    };
    ArrayMat.prototype.decomposeFA = function (matrix) {
        var _a = this, rows = _a.rows, cols = _a.cols;
        if (rows != cols)
            throw RangeError("Cannot decompose non-square matrix");
        // set up row permutation result
        var perm = Array(rows);
        for (var i = 0; i < rows; i++)
            perm[i] = i;
        // toggle tracks row swaps. +1 -> even, -1 -> odd. used by MatrixDeterminant
        var toggle = 1;
        for (var c = 0; c < cols - 1; c++) {
            var colMax = Math.abs(matrix[c][c]); // find largest value in col j
            var pRow = c;
            for (var r = c + 1; r < rows; r++)
                if (matrix[r][c] > colMax) {
                    colMax = matrix[r][c];
                    pRow = r;
                }
            if (pRow != c) {
                // if largest value not on pivot, swap rows
                var rowPtr = matrix[pRow];
                matrix[pRow] = matrix[c];
                matrix[c] = rowPtr;
                // and swap perm info
                var tmp = perm[pRow];
                perm[pRow] = perm[c];
                perm[c] = tmp;
                // adjust the row-swap toggle
                toggle = -toggle;
            }
            // handle the case where the input matrix is singular
            if (matrix[c][c] == 0)
                matrix[c][c] = 0.000001;
            for (var r = c + 1; r < rows; r++) {
                matrix[r][c] /= matrix[c][c];
                for (var k = c + 1; k < cols; k++)
                    matrix[r][k] -= matrix[r][c] * matrix[c][k];
            }
        }
        return [perm, toggle];
    };
    ArrayMat.prototype.determinantFA = function () {
        var matrix = this.toJaggedArray();
        var result = this.decomposeFA(matrix)[1];
        for (var i = 0; i < matrix.length; i++)
            result *= matrix[i][i];
        return result;
    };
    ArrayMat.prototype.inverseFA = function () {
        var matrix = this.toJaggedArray();
        var rows = matrix.length;
        var result = ArrayHelper.clone(matrix);
        var perm = this.decomposeFA(matrix)[0];
        var b = Array(rows);
        for (var c = 0; c < rows; c++) {
            for (var r = 0; r < rows; r++)
                b[r] = c == perm[r] ? 1 : 0;
            var x = ArrayMat.helperSolvef(matrix, b);
            for (var r = 0; r < rows; r++)
                result[r][c] = x[r];
        }
        return result;
    };
    ArrayMat.helperSolvef = function (luMatrix, vector) {
        // before calling this helper, permute b using the perm array from 
        // MatrixDecompose that generated luMatrix
        var rows = luMatrix.length;
        var res = vector.slice();
        for (var r = 1; r < rows; r++) {
            var sum = res[r];
            for (var c = 0; c < r; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum;
        }
        res[rows - 1] /= luMatrix[rows - 1][rows - 1];
        for (var r = rows - 2; r >= 0; r--) {
            var sum = res[r];
            for (var c = r + 1; c < rows; c++)
                sum -= luMatrix[r][c] * res[c];
            res[r] = sum / luMatrix[r][r];
        }
        return res;
    };
    ArrayMat.prototype.equals = function (other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    };
    ArrayMat.prototype.approxEquals = function (other, epsilon) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    };
    ArrayMat.prototype.toString = function () {
        var res = "";
        for (var r = 0; r < this.rows; r++) {
            res += "[ ";
            for (var c = 0; c < this.cols; c++)
                res += this.element(r, c) + " ";
            res += "]\n";
        }
        return res;
    };
    ArrayMat.prototype.toArray = function () {
        return this.array;
    };
    ArrayMat.prototype.toFloat32Array = function () {
        return new Float32Array(this.array);
    };
    return ArrayMat;
}());
//# sourceMappingURL=ArrayMat.js.map