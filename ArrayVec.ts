import * as FMath from "./FMath"
import { Dim, Vec, Vec2, Vec3, Vec4, NewVec } from "./Vectors"

export function vec (values: number[]): Vec2 | Vec3 | Vec4
{
    let len = values.length
    if (len < 2 || len > 4)
        throw RangeError ("Number of components must be 2-4.")
    return new ArrayVec (values);
}

export function vec2 (x: number, y?: number): Vec2
{
    return y ? new ArrayVec ([x, y]) : 
           new ArrayVec ([x, x]) 
}

export function vec3 (x: number, y?: number, z?: number): Vec3
{
    return y && z ? new ArrayVec ([x, y, z]) : 
           new ArrayVec ([x, x, x]) 
}

export function vec4 (x: number, y?: number, z?: number, w?: number): Vec4
{
    return y && z && w ? new ArrayVec ([x, y, z, w]) :
           new ArrayVec ([x, x, x, x]) 
}

class ArrayVec implements Vec2, Vec3, Vec4
{
    private array: number[]

    constructor (values: number[])
    {
        this.array = values
    }

    get dimensions (): number
    {
        return this.array.length
    }

    get x (): number { return this.array[Dim.x] }
    set x (value: number) { this.array[Dim.x] = value }

    get y (): number { return this.array[Dim.y] }
    set y (value: number) { this.array[Dim.y] = value }

    get z (): number { return this.array[Dim.z] }
    set z (value: number) { this.array[Dim.z] = value }

    get w (): number { return this.array[Dim.w] }
    set w (value: number) { this.array[Dim.w] = value }
    
    swizzle (coords: Dim[]): number[]
    {
        var res = new Array (coords.length)
        for (var i = 0; i < res.length; i++)
            res[i] = this.array[coords[i]]
        return res;
    }

    private map (oper: (x: number) => number): ArrayVec
    {
        return new ArrayVec (this.array.map (
            function (this, v, i, a)
            {
                return oper (v)
            }))
    }

    private map2 (other: ArrayVec, oper: (x: number, y: number) => number): ArrayVec
    {
        return new ArrayVec (this.array.map (
            function (this, v, i, a)
            {
                return oper (v, other.array[i])
            }))
    }

    private reduce (oper: (acc: number, x: number) => number): number
    {
        return this.array.reduce (
            function (c, v, i, a)
            {
                return oper (c, v)
            }, 0)
    }

    get lenSqr (): number
    {
        return this.reduce ((a, x) => a + (x * x))
    }

    get len (): number
    {
        return Math.sqrt (this.lenSqr)
    }

    inv () : ArrayVec
    {
        return this.map (x => -x)
    }

    add (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other, (x, y) => x + y) :
            this.map (x => x + other)
    }

    sub (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other,(x, y) => x - y) :
            this.map (x => x - other)
    }

    mul (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other,(x, y) => x * y) :
            this.map (x => x * other)
    }

    div (other: ArrayVec | number): ArrayVec
    {
        return other instanceof ArrayVec ? 
            this.map2 (other,(x, y) => x / y) :
            this.map (x => x / other)
    }

    norm (): ArrayVec
    {
        let l = this.len
        if (l == 0)
            throw RangeError ("Cannot normalize zero vector")
        return this.map (x => x / l)
    }

    equals (other: ArrayVec): boolean
    {
        return this.array.every (
            function (v, i, a)
            {
                return v === other.array[i]
            })
    }

    approxEquals (other: ArrayVec, epsilon: number = 0.000001): boolean
    {
        return this.array.every (
            function (v, i, a)
            {
                return FMath.approxEquals (v, other.array[i], epsilon)
            })
    }

    dot (other: ArrayVec): number
    {
        return this.array.reduce (
            function (c: number, v: number, i: number, a: number[])
            {
                return c + (v * other.array[i]) 
            }, 0)
    }

    cross (other: ArrayVec): ArrayVec
    {
        return new ArrayVec ([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x])		
    }

    abs (): ArrayVec
    {
        return this.map (Math.abs)
    }

    floor (): ArrayVec
    {
        return this.map (Math.floor)
    }

    ceil (): ArrayVec
    {
        return this.map (Math.ceil)
    }

    round (): ArrayVec
    {
        return this.map (Math.round)
    }

    fract (): ArrayVec
    {
        return this.map (FMath.fract)
    }

    clamp (min: number, max: number): ArrayVec
    {
        return this.map (x => FMath.clamp (x, min, max))
    }

    mix (other: ArrayVec, interPos: number): ArrayVec
    {
        return this.map2 (other, (x, y) => FMath.mix (x, y, interPos))
    }

    step (edge: number): ArrayVec
    {
        return this.map (x => FMath.step (edge, x))
    }

    smoothStep (edgeLower: number, edgeUpper: number): ArrayVec
    {
        return this.map (x => FMath.smoothStep (edgeLower, edgeUpper, x))
    }

    toString (): string
    {
        return "[" + this.array.join (" ") + "]"
    }

    toFloat32Array (): Float32Array
    {
        return new Float32Array (this.array)
    }
}

class NewArrayVec implements NewVec<Vec2>, NewVec<Vec3>, NewVec<Vec4>
{
    zero (): Vec2
    {
        return new ArrayVec([0, 0])
    }

    zero (): Vec3
    {
        return new ArrayVec([0, 0, 0])
    }
}