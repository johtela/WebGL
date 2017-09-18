import * as FMath from "./FMath"
import { Dim, Vec, Vec2, Vec3, Vec4 } from "./Vectors"

export function vec (values: number[]): Vec2 | Vec3 | Vec4
{
    let len = values.length
    if (len < 2 || len > 4)
        throw RangeError ("Number of components must be 2-4.")
    return new Float32Vec (values);
}

export function vec2 (x: number, y?: number): Vec2
{
    return y ? new Float32Vec ([x, y]) : 
           new Float32Vec ([x, x]) 
}

export function vec3 (x: number, y?: number, z?: number): Vec3
{
    return y && z ? new Float32Vec ([x, y, z]) : 
           new Float32Vec ([x, x, x]) 
}

export function vec4 (x: number, y?: number, z?: number, w?: number): Vec4
{
    return y && z && w ? new Float32Vec ([x, y, z, w]) :
           new Float32Vec ([x, x, x, x]) 
}

class Float32Vec implements Vec2, Vec3, Vec4
{
    private array: Float32Array

    constructor (values: number[] | Float32Array)
    {
        this.array = values instanceof Array ? new Float32Array (values) : values
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

    private map (oper: (x: number) => number): Float32Vec
    {
        return new Float32Vec (this.array.map (
            function (this, v, i, a)
            {
                return oper (v)
            }))
    }

    private map2 (other: Float32Vec, oper: (x: number, y: number) => number): Float32Vec
    {
        return new Float32Vec (this.array.map (
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

    inv () : Float32Vec
    {
        return this.map (x => -x)
    }

    add (other: Float32Vec | number): Float32Vec
    {
        return other instanceof Float32Vec ? 
            this.map2 (other, (x, y) => x + y) :
            this.map (x => x + other)
    }

    sub (other: Float32Vec | number): Float32Vec
    {
        return other instanceof Float32Vec ? 
            this.map2 (other,(x, y) => x - y) :
            this.map (x => x - other)
    }

    mul (other: Float32Vec | number): Float32Vec
    {
        return other instanceof Float32Vec ? 
            this.map2 (other,(x, y) => x * y) :
            this.map (x => x * other)
    }

    div (other: Float32Vec | number): Float32Vec
    {
        return other instanceof Float32Vec ? 
            this.map2 (other,(x, y) => x / y) :
            this.map (x => x / other)
    }

    norm (): Float32Vec
    {
        let l = this.len
        if (l == 0)
            throw RangeError ("Cannot normalize zero vector")
        return this.map (x => x / l)
    }

    equals (other: Float32Vec): boolean
    {
        return this.array.every (
            function (v, i, a)
            {
                return v === other.array[i]
            })
    }

    approxEquals (other: Float32Vec, epsilon: number = 0.000001): boolean
    {
        return this.array.every (
            function (v, i, a)
            {
                return FMath.approxEquals (v, other.array[i], epsilon)
            })
    }

    dot (other: Float32Vec): number
    {
        return this.array.reduce (
            function (c: number, v: number, i: number, a: Float32Array)
            {
                return c + (v * other.array[i]) 
            }, 0)
    }

    cross (other: Float32Vec): Float32Vec
    {
        return new Float32Vec ([
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x])		
    }

    abs (): Float32Vec
    {
        return this.map (Math.abs)
    }

    floor (): Float32Vec
    {
        return this.map (Math.floor)
    }

    ceil (): Float32Vec
    {
        return this.map (Math.ceil)
    }

    round (): Float32Vec
    {
        return this.map (Math.round)
    }

    fract (): Float32Vec
    {
        return this.map (FMath.fract)
    }

    clamp (min: number, max: number): Float32Vec
    {
        return this.map (x => FMath.clamp (x, min, max))
    }

    mix (other: Float32Vec, interPos: number): Float32Vec
    {
        return this.map2 (other, (x, y) => FMath.mix (x, y, interPos))
    }

    step (edge: number): Float32Vec
    {
        return this.map (x => FMath.step (edge, x))
    }

    smoothStep (edgeLower: number, edgeUpper: number): Float32Vec
    {
        return this.map (x => FMath.smoothStep (edgeLower, edgeUpper, x))
    }

    toString (): string
    {
        return "[" + this.array.join (" ") + "]"
    }
}