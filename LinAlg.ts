export enum Dim 
    {
        x = 0,
        y = 1, 
        z = 2,
        w = 3
    }

export class Vec
{
    private array: Float32Array;

    constructor (value: number | number[])
    {
        this.array = value instanceof Array ?
            new Float32Array (value) :
            new Float32Array (value);
    }

        get dimensions (): number
        {
            return this.array.length;
        }

        get x () { return this.array[Dim.x]; }
        set x (value: number) { this.array[Dim.x] = value; }

        get y () { return this.array[Dim.y]; }
        set y (value: number) { this.array[Dim.y] = value; }

        get z () { return this.array[Dim.z]; }
        set z (value: number) { this.array[Dim.z] = value; }

        get w () { return this.array[Dim.w]; }
        set w (value: number) { this.array[Dim.w] = value; }
        
        swizzle (coords: Dim[])
        {
            var res = new Array (coords.length);
            for (var i = 0; i < res.length; i++)
                res[i] = this.array[coords[i]];  
        }

    add (other: Vec | number, result: Vec = this): Vec
    {
        for (var i = 0; i < result.array.length; i++)
            result.array[i] = result.array[i] + (other instanceof Vec ? other.array[i] : other);
        return result;
    }
}
