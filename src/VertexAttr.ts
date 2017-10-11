import { Vec, Vec2, Vec3, Vec4 } from "./Vectors";

export type VertexAttrType = 'byte' | 'short' | 'ubyte' | 'ushort' | 'float'

export class VertexAttr<V>
{
    readonly name: string
    readonly type: VertexAttrType
    readonly count: number
    readonly getter: (V) => number[]

    location: number

    constructor (name: string, type: VertexAttrType, count: number, getter: (V) => number[]) 
    {
        this.type = type
        this.count = count
        this.getter = getter
    }

    typeSize (): number
    {
        switch (this.type) 
        {
            case 'byte': 
            case 'ubyte': 
                return 1
            case 'short':
            case 'ushort': 
                return 2
            case 'float':
                return 4
            default:
                throw Error ("Unsupported attribute type.")
        }
    }

    sizeInBytes (): number
    {
        return Math.ceil (this.typeSize () * this.count / 4) * 4
    }
}

export function byte<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'byte', 1, v => [ v[name] ])
}

export function ubyte<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'ubyte', 1, v => [ v[name] ])
}

export function short<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'short', 1, v => [ v[name] ])
}

export function ushort<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'ushort', 1, v => [ v[name] ])
}

export function float<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'float', 1, v => [ v[name] ])
}

export function vec2<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'float', 2, v => (<Vec2>v[name]).toArray () )
}

export function vec3<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'float', 3, v => (<Vec3>v[name]).toArray () )
}

export function vec4<V, A extends keyof V> (name: A): VertexAttr<V>
{
    return new VertexAttr (name, 'float', 4, v => (<Vec4>v[name]).toArray () )
}