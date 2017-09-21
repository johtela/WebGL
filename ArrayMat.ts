import { Vec } from "./Vectors";
import { NewMat, Mat2, Mat3, Mat4 } from "./Matrices";

class ArrayMat implements Mat2, Mat3, Mat4
{
    readonly rows: number
    readonly cols: number

    private array: number[]
    
    constructor (values: number[], rows: number, columns: number) 
    {
        if (values.length !== rows *columns)
            throw RangeError ("Array length has to be equeal rows * columns.") 
        this.array = values
        this.rows = rows
        this.cols = columns        
    }

    element (row: number, column: number): number
    {
        return this.array[column * this.rows + row]
    }

    private map (oper: (x: number) => number): ArrayMat
    {
        return new ArrayMat (this.array.map (
            function (this, v, i, a)
            {
                return oper (v)
            }), this.cols, this.rows)
    }

    private map2 (other: ArrayMat, oper: (x: number, y: number) => number): ArrayMat
    {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError ("Matrix dimensions must match.")
        return new ArrayMat (this.array.map (
            function (this, v, i, a)
            {
                return oper (v, other.array[i])
            }), this.cols, this.rows)
    }

    private matrixMultiply (other: ArrayMat): ArrayMat
    {
        let n = this.rows
        let m = this.cols
        let q = other.rows
        let p = other.cols
        if (m !== q)
            throw RangeError (`Cannot multiply ${n}x${m} matrix with ${q}x${p} matrix.`)
        var res = Array<number> (n * p)
        // Iterate through rows and columns
        for (let i = 0; i < n; i++)
            for (let j = 0; j < p; j++)
            {
                // Sum up rows from this with columns from other matrix.
                let val = 0
                for (let k = 0; k < m; k++)
                    val += this.array[k * n + i] * other.array[j * q + k]
                res[j * n + i] = val 
            }
        return new ArrayMat (res, n, p)
    }

    static identity (rows: number, cols: number): ArrayMat
    {
        var res = Array<number> (rows * cols);
        for (let i = 0; i < Math.min (rows, cols); i++)
            res[i * rows + i] = 1
        return new ArrayMat (res, rows, cols)
    }

    add (other: ArrayMat | number): ArrayMat
    {
        return other instanceof ArrayMat ?
            this.map2 (other, (x, y) => x + y) :
            this.map (x => x + other)
    }

    sub (other: ArrayMat | number): ArrayMat
    {
        return other instanceof ArrayMat ?
            this.map2 (other, (x, y) => x - y) :
            this.map (x => x - other)
    }

    mul (other: ArrayMat | number): ArrayMat
    {
        return other instanceof ArrayMat ?
            this.matrixMultiply (other) :
            this.map (x => x * other)
    }

    mulVec<V extends Vec<V>> (other: V): V
    {
        if (other.dimensions != this.cols)
            throw RangeError (`Cannot multiply ${this.rows}x${this.cols} matrix with ` +
                `${other.dimensions}D vector`)
        
    }

    transpose (): ArrayMat
    {
        let rows = this.cols
        let cols = this.rows
        let res = Array<number> (this.array.length)
        let ind = 0
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++]
        return new ArrayMat (res, rows, cols)
    }
}