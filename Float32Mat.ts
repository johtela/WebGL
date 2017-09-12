
class Float32Mat 
{
    readonly cols: number;
    readonly rows: number;

    private array: Float32Array
    
    constructor (values: number[] | Float32Array, c: number, r: number) 
    {
        if (values.length !== r *c)
            throw RangeError ("Array length has to be r * c.") 
        this.array = values instanceof Array ? new Float32Array (values) : values
        this.cols = c;        
        this.rows = r;
    }

    element (r: number, c: number)
    {
        return this.array[r * this.rows + c]
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

    private matrixMultiply (other: Float32Mat)
    {

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
            null :
            this.map (x => x * other)
    }
    
}