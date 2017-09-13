
class Float32Mat 
{
    readonly rows: number;
    readonly cols: number;

    private array: Float32Array
    
    constructor (values: number[] | Float32Array, rows: number, columns: number) 
    {
        if (values.length !== rows *columns)
            throw RangeError ("Array length has to be equeal rows * columns.") 
        this.array = values instanceof Array ? new Float32Array (values) : values
        this.rows = rows;
        this.cols = columns;        
    }

    element (row: number, column: number)
    {
        return this.array[column * this.rows + row]
    }

    private map (oper: (x: number) => number): Float32Mat
    {
        return new Float32Mat (this.array.map (
            function (this, v, i, a)
            {
                return oper (v)
            }), this.cols, this.rows)
    }

    private map2 (other: Float32Mat, oper: (x: number, y: number) => number): Float32Mat
    {
        if (this.cols != other.cols || this.rows != other.rows)
            throw RangeError ("Matrix dimensions must match.")
        return new Float32Mat (this.array.map (
            function (this, v, i, a)
            {
                return oper (v, other.array[i])
            }), this.cols, this.rows)
    }

    private matrixMultiply (other: Float32Mat): Float32Mat
    {
        let n = this.rows
        let m = this.cols
        let q = other.rows
        let p = other.cols
        if (m !== q)
            throw RangeError (`Cannot multiply ${n}x${m} matrix with ${q}x${p} matrix.`)
        var res = new Float32Array (n * p)
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
        return new Float32Mat (res, n, p)
    }

    static identity (rows: number, cols: number): Float32Mat
    {
        var res = new Float32Array (rows * cols);
        for (let i = 0; i < Math.min (rows, cols); i++)
            res[i * rows + i] = 1
        return new Float32Mat (res, rows, cols)
    }

    add (other: Float32Mat | number): Float32Mat
    {
        return other instanceof Float32Mat ?
            this.map2 (other, (x, y) => x + y) :
            this.map (x => x + other)
    }

    sub (other: Float32Mat | number): Float32Mat
    {
        return other instanceof Float32Mat ?
            this.map2 (other, (x, y) => x - y) :
            this.map (x => x - other)
    }

    mul (other: Float32Mat | number): Float32Mat
    {
        return other instanceof Float32Mat ?
            this.matrixMultiply (other) :
            this.map (x => x * other)
    }

    transpose (): Float32Mat
    {
        let rows = this.cols
        let cols = this.rows
        let res = new Float32Array (this.array.length)
        let ind = 0
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                res[j * rows + i] = this.array[ind++]
        return new Float32Mat (res, rows, cols)
    }
}