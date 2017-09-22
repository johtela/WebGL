import { Vec, Vec2, Vec3, Vec4 } from "./Vectors";
import { NewMat, NewMat4, Mat2, Mat3, Mat4 } from "./Matrices";
import * as FMath from "./FMath"

class NewArrayMat implements NewMat<Mat2, Vec2>, NewMat<Mat3, Vec3>, NewMat4
{
    private rows: number
    private cols: number

    constructor(rows: number, cols: number) 
    {
        this.rows = rows
        this.cols = cols
    }

    private identityArray (): number[]
    {
        let r = this.rows        
        let c = this.cols        
        let arr = Array<number> (r * c)
        for (let i = 0; i < Math.min (r, c); i++) 
            arr[i * r + i] = 1
        return arr
    }

    identity (): Mat2 & Mat3 & Mat4
    {
        return new ArrayMat (this.identityArray (), this.rows, this.cols)
    }

    translation (offsets: number[]|Vec2|Vec3|Vec4): Mat2 & Mat3 & Mat4
    {
        let r = this.rows
        let c = this.cols
        let offs = offsets instanceof Array ? offsets : offsets.toArray ()
        if (offs.length >= r)
            throw RangeError (`Too many offsets for ${r}x${c} matrix.`)
        let res = this.identityArray ()
        let lastCol = c - 1
        for (let i = 0; i < offs.length; i++)
            res [lastCol * r + i] = offs[i]
        return new ArrayMat (res, r, c)
    }

    scaling (factors: number[]|Vec2|Vec3|Vec4): Mat2 & Mat3 & Mat4
    {
        let r = this.rows
        let c = this.cols
        let facs = factors instanceof Array ? factors :factors.toArray ()
        if (facs.length >= r)
            throw RangeError (`Too many factors for ${r}x${c} matrix.`)
        let res = this.identityArray ()
        for (let i = 0; i < facs.length; i++)
            res [i * r + i] = facs[i]
        return new ArrayMat (res, r, c)
    }

    rotationX (angle: number): Mat2 & Mat3 & Mat4
    {
        let r = this.rows
        let c = this.cols
        if (r < 3 || c < 3)
            throw RangeError (`Rotation around X-axis not defined for ${r}x${c} matrix.`)
        let res = this.identityArray ()
        let sina = Math.sin (angle)
        let cosa = Math.cos (angle)
        res[r + 1] = cosa
        res[r + 2] = sina
        res[2 * r + 1] = -sina
        res[2 * r + 2] = cosa
        return new ArrayMat (res, r, c)
    }

    rotationY (angle: number): Mat2 & Mat3 & Mat4
    {
        let r = this.rows
        let c = this.cols
        if (r < 3 || c < 3)
            throw RangeError (`Rotation around Y-axis not defined for ${r}x${c} matrix.`)
        let res = this.identityArray ()
        let sina = Math.sin (angle)
        let cosa = Math.cos (angle)
        res[0] = cosa;
        res[2] = -sina;
        res[2 * r] = sina;
        res[2 * r + 2] = cosa;
        return new ArrayMat (res, r, c)
    }

    rotationZ (angle: number): Mat2 & Mat3 & Mat4
    {
        let r = this.rows
        let c = this.cols
        let res = this.identityArray ()
        let sina = Math.sin (angle)
        let cosa = Math.cos (angle)
        res[0] = cosa;
        res[1] = sina;
        res[r] = -sina;
        res[r + 1] = cosa;
        return new ArrayMat (res, r, c)
    }
}

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
        let vecm = new ArrayMat (other.toArray (), this.cols, 1)
        return other.newVec ().fromArray (this.matrixMultiply (vecm).array)
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

    equals (other: ArrayMat): boolean
    {
        return this.array.every (
            function (v, i, a)
            {
                return v === other.array[i]
            })
    }

    approxEquals (other: ArrayMat, epsilon?: number): boolean
    {
        return this.array.every (
            function (v, i, a)
            {
                return FMath.approxEquals (v, other.array[i], epsilon)
            })
    }

    toString (): string
    {
        let res = ""
        for (let r = 0; r < this.rows; r++)
        {
            res += "[ "
            for (let c = 0; c < this.cols; c++)
                res += this.element(r, c) + " "
            res += "]\n"
        }
        return res        
    }

    toFloat32Array (): Float32Array
    {
        return new Float32Array (this.array)
    }
}