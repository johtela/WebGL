"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GLResource_1 = require("./GLResource");
class Buffer extends GLResource_1.GLResource {
    constructor(gl, target, glBuffer, length) {
        super(gl);
        this.target = target;
        this.glBuffer = glBuffer;
        this.length = length;
    }
    use() {
        this.gl.bindBuffer(this.target, this.glBuffer);
    }
    release() {
        this.gl.bindBuffer(this.target, null);
    }
}
exports.Buffer = Buffer;
class VertexBuffer extends Buffer {
    constructor(gl, vertexDef, vertices) {
        let buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create vertex buffer.');
        super(gl, gl.ARRAY_BUFFER, buf, vertices.length);
        GLResource_1.using(this, () => gl.bufferData(gl.ARRAY_BUFFER, this.initBuffer(vertexDef, vertices), gl.STATIC_DRAW));
    }
    initBuffer(vertexDef, vertices) {
        let vertexSize = vertexDef.stride;
        let len = vertices.length;
        let buffer = new ArrayBuffer(vertexSize * len);
        let view = new DataView(buffer);
        vertexDef.vertexAttrs.forEach(attr => {
            var setter = this.vertexAttrSetter(view, attr.type);
            let typeSize = attr.typeSize;
            for (let j = 0; j < len; j++) {
                let values = attr.getter(vertices[j]);
                for (let k = 0; k < attr.numComponents; k++)
                    setter((j * vertexSize) + attr.offset + (k * typeSize), values[k]);
            }
        });
        return buffer;
    }
    vertexAttrSetter(view, type) {
        switch (type) {
            case 'byte': return (off, val) => view.setInt8(off, val);
            case 'ubyte': return (off, val) => view.setUint8(off, val);
            case 'short': return (off, val) => view.setInt16(off, val, true);
            case 'ushort': return (off, val) => view.setUint16(off, val, true);
            case 'float': return (off, val) => view.setFloat32(off, val, true);
        }
    }
}
exports.VertexBuffer = VertexBuffer;
class IndexBuffer extends Buffer {
    constructor(gl, indices) {
        let buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create index buffer.');
        super(gl, gl.ELEMENT_ARRAY_BUFFER, buf, indices.length);
        GLResource_1.using(this, () => gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW));
    }
}
exports.IndexBuffer = IndexBuffer;
//# sourceMappingURL=Buffers.js.map