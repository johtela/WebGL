"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FMath = require("./FMath");
class NewArrayMat {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    identityArray() {
        let { rows: r, cols: c } = this;
        let arr = Array(r * c);
        for (let i = 0; i < Math.min(r, c); i++)
            arr[i * r + i] = 1;
        return arr;
    }
    identity() {
        return new ArrayMat(this.identityArray(), this.rows, this.cols);
    }
    translation(offsets) {
        let { rows: r, cols: c } = this;
        let offs = offsets instanceof Array ? offsets : offsets.toArray();
        if (offs.length >= r)
            throw RangeError(`Too many offsets for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let lastCol = c - 1;
        for (let i = 0; i < offs.length; i++)
            res[lastCol * r + i] = offs[i];
        return new ArrayMat(res, r, c);
    }
    scaling(factors) {
        let { rows: r, cols: c } = this;
        let facs = factors instanceof Array ? factors : factors.toArray();
        if (facs.length >= r)
            throw RangeError(`Too many factors for ${r}x${c} matrix.`);
        let res = this.identityArray();
        for (let i = 0; i < facs.length; i++)
            res[i * r + i] = facs[i];
        return new ArrayMat(res, r, c);
    }
    rotationX(angle) {
        let { rows: r, cols: c } = this;
        if (r < 3 || c < 3)
            throw RangeError(`Rotation around X-axis not defined for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[r + 1] = cosa;
        res[r + 2] = sina;
        res[2 * r + 1] = -sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    }
    rotationY(angle) {
        let { rows: r, cols: c } = this;
        if (r < 3 || c < 3)
            throw RangeError(`Rotation around Y-axis not defined for ${r}x${c} matrix.`);
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[0] = cosa;
        res[2] = -sina;
        res[2 * r] = sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat(res, r, c);
    }
    rotationZ(angle) {
        let { rows: r, cols: c } = this;
        let res = this.identityArray();
        let sina = Math.sin(angle);
        let cosa = Math.cos(angle);
        res[0] = cosa;
        res[1] = sina;
        res[r] = -sina;
        res[r + 1] = cosa;
        return new ArrayMat(res, r, c);
    }
    perspective(left, right, bottom, top, zNear, zFar) {
        if (zNear <= 0 || zNear >= zFar)
            throw RangeError("zNear needs to be positive and smaller thatn zFar");
        let width = right - left;
        let height = top - bottom;
        let depth = zFar - zNear;
        return new ArrayMat([(2.0 * zNear) / width, 0, 0, 0,
            0, (2.0 * zNear) / height, 0, 0,
            (right + left) / width, (top + bottom) / height, -(zFar + zNear) / depth, -1,
            0, 0, -(2.0 * zFar * zNear) / depth, 0], 4, 4);
    }
    orthographic(left, right, bottom, top, zNear, zFar) {
        let invWidth = 1.0 / (right - left);
        let invHeight = 1.0 / (top - bottom);
        let invDepth = 1.0 / (zFar - zNear);
        return new ArrayMat([2 * invWidth, 0, 0, 0,
            0, 2 * invHeight, 0, 0,
            0, 0, -2 * invDepth, 0,
            -(right + left) * invWidth, -(top + bottom) * invHeight, -(zFar + zNear) * invDepth, 1], 4, 4);
    }
    lookAt(direction, up) {
        let zaxis = direction.inv().norm();
        let xaxis = up.cross(zaxis).norm();
        let yaxis = zaxis.cross(xaxis);
        return new ArrayMat([xaxis.x, yaxis.x, zaxis.x, 0,
            xaxis.y, yaxis.y, zaxis.y, 0,
            xaxis.z, yaxis.z, zaxis.z, 0,
            0, 0, 0, 1], 4, 4);
    }
}
exports.newMat2 = new NewArrayMat(2, 2);
exports.newMat3 = new NewArrayMat(3, 3);
exports.newMat4 = new NewArrayMat(4, 4);
class ArrayMat {
    constructor(values, rows, columns) {
        if (values.length !== rows * columns)
            throw RangeError("Array length has to be equeal rows * columns.");
        this.array = values;
        this.rows = rows;
        this.cols = columns;
    }
    element(row, column) {
        return this.array[column * this.rows + row];
    }
    map(oper) {
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v);
        }), this.cols, this.rows);
    }
    map2(other, oper) {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError("Matrix dimensions must match.");
        return new ArrayMat(this.array.map(function (v, i, a) {
            return oper(v, other.array[i]);
        }), this.cols, this.rows);
    }
    matrixMultiply(other) {
        let n = this.rows;
        let m = this.cols;
        let q = other.rows;
        let p = other.cols;
        if (m !== q)
            throw RangeError(`Cannot multiply ${n}x${m} matrix with ${q}x${p} matrix.`);
        let res = Array(n * p);
        // Iterate through rows and columns
        for (let i = 0; i < n; i++)
            for (let j = 0; j < p; j++) {
                // Sum up rows from this with columns from other matrix.
                let val = 0;
                for (let k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k];
                res[j * n + i] = val;
            }
        return new ArrayMat(res, n, p);
    }
    add(other) {
        return other instanceof ArrayMat ?
            this.map2(other, (x, y) => x + y) :
            this.map(x => x + other);
    }
    sub(other) {
        return other instanceof ArrayMat ?
            this.map2(other, (x, y) => x - y) :
            this.map(x => x - other);
    }
    mul(other) {
        return other instanceof ArrayMat ?
            this.matrixMultiply(other) :
            this.map(x => x * other);
    }
    mulVec(other) {
        let vecm = new ArrayMat(other.toArray(), this.cols, 1);
        return other.newVec().fromArray(this.matrixMultiply(vecm).array);
    }
    transpose() {
        let rows = this.cols;
        let cols = this.rows;
        let res = Array(this.array.length);
        let ind = 0;
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++];
        return new ArrayMat(res, rows, cols);
    }
    equals(other) {
        return this.array.every(function (v, i, a) {
            return v === other.array[i];
        });
    }
    approxEquals(other, epsilon) {
        return this.array.every(function (v, i, a) {
            return FMath.approxEquals(v, other.array[i], epsilon);
        });
    }
    toString() {
        let res = "";
        for (let r = 0; r < this.rows; r++) {
            res += "[ ";
            for (let c = 0; c < this.cols; c++)
                res += this.element(r, c) + " ";
            res += "]\n";
        }
        return res;
    }
    toFloat32Array() {
        return new Float32Array(this.array);
    }
}
//# sourceMappingURL=ArrayMat.js.map