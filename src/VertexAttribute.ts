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
}

function lift (fun: (object) => number): (object) => number[]
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

