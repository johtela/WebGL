import { VertexAttr, VertexAttrType, VertexDef } from "./VertexAttr"

export class VertexBuffer<V>
{
    readonly glBuffer: WebGLBuffer
    readonly count: number

    constructor (gl: WebGLRenderingContext, vertexDef: VertexDef<V>, vertices: V[])
    {
        let buf = gl.createBuffer ()
        if (buf === null)
            throw Error ('Failed to create vertex buffer.')
        this.glBuffer = buf
        this.count = vertices.length
        gl.bindBuffer (gl.ARRAY_BUFFER, buf)
        gl.bufferData (gl.ARRAY_BUFFER, this.initBuffer (vertexDef, vertices), gl.STATIC_DRAW)
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

export class IndexBuffer
{
    readonly glBuffer: WebGLBuffer
    readonly count: number

    constructor (gl: WebGLRenderingContext, indices: number[])
    {
        let buf = gl.createBuffer ()
        if (buf === null)
            throw Error ('Failed to create index buffer.')
        this.glBuffer = buf
        this.count = indices.length
        gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, buf)
        gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array (indices), gl.STATIC_DRAW)
    }
}