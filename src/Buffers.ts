import { GLResource, using } from "./GLResource";
import { VertexAttr, VertexAttrType, VertexDef } from "./VertexAttr"

export abstract class Buffer extends GLResource
{
    readonly target: number
    readonly glBuffer: WebGLBuffer
    readonly length: number

    constructor (gl: WebGLRenderingContext, target: number, glBuffer: WebGLBuffer, length: number)
    {
        super (gl)
        this.target = target
        this.glBuffer = glBuffer
        this.length = length
    }

    use ()
    {
        this.gl.bindBuffer (this.target, this.glBuffer)
    }

    release ()
    {
        this.gl.bindBuffer (this.target, null)
    }
}

export class VertexBuffer<V> extends Buffer 
{
    constructor (gl: WebGLRenderingContext, vertexDef: VertexDef<V>, vertices: V[])
    {
        let buf = gl.createBuffer ()
        if (buf === null)
            throw Error ('Failed to create vertex buffer.')
        super (gl, gl.ARRAY_BUFFER, buf, vertices.length)
        using (this, () => 
            gl.bufferData (gl.ARRAY_BUFFER, this.initBuffer (vertexDef, vertices), gl.STATIC_DRAW))
    }

    private initBuffer (vertexDef: VertexDef<V>, vertices: V[]): ArrayBuffer
    {
        let vertexSize = vertexDef.stride
        let len = vertices.length
        let buffer = new ArrayBuffer (vertexSize * len)
        let view = new DataView (buffer)
        vertexDef.vertexAttrs.forEach (attr => 
        { 
            var setter = this.vertexAttrSetter (view, attr.type)
            for (let j = 0; j < attr.numComponents; j++)
            {
                for (let k = 0; k < len; k++)
                    setter ((k * vertexSize) + attr.offset + (j * attr.typeSize), 
                        attr.getter (vertices[k])[j]) 
            }
        })
        return buffer
    }

    private vertexAttrSetter (view: DataView, type: VertexAttrType): 
        (offset: number, value: number) => void
    {
        switch (type) 
        {
            case 'byte': return view.setInt8
            case 'ubyte': return view.setUint8
            case 'short': return view.setInt16
            case 'ushort': return view.setUint16
            case 'float': return view.setFloat32
        }
    }
}

export class IndexBuffer extends Buffer
{
    readonly glBuffer: WebGLBuffer
    readonly length: number

    constructor (gl: WebGLRenderingContext, indices: number[])
    {
        let buf = gl.createBuffer ()
        if (buf === null)
            throw Error ('Failed to create index buffer.')
        super (gl, gl.ELEMENT_ARRAY_BUFFER, buf, indices.length)
        using (this, () => 
            gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices), gl.STATIC_DRAW))
    }
}