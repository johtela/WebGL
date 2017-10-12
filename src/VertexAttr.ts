import { Vec, Vec2, Vec3, Vec4 } from "./Vectors";

export type VertexAttrType = 'byte' | 'short' | 'ubyte' | 'ushort' | 'float'

export class VertexAttr<V>
{
    readonly name: string
    readonly type: VertexAttrType
    readonly componentCount: number
    readonly getter: (V) => number[]

    location: number
    offset: number

    constructor (name: string, type: VertexAttrType, count: number, getter: (V) => number[]) 
    {
        this.type = type
        this.componentCount = count
        this.getter = getter
    }

    get typeSize (): number
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

    get sizeInBytes (): number
    {
        return Math.ceil (this.typeSize * this.componentCount / 4) * 4
    }

    glType (gl: WebGLRenderingContext): number
    {
        switch (this.type) 
        {
            case 'byte': return gl.BYTE
            case 'ubyte': return gl.UNSIGNED_BYTE
            case 'short': return gl.SHORT
            case 'ushort': return gl.UNSIGNED_SHORT
            case 'float': return gl.FLOAT
            default: throw Error ("Unsupported attribute type.")
        }
    }
}

export class VertexDef<V>
{
    readonly vertexAttrs: VertexAttr<V>[]
    readonly size: number
    
    constructor (attrs: VertexAttr<V>[])
    {
        this.vertexAttrs = attrs
        this.size = this.initVertexAttrOffsets ()
    }

    initVertexAttrOffsets (): number
    {
        let offset = 0
        this.vertexAttrs.forEach (v =>
        {
            v.offset = offset
            offset += v.sizeInBytes 
        })
        return offset
    }

    initVertexAttrLocations (gl: WebGLRenderingContext, prg: WebGLProgram): void
    {
        this.vertexAttrs.forEach(v =>
        {
            var loc = gl.getAttribLocation (prg, v.name)
            if (loc < 0)
                throw Error (`Vertex attribute '${v.name}' not found in program.`)
            v.location = loc
        })
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