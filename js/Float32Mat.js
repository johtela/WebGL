class Float32Mat {
    constructor(values, rows, columns) {
        if (values.length !== rows * columns)
            throw RangeError("Array length has to be equeal rows * columns.");
        this.array = values instanceof Array ? new Float32Array(values) : values;
        this.rows = rows;
        this.cols = columns;
    }
    element(row, column) {
        return this.array[column * this.rows + row];
    }
    map(oper) {
        return new Float32Mat(this.array.map(function (v, i, a) {
            return oper(v);
        }), this.cols, this.rows);
    }
    map2(other, oper) {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError("Matrix dimensions must match.");
        return new Float32Mat(this.array.map(function (v, i, a) {
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
        var res = new Float32Array(n * p);
        // Iterate through rows and columns
        for (let i = 0; i < n; i++)
            for (let j = 0; j < p; j++) {
                // Sum up rows from this with columns from other matrix.
                let val = 0;
                for (let k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k];
                res[j * n + i] = val;
            }
        return new Float32Mat(res, n, p);
    }
    static identity(rows, cols) {
        var res = new Float32Array(rows * cols);
        for (let i = 0; i < Math.min(rows, cols); i++)
            res[i * rows + i] = 1;
        return new Float32Mat(res, rows, cols);
    }
    add(other) {
        return other instanceof Float32Mat ?
            this.map2(other, (x, y) => x + y) :
            this.map(x => x + other);
    }
    sub(other) {
        return other instanceof Float32Mat ?
            this.map2(other, (x, y) => x - y) :
            this.map(x => x - other);
    }
    mul(other) {
        return other instanceof Float32Mat ?
            this.matrixMultiply(other) :
            this.map(x => x * other);
    }
    transpose() {
        let rows = this.cols;
        let cols = this.rows;
        let res = new Float32Array(this.array.length);
        let ind = 0;
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++];
        return new Float32Mat(res, rows, cols);
    }
}
//# sourceMappingURL=Float32Mat.js.map