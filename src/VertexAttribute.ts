import { Vec, Vec2, Vec3, Vec4 } from "./Vectors";

export type VertAttrGetter<T> = (object) => T

export class VertAttr<T>
{
    readonly type: number
    readonly count: number
    readonly getter: (object) => number[]

    constructor (type: number, count: number, getter: (object) => number[]) 
    {
        this.type = type
        this.count = count
        this.getter = getter
    }

    typeSize (gl: WebGLRenderingContext): number
    {
        switch (this.type) 
        {
            case gl.BYTE: 
            case gl.UNSIGNED_BYTE: 
                return 1 * this.count
            case gl.SHORT:
            case gl.UNSIGNED_SHORT: 
                return 2 * this.count
            case gl.FLOAT:
                return 4 * this.count
            default:
                throw Error ("Unsupported attribute type.")
        }
    }

    sizeInBytes (gl: WebGLRenderingContext): number
    {
        return Math.ceil (this.typeSize (gl) * this.count / 4) * 4
    }
}

function lift<T> (fun: (object) => T): (object) => T[]
{
    return obj => [ fun (obj) ]
}

export function byte (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
{
    return new VertAttr (gl.BYTE, 1, lift (getter))
}

export function short (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
{
    return new VertAttr (gl.SHORT, 1, lift (getter))
}

export function ubyte (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
{
    return new VertAttr (gl.UNSIGNED_BYTE, 1, lift (getter))
}

export function ushort (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
{
    return new VertAttr (gl.UNSIGNED_SHORT, 1, lift (getter))
}

export function float (gl: WebGLRenderingContext, getter: VertAttrGetter<number>): VertAttr<number>
{
    return new VertAttr (gl.FLOAT, 1, lift (getter))
}

function liftVec<V extends Vec<V>> (getter: VertAttrGetter<V>): (object) => number[]
{
    return obj => getter (obj).toArray ()
}

export function vec2 (gl: WebGLRenderingContext, getter: VertAttrGetter<Vec2>): VertAttr<Vec2>
{
    return new VertAttr (gl.FLOAT, 2, liftVec (getter))
}

export function vec3 (gl: WebGLRenderingContext, getter: VertAttrGetter<Vec3>): VertAttr<Vec3>
{
    return new VertAttr (gl.FLOAT, 3, liftVec (getter))
}

export function vec4 (gl: WebGLRenderingContext, getter: VertAttrGetter<Vec4>): VertAttr<Vec4>
{
    return new VertAttr (gl.FLOAT, 4, liftVec (getter))
}