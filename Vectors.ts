/**
 * Enumeration that defines the coordinate dimensions used in the vector types.
 */
export enum Dim 
{
    x = 0,
    y = 1, 
    z = 2,
    w = 3
}

/** 
 * Base interface for all vectory types. Defines methods that have the same signature
 * in all vector variants.
 */
export interface Vec
{
    /**
     * Return one or more components of the vector in arbitrary order. The components
     * returned depend on the dimensions specified in the coords argument. Note that
     * the same component can occur multiple times in coords. So, it is valid to call
     * the function like this:
     * 
     * swizzle ([Dim.x, Dim.x, Dim.y])
     */
    swizzle (coords: Dim[]): number[]
    /**
     * The lenght of the vector squared. Faster to calculate than the actual length,
     * and useful for comparing vector magnitudes.
     */
    readonly lenSqr: number
    /**
     * Length of the vector.
     */
    readonly len: number
    /**
     * Returns the string representation of a vector. Formatted like this: [x y z]
     */
    toString (): string
}

export interface Vec2 extends Vec
{
    x: number
    y: number

    inv (): Vec2
    add (other: Vec2 | number): Vec2
    sub (other: Vec2 | number): Vec2
    mul (other: Vec2 | number): Vec2
    div (other: Vec2 | number): Vec2
    norm (): Vec2
    equals (other: Vec2): boolean
    approxEquals (other: Vec2, epsilon: number): boolean
    dot (other: Vec2): number
    abs (): Vec2
    floor (): Vec2
    ceil (): Vec2
    round (): Vec2
    fract (): Vec2
    clamp (min: number, max: number): Vec2
    mix (other: Vec2, interPos: number): Vec2
    step (edge: number): Vec2
    smoothStep (edgeLower: number, edgeUpper: number): Vec2
}

export interface Vec3 extends Vec
{
    x: number;
    y: number;
    z: number;

    inv (): Vec3
    add (other: Vec3 | number): Vec3;
    sub (other: Vec3 | number): Vec3
    mul (other: Vec3 | number): Vec3
    div (other: Vec3 | number): Vec3
    norm (): Vec3
    equals (other: Vec3): boolean
    approxEquals (other: Vec3, epsilon: number): boolean
    dot (other: Vec3): number
    abs (): Vec3
    floor (): Vec3
    ceil (): Vec3
    round (): Vec3
    fract (): Vec3
    clamp (min: number, max: number): Vec3
    mix (other: Vec3, interPos: number): Vec3
    step (edge: number): Vec3
    smoothStep (edgeLower: number, edgeUpper: number): Vec3
    cross (other: Vec3): Vec3
}

export interface Vec4 extends Vec
{
    x: number
    y: number
    z: number;
    w: number;
    
    inv (): Vec4
    add (other: Vec4 | number): Vec4
    sub (other: Vec4 | number): Vec4
    mul (other: Vec4 | number): Vec4
    div (other: Vec4 | number): Vec4
    norm (): Vec4
    equals (other: Vec4): boolean
    approxEquals (other: Vec4, epsilon: number): boolean
    dot (other: Vec4): number
    abs (): Vec4
    floor (): Vec4
    ceil (): Vec4
    round (): Vec4
    fract (): Vec4
    clamp (min: number, max: number): Vec4
    mix (other: Vec4, interPos: number): Vec4
    step (edge: number): Vec4
    smoothStep (edgeLower: number, edgeUpper: number): Vec4
}