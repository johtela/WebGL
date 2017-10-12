import { VertexAttr, VertexAttrType } from "./VertexAttr"
import { Program } from "./Program";

export class VertexBuffer<V>
{
    readonly glBuffer: WebGLBuffer
    readonly count: number
    readonly arrayBuffer: ArrayBuffer

    constructor (program: Program<V>, elements: V[])
    {
        let gl = program.gl
        let buf = gl.createBuffer ()
        if (buf === null)
            throw Error ('Failed to create vertex buffer.')
        this.glBuffer = buf
        this.count = elements.length
        this.arrayBuffer = this.copyToBuffer (program, elements)
    }

    private copyToBuffer (program: Program<V>, elements: V[]): ArrayBuffer
    {
        let vertexDef = program.vertexDef
        let vertexSize = vertexDef.size
        let len = elements.length
        let buffer = new ArrayBuffer (vertexSize * len)
        let view = new DataView (buffer)
        vertexDef.vertexAttrs.forEach (attr => 
        { 
            var setter = this.vertexAttrSetter (view, attr.type)
            for (let j = 0; j < attr.componentCount; j++)
            {
                for (let k = 0; k < len; k++)
                    setter ((k * vertexSize) + attr.offset + (j * attr.typeSize), 
                        attr.getter (elements[k])[j]) 
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