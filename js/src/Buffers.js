"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VertexBuffer = (function () {
    function VertexBuffer(gl, vertexDef, vertices) {
        var buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create vertex buffer.');
        this.glBuffer = buf;
        this.count = vertices.length;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, this.initBuffer(vertexDef, vertices), gl.STATIC_DRAW);
    }
    VertexBuffer.prototype.initBuffer = function (vertexDef, vertices) {
        var _this = this;
        var vertexSize = vertexDef.stride;
        var len = vertices.length;
        var buffer = new ArrayBuffer(vertexSize * len);
        var view = new DataView(buffer);
        vertexDef.vertexAttrs.forEach(function (attr) {
            var setter = _this.vertexAttrSetter(view, attr.type);
            for (var j = 0; j < attr.numComponents; j++) {
                for (var k = 0; k < len; k++)
                    setter((k * vertexSize) + attr.offset + (j * attr.typeSize), attr.getter(vertices[k])[j]);
            }
        });
        return buffer;
    };
    VertexBuffer.prototype.vertexAttrSetter = function (view, type) {
        switch (type) {
            case 'byte': return view.setInt8;
            case 'ubyte': return view.setUint8;
            case 'short': return view.setInt16;
            case 'ushort': return view.setUint16;
            case 'float': return view.setFloat32;
        }
    };
    return VertexBuffer;
}());
exports.VertexBuffer = VertexBuffer;
var IndexBuffer = (function () {
    function IndexBuffer(gl, indices) {
        var buf = gl.createBuffer();
        if (buf === null)
            throw Error('Failed to create index buffer.');
        this.glBuffer = buf;
        this.count = indices.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    }
    return IndexBuffer;
}());
exports.IndexBuffer = IndexBuffer;
//# sourceMappingURL=Buffers.js.map